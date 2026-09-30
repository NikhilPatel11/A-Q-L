const $ = i => document.getElementById(i);
let K = 'array', D = [], F = 0, N = 0, steps = [], idx = 0, timer = null, quiet = false;
const CAP = { array: 10, stack: 8, cqueue: 6 }, MAXN = 10, HS = 7, CQ = 6;
const isL = () => /ll$/.test(K);
const INFO = {
    array: ['Array', 'Continuous memory ma same type na elements. Index thi direct access (O(1)), pan vachche insert/delete ma elements khasedva padta hoy chhe.', 'Access O(1), Search O(n) (sorted hoy to binary O(log n)), Insert/Delete O(n)'],
    stack: ['Stack', 'LIFO: chhelle je aavyu te pehla nikle. Badhu kaam ek j chhedo (top) par thay chhe.', 'Push, Pop, Peek badhu O(1)'],
    queue: ['Queue', 'FIFO: pehla je aavyu te pehla nikle. Enqueue rear par, dequeue front par.', 'Enqueue, Dequeue, Front badhu O(1)'],
    cqueue: ['Circular Queue', 'Fixed size array je chhelle thi pachha shuru par wrap thai jay chhe: rear = (rear+1) % size. Jagya no waste nathi thato.', 'Enqueue, Dequeue O(1), capacity 6'],
    deque: ['Deque (Double-ended Queue)', 'Front ane rear banne bajue thi add/remove thai shake chhe. Stack ane Queue banne tarike vapray.', 'Chaare operation O(1)'],
    pq: ['Priority Queue', 'Darek item ni priority hoy chhe. Dequeue ma sauthi nano priority number (1 = sauthi vadhu important) pehla nikle. Ahiya sorted list tarike batavyu chhe.', 'Sorted list ma Enqueue O(n), Dequeue O(1) (heap ma O(log n))'],
    sll: ['Singly Linked List', 'Darek node ma value ane next pointer. Head thi j shuru karvu padtu hoy chhe, etle access O(n) chhe pan head par insert O(1).', 'Insert head O(1), Insert tail/Search O(n)'],
    dll: ['Doubly Linked List', 'Darek node ma prev ane next banne pointer. Banne dishama chalay shake chhe ane delete saral chhe, pan vadhu memory joie.', 'Insert/Delete (node malya pachhi) O(1), Search O(n)'],
    cll: ['Circular Linked List', 'Chhella node nu next pointer pachhu head ne point kare chhe, etle end par null nathi. Round-robin jeva kaam mate saru.', 'Insert head/tail O(n) (tail sudhi), Search O(n)'],
    hash: ['Hash Table (Chaining)', 'hash(x) = x % 7 thi bucket nakki thay chhe. Be value same bucket ma aave (collision) to linked chain ma joday chhe.', 'Average O(1), worst O(n)']
};

/* ---- snapshots ---- */
const pt = (o, i, l) => { o[i] = o[i] ? o[i] + '/' + l : l };
function snap() {
    if (K == 'hash') return { k: 'h', b: D.map(x => x.slice()) };
    if (isL()) return { k: 'l', n: D.slice(), d: K == 'dll', c: K == 'cll' };
    const p = {}; let c;
    if (K == 'cqueue') { c = D.map(x => x == null ? null : { t: x }); if (N) { pt(p, F, 'front'); pt(p, (F + N - 1) % CQ, 'rear') } }
    else if (K == 'array' || K == 'stack') { c = Array.from({ length: CAP[K] }, (_, i) => i < D.length ? { t: D[i] } : null); if (K == 'stack' && D.length) pt(p, D.length - 1, 'top') }
    else { c = D.map(x => K == 'pq' ? { t: x.v, s: 'p' + x.p } : { t: x }); if (D.length) { pt(p, 0, 'front'); if (K != 'pq') pt(p, D.length - 1, 'rear') } }
    return { k: 'c', v: K == 'stack', c, p }
}
const rec = (hl, m) => { if (!quiet) steps.push({ t: snap(), hl: hl || {}, m }) };
const say = (m, hl) => rec(hl, m);
const dimAll = c => Object.fromEntries(D.map((_, j) => [j, c]));

