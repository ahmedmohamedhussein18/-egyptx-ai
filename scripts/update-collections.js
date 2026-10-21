const fs = require('fs');

let content = fs.readFileSync('src/components/MemoryCollectionsTab.tsx', 'utf8');

if (!content.includes('resolveCollectionsSignedUrls')) {
  content = content.replace(
    "import { createClient } from '@/lib/supabase/client';",
    "import { createClient } from '@/lib/supabase/client';\nimport { resolveCollectionsSignedUrls } from '@/lib/memory-photos';"
  );
}

const oldFetchCollectionsRegex = /const fetchCollections = async \(\) => \{[\s\S]*?finally \{\s*setLoading\(false\);\s*\}\s*\};/;

const newFetchCollections = `const fetchCollections = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('memory_collections')
        .select(\`
          *,
          memory_collection_items (
            id,
            memory_photo_id,
            memory_photos ( photo_url, caption )
          )
        \`)
        .order('created_at', { ascending: false });

      if (data) {
        const resolved = await resolveCollectionsSignedUrls(supabase, data);
        setCollections(resolved);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };`;

content = content.replace(oldFetchCollectionsRegex, newFetchCollections);

const oldHandleRemoveRegex = /const handleRemovePhoto = async \(itemId: string\) => \{[\s\S]*?if \(data\) setActiveCollection\(data\);[\s\S]*?\}\s*catch[\s\S]*?\}\s*\};/;

const newHandleRemove = `const handleRemovePhoto = async (itemId: string) => {
    try {
      await supabase.from('memory_collection_items').delete().eq('id', itemId);
      fetchCollections();
      const { data } = await supabase.from('memory_collections').select(\`*, memory_collection_items(id, memory_photo_id, memory_photos(photo_url, caption))\`).eq('id', activeCollection.id).single();
      if (data) {
        const [resolved] = await resolveCollectionsSignedUrls(supabase, [data]);
        setActiveCollection(resolved);
      }
    } catch (err) {
      console.error(err);
    }
  };`;

content = content.replace(oldHandleRemoveRegex, newHandleRemove);

fs.writeFileSync('src/components/MemoryCollectionsTab.tsx', content, 'utf8');
console.log('Successfully updated MemoryCollectionsTab.tsx');
