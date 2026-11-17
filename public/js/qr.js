/* مولّد رمز QR صغير داخل الموقع (بدون مكتبات ولا إنترنت): نص قصير مثل رابط الموقع، مستوى تصحيح M، الإصدارات 1 إلى 6 */
(function () {
  const VER = { 1: [16, 10, 1], 2: [28, 16, 1], 3: [44, 26, 1], 4: [64, 18, 2], 5: [86, 24, 2], 6: [108, 16, 4] };   // [بايتات البيانات، بايتات التصحيح لكل كتلة، عدد الكتل]
  const ALIGN = { 2: 18, 3: 22, 4: 26, 5: 30, 6: 34 };
  const EXP = new Uint8Array(512), LOG = new Uint8Array(256);
  for (let i = 0, x = 1; i < 255; i++) { EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 256) x ^= 0x11d; }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
  const mul = (a, b) => (a && b ? EXP[LOG[a] + LOG[b]] : 0);
  function rsEncode(data, n) {
    let gen = [1];
    for (let i = 0; i < n; i++) { const next = new Array(gen.length + 1).fill(0); gen.forEach((g, j) => { next[j] ^= g; next[j + 1] ^= mul(g, EXP[i]); }); gen = next; }
    const rem = new Array(n).fill(0);
    for (const d of data) { const f = d ^ rem.shift(); rem.push(0); for (let j = 0; j < n; j++) rem[j] ^= mul(gen[j + 1], f); }
    return rem;
  }
  function matrix(text) {
    const bytes = Array.from(new TextEncoder().encode(text));
    let v = 1; while (v <= 6 && bytes.length > VER[v][0] - 2) v++;
    if (v > 6) throw new Error('QR: النص أطول من المدعوم');
    const [nData, nEc, nBlocks] = VER[v];
    const bits = [];
    const put = (val, len) => { for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1); };
    put(4, 4); put(bytes.length, 8); bytes.forEach((b) => put(b, 8));
    put(0, Math.min(4, nData * 8 - bits.length));
    while (bits.length % 8) bits.push(0);
    const data = [];
    for (let i = 0; i < bits.length; i += 8) data.push(parseInt(bits.slice(i, i + 8).join(''), 2));
    for (let p = 0; data.length < nData; p++) data.push(p % 2 ? 0x11 : 0xec);
    const per = nData / nBlocks, blocks = [], ecs = [];
    for (let b = 0; b < nBlocks; b++) { const blk = data.slice(b * per, (b + 1) * per); blocks.push(blk); ecs.push(rsEncode(blk, nEc)); }
    const stream = [];
    for (let i = 0; i < per; i++) blocks.forEach((b) => stream.push(b[i]));
    for (let i = 0; i < nEc; i++) ecs.forEach((e) => stream.push(e[i]));
    const size = 17 + 4 * v;
    const M = Array.from({ length: size }, () => new Array(size).fill(null));     // null = لم يُحجز بعد
    const set = (r, c, val) => { if (r >= 0 && c >= 0 && r < size && c < size) M[r][c] = val ? 1 : 0; };
    const finder = (r0, c0) => { for (let r = -1; r <= 7; r++) for (let c = -1; c <= 7; c++) { const inside = r >= 0 && r <= 6 && c >= 0 && c <= 6; set(r0 + r, c0 + c, inside && (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4))); } };
    finder(0, 0); finder(0, size - 7); finder(size - 7, 0);
    if (ALIGN[v]) { const a = ALIGN[v]; for (let r = -2; r <= 2; r++) for (let c = -2; c <= 2; c++) set(a + r, a + c, Math.max(Math.abs(r), Math.abs(c)) !== 1); }
    for (let i = 8; i < size - 8; i++) { if (M[6][i] === null) M[6][i] = i % 2 ? 0 : 1; if (M[i][6] === null) M[i][6] = i % 2 ? 0 : 1; }
    set(size - 8, 8, 1);
    const fmtCells = [];                                  // مواضع بتات الصيغة (تُحجز الآن وتُكتب بعد اختيار القناع)
    for (let i = 0; i <= 5; i++) fmtCells.push([[i, 8], [8, size - 1 - i]]);                 // [صف، عمود]
    fmtCells.push([[7, 8], [8, size - 7]], [[8, 8], [8, size - 8]], [[8, 7], [size - 7, 8]]);
    for (let i = 9; i <= 14; i++) fmtCells.push([[8, 14 - i], [size - 15 + i, 8]]);
    fmtCells.forEach((pair) => pair.forEach(([r, c]) => { if (M[r][c] === null) M[r][c] = 0; }));
    const isData = M.map((row) => row.map((x) => x === null));
    const sbits = []; stream.forEach((b) => { for (let i = 7; i >= 0; i--) sbits.push((b >> i) & 1); });
    let k = 0, up = true;
    for (let c = size - 1; c > 0; c -= 2) {
      if (c === 6) c--;
      for (let i = 0; i < size; i++) { const r = up ? size - 1 - i : i; for (const cc of [c, c - 1]) if (isData[r][cc]) M[r][cc] = k < sbits.length ? sbits[k++] : 0; }
      up = !up;
    }
    const MASKS = [(r, c) => (r + c) % 2 === 0, (r) => r % 2 === 0, (r, c) => c % 3 === 0, (r, c) => (r + c) % 3 === 0, (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0, (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0, (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0, (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0];
    const build = (m) => {
      const G = M.map((row, r) => row.map((x, c) => (isData[r][c] && MASKS[m](r, c) ? x ^ 1 : x)));
      let f = (0 << 3) | m, rem = f;                      // مستوى M = 00
      for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >> 9) * 0x537);
      const fmt = ((f << 10) | rem) ^ 0x5412;
      fmtCells.forEach((pair, i) => pair.forEach(([r, c]) => { G[r][c] = (fmt >> i) & 1; }));
      return G;
    };
    const penalty = (G) => {
      let p = 0, dark = 0;
      for (let r = 0; r < size; r++) for (let dir = 0; dir < 2; dir++) { let run = 1; for (let c = 1; c < size; c++) { const a = dir ? G[c][r] : G[r][c], b = dir ? G[c - 1][r] : G[r][c - 1]; if (a === b) { run++; if (run === 5) p += 3; else if (run > 5) p++; } else run = 1; } }
      for (let r = 0; r < size - 1; r++) for (let c = 0; c < size - 1; c++) { const s = G[r][c] + G[r][c + 1] + G[r + 1][c] + G[r + 1][c + 1]; if (s === 0 || s === 4) p += 3; }
      G.forEach((row) => row.forEach((x) => { dark += x; }));
      return p + Math.floor(Math.abs(dark * 100 / (size * size) - 50) / 5) * 10;
    };
    let best = null, bestP = Infinity;
    for (let m = 0; m < 8; m++) { const G = build(m), p = penalty(G); if (p < bestP) { bestP = p; best = G; } }
    return best;
  }
  /* يرجع SVG كنص. quiet: الهامش الأبيض حول الرمز بعدد المربعات */
  function svg(text, { quiet = 3, dark = '#12301a', light = '#ffffff' } = {}) {
    const G = matrix(text), n = G.length, s = n + quiet * 2; let d = '';
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (G[r][c]) d += `M${c + quiet} ${r + quiet}h1v1h-1z`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}" shape-rendering="crispEdges" role="img" aria-label="رمز QR"><rect width="${s}" height="${s}" fill="${light}" stroke="none"/><path d="${d}" fill="${dark}" stroke="none"/></svg>`;
  }
  const api = { matrix, svg };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else window.NazihQR = api;
})();
