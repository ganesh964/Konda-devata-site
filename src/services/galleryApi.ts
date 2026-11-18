const API_BASE = '/api';

export interface GalleryImage {
  id: number;
  src: string;
  title: string;
  desc: string;
  year: number;
  type: 'image' | 'video';
  isUploaded: boolean;
}

async function getErrorMessage(response: Response, fallback: string): Promise<string> {
  const body = await response.json().catch(() => null);
  return body?.error || body?.message || fallback;
}

// Fetch only media saved in the backend. The four bundled default images
// are maintained separately in Home.tsx and are never removed by this API.
export async function fetchGalleryImages(): Promise<GalleryImage[]> {
  const response = await fetch(`${API_BASE}/gallery`);

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, 'Failed to fetch gallery images'));
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('Invalid gallery response: expected an array');
  }

  return data.map((item: any): GalleryImage => ({
    id: Number(item.id),
    src: String(item.src ?? ''),
    title: String(item.title ?? ''),
    desc: String(item.desc ?? ''),
    year: Number(item.year),
    type: item.type === 'video' ? 'video' : 'image',
    isUploaded: true,
  }));
}

export async function uploadGalleryImage(
  file: File,
  meta: { title: string; desc: string; year: number; type: 'image' | 'video' }
): Promise<GalleryImage> {
  const form = new FormData();
  form.append('file', file);
  form.append('title', meta.title);
  form.append('desc', meta.desc);
  form.append('year', String(meta.year));
  form.append('type', meta.type);

  const response = await fetch(`${API_BASE}/gallery`, {
    method: 'POST',
    body: form,
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, 'Upload failed'));
  }

  const item: any = await response.json();
  return {
    id: Number(item.id),
    src: String(item.src ?? ''),
    title: String(item.title ?? meta.title),
    desc: String(item.desc ?? meta.desc),
    year: Number(item.year ?? meta.year),
    type: item.type === 'video' ? 'video' : meta.type,
    isUploaded: true,
  };
}

export async function deleteGalleryImage(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/gallery/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, 'Failed to delete gallery image'));
  }
}
