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
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'X-Accel-Buffering': 'no', 'X-Chat': lastChat.replace(/[^\x20-\x7e]/g, '') });
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
/* مزوّد العقل: الافتراضي OpenAI. لتجربة نموذج من جهة أخرى لها واجهة متوافقة مع OpenAI (مثل HUMAIN Node) أضف في Environment:
     CHAT_BASE_URL (مثل https://api.node.humain.com/v1) و CHAT_API_KEY و CHAT_MODEL (مثل humain-m3)
   تحويل الكلام لنص والصوت يبقيان كما هما. وإذا تعذّر المزوّد البديل يجاوب نموذج OpenAI حتى لا يسكت نزيه. */
const ALT_BASE = (process.env.CHAT_BASE_URL || '').replace(/\/+$/, ''), ALT_KEY = process.env.CHAT_API_KEY || '', ALT_MODEL = process.env.CHAT_MODEL || '';
const CHAT_PROVIDERS = [];
if (ALT_BASE && ALT_KEY && ALT_MODEL) CHAT_PROVIDERS.push({ name: 'alt', base: ALT_BASE, key: ALT_KEY, model: ALT_MODEL, style: null, tier: '' });
// اختياري ومدفوع: المسار السريع من OpenAI يولّد الكلمات أسرع (OPENAI_SERVICE_TIER=priority). يُلغى تلقائياً إن لم يقبله النموذج.
CHAT_PROVIDERS.push({ name: 'openai', base: OPENAI_BASE, key: API_KEY, model: CHAT_MODEL, style: null, tier: process.env.OPENAI_SERVICE_TIER || '' });
const styleBody = (name, model, m) => name === 'classic' ? { model, messages: m, temperature: 0.2, max_tokens: 700 }
  : name === 'plain' ? { model, messages: m, max_completion_tokens: 2500 }
  : { model, messages: m, max_completion_tokens: 2500, reasoning_effort: name.slice(7) };