/* ---- Array ---- */
const bad = i => say(`Index ${i} valid nathi (size ${D.length}, valid index 0 thi ${D.length - 1}).`);
const AR = [
    ['Access', 'i', ({ i }) => { if (i >= D.length) return bad(i); say(`arr[${i}] = ${D[i]}. Address = base + ${i} × size, etle O(1) ma direct male.`, { [i]: 's' }) }],
    ['Update', 'vi', ({ v, i }) => { if (i >= D.length) return bad(i); say(`arr[${i}] hatu ${D[i]}, have ${v} karvu.`, { [i]: 'c' }); D[i] = v; say(`arr[${i}] = ${v} update thayu.`, { [i]: 's' }) }],
    ['Insert', 'vi', ({ v, i }) => {
        const n = D.length; if (n >= 10) return say('Array bharai gayo (capacity 10).'); if (i > n) return say(`Insert index 0 thi ${n} vachche j thai shake.`);
        say(`Index ${i} par ${v} mukvo chhe. ${i} thi aagal na elements ne jamna khasedva padshe.`); D.push(D[n - 1] ?? v);
        for (let j = n - 1; j >= i; j--) { D[j + 1] = D[j]; say(`arr[${j}] ne arr[${j + 1}] ma khasedyo.`, { [j]: 'c', [j + 1]: 'w' }) }
        D[i] = v; say(`Jagya khali thai, arr[${i}] = ${v} mukyo.`, { [i]: 's' })
    }],
    ['Delete', 'i', ({ i }) => {
        const n = D.length; if (i >= n) return bad(i); say(`arr[${i}] = ${D[i]} kadhvo chhe.`, { [i]: 'w' });
        for (let j = i; j < n - 1; j++) { D[j] = D[j + 1]; say(`arr[${j + 1}] ne arr[${j}] ma khasedyo.`, { [j]: 'w', [j + 1]: 'c' }) }
        D.pop(); say('Chhelo duplicate kadhi nakhyo, size 1 ghatyu.')
    }],
    ['Linear search', 'v', ({ v }) => { for (let j = 0; j < D.length; j++) { say(`arr[${j}] = ${D[j]} ne ${v} sathe sarkhavyo.`, { [j]: 'c' }); if (D[j] == v) return say(`${v} index ${j} par mali gayo!`, { [j]: 's' }) } say(`${v} array ma nathi.`) }],
    ['Binary search', 'v', ({ v }) => {
        if (D.some((x, j) => j && D[j - 1] > x)) return say('Binary search mate array sorted joie. Pehla "Sort" dabavo.'); let lo = 0, hi = D.length - 1;
        const dim = () => { const h = {}; D.forEach((_, j) => { if (j < lo || j > hi) h[j] = 'd' }); return h };
        while (lo <= hi) {
            const m = (lo + hi) >> 1; say(`lo=${lo}, hi=${hi}, mid=${m}. arr[mid]=${D[m]} ne ${v} sathe sarkhavyo.`, { ...dim(), [m]: 'c' });
            if (D[m] == v) return say(`${v} index ${m} par mali gayo!`, { ...dim(), [m]: 's' });
            if (D[m] < v) { lo = m + 1; say(`${D[m]} < ${v}, jamni bajue jao (lo=${lo}).`, dim()) } else { hi = m - 1; say(`${D[m]} > ${v}, dabi bajue jao (hi=${hi}).`, dim()) }
        }
        say(`${v} array ma nathi.`)
    }],
    ['Sort', '', () => { D.sort((a, b) => a - b); say('Array ascending ma sort karyo.', dimAll('v')) }]];

