export function isAllowedHost(allowed: readonly string[]): boolean {
  try {
    const host = new URL(window.location.href).hostname.toLowerCase();
    return allowed.some((d) => host === d || host.endsWith('.' + d));
  } catch {
    return false;
  }
}