let lastChat = '';                                   // ما استُخدم في آخر جواب (يظهر في مربع القياس)
async function chatWith(p, messages, stream, signal) {
  const legacy = /^(gpt-4|gpt-3|chatgpt-4)/.test(p.model), fast = EFFORTS.map((e) => `effort=${e}`);
  const order = p.style ? [p.style] : legacy || p.name === 'alt' ? ['classic', 'plain', ...fast] : [...fast, 'plain', 'classic'];
  let r;
  for (const name of order) {
    r = await fetch(`${p.base}/chat/completions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${p.key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...styleBody(name, p.model, messages), ...(stream ? { stream: true } : {}), ...(p.tier ? { service_tier: p.tier } : {}) }),
      signal,
    });
    const bad = r.status === 400 || r.status === 422;      // الصيغة غير مقبولة عند هذا النموذج: جرّب التالية
    if (bad && p.tier) { console.log(`service_tier ${p.tier} rejected, continuing without it`); p.tier = ''; await r.arrayBuffer().catch(() => {}); return chatWith(p, messages, stream, signal); }
    if (!bad) { if (r.ok && p.style !== name) { p.style = name; console.log(`chat style: ${name} (${p.model})`); } if (r.ok) lastChat = `${p.model} ${name}`; return r; }
    if (p.style) { p.style = null; return chatWith(p, messages, stream, signal); }   // الصيغة المحفوظة لم تعد تعمل: أعد المحاولة بكل الصيغ
    if (name !== order[order.length - 1]) { const why = await r.text().catch(() => ''); console.log(`chat style ${name} rejected by ${p.model}: ${why.slice(0, 160).replace(/\s+/g, ' ')}`); }
  }
  return r;
}
let altWarned = 0;
async function chatCall(messages, stream, signal) {
  for (const p of CHAT_PROVIDERS) {
    const last = p === CHAT_PROVIDERS[CHAT_PROVIDERS.length - 1];
    try {
      const r = await chatWith(p, messages, stream, signal);
      if (r.ok || last) return r;
      const why = await r.text().catch(() => '');
      if (altWarned++ < 30) console.warn(`chat ${p.model} ${r.status}: ${why.slice(0, 200).replace(/\s+/g, ' ')} — answering with ${CHAT_MODEL}`);
    } catch (e) {
      if (last || e.name === 'AbortError' || e.name === 'TimeoutError') throw e;
      if (altWarned++ < 30) console.warn(`chat ${p.model}: ${e.message} — answering with ${CHAT_MODEL}`);
    }
  }
}


/* ذاكرة الصوت: المقطع الذي نُطق مرة (خصوصاً الإجابات الجاهزة التي يسمعها كل الزوار) يُحفظ في الخادم،
   فلا يُطلب من OpenAI مرة ثانية: أسرع للزائر وأوفر في الفاتورة. الحد الأقصى 80 ميجابايت ثم يُحذف الأقدم. */
const TTS_CACHE = new Map(); let ttsBytes = 0;
const TTS_CACHE_MAX = Number(process.env.TTS_CACHE_MB || 80) * 1024 * 1024;
function sendAudio(res, buf, hit) {
  res.writeHead(200, { 'Content-Type': 'audio/mpeg', 'Content-Length': buf.length, 'Cache-Control': 'no-store', 'X-Cache': hit ? 'hit' : 'miss' });
  res.end(buf);
}
/* ---------- مزوّد الصوت ----------
   الافتراضي OpenAI. للصوت السعودي أضف في Environment أحد الخيارين (والمفتاح يبقى في الخادم):
     Azure      : AZURE_SPEECH_KEY + AZURE_SPEECH_REGION (مثل uaenorth)، والصوت AZURE_VOICE (الافتراضي ar-SA-HamedNeural «حامد»)
     ElevenLabs : ELEVENLABS_API_KEY + ELEVENLABS_VOICE_ID، والنموذج ELEVENLABS_MODEL (الافتراضي eleven_flash_v2_5)
   إذا تعذّر المزوّد المختار (مفتاح خاطئ، انتهاء الحصة) يُنطق المقطع بصوت OpenAI حتى لا يسكت نزيه. */
const AZ_KEY = process.env.AZURE_SPEECH_KEY || '', AZ_REGION = (process.env.AZURE_SPEECH_REGION || '').toLowerCase().replace(/\s+/g, '');
const AZ_VOICE = process.env.AZURE_VOICE || 'ar-SA-HamedNeural', AZ_RATE = process.env.AZURE_RATE || '+0%', AZ_PITCH = process.env.AZURE_PITCH || '+0%';
const AZ_BASE = process.env.AZURE_TTS_BASE || `https://${AZ_REGION}.tts.speech.microsoft.com`;
const EL_KEY = process.env.ELEVENLABS_API_KEY || '', EL_VOICE = process.env.ELEVENLABS_VOICE_ID || '', EL_MODEL = process.env.ELEVENLABS_MODEL || 'eleven_flash_v2_5';
const EL_BASE = process.env.ELEVENLABS_BASE || 'https://api.elevenlabs.io';
const TTS_PROVIDER = (process.env.TTS_PROVIDER || (AZ_KEY && AZ_REGION ? 'azure' : EL_KEY && EL_VOICE ? 'elevenlabs' : 'openai')).toLowerCase();
const xml = (t) => String(t).replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]));
function ttsRequest(provider, text, pcm, signal) {       // يرجع { r, rate } حيث rate تردد الـ PCM الخام
  if (provider === 'azure') {
    const lang = AZ_VOICE.split('-').slice(0, 2).join('-');
    return fetch(`${AZ_BASE}/cognitiveservices/v1`, {
      method: 'POST',
      headers: { 'Ocp-Apim-Subscription-Key': AZ_KEY, 'Content-Type': 'application/ssml+xml', 'User-Agent': 'nazih-kiosk',
        'X-Microsoft-OutputFormat': pcm ? 'raw-16khz-16bit-mono-pcm' : 'audio-24khz-96kbitrate-mono-mp3' },
      body: `<speak version='1.0' xml:lang='${lang}'><voice name='${AZ_VOICE}'><prosody rate='${xml(AZ_RATE)}' pitch='${xml(AZ_PITCH)}'>${xml(text)}</prosody></voice></speak>`,
      signal,
    }).then((r) => ({ r, rate: 16000 }));
  }
  if (provider === 'elevenlabs') {
    const body = { text, model_id: EL_MODEL };
    if (/v2_5|v3|v4/.test(EL_MODEL)) body.language_code = 'ar';
    return fetch(`${EL_BASE}/v1/text-to-speech/${encodeURIComponent(EL_VOICE)}/stream?output_format=${pcm ? 'pcm_16000' : 'mp3_44100_128'}`, {
      method: 'POST', headers: { 'xi-api-key': EL_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal,
    }).then((r) => ({ r, rate: 16000 }));
  }
  const payload = { model: TTS_MODEL, voice: TTS_VOICE, input: text, response_format: pcm ? 'pcm' : 'mp3' };
  if (TTS_MODEL.includes('gpt-4o')) payload.instructions = TTS_INSTRUCTIONS;      // نموذج gpt-4o-mini-tts يقبل تعليمات لطريقة الأداء
  return fetch(`${OPENAI_BASE}/audio/speech`, {
    method: 'POST', headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal,
  }).then((r) => ({ r, rate: 24000 }));
}
let ttsWarned = 0;
async function ttsFetch(text, pcm, signal) {
  if (TTS_PROVIDER !== 'openai') {
    try {
      const out = await ttsRequest(TTS_PROVIDER, text, pcm, signal);
      if (out.r.ok) return { ...out, provider: TTS_PROVIDER };
      const why = await out.r.text().catch(() => '');
      if (ttsWarned++ < 20) console.warn(`TTS ${TTS_PROVIDER} ${out.r.status}: ${why.slice(0, 200)} — using OpenAI voice for this clip`);
    } catch (e) { if (e.name === 'AbortError') throw e; if (ttsWarned++ < 20) console.warn(`TTS ${TTS_PROVIDER}: ${e.message} — using OpenAI voice`); }
  }
  return { ...(await ttsRequest('openai', text, pcm, signal)), provider: 'openai' };
}

async function handleTTS(req, res) {
  if (needKey(res)) return;
  const { text } = JSON.parse((await readBody(req, 50_000)).toString('utf8') || '{}');
  if (!text) return sendJSON(res, 400, { error: 'no text' });
  const key = String(text).slice(0, 1500);
  const cached = TTS_CACHE.get(key);
  if (cached) { TTS_CACHE.delete(key); TTS_CACHE.set(key, cached); return sendAudio(res, cached, true); }
  const { r, provider } = await ttsFetch(key, false, withTimeout(30_000));
  if (!r.ok) { const e = await r.text(); return sendJSON(res, 502, { error: e.slice(0, 300) }); }
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.length < TTS_CACHE_MAX / 4) {
    if (provider === TTS_PROVIDER) { TTS_CACHE.set(key, buf); ttsBytes += buf.length; }       // لا نحفظ الصوت الاحتياطي حتى يعود الصوت الأصلي حين يتعافى المزوّد
    while (ttsBytes > TTS_CACHE_MAX) { const [k, v] = TTS_CACHE.entries().next().value; TTS_CACHE.delete(k); ttsBytes -= v.length; }
  }
  sendAudio(res, buf, false);
}