/* ---- Stack ---- */
const ST = [
    ['Push', 'v', ({ v }) => { if (D.length >= 8) return say('Stack Overflow! Stack bharai gayo (capacity 8).', { 7: 'w' }); say(`top++ karine ${v} push karvo chhe.`); D.push(v); say(`${v} top par mukyo.`, { [D.length - 1]: 's' }) }],
    ['Pop', '', () => { if (!D.length) return say('Stack Underflow! Stack khali chhe.'); const t = D.length - 1; say(`Top element ${D[t]} kadhvo chhe.`, { [t]: 'w' }); const x = D.pop(); say(`${x} pop thayo, top-- thayu.`) }],
    ['Peek', '', () => D.length ? say(`Top element ${D[D.length - 1]} chhe (kadhyo nathi).`, { [D.length - 1]: 'c' }) : say('Stack khali chhe.')],
    ['Info', '', () => say(`Size = ${D.length}, isEmpty = ${!D.length}, isFull = ${D.length >= 8}.`)]];

/* ---- Queue / Deque ---- */
const qadd = (v, front) => {
    if (D.length >= MAXN) return say('Queue bharai gayi (max 10 items).'); say(front ? `${v} ne front par mukvo chhe.` : `${v} ne rear par mukvo chhe.`);
    front ? D.unshift(v) : D.push(v); say(`${v} ${front ? 'front' : 'rear'} par add thayo.`, { [front ? 0 : D.length - 1]: 's' })
};
const qrem = front => { if (!D.length) return say('Queue Underflow! Queue khali chhe.'); const i = front ? 0 : D.length - 1; say(`${front ? 'Front' : 'Rear'} element ${D[i]} kadhvo chhe.`, { [i]: 'w' }); const x = front ? D.shift() : D.pop(); say(`${x} remove thayo.`) };
const qpeek = front => D.length ? say(`${front ? 'Front' : 'Rear'} element ${D[front ? 0 : D.length - 1]} chhe (kadhyo nathi).`, { [front ? 0 : D.length - 1]: 'c' }) : say('Queue khali chhe.');
const qinfo = () => say(`Size = ${D.length}, isEmpty = ${!D.length}.`);
const QU = [['Enqueue', 'v', ({ v }) => qadd(v, 0)], ['Dequeue', '', () => qrem(1)], ['Front', '', () => qpeek(1)], ['Rear', '', () => qpeek(0)], ['Info', '', qinfo]];
const DQ = [['Add front', 'v', ({ v }) => qadd(v, 1)], ['Add rear', 'v', ({ v }) => qadd(v, 0)], ['Remove front', '', () => qrem(1)], ['Remove rear', '', () => qrem(0)], ['Peek front', '', () => qpeek(1)], ['Peek rear', '', () => qpeek(0)], ['Info', '', qinfo]];

/* ---- Circular Queue ---- */
function cqEnq({ v }) {
    if (N == CQ) return say(`Queue Full (Overflow)! Size ${N} = capacity ${CQ}.`, { [(F + N - 1) % CQ]: 'w' }); const r = (F + N) % CQ;
    say(`rear = (rear+1) % ${CQ} = ${r}.${F + N >= CQ ? ' End par thi wrap thai ne pachha shuru par aavyo!' : ''}`, { [r]: 'c' }); D[r] = v; N++; say(`${v} index ${r} par mukyo.`, { [r]: 's' })
}
function cqDeq() {
    if (!N) return say('Queue Underflow! Queue khali chhe.'); say(`Front (index ${F}) no ${D[F]} kadhvo chhe.`, { [F]: 'w' }); const x = D[F]; D[F] = null; const o = F; F = (F + 1) % CQ; N--;
    say(`${x} nikalyo. front = (front+1) % ${CQ} = ${F}.${o + 1 >= CQ ? ' Wrap thayu!' : ''}`)
}
const CQO = [['Enqueue', 'v', cqEnq], ['Dequeue', '', cqDeq], ['Front', '', () => N ? say(`Front element ${D[F]} (index ${F}).`, { [F]: 'c' }) : say('Queue khali chhe.')],
['Info', '', () => say(`front=${N ? F : '-'}, rear=${N ? (F + N - 1) % CQ : '-'}, size=${N}, isEmpty=${!N}, isFull=${N == CQ}.`)]];

