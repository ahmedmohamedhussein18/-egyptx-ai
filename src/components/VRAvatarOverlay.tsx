'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';
import { UserCheck, RotateCcw, Compass, Gamepad2, Eye, Footprints } from 'lucide-react';
import type { MatterportGraphSweep } from '@/app/api/matterport-sweeps/route';

export interface VRAvatarOverlayProps {
  siteTitle?: string;
  initialYaw?: number;
  initialPitch?: number;
}

interface ControlState {
  forward: number; // -1 (backward/S) to +1 (forward/W)
  strafe: number;  // -1 (left/A) to +1 (right/D)
}

interface CameraOrientation {
  yaw: number;
  pitch: number;
}

const EXPLORER_MODEL_PATH = '/models/explorer.glb';
const TRANSITION_DURATION_MS = 800;

/**
 * Upgrades the high-poly rigged `.glb` warrior mesh into a 24K Gold & Lapis Lazuli
 * Pharaonic Royal Guardian while keeping its detailed tangent-space normal maps and
 * attaching Nemes Crown, Uraeus Cobra, Usekh Collar, and Golden Ankh to the Mixamo bones.
 */
function transformToPharaonicGuardian(clonedRoot: THREE.Object3D) {
  const goldMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#D4AF37'),
    metalness: 0.88,
    roughness: 0.2,
    emissive: new THREE.Color('#8A6615'),
    emissiveIntensity: 0.18,
  });

  const lapisMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#143B66'),
    metalness: 0.45,
    roughness: 0.32,
  });

  const turquoiseMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#14B8A6'),
    metalness: 0.5,
    roughness: 0.25,
    emissive: new THREE.Color('#0D9488'),
    emissiveIntensity: 0.2,
  });

  clonedRoot.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const origMat = mesh.material as THREE.MeshStandardMaterial;
      if (origMat) {
        const pharaohMat = origMat.clone();
        if (mesh.name.toLowerCase().includes('visor')) {
          pharaohMat.color = new THREE.Color('#F5C542');
          pharaohMat.emissive = new THREE.Color('#D4AF37');
          pharaohMat.emissiveIntensity = 0.55;
          pharaohMat.metalness = 0.92;
          pharaohMat.roughness = 0.14;
        } else {
          pharaohMat.color = new THREE.Color('#E6C267');
          pharaohMat.metalness = 0.72;
          pharaohMat.roughness = 0.28;
          if (pharaohMat.normalScale) {
            pharaohMat.normalScale.set(1.35, 1.35);
          }
        }
        mesh.material = pharaohMat;
      }
    }
  });

  const headBone =
    clonedRoot.getObjectByName('mixamorig:Head') || clonedRoot.getObjectByName('mixamorigHead');
  if (headBone && !headBone.getObjectByName('PharaohNemesCrown')) {
    const crownGroup = new THREE.Group();
    crownGroup.name = 'PharaohNemesCrown';

    const diadem = new THREE.Mesh(new THREE.TorusGeometry(11.5, 1.4, 12, 28), goldMat);
    diadem.rotation.x = Math.PI / 2;
    diadem.position.set(0, 9.5, 1.5);
    crownGroup.add(diadem);

    const wingGeo = new THREE.BoxGeometry(5.5, 22, 13);
    const leftWing = new THREE.Mesh(wingGeo, goldMat);
    leftWing.position.set(-12.5, 1.5, -1.5);
    leftWing.rotation.z = 0.26;
    crownGroup.add(leftWing);

    const rightWing = new THREE.Mesh(wingGeo, goldMat);
    rightWing.position.set(12.5, 1.5, -1.5);
    rightWing.rotation.z = -0.26;
    crownGroup.add(rightWing);

    const stripeGeo = new THREE.BoxGeometry(5.8, 3.2, 13.4);
    for (const yOff of [-4, 2, 8]) {
      const lStripe = new THREE.Mesh(stripeGeo, lapisMat);
      lStripe.position.set(-12.5, yOff, -1.5);
      lStripe.rotation.z = 0.26;
      crownGroup.add(lStripe);

      const rStripe = new THREE.Mesh(stripeGeo, lapisMat);
      rStripe.position.set(12.5, yOff, -1.5);
      rStripe.rotation.z = -0.26;
      crownGroup.add(rStripe);
    }

    const cobraHood = new THREE.Mesh(new THREE.SphereGeometry(2.6, 14, 14), goldMat);
    cobraHood.scale.set(1, 1.5, 0.6);
    cobraHood.position.set(0, 13.5, 12.8);
    crownGroup.add(cobraHood);

    headBone.add(crownGroup);
  }

  const chestBone =
    clonedRoot.getObjectByName('mixamorig:Spine2') || clonedRoot.getObjectByName('mixamorigSpine2');
  if (chestBone && !chestBone.getObjectByName('PharaohUsekhCollar')) {
    const collarGroup = new THREE.Group();
    collarGroup.name = 'PharaohUsekhCollar';

    const outerCollar = new THREE.Mesh(new THREE.TorusGeometry(17.5, 2.8, 14, 32), goldMat);
    outerCollar.rotation.x = Math.PI / 2 + 0.18;
    outerCollar.position.set(0, 14, 1);
    collarGroup.add(outerCollar);

    const innerCollar = new THREE.Mesh(new THREE.TorusGeometry(19.8, 1.3, 12, 32), turquoiseMat);
    innerCollar.rotation.x = Math.PI / 2 + 0.18;
    innerCollar.position.set(0, 13, 1.5);
    collarGroup.add(innerCollar);

    chestBone.add(collarGroup);
  }

  const rightHandBone =
    clonedRoot.getObjectByName('mixamorig:RightHand') ||
    clonedRoot.getObjectByName('mixamorigRightHand');
  if (rightHandBone && !rightHandBone.getObjectByName('PharaohAnkhScepter')) {
    const ankhGroup = new THREE.Group();
    ankhGroup.name = 'PharaohAnkhScepter';
    ankhGroup.position.set(0, 8, 4);
    ankhGroup.rotation.set(Math.PI / 2, 0, 0);

    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 26, 12), goldMat);
    ankhGroup.add(shaft);

    const crossbar = new THREE.Mesh(new THREE.BoxGeometry(16, 2.2, 2.2), goldMat);
    crossbar.position.set(0, 11, 0);
    ankhGroup.add(crossbar);

    const loop = new THREE.Mesh(new THREE.TorusGeometry(6.2, 1.5, 12, 24), goldMat);
    loop.position.set(0, 18.5, 0);
    ankhGroup.add(loop);

    rightHandBone.add(ankhGroup);
  }
}

