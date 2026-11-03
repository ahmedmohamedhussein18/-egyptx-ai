import { NextRequest, NextResponse } from 'next/server';

export interface MatterportGraphSweep {
  id: string;
  sweepUuid: string;
  /** Three.js Y-up coordinates (meters): x = East, y = Up (elevation), z = South */
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number; w: number };
  /** 6 cube face URLs ordered raw 0..5 from Matterport CDN */
  skyboxFaces: string[];
  /** Adjacent walkable sweep IDs on the same floor */
  neighbors: string[];
}

export async function GET(req: NextRequest) {
  const modelId = req.nextUrl.searchParams.get('modelId')?.trim() || 'VxYAEMXh6dW';

  try {
    const res = await fetch('https://my.matterport.com/api/mp/models/graph', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referer: `https://my.matterport.com/show/?m=${encodeURIComponent(modelId)}`,
        Origin: 'https://my.matterport.com',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({
        query: `query {
          model(id: "${modelId.replace(/[^a-zA-Z0-9_-]/g, '')}") {
            id
            name
            locations {
              id
              pano {
                id
                sweepUuid
                position { x y z }
                rotation { x y z w }
                skyboxes {
                  resolution
                  status
                  children
                }
              }
            }
          }
        }`,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return NextResponse.json({ sweeps: [] }, { status: 200 });
    }

    const json = await res.json();
    const rawLocations: any[] = json?.data?.model?.locations || [];

    // Convert Matterport Z-up (x, y, z_elevation) into Three.js Y-up (x, y_elevation, z = -mp.y)
    // and filter out aerial drone sky shots (z_elevation > 45m)
    const nodes: MatterportGraphSweep[] = [];

    for (const loc of rawLocations) {
      const pano = loc?.pano;
      if (!pano?.position) continue;

      const rawX = Number(pano.position.x || 0);
      const rawY = Number(pano.position.y || 0);
      const rawZ = Number(pano.position.z || 0);

      // Skip high-altitude drone panoramas (e.g. z = 197m) so avatar stays inside/around the monument
      if (Math.abs(rawZ) > 45) continue;

      const skyboxes: any[] = Array.isArray(pano.skyboxes) ? pano.skyboxes : [];
      const sky2k = skyboxes.find((s) => s.resolution === '2k' && Array.isArray(s.children) && s.children.length === 6);
      const skyHigh = skyboxes.find((s) => s.resolution === 'high' && Array.isArray(s.children) && s.children.length === 6);
      const chosenSky = sky2k || skyHigh;
      if (!chosenSky) continue;

      nodes.push({
        id: String(loc.id || pano.id),
        sweepUuid: String(pano.sweepUuid || loc.id),
        position: {
          x: Number(rawX.toFixed(3)),
          y: Number(rawZ.toFixed(3)),
          z: Number(rawY.toFixed(3)),
        },
        rotation: {
          x: Number(pano.rotation?.x || 0),
          y: Number(pano.rotation?.y || 0),
          z: Number(pano.rotation?.z || 0),
          w: Number(pano.rotation?.w ?? 1),
        },
        skyboxFaces: chosenSky.children,
        neighbors: [],
      });
    }

    // Build bidirectional walkable adjacency graph between sweeps on the same floor
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      const scored: Array<{ id: string; dist: number }> = [];

      for (let j = 0; j < nodes.length; j++) {
        if (i === j) continue;
        const b = nodes[j];
        const dy = Math.abs(a.position.y - b.position.y);
        // Same floor / ramp level (within 2.6m vertical change)
        if (dy > 2.6) continue;

        const dist = Math.hypot(a.position.x - b.position.x, a.position.z - b.position.z);
        if (dist >= 0.35 && dist <= 13.5) {
          scored.push({ id: b.id, dist });
        }
      }

      scored.sort((m, n) => m.dist - n.dist);
      a.neighbors = scored.slice(0, 10).map((s) => s.id);
    }

    return NextResponse.json({
      modelId,
      name: json?.data?.model?.name || '',
      sweeps: nodes,
    });
  } catch {
    return NextResponse.json({ sweeps: [] }, { status: 200 });
  }
}