/* ---- Priority Queue ---- */
function pqIns(v, p) {
    if (D.length >= MAXN) return say('Queue bharai gayi (max 10 items).'); let j = 0;
    while (j < D.length && D[j].p <= p) { say(`${D[j].v} (priority ${D[j].p}) ≤ ${p}, aagal jao.`, { [j]: 'c' }); j++ }
    D.splice(j, 0, { v, p }); say(`${v} (priority ${p}) index ${j} par mukyo.`, { [j]: 's' })
}
const PQ = [['Enqueue', 'vi', ({ v, i }) => i < 1 || i > 9 ? say('Priority 1 thi 9 vachche lakho.') : pqIns(v, i)],
['Dequeue', '', () => { if (!D.length) return say('Queue khali chhe.'); say(`Sauthi vadhu priority: ${D[0].v} (priority ${D[0].p}).`, { 0: 'w' }); const x = D.shift(); say(`${x.v} nikalyo.`) }],
['Peek', '', () => D.length ? say(`Front: ${D[0].v} (priority ${D[0].p}).`, { 0: 'c' }) : say('Queue khali chhe.')]];

/* ---- Linked lists ---- */
const nxt = () => K == 'dll' ? 'next ane prev' : 'next';
const full = () => D.length >= MAXN && (say('Max 10 nodes j batavi shakay.'), 1);
function walk(to, txt) { for (let j = 0; j < to; j++)say(`Node ${D[j]} par chho, ${txt || 'next follow karo'}.`, { [j]: 'c' }) }
function insHead(v) {
    if (full()) return; if (D.length) say(`Navo node ${v} banavyo, tena ${nxt()} ma purano head (${D[0]}) jodyo.`, { 0: 'p' }); D.unshift(v);
    say(`Head have ${v} chhe.${K == 'cll' && D.length > 1 ? ' Tail.next pan navo head ne point kare chhe.' : ''}`, { 0: 's' })
}
function insTail(v) { if (full()) return; walk(D.length, 'next follow karo tail sudhi'); D.push(v); say(`${v} tail nu navu node banyu${K == 'cll' ? '; tail.next = head' : '; purana tail nu next = navu node'}.`, { [D.length - 1]: 's' }) }
function delAt(i) {
    const n = D.length; if (!n) return say('List khali chhe.'); if (i >= n) return bad(i);
    if (i == 0) { say(`Head ${D[0]} kadhvo; head = head.next.`, { 0: 'w' }); D.shift(); return say(`Head ek node aagal gayo.${K == 'cll' && D.length ? ' Tail.next = navo head.' : ''}`) }
    walk(i, `aagal jao`); say(`Node ${D[i - 1]} nu next, ${D[i]} ne skip karine agla node ne point karshe.`, { [i - 1]: 'p', [i]: 'w' }); const x = D.splice(i, 1)[0]; say(`${x} kadhi nakhyu, pointers jodya.`)
}
const LLO = [
    ['Insert head', 'v', ({ v }) => insHead(v)], ['Insert tail', 'v', ({ v }) => insTail(v)],
    ['Insert at', 'vi', ({ v, i }) => {
        if (full()) return; if (i > D.length) return say(`Index 0 thi ${D.length} vachche j thai shake.`); if (i == 0) return insHead(v);
        walk(i, 'aagal jao'); say(`Node ${D[i - 1]} pachhi ${v} nu node jodvu chhe.`, { [i - 1]: 'p' }); D.splice(i, 0, v); say(`${v} ne vachche jodyo (pointers update: ${nxt()}).`, { [i]: 's' })
    }],
    ['Delete head', '', () => delAt(0)],
    ['Delete tail', '', () => D.length ? delAt(D.length - 1) : say('List khali chhe.')],
    ['Delete at', 'i', ({ i }) => delAt(i)],
    ['Delete value', 'v', ({ v }) => { for (let j = 0; j < D.length; j++) { say(`${D[j]} ne ${v} sathe sarkhavyo.`, { [j]: 'c' }); if (D[j] == v) return delAt(j) } say(`${v} list ma nathi.`) }],
    ['Search', 'v', ({ v }) => { for (let j = 0; j < D.length; j++) { say(`${D[j]} ne ${v} sathe sarkhavyo.`, { [j]: 'c' }); if (D[j] == v) return say(`${v} position ${j} par mali gayo!`, { [j]: 's' }) } say(`${v} list ma nathi.`) }],
    ['Traverse', '', () => { const h = {}; D.forEach((x, j) => { say(`${x} visit karyo. Output: ${D.slice(0, j + 1).join(' → ')}`, { ...h, [j]: 'c' }); h[j] = 'v' }); if (!D.length) say('List khali chhe.') }],
    ['Reverse', '', () => { if (D.length < 2) return say('Reverse mate ochha ma ochha 2 node joie.'); D.forEach((x, j) => say(`Node ${x} nu ${nxt()} pointer ulto karyo (prev, cur, next 3 pointer vaparine).`, { [j]: 'c' })); D.reverse(); say('Badha pointer ulta thaya; purano tail have head chhe.', dimAll('v')) }]];

