const fs = require('fs');

let content = fs.readFileSync('src/components/TravelCardContent.tsx', 'utf8');

if (!content.includes('resolvePhotoSignedUrls')) {
  content = content.replace(
    "import { createClient } from '@/lib/supabase/client';",
    "import { createClient } from '@/lib/supabase/client';\nimport { resolvePhotoSignedUrls } from '@/lib/memory-photos';"
  );
}

const oldFetchPhotosRegex = /const fetchPhotos = async \(\) => \{[\s\S]*?finally \{\s*setLoading\(false\);\s*\}\s*\};/;

const newFetchPhotos = `const fetchPhotos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('memory_photos')
        .select('*, attractions(name_en, name_ar)')
        .eq('user_id', user?.id)
        .order('memory_date', { ascending: false });

      if (data) {
        const resolvedPhotos = await resolvePhotoSignedUrls(supabase, data);
        setPhotos(resolvedPhotos);
        if (resolvedPhotos.length > 0) setSelectedPhoto(resolvedPhotos[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };`;

content = content.replace(oldFetchPhotosRegex, newFetchPhotos);

fs.writeFileSync('src/components/TravelCardContent.tsx', content, 'utf8');
console.log('Successfully updated TravelCardContent.tsx');
