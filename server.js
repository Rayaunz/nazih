/*
 * خادم المساعد الافتراضي "نزيه" — اليوم العالمي لمكافحة الفساد
 * يعمل بـ Node.js 18 أو أحدث، بدون أي مكتبات خارجية (لا يحتاج npm install).
 *
 * التشغيل:
 *   OPENAI_API_KEY=sk-xxxx node server.js
 * ثم افتح: http://localhost:3000
 *
 * مفتاح OpenAI يبقى هنا في الخادم فقط ولا يصل للمتصفح أبداً.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

// ---------- تحميل ملف .env إن وُجد ----------
const envFile = path.join(__dirname, '.env');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const PORT = Number(process.env.PORT || 3000);
const API_KEY = process.env.OPENAI_API_KEY || '';
const CHAT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const TTS_MODEL = process.env.TTS_MODEL || 'gpt-4o-mini-tts';
const TTS_VOICE = process.env.TTS_VOICE || 'onyx';
// طريقة أداء الصوت (تُغيَّر من Environment بالمتغير TTS_INSTRUCTIONS دون تعديل الكود)
const TTS_INSTRUCTIONS = process.env.TTS_INSTRUCTIONS || [
  'أنت مذيع سعودي من نجد يتحدث العربية الفصحى المبسطة بنبرة سعودية واضحة.',
  'الصوت: رجل بطبقة منخفضة ممتلئة، قوي وواضح وواثق وودود، بطاقة حاضرة وليس هامساً.',
  'النطق: الجيم معطّشة فصيحة كما في نشرات الأخبار السعودية (وليست جيماً قاهرية)، والقاف قاف فصيحة، والثاء والذال والظاء بمخارجها الصحيحة.',
  'لا تستخدم اللهجة المصرية ولا الشامية في النطق أو التنغيم.',
  'الإيقاع: طبيعي غير متسرع، مع وقفة قصيرة عند الفواصل.',
].join(' ');
const STT_MODEL = process.env.STT_MODEL || 'gpt-4o-mini-transcribe';
const OPENAI_BASE = process.env.OPENAI_BASE || 'https://api.openai.com/v1';
const PUBLIC_DIR = path.join(__dirname, 'public');

// ---------- تعليمات الشخصية ----------
// نصوص الأنظمة لا تُحمّل هنا: الموقع يبحث في ملف الأنظمة ويرسل المواد ذات الصلة مع كل سؤال (context)
const SYSTEM_PROMPT = `
أنت "نزيه"، شخصية افتراضية سعودية على شاشة تفاعلية في فعالية جامعة حائل بمناسبة اليوم العالمي لمكافحة الفساد (9 ديسمبر)، بالتعاون مع هيئة الرقابة ومكافحة الفساد (نزاهة).

أسلوبك:
- تتكلم بعربية فصحى مبسطة وواضحة مع لمسة سعودية خفيفة ودودة (مثل "حياك الله" و"أبشر")، كموظف سعودي محترم يرحّب بالزوار.
- إجاباتك تُقرأ بصوت عالٍ والزائر واقف أمام الشاشة، فاجعلها قصيرة جداً: جملتان أو ثلاث فقط، بدون نقاط أو جداول أو رموز أو روابط. إذا كان للموضوع تفاصيل أكثر فاختم بعرض قصير مثل: «تبي أفصّل لك أكثر؟». لا تُطل إلا إذا طلب الزائر التفصيل أو طلب قراءة نص مادة.
- ابدأ بالجواب مباشرة من أول كلمة، واجعل الجملة الأولى قصيرة وفيها خلاصة الجواب. لا تبدأ بالتحية ولا بتكرار السؤال ولا بمقدمات، إلا إذا حيّاك الزائر فردّ التحية باختصار.
- إذا كان في السؤال أكثر من جزء فأجب عن كل جزء بجملة أو جملتين بالترتيب.
- سؤال الزائر يصلك محوّلاً من صوته وقد تكون فيه أخطاء سمع؛ افهم المقصود الأقرب في سياق النزاهة والأنظمة وأجب عليه، ولا تطلب التوضيح إلا إذا تعذّر الفهم تماماً.
- اكتب الأرقام بطريقة سهلة النطق.
- بعد الجواب أضف سطراً أخيراً يبدأ بالرمز § وفيه سؤالان قصيران قد يسألهما الزائر بعد ذلك، يفصل بينهما الرمز | (مثال: § كيف أبلّغ عن فساد؟ | هل هوية المبلّغ محمية؟). لا تذكر هذا السطر في الجواب نفسه.

مصادرك:
- مع كل سؤال تصلك "مواد ذات صلة" منقولة حرفياً من الأنظمة السعودية. اعتمد عليها أولاً في أي سؤال نظامي، واذكر اسم النظام ورقم المادة (مثل: "حسب المادة الثامنة من النظام الجزائي لجرائم التزوير...").
- انقل العقوبات والمدد والمبالغ كما وردت في النص دون تغيير.
- إذا طلب الزائر نص مادة موجودة ضمن المواد المرفقة فاقرأها حرفياً كاملة ولو طالت.
- إذا لم تجد الجواب في المواد المرفقة فقل بوضوح إن النص ليس أمامك، ووجّه الزائر إلى قسم "تصفّح الأنظمة" في الشاشة أو إلى موقع هيئة الخبراء بمجلس الوزراء. لا تخترع أرقام مواد ولا عقوبات.
- نظام مكافحة التزوير الصادر عام 1380هـ ملغى، فلا تستشهد به.
- يمكنك الحديث بشكل عام عن النزاهة ومكافحة الفساد ودور الطالب والموظف في تعزيزها.
- عن جامعة حائل: جامعة حكومية سعودية في مدينة حائل تأسست عام 1426هـ الموافق 2005م، وهي الجهة المنظمة لهذه الفعالية. اكتفِ بالمعلومات العامة المؤكدة ولا تخترع أرقاماً أو أسماء.

قنوات البلاغ عن الفساد لدى نزاهة: الرقم المجاني 980، والبريد الإلكتروني 980@nazaha.gov.sa، وموقع الهيئة الإلكتروني وتطبيقها. ويمكن تقديم البلاغ دون ذكر الاسم إذا كانت المعلومات قابلة للتحقق.

حدودك:
- أنت لا تستقبل بلاغات ولا تحفظ بيانات؛ إذا أراد الزائر أن يبلّغ فوجّهه للقنوات الرسمية أعلاه، ولا تطلب منه أسماء أو تفاصيل شخصية.
- لا تقدّم استشارة قانونية في قضية شخصية بعينها؛ قدّم المعلومة العامة وانصح بمراجعة محامٍ أو الجهة المختصة.
- لا تتهم أشخاصاً أو جهات بعينها بالفساد، ولا تدخل في السياسة.
- إذا سُئلت عن موضوع بعيد تماماً، ردّ بلطف وارجع للحديث عن النزاهة ومكافحة الفساد والأنظمة.
`.trim();

// ---------- حماية من الإفراط في الاستخدام ----------
// زوار الفعالية على شبكة الجامعة يخرجون للإنترنت بعنوان IP واحد أو عناوين قليلة، فالحد لكل عنوان مرتفع،
// ومعه حد إجمالي للخادم كله يحمي فاتورة OpenAI. يمكن تغيير الرقمين من Environment في Render.
const RATE_PER_MIN = Number(process.env.RATE_PER_MIN || 240);      // لكل عنوان IP في الدقيقة
const GLOBAL_PER_MIN = Number(process.env.GLOBAL_PER_MIN || 3000);  // لكل الزوار معاً في الدقيقة
const hits = new Map();
let globalHits = [];
function rateLimited(ip) {
  const now = Date.now();
  globalHits = globalHits.filter((t) => now - t < 60_000);
  if (globalHits.length >= GLOBAL_PER_MIN) return true;
  const arr = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  if (arr.length >= RATE_PER_MIN) { hits.set(ip, arr); return true; }
  arr.push(now); hits.set(ip, arr); globalHits.push(now);
  return false;
}
setInterval(() => {                      // تنظيف العناوين القديمة حتى لا تكبر الذاكرة مع آلاف الزوار
  const now = Date.now();
  for (const [ip, arr] of hits) if (!arr.length || now - arr[arr.length - 1] > 60_000) hits.delete(ip);
}, 60_000).unref();

// طلبات الـ API تُقبل من صفحات الموقع نفسه فقط (يمنع مواقع أخرى من استخدام مفتاحك).
// لإضافة نطاق آخر: ALLOWED_ORIGINS=https://example.com,https://www.example.com
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '').split(',').map((x) => x.trim().toLowerCase()).filter(Boolean);
function sameSite(req) {
  const src = req.headers.origin || req.headers.referer || '';
  let host = '';
  try { host = new URL(src).host.toLowerCase(); } catch { return false; }
  const mine = [req.headers.host, req.headers['x-forwarded-host']].filter(Boolean).map((h) => String(h).split(',')[0].trim().toLowerCase());
  if (mine.includes(host)) return true;
  return ALLOWED_ORIGINS.some((o) => { try { return new URL(o).host === host; } catch { return o === host; } });
}
const withTimeout = (ms) => AbortSignal.timeout(ms);   // حتى لا يبقى الزائر معلّقاً إذا تأخر OpenAI

// ---------- أدوات ----------
const MIME = {
  '.pdf': 'application/pdf',
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.mp3': 'audio/mpeg', '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8', '.webp': 'image/webp',
};

function readBody(req, limit = 15 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    const chunks = []; let size = 0;
    req.on('data', (c) => { size += c.length; if (size > limit) { reject(new Error('too large')); req.destroy(); } else chunks.push(c); });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function sendJSON(res, status, obj) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(obj));
}

function needKey(res) {
  if (!API_KEY) { sendJSON(res, 503, { error: 'لم يتم ضبط OPENAI_API_KEY في الخادم' }); return true; }
  return false;
}

// ---------- نقاط الـ API ----------
async function handleChat(req, res) {
  if (needKey(res)) return;
  const body = JSON.parse((await readBody(req, 300_000)).toString('utf8') || '{}');
  const history = Array.isArray(body.messages) ? body.messages.slice(-10) : [];
  const context = typeof body.context === 'string' ? body.context.slice(0, 14000) : '';
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT + (context ? `\n\nمواد ذات صلة بسؤال الزائر الأخير (منقولة حرفياً من الأنظمة):\n"""\n${context}\n"""` : '') },
    ...history
      .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .map((m) => ({ role: m.role, content: m.content.slice(0, 2500) })),
  ];
  const stream = body.stream === true;
  // إذا قاطع الزائر أو أغلق الصفحة نوقف طلب OpenAI فوراً (لا ندفع ثمن جواب لن يُسمع)
  const ac = new AbortController();
  const killer = setTimeout(() => ac.abort(), 60_000);
  res.on('close', () => { clearTimeout(killer); if (!res.writableEnded) ac.abort(); });
  let r;
  try { r = await chatCall(messages, stream, ac.signal); }
  catch (e) { clearTimeout(killer); if (!res.headersSent && !res.destroyed) sendJSON(res, 504, { error: 'تأخر الرد، حاول مرة ثانية' }); return; }
  if (!r.ok) {
    const data = await r.json().catch(() => ({}));
    return sendJSON(res, 502, { error: data.error?.message || 'OpenAI error' });
  }
  if (stream) {
    // بثّ الرد كلمة بكلمة: المتصفح ينطق أول جملة فور وصولها بدل انتظار الرد كاملاً
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'X-Accel-Buffering': 'no', 'X-Chat': `${CHAT_MODEL} ${chatStyle || ''}`.replace(/[^\x20-\x7e]/g, '') });
    const dec = new TextDecoder(); let buf = '';
    try {
      for await (const chunk of r.body) {
        buf += dec.decode(chunk, { stream: true });
        let i;
        while ((i = buf.indexOf('\n')) >= 0) {
          const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
          if (!line.startsWith('data:')) continue;
          const d = line.slice(5).trim();
          if (d === '[DONE]') continue;
          try { const t = JSON.parse(d).choices?.[0]?.delta?.content; if (t) res.write(t); } catch {}
        }
      }
    } catch (e) { if (e.name !== 'AbortError') console.warn('stream:', e.message); }
    clearTimeout(killer);
    return res.end();
  }
  const data = await r.json();
  clearTimeout(killer);
  const raw = data.choices?.[0]?.message?.content?.trim() || '';
  // السطر الأخير الذي يبدأ بـ § يحمل أسئلة المتابعة المقترحة
  const [answer, extra = ''] = raw.split('§');
  const suggestions = extra.split('|').map((x) => x.trim().replace(/^[-•\s]+/, '')).filter((x) => x.length > 3 && x.length < 70).slice(0, 2);
  sendJSON(res, 200, { reply: answer.trim(), suggestions });
}

/* النماذج تختلف في الصيغة ودرجات التفكير التي تقبلها، فنجرّب بالترتيب ونحفظ أول صيغة تنجح حتى لا نضيّع وقتاً في كل سؤال.
   الشاشة تحتاج رداً فورياً، فنبدأ بدون تفكير (none) ثم أقل درجة يقبلها النموذج. لتثبيت درجة بعينها: OPENAI_REASONING في Environment. */