/* ---- Hash table ---- */
function hIns(v) {
    const b = v % HS; say(`hash(${v}) = ${v} % ${HS} = ${b}`, { [b]: 'c' }); if (D[b].includes(v)) return say(`${v} pehla thi bucket ${b} ma chhe.`);
    if (D[b].length) say(`Collision! Bucket ${b} ma pehla thi ${D[b].join(', ')} chhe, etle chain ma jodvu.`, { [b]: 'w' }); D[b].push(v); say(`${v} bucket ${b} ma mukyo.`, { [b + '.' + (D[b].length - 1)]: 's' })
}
function hSrch(v, del) {
    const b = v % HS; say(`hash(${v}) = ${v} % ${HS} = ${b}`, { [b]: 'c' });
    for (let j = 0; j < D[b].length; j++) { say(`Chain ma ${D[b][j]} ne ${v} sathe sarkhavyo.`, { [b + '.' + j]: 'c' }); if (D[b][j] == v) { if (!del) return say(`${v} mali gayo!`, { [b + '.' + j]: 's' }); D[b].splice(j, 1); return say(`${v} chain ma thi kadhi nakhyo.`, { [b]: 'w' }) } }
    say(`${v} bucket ${b} ma nathi.`)
}
const HT = [['Insert', 'v', ({ v }) => hIns(v)], ['Search', 'v', ({ v }) => hSrch(v, 0)], ['Delete', 'v', ({ v }) => hSrch(v, 1)]];
const OPS = { array: AR, stack: ST, queue: QU, cqueue: CQO, deque: DQ, pq: PQ, sll: LLO, dll: LLO, cll: LLO, hash: HT };

