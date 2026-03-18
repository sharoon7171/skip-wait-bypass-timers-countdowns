import { isAllowedHost } from '../utils/domain-check';

const ALLOWED_HOSTS = ['hubcdn.fans'];
const DL_LINK_RE = /\/dl\/\?link=(.+)/;

export function initHubcdnRedirect(): void {
  if (!isAllowedHost(ALLOWED_HOSTS)) return;
  const m = window.location.href.match(DL_LINK_RE);
  if (m?.[1]) window.location.href = decodeURIComponent(m[1]);
}
