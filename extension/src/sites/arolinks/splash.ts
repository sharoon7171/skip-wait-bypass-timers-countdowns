type SplashFields = {
  action: string;
  pdata: string;
  wsidchk: number;
  passId: string;
  ts: string;
};

export const isSplashHtml = (html: string): boolean =>
  /Please wait while your request is being verified/i.test(html) &&
  (/wsidchk/.test(html) || /a0A\s*=\s*function/.test(html) || /fbta74xmsz5m/.test(html));

const jsFuckInt = (expr: string): number => {
  const wrapped = '+((' + expr + '))';
  const inners = [...wrapped.matchAll(/\(([^()]+)\)/g)].map((m) => m[1]!);
  let acc: string | number | null = null;
  for (const inner of inners) {
    let body = inner;
    const asString = /\]\+\[\]$/.test(body);
    if (asString) body = body.slice(0, -3);
    let sum = 0;
    let s = body;
    while (s.length) {
      if (s.startsWith('+!+[]')) {
        sum += 1;
        s = s.slice(5);
        continue;
      }
      if (s.startsWith('+!![]')) {
        sum += 1;
        s = s.slice(5);
        continue;
      }
      if (s.startsWith('+![]')) {
        sum += 0;
        s = s.slice(4);
        continue;
      }
      if (s.startsWith('+[]')) {
        sum += 0;
        s = s.slice(3);
        continue;
      }
      throw new Error('jsfuck');
    }
    const val: string | number = asString ? String(sum) : sum;
    if (acc == null) acc = val;
    else if (typeof acc === 'string' || typeof val === 'string') acc = String(acc) + String(val);
    else acc = acc + val;
  }
  return Number(acc);
};

const parseStringTable = (code: string): string[] | null => {
  const raw = code.match(/var L=(\[[^\]]+\])/);
  if (!raw?.[1]) return null;
  try {
    const list = JSON.parse(raw[1].replace(/'/g, '"')) as unknown;
    return Array.isArray(list) && list.every((x) => typeof x === 'string') ? (list as string[]) : null;
  } catch {
    return null;
  }
};

const parseShuffleTarget = (code: string): number | null => {
  const m = code.match(/\(a0i,(0x[0-9a-f]+)\)/i);
  return m?.[1] ? Number.parseInt(m[1], 16) : null;
};

const parseA0u = (code: string): { b: number; P: number; i: number; A: number; d: number; C: number } | null => {
  const m = code.match(/a0u=\{([^}]+)\}/);
  if (!m?.[1]) return null;
  const out: Record<string, number> = {};
  for (const part of m[1].split(',')) {
    const kv = part.match(/([A-Za-z]+):(0x[0-9a-f]+)/i);
    if (!kv?.[1] || !kv[2]) continue;
    out[kv[1]] = Number.parseInt(kv[2], 16);
  }
  const b = out['b'];
  const P = out['P'];
  const i = out['i'];
  const A = out['A'];
  const d = out['d'];
  const C = out['C'];
  if (b == null || P == null || i == null || A == null || d == null || C == null) return null;
  return { b, P, i, A, d, C };
};

const shuffleGet = (
  list: string[],
  a0u: { b: number; P: number; i: number; A: number; d: number; C: number },
  target: number,
): ((n: number) => string) => {
  const L = list.slice();
  const G = (n: number): string => L[n - 0x1d9] ?? '';
  for (let guard = 0; guard < 2000; guard++) {
    try {
      const A =
        (-Number.parseInt(G(0x20b), 10) / 0x1) * (-Number.parseInt(G(a0u.b), 10) / 0x2) +
        Number.parseInt(G(a0u.P), 10) / 0x3 +
        (-Number.parseInt(G(0x1df), 10) / 0x4) * (Number.parseInt(G(a0u.i), 10) / 0x5) +
        -Number.parseInt(G(0x204), 10) / 0x6 +
        (-Number.parseInt(G(0x1f4), 10) / 0x7) * (-Number.parseInt(G(a0u.A), 10) / 0x8) +
        (-Number.parseInt(G(a0u.d), 10) / 0x9) * (Number.parseInt(G(a0u.C), 10) / 0xa) +
        (-Number.parseInt(G(0x1ff), 10) / 0xb) * (-Number.parseInt(G(0x202), 10) / 0xc);
      if (A === target) break;
      L.push(L.shift()!);
    } catch {
      L.push(L.shift()!);
    }
  }
  return (n: number) => L[n - 0x1d9] ?? '';
};

export const parseSplashFields = (html: string): SplashFields | null => {
  if (!isSplashHtml(html)) return null;
  const code = html.match(/<script>([\s\S]*?a0C[\s\S]*?)<\/script>/)?.[1];
  if (!code) return null;
  const action = code.match(/R='(\/[^']+)'/)?.[1];
  const pdataEnc = code.match(/X='([^']+)'/)?.[1];
  const pExpr = code.match(/P=\+\(\((.+?)\)\),i=/)?.[1];
  const nExpr = code.match(/N=\+\(\((.+?)\)\),S=/)?.[1];
  const ts = code.match(/\('ts','(\d+)'\)/)?.[1] ?? code.match(/\]='(\d{10})'/)?.[1];
  const table = parseStringTable(code);
  const target = parseShuffleTarget(code);
  const a0u = parseA0u(code);
  if (!action || !pdataEnc || !pExpr || !nExpr || !ts || !table || target == null || !a0u) return null;
  let wsidchk: number;
  try {
    wsidchk = jsFuckInt(pExpr) + jsFuckInt(nExpr);
  } catch {
    return null;
  }
  if (!Number.isFinite(wsidchk)) return null;
  const G = shuffleGet(table, a0u, target);
  const passId = `${G(0x1f3)}${G(0x1ec)}${G(0x1d9)}c7`;
  if (passId.length < 20) return null;
  return {
    action,
    pdata: decodeURIComponent(pdataEnc),
    wsidchk,
    passId,
    ts,
  };
};

export const splashPassUrl = (pageUrl: string, fields: SplashFields): string => {
  const origin = new URL(pageUrl).origin;
  const q = new URLSearchParams({
    wsidchk: String(fields.wsidchk),
    pdata: fields.pdata,
    id: fields.passId,
    ts: fields.ts,
    cttl: '0',
  });
  return `${origin}${fields.action}?${q.toString()}`;
};