/* ---- rendering ---- */
const A = 'marker-end="url(#ar)"';
const DEFS = '<defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="ah" d="M0 0L10 5L0 10z"/></marker></defs>';
const T = (x, y, t, c) => `<text ${c ? `class="${c}" ` : ''}x="${x}" y="${y}">${t}</text>`;
function rCells(s, hl) {
    const c = s.c, n = Math.max(c.length, 1); let h = '', W, H;
    if (s.v) { W = 230; H = n * 46 + 16; c.forEach((x, i) => { const y = (n - 1 - i) * 46 + 8; h += `<g class="nd ${hl[i] || ''}"><rect ${x ? '' : 'class="em"'} x="70" y="${y}" width="90" height="40" rx="4"/>${x ? T(115, y + 20, x.t) : ''}</g>` + T(50, y + 21, i, 'ix') + (s.p[i] ? T(190, y + 21, '← ' + s.p[i], 'pl') : '') }) }
    else { W = n * 60 + 24; H = 110; c.forEach((x, i) => { const X = i * 60 + 12; h += `<g class="nd ${hl[i] || ''}"><rect ${x ? '' : 'class="em"'} x="${X}" y="34" width="54" height="42" rx="4"/>${x ? T(X + 27, x.s ? 51 : 55, x.t) + (x.s ? T(X + 27, 67, x.s, 'sb') : '') : ''}</g>` + T(X + 27, 94, i, 'ix') + (s.p[i] ? T(X + 27, 20, s.p[i], 'pl') : '') }) }
    return [W, H, h]
}
function rList(s, hl) {
    const n = s.n.length; if (!n) return [420, 70, T(10, 40, 'List khali chhe (head = null).', 'mt')];
    const nw = s.d ? 96 : 70, st = nw + 46, x0 = 34; let h = '', W = x0 + n * st + 40;
    s.n.forEach((v, i) => {
        const X = x0 + i * st, vx = s.d ? X + 24 : X, vw = 48;
        h += `<g class="nd ${hl[i] || ''}"><rect x="${X}" y="44" width="${nw}" height="38" rx="4"/>${T(vx + vw / 2, 63, v)}</g>`;
        h += s.d ? `<line class="dv" x1="${X + 24}" y1="44" x2="${X + 24}" y2="82"/><line class="dv" x1="${X + 72}" y1="44" x2="${X + 72}" y2="82"/>` : `<line class="dv" x1="${X + 48}" y1="44" x2="${X + 48}" y2="82"/>`;
        if (i < n - 1) { const a = X + nw - 11, b = X + st; h += `<line class="ln" x1="${a}" y1="56" x2="${b}" y2="56" ${A}/>`; if (s.d) h += `<line class="ln" x1="${b + 11}" y1="72" x2="${X + nw}" y2="72" ${A}/>` }
    });
    const xl = x0 + (n - 1) * st;
    if (s.c) h += `<path class="ln" d="M${xl + nw - 11} 82 C${xl + nw - 11} 130 ${x0 + 24} 130 ${x0 + 24} 84" ${A}/>`; else h += T(xl + nw + 22, 63, 'null', 'mt');
    h += T(x0 + nw / 2, 32, n == 1 ? 'head/tail' : 'head', 'pl'); if (n > 1) h += T(xl + nw / 2, 32, 'tail', 'pl'); return [W, s.c ? 150 : 100, h]
}
function rHash(s, hl) {
    let h = '', W = 200; s.b.forEach((ch, i) => {
        const y = i * 46 + 8; h += T(30, y + 20, i, 'ix') + `<g class="nd ${hl[i] || ''}"><rect x="50" y="${y}" width="50" height="38" rx="4"/>${T(75, y + 19, ch.length ? '•' : '')}</g>`;
        ch.forEach((v, j) => { const x = 140 + j * 86; h += `<line class="ln" x1="${j ? x - 30 : 100}" y1="${y + 19}" x2="${x}" y2="${y + 19}" ${A}/><g class="nd ${hl[i + '.' + j] || ''}"><rect x="${x}" y="${y}" width="56" height="38" rx="4"/>${T(x + 28, y + 19, v)}</g>`; W = Math.max(W, x + 90) })
    });
    return [W, s.b.length * 46 + 16, h]
}
function render(t, hl) {
    const svg = $('svg'); const [W, H, h] = t.k == 'c' ? rCells(t, hl) : t.k == 'l' ? rList(t, hl) : rHash(t, hl);
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.style.width = W + 'px'; svg.innerHTML = DEFS + h
}
function draw() {
    const s = steps[idx]; render(s.t, s.hl); $('msg').textContent = s.m; $('cnt').textContent = `Step ${idx + 1} / ${steps.length}`;
    $('prev').disabled = idx <= 0; $('next').disabled = idx >= steps.length - 1; if (idx >= steps.length - 1) stop()
}
function stop() { clearInterval(timer); timer = null; $('play').textContent = 'Play' }
function play() {
    if (timer) return stop(); if (idx >= steps.length - 1) idx = 0; $('play').textContent = 'Pause';
    timer = setInterval(() => { if (idx < steps.length - 1) { idx++; draw() } else stop() }, 1100 - $('spd').value * 100)
}
function run(fn) { stop(); steps = []; rec({}, 'Operation shuru. Current sthiti.'); fn(); idx = 0; draw(); if (steps.length > 1) play() }

