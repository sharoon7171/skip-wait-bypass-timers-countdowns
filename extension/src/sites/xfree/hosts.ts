import { canBypassHost } from '../../gate';

export async function isXfreeUrl(url: string): Promise<boolean> {
  try {
    const u = new URL(url);
    return await canBypassHost(u.hostname, 'xfree');
  } catch {
    return false;
  }
}