const EFFORTS = [...new Set([process.env.OPENAI_REASONING, 'none', 'minimal', 'low'].filter(Boolean))];
const CHAT_STYLES = {
  plain: (m) => ({ model: CHAT_MODEL, messages: m, max_completion_tokens: 2500 }),
  classic: (m) => ({ model: CHAT_MODEL, messages: m, temperature: 0.2, max_tokens: 700 }),
};
for (const e of EFFORTS) CHAT_STYLES[`effort=${e}`] = (m) => ({ model: CHAT_MODEL, messages: m, max_completion_tokens: 2500, reasoning_effort: e });
let chatStyle = null;
// اختياري ومدفوع: المسار السريع من OpenAI يولّد الكلمات أسرع (OPENAI_SERVICE_TIER=priority). يُلغى تلقائياً إن لم يقبله النموذج.
let tier = process.env.OPENAI_SERVICE_TIER || '';
async function chatCall(messages, stream, signal) {
  const legacy = /^(gpt-4|gpt-3|chatgpt-4)/.test(CHAT_MODEL), fast = EFFORTS.map((e) => `effort=${e}`);
  const order = chatStyle ? [chatStyle] : legacy ? ['classic', 'plain', ...fast] : [...fast, 'plain', 'classic'];
  let r;
  for (const name of order) {
    r = await fetch(`${OPENAI_BASE}/chat/completions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...CHAT_STYLES[name](messages), ...(stream ? { stream: true } : {}), ...(tier ? { service_tier: tier } : {}) }),
      signal,
    });
    if (r.status === 400 && tier) { console.log(`service_tier ${tier} rejected, continuing without it`); tier = ''; await r.arrayBuffer().catch(() => {}); return chatCall(messages, stream, signal); }
    if (r.status !== 400) { if (r.ok && chatStyle !== name) { chatStyle = name; console.log(`chat style: ${name} (${CHAT_MODEL})`); } return r; }
    if (chatStyle) { chatStyle = null; return chatCall(messages, stream, signal); }   // الصيغة المحفوظة لم تعد تعمل: أعد المحاولة بكل الصيغ
    if (name !== order[order.length - 1]) { const why = await r.text().catch(() => ''); console.log(`chat style ${name} rejected: ${why.slice(0, 160).replace(/\s+/g, ' ')}`); }
  }
  return r;
}

/* ذاكرة الصوت: المقطع الذي نُطق مرة (خصوصاً الإجابات الجاهزة التي يسمعها كل الزوار) يُحفظ في الخادم،
   فلا يُطلب من OpenAI مرة ثانية: أسرع للزائر وأوفر في الفاتورة. الحد الأقصى 80 ميجابايت ثم يُحذف الأقدم. */
const TTS_CACHE = new Map(); let ttsBytes = 0;
const TTS_CACHE_MAX = Number(process.env.TTS_CACHE_MB || 80) * 1024 * 1024;
function sendAudio(res, buf, hit) {
  res.writeHead(200, { 'Content-Type': 'audio/mpeg', 'Content-Length': buf.length, 'Cache-Control': 'no-store', 'X-Cache': hit ? 'hit' : 'miss' });
  res.end(buf);
}
async function handleTTS(req, res) {
  if (needKey(res)) return;
  const { text } = JSON.parse((await readBody(req, 50_000)).toString('utf8') || '{}');
  if (!text) return sendJSON(res, 400, { error: 'no text' });
  const key = String(text).slice(0, 1500);
  const cached = TTS_CACHE.get(key);
  if (cached) { TTS_CACHE.delete(key); TTS_CACHE.set(key, cached); return sendAudio(res, cached, true); }
  const payload = {
    model: TTS_MODEL, voice: TTS_VOICE, input: String(text).slice(0, 1500), response_format: 'mp3',
  };
  // نموذج gpt-4o-mini-tts يقبل تعليمات لطريقة الأداء
  if (TTS_MODEL.includes('gpt-4o')) {
    payload.instructions = TTS_INSTRUCTIONS;
  }
  const r = await fetch(`${OPENAI_BASE}/audio/speech`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: withTimeout(30_000),
  });
  if (!r.ok) { const e = await r.text(); return sendJSON(res, 502, { error: e.slice(0, 300) }); }
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.length < TTS_CACHE_MAX / 4) {
    TTS_CACHE.set(key, buf); ttsBytes += buf.length;
    while (ttsBytes > TTS_CACHE_MAX) { const [k, v] = TTS_CACHE.entries().next().value; TTS_CACHE.delete(k); ttsBytes -= v.length; }
  }
  sendAudio(res, buf, false);
}

/* صوت متدفق للوجه الحي: يُرسل إلى المتصفح أول بأول وهو يتولّد (PCM16 أحادي 16 كيلوهرتز، الصيغة التي يطلبها Simli)،
   فيبدأ نزيه الكلام بعد جزء من الثانية بدل انتظار المقطع كاملاً. المقطع يُحفظ بعد أول مرة مثل ‎/api/tts‎. */
const TTS_GAIN = Number(process.env.TTS_GAIN || 1.6);            // تكبير الصوت (1 = كما يصل من المزوّد)
function makeResampler(ratio, gain) {                             // ratio = تردد الدخل ÷ تردد الخرج (24000/16000 = 1.5)
  let carry = Buffer.alloc(0), pos = 0;
  return (chunk) => {
    const data = carry.length ? Buffer.concat([carry, chunk]) : chunk, n = data.length >> 1;
    const out = Buffer.alloc((Math.ceil(n / ratio) + 2) * 2); let o = 0, p = pos;
    while (p + 1 < n) {
      const i = Math.floor(p), f = p - i, a = data.readInt16LE(i * 2), b = data.readInt16LE(i * 2 + 2);
      const v = Math.tanh(((a + (b - a) * f) / 32768) * gain) * 32767;     // تكبير مع حد ناعم يمنع التشويش
      out.writeInt16LE(Math.round(v), o); o += 2; p += ratio;
    }
    const k = Math.min(Math.floor(p), n);
    carry = Buffer.from(data.subarray(k * 2)); pos = p - k;
    return out.subarray(0, o);
  };
}
const PCM_CACHE = new Map(); let pcmBytes = 0;
async function handleTTSPcm(req, res) {
  if (needKey(res)) return;
  const { text } = JSON.parse((await readBody(req, 50_000)).toString('utf8') || '{}');
  if (!text) return sendJSON(res, 400, { error: 'no text' });
  const key = String(text).slice(0, 1500);
  const head = { 'Content-Type': 'application/octet-stream', 'Cache-Control': 'no-store', 'X-Sample-Rate': '16000' };
  const cached = PCM_CACHE.get(key);
  if (cached) { PCM_CACHE.delete(key); PCM_CACHE.set(key, cached); res.writeHead(200, { ...head, 'Content-Length': cached.length, 'X-Cache': 'hit' }); return res.end(cached); }
  const payload = { model: TTS_MODEL, voice: TTS_VOICE, input: key, response_format: 'pcm' };      // PCM خام 24 كيلوهرتز
  if (TTS_MODEL.includes('gpt-4o')) payload.instructions = TTS_INSTRUCTIONS;
  const ac = new AbortController(); const killer = setTimeout(() => ac.abort(), 40_000);
  res.on('close', () => { clearTimeout(killer); if (!res.writableEnded) ac.abort(); });
  let r;
  try {
    r = await fetch(`${OPENAI_BASE}/audio/speech`, { method: 'POST', headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: ac.signal });
  } catch (e) { clearTimeout(killer); if (!res.headersSent && !res.destroyed) sendJSON(res, 504, { error: 'تأخر الصوت' }); return; }
  if (!r.ok) { clearTimeout(killer); const e = await r.text(); return sendJSON(res, 502, { error: e.slice(0, 300) }); }
  res.writeHead(200, { ...head, 'X-Cache': 'miss', 'X-Accel-Buffering': 'no' });
  const rs = makeResampler(1.5, TTS_GAIN), parts = []; let ok = true;
  try { for await (const chunk of r.body) { const out = rs(Buffer.from(chunk)); if (out.length) { parts.push(Buffer.from(out)); res.write(out); } } }
  catch (e) { ok = false; if (e.name !== 'AbortError') console.warn('tts-pcm:', e.message); }
  clearTimeout(killer); res.end();
  if (ok && parts.length) {
    const buf = Buffer.concat(parts);
    if (buf.length < TTS_CACHE_MAX / 4) {
      PCM_CACHE.set(key, buf); pcmBytes += buf.length;
      while (pcmBytes > TTS_CACHE_MAX) { const [k, v] = PCM_CACHE.entries().next().value; PCM_CACHE.delete(k); pcmBytes -= v.length; }
    }
  }
}

async function handleSTT(req, res) {
  if (needKey(res)) return;
  const audio = await readBody(req, 3 * 1024 * 1024);   // 25 ثانية صوت لا تتجاوز مئات الكيلوبايت
  if (audio.length < 1000) return sendJSON(res, 400, { error: 'audio too short' });
  const type = (req.headers['content-type'] || 'audio/webm').split(';')[0];
  const ext = type.includes('mp4') ? 'mp4' : type.includes('ogg') ? 'ogg' : type.includes('wav') ? 'wav' : type.includes('mpeg') ? 'mp3' : 'webm';
  const form = new FormData();
  form.append('file', new Blob([audio], { type }), `speech.${ext}`);
  form.append('model', STT_MODEL);
  form.append('language', 'ar');
  form.append('prompt', 'سؤال من زائر عن النزاهة ومكافحة الفساد: هيئة الرقابة ومكافحة الفساد نزاهة، الرشوة، التزوير، محرر رسمي، غسل الأموال، حماية المبلّغين والشهود، النظام الأساسي للحكم، مجلس الشورى، مجلس الوزراء، نظام المناطق، هيئة البيعة، الانضباط الوظيفي، الخدمة المدنية، أعضاء هيئة التدريس، الترقية، التفرغ العلمي، المال العام، المادة، العقوبة، جامعة حائل.');
  const r = await fetch(`${OPENAI_BASE}/audio/transcriptions`, {
    method: 'POST', headers: { Authorization: `Bearer ${API_KEY}` }, body: form, signal: withTimeout(30_000),
  });
  const data = await r.json();
  if (!r.ok) return sendJSON(res, 502, { error: data.error?.message || 'STT error' });
  sendJSON(res, 200, { text: (data.text || '').trim() });
}

// ---------- Simli: الوجه الحي للشاشة الرئيسية ----------
// المفتاح يبقى هنا في الخادم. المتصفح يطلب «تذكرة جلسة» قصيرة العمر فقط، ثم يتصل بها مباشرة مع Simli.
//   SIMLI_API_KEY  : مفتاح Simli (سري)          SIMLI_FACE_ID : رقم الوجه من صفحة Your Faces
//   SIMLI_CODE     : (اختياري) رمز للشاشة؛ إذا وُضع فلا تُفتح جلسة إلا لمن فتح الرابط ‎/?avatar=simli&code=الرمز‎
const SIMLI_KEY = process.env.SIMLI_API_KEY || '';
const SIMLI_FACE = process.env.SIMLI_FACE_ID || '';
const SIMLI_CODE = process.env.SIMLI_CODE || '';
const SIMLI_BASE = process.env.SIMLI_BASE || 'https://api.simli.ai';
const SIMLI_IDLE = Number(process.env.SIMLI_IDLE_SECONDS || 120);       // تُقفل الجلسة بعد هذا السكوت فلا تُحسب دقائق والشاشة واقفة
const SIMLI_MAX = Number(process.env.SIMLI_MAX_SECONDS || 1800);        // أقصى مدة للجلسة الواحدة ثم يُعاد الاتصال عند الحاجة
async function handleSimliToken(req, res) {
  if (!SIMLI_KEY || !SIMLI_FACE) return sendJSON(res, 503, { error: 'Simli غير مضبوط: أضف SIMLI_API_KEY و SIMLI_FACE_ID في Environment' });
  const body = JSON.parse((await readBody(req, 2000)).toString('utf8') || '{}');
  if (SIMLI_CODE && body.code !== SIMLI_CODE) return sendJSON(res, 403, { error: 'رمز الشاشة غير صحيح' });
  const portrait = body.portrait === true;
  const r = await fetch(`${SIMLI_BASE}/compose/token`, {
    method: 'POST',
    headers: { 'x-simli-api-key': SIMLI_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      faceId: SIMLI_FACE, handleSilence: true, maxSessionLength: SIMLI_MAX, maxIdleTime: SIMLI_IDLE,
      streaming_width: portrait ? 720 : 1280, streaming_height: portrait ? 1280 : 720,     // الشاشة الطولية 9:16 والعرضية 16:9
    }),
    signal: withTimeout(20_000),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok || !data.session_token || data.session_token === 'FAIL TOKEN') {
    const why = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail || data).slice(0, 300);
    console.warn('Simli token:', r.status, why);
    return sendJSON(res, 502, { error: why || 'Simli error' });
  }
  if (data.warnings?.length) console.warn('Simli warnings:', data.warnings.join(' | '));
  sendJSON(res, 200, { session_token: data.session_token });
}

// ---------- الملفات الثابتة ----------
const zlib = require('zlib');
const GZ_CACHE = new Map();                       // ضغط الملفات النصية مرة واحدة ثم حفظها في الذاكرة
const TEXT_EXT = new Set(['.html', '.js', '.css', '.json', '.svg', '.txt']);
function serveStatic(req, res) {
  let urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = path.normalize(path.join(PUBLIC_DIR, urlPath));
  if (!filePath.startsWith(PUBLIC_DIR + path.sep) || path.basename(filePath).startsWith('.')) {
    res.writeHead(403); return res.end('Forbidden');
  }
  fs.stat(filePath, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404); return res.end('Not found'); }
    const ext = path.extname(filePath).toLowerCase();
    const etag = `"${st.size.toString(16)}-${Math.floor(st.mtimeMs).toString(16)}"`;
    const isText = TEXT_EXT.has(ext);
    const headers = {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'ETag': etag,
      // النصوص: يتأكد المتصفح من التحديث كل مرة (رد سريع 304)، الصور: تُحفظ يوماً كاملاً
      'Cache-Control': isText ? 'no-cache' : 'public, max-age=86400',
    };
    if (req.headers['if-none-match'] === etag) { res.writeHead(304, headers); return res.end(); }
    const gzipOk = isText && /\bgzip\b/.test(req.headers['accept-encoding'] || '');
    if (!gzipOk) { res.writeHead(200, headers); return fs.createReadStream(filePath).pipe(res); }
    headers['Content-Encoding'] = 'gzip'; headers['Vary'] = 'Accept-Encoding';
    const hit = GZ_CACHE.get(filePath);
    if (hit && hit.etag === etag) { res.writeHead(200, headers); return res.end(hit.buf); }
    fs.readFile(filePath, (e, raw) => {
      if (e) { res.writeHead(500); return res.end('Error'); }
      zlib.gzip(raw, { level: 9 }, (e2, buf) => {
        if (e2) { delete headers['Content-Encoding']; res.writeHead(200, headers); return res.end(raw); }
        GZ_CACHE.set(filePath, { etag, buf });
        res.writeHead(200, headers); res.end(buf);
      });
    });
  });
}

// ---------- الخادم ----------
http.createServer(async (req, res) => {
  try {
    if (req.url.startsWith('/api/')) {
      if (req.method !== 'POST') return sendJSON(res, 405, { error: 'POST only' });
      const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
      if (!sameSite(req)) return sendJSON(res, 403, { error: 'forbidden' });
      if (rateLimited(ip)) return sendJSON(res, 429, { error: 'طلبات كثيرة، حاول بعد قليل' });
      if (req.url.startsWith('/api/chat')) return await handleChat(req, res);
      if (req.url.startsWith('/api/tts-pcm')) return await handleTTSPcm(req, res);
      if (req.url.startsWith('/api/tts')) return await handleTTS(req, res);
      if (req.url.startsWith('/api/stt')) return await handleSTT(req, res);
      if (req.url.startsWith('/api/simli-token')) return await handleSimliToken(req, res);
      return sendJSON(res, 404, { error: 'not found' });
    }
    serveStatic(req, res);
  } catch (e) {
    const timeout = e?.name === 'TimeoutError' || e?.name === 'AbortError';
    if (!timeout) console.error(e);
    if (!res.headersSent && !res.destroyed) sendJSON(res, timeout ? 504 : 500, { error: timeout ? 'تأخر الرد، حاول مرة ثانية' : 'خطأ في الخادم' });
  }
}).listen(PORT, () => {
  console.log(`✅ نزيه يعمل على: http://localhost:${PORT}`);
  console.log(SIMLI_KEY && SIMLI_FACE ? '✅ Simli مضبوط (الوجه الحي للشاشة: /?avatar=simli)' : `ℹ️  Simli غير مفعّل${SIMLI_KEY ? ' — ينقص SIMLI_FACE_ID' : ''}`);
  if (!API_KEY) console.log('⚠️  لم يتم ضبط OPENAI_API_KEY — الموقع سيعمل لكن المساعد سيرد بإجابات محلية محدودة فقط.');
});
