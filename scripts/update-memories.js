const fs = require('fs');

let content = fs.readFileSync('src/components/MemoriesContent.tsx', 'utf8');

// Ensure import exists
if (!content.includes('extractMemoryPhotoPath')) {
  content = content.replace(
    "import { createClient } from '@/lib/supabase/client';",
    "import { createClient } from '@/lib/supabase/client';\nimport { resolvePhotoSignedUrls, extractMemoryPhotoPath } from '@/lib/memory-photos';"
  );
}

// Replace savePhoto
const oldSavePhotoRegex = /const savePhoto = async \(e: React\.FormEvent\) => \{[\s\S]*?finally \{\s*setSaving\(false\);\s*\}\s*\};/;

const newSavePhoto = `const savePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedFile) return;
    setSaving(true);
    try {
      // 1. Upload to Storage with user.id/ prefix required by RLS
      const fileExt = selectedFile.name.split('.').pop()?.toLowerCase() || 'webp';
      const cleanExt = fileExt.replace(/[^a-z0-9]/g, '') || 'webp';
      const fileName = \`\${Date.now()}-\${Math.random().toString(36).substring(2, 9)}.\${cleanExt}\`;
      const filePath = \`\${user.id}/\${fileName}\`;
      
      const { error: uploadError } = await supabase.storage
        .from('memory-photos')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) throw uploadError;

      // 2. Generate signed URL since memory-photos bucket is private
      const { data: signedData, error: signError } = await supabase.storage
        .from('memory-photos')
        .createSignedUrl(filePath, 3600);

      if (signError) throw signError;
      const photoUrl = signedData?.signedUrl || filePath;

      // 3. Insert into memory_photos
      const payload = {
        user_id: user.id,
        photo_url: photoUrl,
        caption: photoForm.caption || '',
        memory_date: photoForm.memory_date || new Date().toISOString(),
        attraction_id: photoForm.attraction_id || null
      };

      const { error: insertError } = await supabase.from('memory_photos').insert(payload);
      if (insertError) throw insertError;
      
      setIsPhotoModalOpen(false);
      await fetchData();
    } catch (err: any) {
      console.error('Photo save failed:', err);
      alert(err?.message || 'Failed to upload photo. Ensure you created the memory-photos bucket and enabled RLS policies.');
    } finally {
      setSaving(false);
    }
  };`;

content = content.replace(oldSavePhotoRegex, newSavePhoto);

// Replace deletePhoto
const oldDeletePhotoRegex = /const deletePhoto = async \(id: string\) => \{[\s\S]*?fetchData\(\);\s*\}\s*catch[\s\S]*?\}\s*\};/;

const newDeletePhoto = `const deletePhoto = async (id: string) => {
    if (!confirm('Are you sure you want to delete this photo memory?')) return;
    try {
      const targetPhoto = photos.find(p => p.id === id);
      if (targetPhoto) {
        const path = extractMemoryPhotoPath(targetPhoto.photo_url);
        if (path) {
          await supabase.storage.from('memory-photos').remove([path]);
        }
      }
      await supabase.from('memory_photos').delete().eq('id', id);
      fetchData();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };`;

content = content.replace(oldDeletePhotoRegex, newDeletePhoto);

fs.writeFileSync('src/components/MemoriesContent.tsx', content, 'utf8');
console.log('Successfully updated MemoriesContent.tsx');