/* ---- UI ---- */
function fresh() { F = 0; N = 0; D = K == 'cqueue' ? Array(CQ).fill(null) : K == 'hash' ? Array.from({ length: HS }, () => []) : [] }
function sample() {
    stop(); quiet = true; fresh();
    if (K == 'cqueue') { [4, 8, 2, 6].forEach(v => cqEnq({ v })); cqDeq(); cqDeq();[5, 9, 3].forEach(v => cqEnq({ v })) }
    else if (K == 'pq') [[8, 3], [4, 1], [6, 2]].forEach(([v, p]) => pqIns(v, p));
    else if (K == 'hash') [10, 17, 3, 22, 9].forEach(hIns);
    else D = ({ array: [7, 3, 9, 1, 5], stack: [4, 8, 2], queue: [4, 8, 2, 6], deque: [5, 3, 8] }[K] || [3, 7, 1, 9]).slice();
    quiet = false; steps = [{ t: snap(), hl: {}, m: 'Sample data taiyar. Upar thi operation try karo.' }]; idx = 0; draw()
}
function setK(k) {
    K = k; document.querySelectorAll('.chip').forEach(b => b.setAttribute('aria-pressed', b.dataset.k == k));
    $('an').textContent = INFO[k][0]; $('ad').textContent = INFO[k][1]; $('ac').textContent = INFO[k][2];
    $('b').placeholder = k == 'pq' ? 'priority (1-9)' : 'index'; $('b').style.display = (k == 'stack' || k == 'queue' || k == 'cqueue' || k == 'deque' || k == 'hash') ? 'none' : '';
    $('ops').innerHTML = OPS[k].map((o, i) => `<button data-n="${i}">${o[0]}</button>`).join(''); sample()
}
function err(m) { $('msg').textContent = m }
$('chips').innerHTML = Object.keys(INFO).map(k => `<button class="chip" data-k="${k}" aria-pressed="false">${INFO[k][0].replace(/ \(.*/, '')}</button>`).join('');
$('chips').onclick = e => { if (e.target.dataset.k) setK(e.target.dataset.k) };
$('ops').onclick = e => {
    const b = e.target.closest('button'); if (!b) return; const [, need, fn] = OPS[K][b.dataset.n], o = {};
    if (need.includes('v')) { const s = $('a').value.trim(), v = +s; if (s === '' || !Number.isInteger(v) || v < 1 || v > 99) return err('Value: 1 thi 99 vachche number lakho.'); o.v = v }
    if (need.includes('i')) { const s = $('b').value.trim(), i = +s; if (s === '' || !Number.isInteger(i) || i < 0 || i > 99) return err(K == 'pq' ? 'Priority: 1 thi 9 number lakho.' : 'Index: 0 thi vadhu number lakho.'); o.i = i }
    run(() => fn(o))
};
$('rs').onclick = sample; $('clr').onclick = () => { stop(); fresh(); steps = [{ t: snap(), hl: {}, m: 'Structure khali chhe.' }]; idx = 0; draw() };
$('next').onclick = () => { stop(); if (idx < steps.length - 1) { idx++; draw() } }; $('prev').onclick = () => { stop(); if (idx > 0) { idx--; draw() } };
$('rst').onclick = () => { stop(); idx = 0; draw() }; $('play').onclick = play; $('spd').oninput = () => { if (timer) { stop(); play() } };
setK('array');