/* صوت متدفق للوجه الحي: يُرسل إلى المتصفح أول بأول وهو يتولّد (PCM16 أحادي 16 كيلوهرتز، الصيغة التي يطلبها Simli)،
   فيبدأ نزيه الكلام بعد جزء من الثانية بدل انتظار المقطع كاملاً. المقطع يُحفظ بعد أول مرة مثل ‎/api/tts‎. */
const TTS_GAIN_OTHER = Number(process.env.TTS_GAIN || 1.25);   // أصوات Azure و ElevenLabs تصل أعلى من OpenAI
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
  if (cached) { PCM_CACHE.delete(key); PCM_CACHE.set(key, cached); res.writeHead(200, { ...head, 'Content-Length': cached.length, 'X-Cache': 'hit', 'X-TTS': TTS_PROVIDER }); return res.end(cached); }
  const ac = new AbortController(); const killer = setTimeout(() => ac.abort(), 40_000);
  res.on('close', () => { clearTimeout(killer); if (!res.writableEnded) ac.abort(); });
  let r, rate, provider;
  try { ({ r, rate, provider } = await ttsFetch(key, true, ac.signal)); }
  catch (e) { clearTimeout(killer); if (!res.headersSent && !res.destroyed) sendJSON(res, 504, { error: 'تأخر الصوت' }); return; }
  if (!r.ok) { clearTimeout(killer); const e = await r.text(); return sendJSON(res, 502, { error: e.slice(0, 300) }); }
  res.writeHead(200, { ...head, 'X-Cache': 'miss', 'X-Accel-Buffering': 'no', 'X-TTS': provider });
  const rs = makeResampler(rate / 16000, provider === 'openai' ? TTS_GAIN : TTS_GAIN_OTHER), parts = []; let ok = true;
  try { for await (const chunk of r.body) { const out = rs(Buffer.from(chunk)); if (out.length) { parts.push(Buffer.from(out)); res.write(out); } } }
  catch (e) { ok = false; if (e.name !== 'AbortError') console.warn('tts-pcm:', e.message); }
  clearTimeout(killer); res.end();
  if (ok && parts.length && provider === TTS_PROVIDER) {
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


// ---------- الإحصائيات (v22) ----------
// أعداد مجهولة فقط: لا أسماء ولا عناوين ولا تسجيلات صوت. تُحفظ في ملف (STATS_DIR) كل نصف دقيقة.
// تنبيه: قرص Render العادي يُمسح عند كل نشر أو إعادة تشغيل. للحفظ الدائم اربط Render Disk وضع مساره في STATS_DIR،
// أو نزّل نسخة من اللوحة (زر «تنزيل نسخة») وارجعها بزر «استرجاع نسخة».
const os = require('os'), crypto = require('crypto');
const STATS_KEY = process.env.STATS_KEY || '';
const STATS_TEXT = process.env.STATS_TEXT !== '0';                     // 0 = لا تُحفظ نصوص الأسئلة (تبقى الأعداد فقط)
const STATS_FILE = path.join(process.env.STATS_DIR || os.tmpdir(), 'nazih-stats.json');
const newStats = () => ({ v: 1, since: Date.now(), days: {}, top: {}, devs: {} });
let STATS = newStats(), statsDirty = false, statsBoot = Date.now();
try { const j = JSON.parse(fs.readFileSync(STATS_FILE, 'utf8')); if (j && j.v === 1 && j.days) STATS = { ...newStats(), ...j }; } catch {}
const riyadh = () => new Date(Date.now() + 3 * 3600 * 1000);           // توقيت المملكة ثابت (UTC+3)
const newDay = () => ({ sessions: 0, screen: 0, phone: 0, qr: 0, newDevs: 0, q: 0, src: {}, kind: {}, bank: {}, act: {}, hours: new Array(24).fill(0), rate: [0, 0, 0, 0, 0], quizN: 0, quizSum: 0, quizMax: 0, quizDist: {}, scn: {} });
function statDay() { const k = riyadh().toISOString().slice(0, 10); return (STATS.days[k] = STATS.days[k] || newDay()); }
const inc = (o, k, n = 1) => { o[k] = (o[k] || 0) + n; };
const normQ = (t) => String(t || '').replace(/[ً-ْـ]/g, '').replace(/[؟?!.,،:؛"«»()\[\]]/g, ' ').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/\s+/g, ' ').trim().toLowerCase();
const SAFE_ID = /^[a-z0-9_-]{1,24}$/i;
function recordEvent(e) {
  if (!e || typeof e !== 'object') return;
  const d = statDay(), h = riyadh().getUTCHours();
  switch (e.t) {
    case 'open': if (e.qr) d.qr++; break;
    case 'session': {
      d.sessions++; if (e.screen) d.screen++; else d.phone++; d.hours[h]++;
      const dev = typeof e.dev === 'string' && e.dev.length >= 8 ? crypto.createHash('sha256').update(e.dev).digest('base64').slice(0, 10) : '';
      if (dev && !STATS.devs[dev] && Object.keys(STATS.devs).length < 60000) { STATS.devs[dev] = 1; d.newDevs++; }
      break;
    }
    case 'q': {
      const kind = ['bank', 'exact', 'ai', 'action'].includes(e.kind) ? e.kind : 'ai';
      if (kind === 'action') { if (SAFE_ID.test(e.id || '')) inc(d.act, e.id); break; }
      d.q++; inc(d.kind, kind); inc(d.src, ['voice', 'text', 'chip'].includes(e.src) ? e.src : 'voice');
      if (kind === 'bank' && SAFE_ID.test(e.id || '')) inc(d.bank, e.id);
      else if (STATS_TEXT && e.text) {
        const shown = String(e.text).replace(/\s+/g, ' ').trim().slice(0, 120), key = normQ(shown).slice(0, 120);
        if (key.length >= 4) {
          const keys = Object.keys(STATS.top);
          if (!STATS.top[key] && keys.length >= 4000) keys.filter((k) => STATS.top[k].n <= 1).slice(0, 800).forEach((k) => delete STATS.top[k]);   // تنظيف الأسئلة التي لم تتكرر
          const it = (STATS.top[key] = STATS.top[key] || { t: shown, n: 0 }); it.n++;
        }
      }
      break;
    }
    case 'rate': { const v = Number(e.v); if (v >= 1 && v <= 5 && Number.isInteger(v)) d.rate[v - 1]++; break; }
    case 'quiz': { const sc = Number(e.score), n = Number(e.n); if (Number.isInteger(sc) && Number.isInteger(n) && n > 0 && n <= 50 && sc >= 0 && sc <= n) { d.quizN++; d.quizSum += sc; d.quizMax += n; inc(d.quizDist, `${sc}/${n}`); } break; }
    case 'scn': { if (SAFE_ID.test(e.id || '') && ['best', 'ok', 'bad'].includes(e.v)) { const x = (d.scn[e.id] = d.scn[e.id] || { best: 0, ok: 0, bad: 0 }); x[e.v]++; } break; }
    default: return;
  }
  statsDirty = true;
}
function saveStats(sync) {
  if (!statsDirty) return; statsDirty = false;
  const data = JSON.stringify(STATS), tmp = STATS_FILE + '.tmp';
  try {
    if (sync) { fs.writeFileSync(tmp, data); fs.renameSync(tmp, STATS_FILE); }
    else fs.writeFile(tmp, data, (e) => { if (e) return console.warn('stats save:', e.message); fs.rename(tmp, STATS_FILE, () => {}); });
  } catch (e) { console.warn('stats save:', e.message); }
}
setInterval(() => saveStats(false), 30000).unref();
setInterval(() => { const d = statDay(); console.log(`📊 اليوم: ${d.sessions} جلسة، ${d.q} سؤال، ${d.rate.reduce((a, b) => a + b, 0)} تقييم، ${d.quizN} اختبار`); }, 30 * 60000).unref();
['SIGTERM', 'SIGINT'].forEach((sig) => process.on(sig, () => { saveStats(true); process.exit(0); }));
async function handleEvent(req, res) {
  let e = null; try { e = JSON.parse((await readBody(req, 2000)).toString('utf8') || '{}'); } catch {}
  recordEvent(e);
  res.writeHead(204); res.end();
}
const keyOk = (req) => {
  const k = String(req.headers['x-stats-key'] || '');
  if (!STATS_KEY || !k) return false;
  const a = crypto.createHash('sha256').update(k).digest(), b = crypto.createHash('sha256').update(STATS_KEY).digest();
  return crypto.timingSafeEqual(a, b);
};
async function handleStats(req, res) {
  if (!STATS_KEY) return sendJSON(res, 503, { error: 'لوحة الإحصائيات غير مفعّلة: أضف المتغير STATS_KEY في إعدادات الخادم.' });
  if (!keyOk(req)) { await new Promise((r) => setTimeout(r, 700)); return sendJSON(res, 401, { error: 'رمز الدخول غير صحيح' }); }
  if (req.url.startsWith('/api/stats-import')) {
    const j = JSON.parse((await readBody(req, 8 * 1024 * 1024)).toString('utf8') || '{}');
    if (!j || j.v !== 1 || typeof j.days !== 'object') return sendJSON(res, 400, { error: 'الملف ليس نسخة إحصائيات صحيحة' });
    STATS = { ...newStats(), since: j.since || Date.now(), days: j.days, top: j.top || {}, devs: j.devs || {} }; statsDirty = true; saveStats(false);
    return sendJSON(res, 200, { ok: true });
  }
  const top = Object.values(STATS.top).sort((a, b) => b.n - a.n).slice(0, 60);
  const full = req.url.includes('full=1');
  sendJSON(res, 200, { v: 1, since: STATS.since, boot: statsBoot, now: Date.now(), today: riyadh().toISOString().slice(0, 10), devices: Object.keys(STATS.devs).length, textOn: STATS_TEXT, persistent: !!process.env.STATS_DIR, days: STATS.days, top: full ? STATS.top : top, ...(full ? { devs: STATS.devs } : {}) });
}

// ---------- الخادم ----------
http.createServer(async (req, res) => {
  try {
    if (req.url.startsWith('/api/')) {
      if (req.method !== 'POST') return sendJSON(res, 405, { error: 'POST only' });
      const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
      if (!sameSite(req)) return sendJSON(res, 403, { error: 'forbidden' });
      if (rateLimited(ip)) return sendJSON(res, 429, { error: 'طلبات كثيرة، حاول بعد قليل' });
      if (req.url.startsWith('/api/event')) return await handleEvent(req, res);
      if (req.url.startsWith('/api/stats')) return await handleStats(req, res);
      if (req.url.startsWith('/api/chat')) return await handleChat(req, res);
      if (req.url.startsWith('/api/tts-pcm')) return await handleTTSPcm(req, res);
      if (req.url.startsWith('/api/tts')) return await handleTTS(req, res);
      if (req.url.startsWith('/api/stt')) return await handleSTT(req, res);
      if (req.url.startsWith('/api/simli-token')) return await handleSimliToken(req, res);
      return sendJSON(res, 404, { error: 'not found' });
    }
    if (/^\/stats\/?(\?.*)?$/.test(req.url)) req.url = '/stats.html';      // لوحة الإحصائيات: ‎/stats‎
    serveStatic(req, res);
  } catch (e) {
    const timeout = e?.name === 'TimeoutError' || e?.name === 'AbortError';
    if (!timeout) console.error(e);
    if (!res.headersSent && !res.destroyed) sendJSON(res, timeout ? 504 : 500, { error: timeout ? 'تأخر الرد، حاول مرة ثانية' : 'خطأ في الخادم' });
  }
}).listen(PORT, () => {
  console.log(`✅ نزيه يعمل على: http://localhost:${PORT}`);
  console.log(SIMLI_KEY && SIMLI_FACE ? '✅ Simli مضبوط (الوجه الحي للشاشة: /?avatar=simli)' : `ℹ️  Simli غير مفعّل${SIMLI_KEY ? ' — ينقص SIMLI_FACE_ID' : ''}`);
  console.log(`🔊 الصوت: ${TTS_PROVIDER}${TTS_PROVIDER === 'azure' ? ` (${AZ_VOICE} @ ${AZ_REGION})` : TTS_PROVIDER === 'elevenlabs' ? ` (${EL_VOICE}, ${EL_MODEL})` : ` (${TTS_VOICE})`}`);
  console.log(`🧠 العقل: ${CHAT_PROVIDERS.map((p) => p.model).join(' ← احتياطي: ')}`);
  console.log(STATS_KEY ? `📊 لوحة الإحصائيات: /stats (${process.env.STATS_DIR ? 'حفظ دائم في ' + STATS_FILE : 'حفظ مؤقت: يُمسح عند إعادة النشر، نزّل نسخة من اللوحة'})` : 'ℹ️  لوحة الإحصائيات غير مفعّلة (أضف STATS_KEY)');
  if (!API_KEY) console.log('⚠️  لم يتم ضبط OPENAI_API_KEY — الموقع سيعمل لكن المساعد سيرد بإجابات محلية محدودة فقط.');
});