/**
 * Synchronizes the 3D PerspectiveCamera with the Matterport camera orientation.
 */
function UnifiedCameraController({
  orientationRef,
}: {
  orientationRef: React.MutableRefObject<CameraOrientation>;
}) {
  const { camera } = useThree();

  useFrame((_, delta) => {
    camera.rotation.order = 'YXZ';
    const targetYaw = orientationRef.current.yaw;
    const targetPitch = THREE.MathUtils.clamp(orientationRef.current.pitch, -Math.PI / 3.2, Math.PI / 3.2);

    const smooth = Math.min(1, delta * 14);
    camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, targetYaw, smooth);
    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, targetPitch, smooth);
  });

  return null;
}

/**
 * Renders the Real Matterport 2K 360° Cubemap Panorama for the current sweep node
 * and animates a smooth 3D spatial transition (`isTransitioning`) into the next sweep.
 */
function MatterportSweepSkyboxAndNodes({
  currentSweep,
  sweepsMap,
  transitionStartRef,
  transitionVecRef,
  isTransitioning,
}: {
  currentSweep: MatterportGraphSweep | null;
  sweepsMap: Record<string, MatterportGraphSweep>;
  transitionStartRef: React.MutableRefObject<number>;
  transitionVecRef: React.MutableRefObject<{ dx: number; dz: number }>;
  isTransitioning: boolean;
}) {
  const skyboxGroupRef = useRef<THREE.Group>(null);
  const textureCacheRef = useRef<Map<string, THREE.MeshBasicMaterial[]>>(new Map());
  const [activeMaterials, setActiveMaterials] = useState<THREE.MeshBasicMaterial[] | null>(null);

  const loadSweepMaterials = useCallback((sweep: MatterportGraphSweep): Promise<THREE.MeshBasicMaterial[]> => {
    const cached = textureCacheRef.current.get(sweep.id);
    if (cached) return Promise.resolve(cached);

    return new Promise((resolve) => {
      const loader = new THREE.TextureLoader();
      loader.setCrossOrigin('anonymous');

      const orderedUrls = [
        sweep.skyboxFaces[2], // +X
        sweep.skyboxFaces[4], // -X
        sweep.skyboxFaces[0], // +Y (Ceiling)
        sweep.skyboxFaces[5], // -Y (Floor)
        sweep.skyboxFaces[1], // +Z
        sweep.skyboxFaces[3], // -Z
      ];

      let loadedCount = 0;
      const mats: THREE.MeshBasicMaterial[] = new Array(6);

      orderedUrls.forEach((url, idx) => {
        const tex = loader.load(
          url,
          () => {
            loadedCount += 1;
            if (loadedCount === 6) {
              textureCacheRef.current.set(sweep.id, mats);
              resolve(mats);
            }
          },
          undefined,
          () => {
            loadedCount += 1;
            if (loadedCount === 6) {
              resolve(mats);
            }
          }
        );
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        mats[idx] = new THREE.MeshBasicMaterial({ map: tex, side: THREE.FrontSide, depthWrite: false });
      });
    });
  }, []);

  useEffect(() => {
    if (!currentSweep) return;
    let cancelled = false;

    loadSweepMaterials(currentSweep).then((mats) => {
      if (!cancelled) {
        setActiveMaterials(mats);
      }
    });

    for (const neighborId of currentSweep.neighbors.slice(0, 6)) {
      const neighbor = sweepsMap[neighborId];
      if (neighbor && !textureCacheRef.current.has(neighbor.id)) {
        loadSweepMaterials(neighbor);
      }
    }

    return () => {
      cancelled = true;
    };
  }, [currentSweep, sweepsMap, loadSweepMaterials]);

  useFrame(() => {
    const grp = skyboxGroupRef.current;
    if (!grp) return;

    if (isTransitioning) {
      const elapsed = performance.now() - transitionStartRef.current;
      const t = THREE.MathUtils.clamp(elapsed / TRANSITION_DURATION_MS, 0, 1);
      const remaining = 1 - (1 - Math.pow(1 - t, 3));
      grp.position.set(
        transitionVecRef.current.dx * remaining * 0.45,
        0,
        transitionVecRef.current.dz * remaining * 0.45
      );
    } else {
      grp.position.lerp(new THREE.Vector3(0, 0, 0), 0.2);
    }
  });

  if (!currentSweep || !activeMaterials) return null;

  return (
    <group>
      <group ref={skyboxGroupRef} renderOrder={-10}>
        <mesh scale={[-1, 1, 1]} material={activeMaterials}>
          <boxGeometry args={[60, 60, 60]} />
        </mesh>
      </group>

      {/* Visible Floor Sweep Rings */}
      {currentSweep.neighbors.map((nId) => {
        const node = sweepsMap[nId];
        if (!node) return null;
        const dx = node.position.x - currentSweep.position.x;
        const dz = node.position.z - currentSweep.position.z;
        return (
          <group key={nId} position={[dx, -1.45, dz]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.28, 0.38, 32]} />
              <meshBasicMaterial color="#E2CB85" transparent opacity={0.75} side={THREE.DoubleSide} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.26, 32]} />
              <meshBasicMaterial color="#C9A84C" transparent opacity={0.25} side={THREE.DoubleSide} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/**
 * Realistic Pharaonic Guardian Avatar:
 * Transitions smoothly between Idle and Walk.
 */
function RealisticPharaonicAvatar({
  orientationRef,
  isWalking,
  activeMoveHeadingRef,
  resetSignal,
}: {
  orientationRef: React.MutableRefObject<CameraOrientation>;
  isWalking: boolean;
  activeMoveHeadingRef: React.MutableRefObject<number>;
  resetSignal: number;
}) {
  const rootRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(EXPLORER_MODEL_PATH);

  const pharaonicScene = useMemo(() => {
    const clone = SkeletonUtils.clone(scene);
    transformToPharaonicGuardian(clone);
    return clone;
  }, [scene]);

  const { actions } = useAnimations(animations, rootRef);
  const activeAnimRef = useRef<'Idle' | 'Walk'>('Idle');
  const strideLeadZRef = useRef(-2.35);

  useEffect(() => {
    const idleAction = actions['Idle'];
    if (idleAction) {
      idleAction.reset().fadeIn(0.2).play();
      activeAnimRef.current = 'Idle';
    }
    return () => {
      Object.values(actions).forEach((action) => action?.stop());
    };
  }, [actions]);

  useEffect(() => {
    strideLeadZRef.current = -2.35;
  }, [resetSignal]);

  useFrame((_, delta) => {
    const group = rootRef.current;
    if (!group) return;

    const desiredAnim: 'Idle' | 'Walk' = isWalking ? 'Walk' : 'Idle';

    if (desiredAnim !== activeAnimRef.current && actions[desiredAnim]) {
      actions[activeAnimRef.current]?.fadeOut(0.18);
      actions[desiredAnim]?.reset().fadeIn(0.18).play();
      activeAnimRef.current = desiredAnim;
    }

    const camYaw = orientationRef.current.yaw;
    const camPitch = THREE.MathUtils.clamp(orientationRef.current.pitch, -0.35, 0.35);

    const targetLeadZ = isWalking ? -2.65 : -2.35;
    strideLeadZRef.current = THREE.MathUtils.lerp(strideLeadZRef.current, targetLeadZ, Math.min(1, delta * 6));

    const localZ = strideLeadZRef.current;
    const cosY = Math.cos(camYaw);
    const sinY = Math.sin(camYaw);

    const worldX = localZ * sinY;
    const worldZ = localZ * cosY;
    const worldY = -0.78 + Math.sin(camPitch) * Math.abs(localZ) * 0.65;

    group.position.set(worldX, worldY, worldZ);

    const desiredWorldYaw = isWalking ? activeMoveHeadingRef.current : camYaw;
    let diff = desiredWorldYaw - group.rotation.y;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    group.rotation.y += diff * Math.min(1, delta * 12);
  });

  return (
    <group ref={rootRef} position={[0, -0.78, -2.35]} scale={[0.42, 0.42, 0.42]} dispose={null}>
      <primitive object={pharaonicScene} />
      <ContactShadows
        position={[0, 0.005, 0]}
        opacity={0.55}
        scale={2.4}
        blur={2.2}
        far={1.5}
        resolution={256}
        color="#000000"
      />
    </group>
  );
}

useGLTF.preload(EXPLORER_MODEL_PATH);

class AvatarCanvasBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

export default function VRAvatarOverlay({
  siteTitle,
  initialYaw = 0,
  initialPitch = 0,
}: VRAvatarOverlayProps) {
  const [avatarActive, setAvatarActive] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isInputActive, setIsInputActive] = useState(false);
  const [currentSweep, setCurrentSweep] = useState<MatterportGraphSweep | null>(null);
  const [sweepsMap, setSweepsMap] = useState<Record<string, MatterportGraphSweep>>({});
  const [sweepIndexDisplay, setSweepIndexDisplay] = useState(1);
  const [totalSweepsDisplay, setTotalSweepsDisplay] = useState(0);
  const [joystickOffset, setJoystickOffset] = useState({ x: 0, y: 0 });
  const [lookPadActive, setLookPadActive] = useState(false);

  const rootOverlayRef = useRef<HTMLDivElement | null>(null);
  const controlRef = useRef<ControlState>({ forward: 0, strafe: 0 });
  const keysPressedRef = useRef<Set<string>>(new Set());
  const joystickVecRef = useRef<ControlState>({ forward: 0, strafe: 0 });
  const orientationRef = useRef<CameraOrientation>({
    yaw: initialYaw,
    pitch: initialPitch,
  });

  // Strict Transition Lock & Matterport Navmesh State
  const isTransitioningRef = useRef<boolean>(false);
  const transitionStartRef = useRef<number>(0);
  const transitionVecRef = useRef<{ dx: number; dz: number }>({ dx: 0, dz: 0 });
  const activeMoveHeadingRef = useRef<number>(0);
  const currentSweepRef = useRef<MatterportGraphSweep | null>(null);
  const sweepsMapRef = useRef<Record<string, MatterportGraphSweep>>({});
  const sweepsListRef = useRef<MatterportGraphSweep[]>([]);
  const initialSweepRef = useRef<MatterportGraphSweep | null>(null);
  const mpSdkRef = useRef<any>(null);

  const joystickBaseRef = useRef<HTMLDivElement | null>(null);
  const isDraggingJoystickRef = useRef(false);
  const sceneDragRef = useRef<{ active: boolean; lastX: number; lastY: number }>({
    active: false,
    lastX: 0,
    lastY: 0,
  });
  const lookDragRef = useRef<{ active: boolean; lastX: number; lastY: number }>({
    active: false,
    lastX: 0,
    lastY: 0,
  });

  // Connect to Matterport SDK if available
  useEffect(() => {
    if (!avatarActive) return;

    const parentEl = rootOverlayRef.current?.parentElement;
    const iframeEl =
      (parentEl?.querySelector('iframe') as HTMLIFrameElement | null) ||
      (document.querySelector('iframe[src*="matterport.com"]') as HTMLIFrameElement | null);

    if (!iframeEl) return;

    let cancelled = false;

    const initSdk = async () => {
      try {
        if (!(window as any).MP_SDK) {
          await new Promise<void>((resolve) => {
            const existing = document.querySelector('script[data-mp-sdk]');
            if (existing) {
              resolve();
              return;
            }
            const script = document.createElement('script');
            script.src = 'https://static.matterport.com/showcase-sdk/latest.js';
            script.async = true;
            script.dataset.mpSdk = 'true';
            script.onload = () => resolve();
            script.onerror = () => resolve();
            document.head.appendChild(script);
          });
        }

        const mpSdkGlobal = (window as any).MP_SDK;
        if (!mpSdkGlobal || typeof mpSdkGlobal.connect !== 'function' || !iframeEl) return;

        const sdkKey = process.env.NEXT_PUBLIC_MATTERPORT_SDK_KEY || '';
        const mpSdk = await mpSdkGlobal.connect(iframeEl, sdkKey, '3.10');
        if (cancelled) return;
        mpSdkRef.current = mpSdk;

        // Try getting sweeps directly from mpSdk
        if (mpSdk?.Sweep?.getSweeps) {
          try {
            const sweeps = await mpSdk.Sweep.getSweeps();
            if (Array.isArray(sweeps) && sweeps.length > 0) {
              const map: Record<string, MatterportGraphSweep> = {};
              const list: MatterportGraphSweep[] = sweeps.map((s: any) => ({
                id: s.id || s.sid,
                sweepUuid: s.uuid || s.id,
                position: s.position || { x: 0, y: 0, z: 0 },
                rotation: s.rotation || { x: 0, y: 0, z: 0, w: 1 },
                skyboxFaces: [],
                neighbors: s.neighbors || [],
              }));
              list.forEach((s) => {
                map[s.id] = s;
              });
              sweepsMapRef.current = map;
              sweepsListRef.current = list;
              setSweepsMap(map);
              setTotalSweepsDisplay(list.length);
            }
          } catch {}
        }

        // Subscribe to current sweep
        if (mpSdk?.Sweep?.current?.subscribe) {
          mpSdk.Sweep.current.subscribe((sweep: any) => {
            if (sweep?.sid) {
              const matched = sweepsMapRef.current[sweep.sid];
              if (matched) {
                currentSweepRef.current = matched;
                setCurrentSweep(matched);
              }
            }
          });
        }

        // Subscribe to Camera.pose for exact viewing angle
        if (mpSdk?.Camera?.pose?.subscribe) {
          mpSdk.Camera.pose.subscribe((pose: any) => {
            if (pose?.rotation) {
              // Convert Matterport degrees to radians
              orientationRef.current.yaw = THREE.MathUtils.degToRad(-pose.rotation.y || 0);
              orientationRef.current.pitch = THREE.MathUtils.clamp(
                THREE.MathUtils.degToRad(pose.rotation.x || 0),
                -Math.PI / 3.2,
                Math.PI / 3.2
              );
            }
          });
        }
      } catch {}
    };

    initSdk();

    return () => {
      cancelled = true;
    };
  }, [avatarActive]);

  // Fetch the real Matterport sweep graph (`locations` + 3D positions + 2K skyboxes) from our API
  useEffect(() => {
    if (!avatarActive) return;

    const parentEl = rootOverlayRef.current?.parentElement;
    const iframeEl =
      (parentEl?.querySelector('iframe') as HTMLIFrameElement | null) ||
      (document.querySelector('iframe[src*="matterport.com"]') as HTMLIFrameElement | null);

    let modelId = 'VxYAEMXh6dW';
    const src = iframeEl?.getAttribute('src') || '';
    const match = src.match(/[?&]m=([a-zA-Z0-9_-]+)/);
    if (match?.[1]) {
      modelId = match[1];
    }

    let cancelled = false;
    fetch(`/api/matterport-sweeps?modelId=${encodeURIComponent(modelId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled || !Array.isArray(data?.sweeps) || data.sweeps.length === 0) return;
        const list: MatterportGraphSweep[] = data.sweeps;
        const map: Record<string, MatterportGraphSweep> = {};
        list.forEach((s) => {
          map[s.id] = s;
        });
        sweepsMapRef.current = map;
        sweepsListRef.current = list;
        setSweepsMap(map);
        setTotalSweepsDisplay(list.length);

        if (!currentSweepRef.current) {
          const startNode = list[0];
          currentSweepRef.current = startNode;
          initialSweepRef.current = startNode;
          setCurrentSweep(startNode);
          setSweepIndexDisplay(1);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [avatarActive]);

  /**
   * REWRITTEN SWEEP DETECTION (Strictly adhering to User Requirements 1, 2, and 3):
   * 1. Fix Forward Vector: Perfectly matches the user's current viewing angle in Matterport.
   * 2. Accurate Sweep Detection: Searches sweeps, calculates angle to each relative to true forward vector, and selects closest.
   * 3. Remove False Collision: Disables broken wall detection. Forces selection of best forward sweep.
   */
  const findBestForwardSweep = useCallback(
    (forward: number, strafe: number): { node: MatterportGraphSweep; headingYaw: number } | null => {
      const curr = currentSweepRef.current;
      const list = sweepsListRef.current;
      if (!curr || list.length === 0) return null;

      // 1. Current camera yaw in radians
      const camYaw = orientationRef.current.yaw;

      // Vector in camera's local space where forward is (0, -1) and strafe right is (+1, 0)
      const localDir = new THREE.Vector2(strafe, -forward).normalize();

      // Rotate local movement direction by camera yaw to get true world direction in horizontal (X, Z) plane
      // In Three.js: X is right, Z is back, so forward (along -Z) rotated by camYaw is:
      // worldX = localDir.x * cos(yaw) + localDir.y * -sin(yaw) [with localDir.y along -Z]
      const sinY = Math.sin(camYaw);
      const cosY = Math.cos(camYaw);
      const worldDirX = localDir.x * cosY - localDir.y * sinY;
      const worldDirZ = localDir.x * sinY + localDir.y * cosY;
      const worldMoveHeading = Math.atan2(worldDirX, -worldDirZ);

      // Search pool: prefer current sweep neighbors, fallback to full list
      const pool =
        curr.neighbors && curr.neighbors.length > 0
          ? curr.neighbors.map((id) => sweepsMapRef.current[id]).filter(Boolean)
          : list;

      const candidates = pool.length > 0 ? pool : list;

      let bestNode: MatterportGraphSweep | null = null;
      let minCost = Infinity;

      // First pass: look for sweeps in the forward hemisphere (dot > 0)
      for (const candidate of candidates) {
        if (candidate.id === curr.id) continue;

        const dx = candidate.position.x - curr.position.x;
        const dz = candidate.position.z - curr.position.z;
        const dist = Math.hypot(dx, dz);

        // Ignore sweeps that are basically identical position or too far (>25m)
        if (dist < 0.25 || dist > 25.0) continue;

        // Direction to candidate
        const candDirX = dx / dist;
        const candDirZ = dz / dist;

        // Dot product with target forward direction
        const dot = candDirX * worldDirX + candDirZ * worldDirZ;

        // If in forward hemisphere
        if (dot > 0.05) {
          // Cost function: balance distance and angular alignment
          // Prefer sweeps straight ahead and closer
          const anglePenalty = (1 - dot) * 4.0;
          const cost = dist * (1 + anglePenalty);

          if (cost < minCost) {
            minCost = cost;
            bestNode = candidate;
          }
        }
      }

      // Fallback pass: if none in neighbors had dot > 0.05, search the ENTIRE model sweeps list
      if (!bestNode && candidates !== list) {
        for (const candidate of list) {
          if (candidate.id === curr.id) continue;

          const dx = candidate.position.x - curr.position.x;
          const dz = candidate.position.z - curr.position.z;
          const dist = Math.hypot(dx, dz);

          if (dist < 0.25 || dist > 25.0) continue;

          const candDirX = dx / dist;
          const candDirZ = dz / dist;
          const dot = candDirX * worldDirX + candDirZ * worldDirZ;

          if (dot > 0.05) {
            const anglePenalty = (1 - dot) * 4.0;
            const cost = dist * (1 + anglePenalty);

            if (cost < minCost) {
              minCost = cost;
              bestNode = candidate;
            }
          }
        }
      }

      // Ultimate fallback: if facing something with no forward sweep (e.g. edge of map), pick the single closest candidate in any direction
      if (!bestNode && list.length > 1) {
        let minDist = Infinity;
        for (const candidate of list) {
          if (candidate.id === curr.id) continue;
          const dist = Math.hypot(candidate.position.x - curr.position.x, candidate.position.z - curr.position.z);
          if (dist > 0.25 && dist < minDist) {
            minDist = dist;
            bestNode = candidate;
          }
        }
      }

      if (!bestNode) return null;
      return { node: bestNode, headingYaw: worldMoveHeading };
    },
    []
  );

  /**
   * THROTTLED SDK MOVEMENT:
   * State lock ensures `moveTo` is called once and waits for completion.
   */
  const attemptForwardSweepStep = useCallback(
    (forward: number, strafe: number) => {
      // State lock: Do NOT spam `moveTo()` while a transition is already running
      if (isTransitioningRef.current) return;

      const inputMag = Math.hypot(forward, strafe);
      if (inputMag < 0.15) return;

      const result = findBestForwardSweep(forward, strafe);
      if (!result) return;

      const { node: nextNode, headingYaw } = result;

      // Lock transition
      isTransitioningRef.current = true;
      setIsTransitioning(true);
      transitionStartRef.current = performance.now();
      activeMoveHeadingRef.current = headingYaw;

      const prevSweep = currentSweepRef.current;
      if (prevSweep) {
        transitionVecRef.current = {
          dx: nextNode.position.x - prevSweep.position.x,
          dz: nextNode.position.z - prevSweep.position.z,
        };
      }

      currentSweepRef.current = nextNode;
      setCurrentSweep(nextNode);
      setSweepIndexDisplay((c) => c + 1);

      // Programmatically invoke Matterport SDK Sweep.moveTo
      if (mpSdkRef.current?.Sweep?.moveTo) {
        mpSdkRef.current.Sweep.moveTo(nextNode.id, {
          transition: mpSdkRef.current.Sweep.Transition?.FLY ?? 1,
          transitionTime: TRANSITION_DURATION_MS,
        }).catch(() => {});
      }

      // Unlock after transition completes
      window.setTimeout(() => {
        isTransitioningRef.current = false;
        setIsTransitioning(false);

        // If user is still holding movement input, smoothly trigger next step
        const { forward: fNow, strafe: sNow } = controlRef.current;
        if (Math.hypot(fNow, sNow) >= 0.15) {
          attemptForwardSweepStep(fNow, sNow);
        }
      }, TRANSITION_DURATION_MS);
    },
    [findBestForwardSweep]
  );

  const recomputeControls = useCallback(() => {
    const keys = keysPressedRef.current;
    let kbForward = 0;
    let kbStrafe = 0;

    if (keys.has('KeyW') || keys.has('ArrowUp')) kbForward += 1;
    if (keys.has('KeyS') || keys.has('ArrowDown')) kbForward -= 1;
    if (keys.has('KeyD') || keys.has('ArrowRight')) kbStrafe += 1;
    if (keys.has('KeyA') || keys.has('ArrowLeft')) kbStrafe -= 1;

    const f = THREE.MathUtils.clamp(kbForward + joystickVecRef.current.forward, -1, 1);
    const s = THREE.MathUtils.clamp(kbStrafe + joystickVecRef.current.strafe, -1, 1);

    controlRef.current = { forward: f, strafe: s };
    const active = Math.hypot(f, s) >= 0.15;
    setIsInputActive(active);

    if (active && !isTransitioningRef.current) {
      attemptForwardSweepStep(f, s);
    }
  }, [attemptForwardSweepStep]);

  // Keyboard navigation & device orientation
  useEffect(() => {
    if (!avatarActive) {
      keysPressedRef.current.clear();
      controlRef.current = { forward: 0, strafe: 0 };
      isTransitioningRef.current = false;
      setIsTransitioning(false);
      setIsInputActive(false);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        keysPressedRef.current.add(e.code);
        recomputeControls();
      } else if (e.code === 'KeyQ') {
        orientationRef.current.yaw += 0.1;
      } else if (e.code === 'KeyE') {
        orientationRef.current.yaw -= 0.1;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (keysPressedRef.current.has(e.code)) {
        keysPressedRef.current.delete(e.code);
        recomputeControls();
      }
    };

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null && e.beta !== null) {
        orientationRef.current.yaw = THREE.MathUtils.degToRad(e.alpha);
        orientationRef.current.pitch = THREE.MathUtils.clamp(
          THREE.MathUtils.degToRad(e.beta - 60),
          -Math.PI / 3.2,
          Math.PI / 3.2
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    };
  }, [avatarActive, recomputeControls]);

  // Virtual Joystick Touch/Mouse Handlers
  const updateJoystickFromPoint = useCallback(
    (clientX: number, clientY: number) => {
      const base = joystickBaseRef.current;
      if (!base) return;
      const rect = base.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const maxRadius = rect.width / 2 - 14;

      let dx = clientX - centerX;
      let dy = clientY - centerY;
      const dist = Math.hypot(dx, dy);
      if (dist > maxRadius) {
        dx = (dx / dist) * maxRadius;
        dy = (dy / dist) * maxRadius;
      }

      setJoystickOffset({ x: dx, y: dy });
      joystickVecRef.current = {
        forward: Number((-dy / maxRadius).toFixed(2)),
        strafe: Number((dx / maxRadius).toFixed(2)),
      };
      recomputeControls();
    },
    [recomputeControls]
  );

  const resetJoystick = useCallback(() => {
    isDraggingJoystickRef.current = false;
    setJoystickOffset({ x: 0, y: 0 });
    joystickVecRef.current = { forward: 0, strafe: 0 };
    recomputeControls();
  }, [recomputeControls]);

  const handleResetAvatar = () => {
    orientationRef.current = { yaw: initialYaw, pitch: initialPitch };
    isTransitioningRef.current = false;
    setIsTransitioning(false);
    setIsInputActive(false);
    if (initialSweepRef.current) {
      currentSweepRef.current = initialSweepRef.current;
      setCurrentSweep(initialSweepRef.current);
      setSweepIndexDisplay(1);
    }
    setResetSignal((n) => n + 1);
  };

  const isWalking = isTransitioning || isInputActive;

  return (
    <div
      ref={rootOverlayRef}
      className="absolute inset-0 pointer-events-none z-30 overflow-hidden select-none"
    >
      {/* 1. Floating Toggle Button for Pharaonic Avatar Mode */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-auto flex items-center gap-2 z-40">
        <button
          type="button"
          onClick={() => setAvatarActive((prev) => !prev)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-300 shadow-xl backdrop-blur-md cursor-pointer border ${
            avatarActive
              ? 'bg-gradient-to-r from-[#C9A84C] to-[#E2CB85] text-[#0A1628] border-[#E2CB85] shadow-[0_0_25px_rgba(201,168,76,0.7)] scale-105'
              : 'bg-black/70 hover:bg-black/90 text-[#E2CB85] border-[#C9A84C]/50 hover:border-[#C9A84C]'
          }`}
          title="Toggle Pharaonic 3D Avatar Mode"
        >
          <UserCheck className="w-4 h-4" />
          <span>{avatarActive ? 'Pharaoh Avatar: ON' : 'Pharaoh 3D Avatar'}</span>
          <span
            className={`w-2 h-2 rounded-full ${
              avatarActive ? 'bg-[#0A1628] animate-ping' : 'bg-[#C9A84C]'
            }`}
          />
        </button>

        {avatarActive && (
          <button
            type="button"
            onClick={handleResetAvatar}
            className="p-2 rounded-full bg-black/75 hover:bg-black/90 text-[#C9A84C] border border-[#C9A84C]/40 hover:border-[#C9A84C] text-xs transition-all shadow-lg cursor-pointer"
            title="Reset Avatar & Starting Sweep"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 2. Unified 3D Matterport Panorama + Realistic Pharaonic Guardian Canvas */}
      {avatarActive && (
        <AvatarCanvasBoundary>
          <div
            onPointerDown={(e) => {
              sceneDragRef.current = { active: true, lastX: e.clientX, lastY: e.clientY };
              (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (!sceneDragRef.current.active) return;
              const dx = e.clientX - sceneDragRef.current.lastX;
              const dy = e.clientY - sceneDragRef.current.lastY;
              sceneDragRef.current.lastX = e.clientX;
              sceneDragRef.current.lastY = e.clientY;
              orientationRef.current.yaw += dx * 0.0055;
              orientationRef.current.pitch = THREE.MathUtils.clamp(
                orientationRef.current.pitch + dy * 0.0045,
                -Math.PI / 3.2,
                Math.PI / 3.2
              );
            }}
            onPointerUp={() => {
              sceneDragRef.current.active = false;
            }}
            onPointerCancel={() => {
              sceneDragRef.current.active = false;
            }}
            className={`absolute inset-0 ${
              currentSweep ? 'pointer-events-auto cursor-grab active:cursor-grabbing' : 'pointer-events-none'
            }`}
          >
            <Canvas
              shadows
              gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
              camera={{ position: [0, 0, 0], fov: 55, near: 0.1, far: 100 }}
              style={{ pointerEvents: 'none', background: 'transparent' }}
            >
              <ambientLight intensity={1.2} color="#FFF8E7" />
              <hemisphereLight args={['#FFE8B8', '#3B2816', 0.95]} />
              <directionalLight position={[3, 6, 3]} intensity={1.7} color="#FFF1C9" castShadow />

              <UnifiedCameraController orientationRef={orientationRef} />

              <MatterportSweepSkyboxAndNodes
                currentSweep={currentSweep}
                sweepsMap={sweepsMap}
                transitionStartRef={transitionStartRef}
                transitionVecRef={transitionVecRef}
                isTransitioning={isTransitioning}
              />

              <Suspense fallback={null}>
                <RealisticPharaonicAvatar
                  orientationRef={orientationRef}
                  isWalking={isWalking}
                  activeMoveHeadingRef={activeMoveHeadingRef}
                  resetSignal={resetSignal}
                />
              </Suspense>
            </Canvas>
          </div>
        </AvatarCanvasBoundary>
      )}

      {/* 3. Direct Joystick & WASD Controls Driving Matterport Sweep Transitions */}
      {avatarActive && (
        <>
          {/* Left: Virtual Analog Joystick */}
          <div className="absolute bottom-16 left-5 pointer-events-auto flex flex-col items-center gap-1.5 z-40">
            <div
              ref={joystickBaseRef}
              onPointerDown={(e) => {
                e.stopPropagation();
                (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                isDraggingJoystickRef.current = true;
                updateJoystickFromPoint(e.clientX, e.clientY);
              }}
              onPointerMove={(e) => {
                if (!isDraggingJoystickRef.current) return;
                e.stopPropagation();
                updateJoystickFromPoint(e.clientX, e.clientY);
              }}
              onPointerUp={(e) => {
                e.stopPropagation();
                resetJoystick();
              }}
              onPointerCancel={resetJoystick}
              className="w-24 h-24 rounded-full bg-black/65 backdrop-blur-md border-2 border-[#C9A84C]/60 shadow-[0_0_25px_rgba(201,168,76,0.3)] relative flex items-center justify-center touch-none cursor-grab active:cursor-grabbing"
              title="Push Joystick or press WASD to walk to the next Matterport node"
            >
              <span className="absolute top-1.5 text-[9px] font-bold text-[#C9A84C]/80">W ▲</span>
              <span className="absolute bottom-1.5 text-[9px] font-bold text-[#C9A84C]/80">▼ S</span>
              <span className="absolute left-2 text-[9px] font-bold text-[#C9A84C]/80">◄ A</span>
              <span className="absolute right-2 text-[9px] font-bold text-[#C9A84C]/80">D ►</span>

              <div
                style={{
                  transform: `translate(${joystickOffset.x}px, ${joystickOffset.y}px)`,
                }}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E2CB85] to-[#C9A84C] border border-white/60 shadow-[0_0_15px_rgba(201,168,76,0.9)] flex items-center justify-center transition-transform duration-75"
              >
                <Gamepad2 className="w-4 h-4 text-[#0A1628]" />
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-black/75 border border-white/10 text-[10px] font-mono text-[#E2CB85]">
              Drive Tour: Joystick / WASD
            </span>
          </div>

          {/* Right: Unified Camera Sync Pad & Live Matterport Node Status */}
          <div className="absolute bottom-16 right-5 pointer-events-auto flex flex-col items-end gap-2 z-40">
            <div
              onPointerDown={(e) => {
                e.stopPropagation();
                (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                lookDragRef.current = { active: true, lastX: e.clientX, lastY: e.clientY };
                setLookPadActive(true);
              }}
              onPointerMove={(e) => {
                if (!lookDragRef.current.active) return;
                e.stopPropagation();
                const dx = e.clientX - lookDragRef.current.lastX;
                const dy = e.clientY - lookDragRef.current.lastY;
                lookDragRef.current.lastX = e.clientX;
                lookDragRef.current.lastY = e.clientY;
                orientationRef.current.yaw += dx * 0.008;
                orientationRef.current.pitch = THREE.MathUtils.clamp(
                  orientationRef.current.pitch + dy * 0.006,
                  -Math.PI / 3.2,
                  Math.PI / 3.2
                );
              }}
              onPointerUp={(e) => {
                e.stopPropagation();
                lookDragRef.current.active = false;
                setLookPadActive(false);
              }}
              onPointerCancel={() => {
                lookDragRef.current.active = false;
                setLookPadActive(false);
              }}
              className={`px-3.5 py-2.5 rounded-2xl bg-black/70 backdrop-blur-md border transition-all touch-none cursor-move flex items-center gap-2 shadow-xl ${
                lookPadActive
                  ? 'border-[#38BDF8] shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                  : 'border-[#C9A84C]/50 hover:border-[#C9A84C]'
              }`}
              title="Drag here or press Q/E to rotate Unified 3D Camera"
            >
              <Eye className="w-4 h-4 text-[#C9A84C]" />
              <div className="text-left">
                <div className="text-[11px] font-bold text-white leading-tight">
                  Unified 360° Camera
                </div>
                <div className="text-[9px] font-mono text-gray-300">
                  Drag Screen or Press Q / E
                </div>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/15 text-[10px] font-mono text-gray-200 flex items-center gap-2 shadow-lg">
              {isWalking ? (
                <Footprints className="w-3.5 h-3.5 text-[#E2CB85] animate-bounce" />
              ) : (
                <Compass className="w-3.5 h-3.5 text-[#C9A84C]" />
              )}
              <span>
                Matterport Node:{' '}
                <strong className="text-[#E2CB85]">
                  #{sweepIndexDisplay}
                  {totalSweepsDisplay > 0 ? ` / ${totalSweepsDisplay}` : ''}
                </strong>{' '}
                ·{' '}
                <strong className={isWalking ? 'text-emerald-400' : 'text-cyan-300'}>
                  {isWalking ? 'Moving to Next Node...' : 'Ready'}
                </strong>
              </span>
              {siteTitle && <span className="hidden sm:inline text-white/40">| {siteTitle}</span>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
