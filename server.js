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
const STT_MODEL = process.env.STT_MODEL || 'gpt-4o-mini-transcribe';
const OPENAI_BASE = process.env.OPENAI_BASE || 'https://api.openai.com/v1';
const REASONING = process.env.OPENAI_REASONING || 'low';   // جهد التفكير للنماذج الحديثة: أقل = أسرع
const PUBLIC_DIR = path.join(__dirname, 'public');

// ---------- تعليمات الشخصية ----------
// نصوص الأنظمة لا تُحمّل هنا: الموقع يبحث في ملف الأنظمة ويرسل المواد ذات الصلة مع كل سؤال (context)
const SYSTEM_PROMPT = `
أنت "نزيه"، شخصية افتراضية سعودية على شاشة تفاعلية في فعالية جامعة حائل بمناسبة اليوم العالمي لمكافحة الفساد (9 ديسمبر)، بالتعاون مع هيئة الرقابة ومكافحة الفساد (نزاهة).

أسلوبك:
- تتكلم بعربية فصحى مبسطة وواضحة مع لمسة سعودية خفيفة ودودة (مثل "حياك الله" و"أبشر")، كموظف سعودي محترم يرحّب بالزوار.
- إجاباتك تُقرأ بصوت عالٍ، فاجعلها قصيرة: من جملتين إلى خمس جمل، بدون نقاط أو جداول أو رموز أو روابط.
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

// ---------- حماية بسيطة من الإفراط في الاستخدام ----------
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > 30; // 30 طلب في الدقيقة لكل جهاز
}

// ---------- أدوات ----------
const MIME = {
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
  const r = await chatCall(messages, stream);
  if (!r.ok) {
    const data = await r.json().catch(() => ({}));
    return sendJSON(res, 502, { error: data.error?.message || 'OpenAI error' });
  }
  if (stream) {
    // بثّ الرد كلمة بكلمة: المتصفح ينطق أول جملة فور وصولها بدل انتظار الرد كاملاً
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'X-Accel-Buffering': 'no' });
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
    } catch (e) { console.warn('stream:', e.message); }
    return res.end();
  }
  const data = await r.json();
  const raw = data.choices?.[0]?.message?.content?.trim() || '';
  // السطر الأخير الذي يبدأ بـ § يحمل أسئلة المتابعة المقترحة
  const [answer, extra = ''] = raw.split('§');
  const suggestions = extra.split('|').map((x) => x.trim().replace(/^[-•\s]+/, '')).filter((x) => x.length > 3 && x.length < 70).slice(0, 2);
  sendJSON(res, 200, { reply: answer.trim(), suggestions });
}

/* النماذج تختلف في الصيغة التي تقبلها، فنجرّب الصيغ بالترتيب ونحفظ أول صيغة تنجح حتى لا نضيّع وقتاً في كل سؤال */
const CHAT_STYLES = {
  fast: (m) => ({ model: CHAT_MODEL, messages: m, max_completion_tokens: 2500, reasoning_effort: REASONING }),
  plain: (m) => ({ model: CHAT_MODEL, messages: m, max_completion_tokens: 2500 }),
  classic: (m) => ({ model: CHAT_MODEL, messages: m, temperature: 0.2, max_tokens: 700 }),
};
let chatStyle = null;
async function chatCall(messages, stream) {
  const legacy = /^(gpt-4|gpt-3|chatgpt-4)/.test(CHAT_MODEL);
  const order = chatStyle ? [chatStyle] : legacy ? ['classic', 'plain', 'fast'] : ['fast', 'plain', 'classic'];
  let r;
  for (const name of order) {
    r = await fetch(`${OPENAI_BASE}/chat/completions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...CHAT_STYLES[name](messages), ...(stream ? { stream: true } : {}) }),
    });
    if (r.status !== 400) { if (r.ok && chatStyle !== name) { chatStyle = name; console.log(`chat style: ${name} (${CHAT_MODEL})`); } return r; }
    if (chatStyle) { chatStyle = null; return chatCall(messages, stream); }   // الصيغة المحفوظة لم تعد تعمل: أعد المحاولة بكل الصيغ
    if (name !== order[order.length - 1]) await r.arrayBuffer().catch(() => {});
  }
  return r;
}

async function handleTTS(req, res) {
  if (needKey(res)) return;
  const { text } = JSON.parse((await readBody(req, 50_000)).toString('utf8') || '{}');
  if (!text) return sendJSON(res, 400, { error: 'no text' });
  const payload = {
    model: TTS_MODEL, voice: TTS_VOICE, input: String(text).slice(0, 1500), response_format: 'mp3',
  };
  // نموذج gpt-4o-mini-tts يقبل تعليمات لطريقة الأداء
  if (TTS_MODEL.includes('gpt-4o')) {
    payload.instructions = 'تحدث بعربية فصحى مبسطة بلكنة سعودية خفيفة، بصوت رجل هادئ وواثق وودود، وبإيقاع طبيعي غير متسرع ومخارج حروف واضحة.';
  }
  const r = await fetch(`${OPENAI_BASE}/audio/speech`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!r.ok) { const e = await r.text(); return sendJSON(res, 502, { error: e.slice(0, 300) }); }
  const buf = Buffer.from(await r.arrayBuffer());
  res.writeHead(200, { 'Content-Type': 'audio/mpeg', 'Content-Length': buf.length, 'Cache-Control': 'no-store' });
  res.end(buf);
}

async function handleSTT(req, res) {
  if (needKey(res)) return;
  const audio = await readBody(req);
  if (audio.length < 1000) return sendJSON(res, 400, { error: 'audio too short' });
  const type = (req.headers['content-type'] || 'audio/webm').split(';')[0];
  const ext = type.includes('mp4') ? 'mp4' : type.includes('ogg') ? 'ogg' : type.includes('wav') ? 'wav' : type.includes('mpeg') ? 'mp3' : 'webm';
  const form = new FormData();
  form.append('file', new Blob([audio], { type }), `speech.${ext}`);
  form.append('model', STT_MODEL);
  form.append('language', 'ar');
  form.append('prompt', 'سؤال عن نزاهة ومكافحة الفساد والرشوة والمال العام وهيئة الرقابة.');
  const r = await fetch(`${OPENAI_BASE}/audio/transcriptions`, {
    method: 'POST', headers: { Authorization: `Bearer ${API_KEY}` }, body: form,
  });
  const data = await r.json();
  if (!r.ok) return sendJSON(res, 502, { error: data.error?.message || 'STT error' });
  sendJSON(res, 200, { text: (data.text || '').trim() });
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
      if (rateLimited(ip)) return sendJSON(res, 429, { error: 'طلبات كثيرة، حاول بعد قليل' });
      if (req.url.startsWith('/api/chat')) return await handleChat(req, res);
      if (req.url.startsWith('/api/tts')) return await handleTTS(req, res);
      if (req.url.startsWith('/api/stt')) return await handleSTT(req, res);
      return sendJSON(res, 404, { error: 'not found' });
    }
    serveStatic(req, res);
  } catch (e) {
    console.error(e);
    if (!res.headersSent) sendJSON(res, 500, { error: 'خطأ في الخادم' });
  }
}).listen(PORT, () => {
  console.log(`✅ نزيه يعمل على: http://localhost:${PORT}`);
  if (!API_KEY) console.log('⚠️  لم يتم ضبط OPENAI_API_KEY — الموقع سيعمل لكن المساعد سيرد بإجابات محلية محدودة فقط.');
});
