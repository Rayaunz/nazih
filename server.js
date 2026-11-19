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

القاعدة الأولى، وتتقدم على كل ما بعدها: لا حكم نظامي إلا من النص
- في آخر هذه التعليمات «مرجعك» لهذا السؤال: أسماء الأنظمة التي تعرفها، وأجوبة موثقة إن وُجدت، ونصوص مواد منقولة حرفياً من تلك الأنظمة. هذا المرجع وحده مصدرك في أي حكم نظامي.
- الحكم النظامي هو: تعريف جريمة أو مخالفة، أو أركانها، أو عقوبتها، أو مدة، أو مبلغ، أو إجراء، أو مهلة، أو اختصاص جهة، أو شرط وظيفي. كل حكم تقوله يجب أن يكون موجوداً في المرجع. ما ليس فيه لا تقله إطلاقاً، ولو كنت تعرفه من معلوماتك العامة، ولو بصيغة عامة أو تقريبية، ولو سبقته بكلمة «غالباً» أو «عموماً».
- قبل كل جملة فيها حكم نظامي تحقق: هل هي موجودة في المرجع؟ إن لم تكن موجودة فاحذفها من جوابك.
- مواد المرجع تُختار آلياً، وقد يكون بعضها لا يتصل بسؤال الزائر. استعمل المتصل بالسؤال اتصالاً مباشراً فقط وتجاهل الباقي تماماً.
- الزائر يتكلم بكلامه لا بألفاظ النظام: «ياخذ فلوس عشان يخلّص المعاملة» هي قبول العطية في الرشوة، و«الهدية» و«العزيمة» قد تكون «عطية» أو «فائدة أو ميزة»، و«الواسطة» هي «الوساطة»، و«بلّغت» تعني أنه «المبلِّغ». اربط كلامه بالمادة التي تنطبق على معناه وأجب منها، ولو لم يذكر اسم النظام.
- أجب أولاً ومباشرة مما في المرجع. لا تطلب من الزائر أن يتصفح الأنظمة أو يطالعها في الشاشة بدل أن تجيبه، ولا تحيله إلى قراءة النظام بنفسه. بعد الجواب الكامل يجوز أحياناً، لا في كل مرة، أن تذكر أن نص المادة موجود في «تصفّح الأنظمة».
- المادة التي تذكر الفعل نفسه (مثل تزوير تقرير طبي، أو التزوير في سجل الحضور، أو قبول العطية) هي جواب سؤاله ولو لم تذكر صفة الفاعل (طالب، موظف، مراجع) ولا تفاصيل قصته: أجب منها مباشرة بالحكم والعقوبة، ولا تقل إن النص لا يذكر حالته. وإذا اشترطت المادة شرطاً (مثل أن تكون العطية مقابل عمل من أعمال وظيفته) فاذكره مع الحكم.
- فقط إذا لم يكن في المرجع مادة تذكر هذا الفعل أصلاً: قل بجملة قصيرة إن النص لا يذكر هذه الحالة بعينها، ثم أعطه أقرب حكم في المرجع مع اسم النظام ورقم المادة، دون أن تجزم بأنه ينطبق على حالته. وإذا لم يكن في المرجع شيء قريب أصلاً فقل «ما عندي معلومة مؤكدة عن هذا» واقترح عليه سؤالاً قريباً تعرف جوابه. لا تخمّن ولا تكمل من معلوماتك العامة.
- موضوع خارج الأنظمة التي تعرفها (مثل السرقة، الاحتيال، الابتزاز، خيانة الأمانة، الجرائم المعلوماتية، نظام العمل، المرور): لا تعرّفه ولا تذكر أركانه ولا عقوبته. قل: «ما عندي معلومة مؤكدة عن هذا، لأنه خارج الأنظمة اللي عندي»، ثم اسأله بجملة قصيرة إن كان يريد شيئاً مما عندك.
- سؤال يقارن بين عدة أمور: اشرح ما تجده في المرجع فقط، وقل عن الباقي إنه ما عندك معلومة مؤكدة عنه.
- إذا شكّ الزائر في معلومة قلتها، أو قال «تأكد» أو «متأكد؟»: ارجع إلى المرجع. إن وجدت المعلومة فيه فأعدها مع اسم النظام ورقم المادة. وإن لم تجدها فقل: «معك حق، ما عندي معلومة مؤكدة عن هذي، فلا تعتمد عليها»، ولا تدافع عنها ولا تكررها.
- اذكر اسم النظام ورقم المادة مع كل حكم (مثل: «حسب المادة الرابعة من نظام مكافحة الرشوة»). انقل العقوبات والمدد والمبالغ كما وردت دون تغيير، ولا تخترع رقم مادة.
- إذا طلب الزائر نص مادة موجودة في المرجع فاقرأها حرفياً كاملة ولو طالت.
- نظام مكافحة التزوير الصادر عام 1380هـ ملغى، فلا تستشهد به.
- المسموح من غير نص: كلام توعوي عام عن قيمة النزاهة والأمانة ودور الطالب والموظف في تعزيزها، وقنوات البلاغ ومعلومات جامعة حائل المذكورة أدناه. بشرط ألا يتضمن حكماً نظامياً.

كيف تتكلم:
- تكلّم كمن يعرف الأنظمة ويحفظها: «حسب المادة الرابعة من نظام مكافحة الرشوة». الزائر لا يرى مرجعك، فلا تشر إليه ولا تصفه، ولا تتكلم عن نصوص أمامك أو وصلتك.
- لا تعتذر أكثر من مرة في الرد، ولا تكرر الجملة نفسها في ردّين متتاليين.

أسلوبك:
- أنت من أهل حائل، وكلامك ثلاثة مستويات بحسب الموقف:
  1) الترحيب والسوالف والشكر والوداع: لهجة حائلية خفيفة وطبيعية. استعمل من هذه العبارات فقط ولا تخترع غيرها: «يا هلا والله»، «حيّاك الله»، «يا بعد حيي»، «وش بغيت؟»، «أبشر»، «سَمّ». عبارة واحدة أو اثنتان في الرد، لا في كل جملة.
  2) الشرح والحوار العادي: سعودية بيضاء مبسطة يفهمها الجميع (وش، تبي، ودّك، عشان، كذا).
  3) الأنظمة والمواد والعقوبات: فصحى واضحة دقيقة بلا أي عامية. لا تدخل اللهجة في نص نظامي ولا في آية أو حديث.
- إذا خاطبك الزائر بتعبير حائلي لا تعرف معناه فاسأله عنه ولا تخمّن. واللهجة للترحيب والتفاعل، لا على حساب دقة المعلومة.
- إجاباتك تُقرأ بصوت عالٍ والزائر واقف أمام الشاشة في قاعة مزدحمة، فاجعلها قصيرة جداً: جملتان في الغالب، وثلاث جمل قصيرة كحد أقصى (نحو خمسين كلمة كلها)، بدون نقاط أو جداول أو رموز أو روابط. القِصَر لا يكون على حساب الدقة: يبقى اسم النظام ورقم المادة مع كل حكم، ويُحذف الشرح الزائد. إذا كان للموضوع تفاصيل أكثر فاختم أحياناً (لا في كل جواب) بعرض قصير مثل: «تبي أفصّل لك أكثر؟»، وهو من ضمن الجمل الثلاث. لا تُطل إلا إذا طلب الزائر التفصيل أو طلب قراءة نص مادة.
- ابدأ بالجواب مباشرة من أول كلمة، واجعل الجملة الأولى قصيرة جداً (أقل من عشر كلمات) وفيها خلاصة الجواب، لأنها تُنطق والباقي ما زال يُكتب. لا تبدأ بالتحية ولا بتكرار السؤال ولا بمقدمات، إلا إذا حيّاك الزائر فردّ التحية باختصار.
- أول كلمة في جوابك هي المعلومة نفسها، بلا تمهيد ولا كلمة انتظار. «أبشر» تقال فقط إذا طلب منك الزائر أن تفعل له شيئاً.
- إذا كان في السؤال أكثر من جزء فأجب عن كل جزء بجملة أو جملتين بالترتيب.
- سؤال الزائر يصلك محوّلاً من صوته وقد تكون فيه أخطاء سمع؛ افهم المقصود الأقرب في سياق النزاهة والأنظمة وأجب عليه، ولا تطلب التوضيح إلا إذا تعذّر الفهم تماماً.
- اكتب الأرقام بطريقة سهلة النطق: الأعداد وأرقام المواد والمدد والمبالغ بالحروف (المادة الثامنة، ثلاث سنوات، مئة ألف ريال)، ولا تكتب أقواساً ولا شرطات مائلة ولا اختصارات.
- تكلّم كما يتكلم إنسان واقف أمام الزائر لا كمن يقرأ ورقة: جمل قصيرة بينها فواصل طبيعية، وكلمات ربط مألوفة (يعني، بمعنى، وعشان كذا، وبالمناسبة)، ونوّع بدايات جملك فلا تكرر العبارة نفسها في كل جواب.
- العبارات الودّية (حياك الله، الله يعطيك العافية، إن شاء الله، ما شاء الله) استعملها في موضعها الطبيعي فقط: عند التحية أو الشكر أو الدعاء، مرة واحدة في الجواب على الأكثر، ولا تحشرها في كل رد.
- إذا شكرك الزائر أو ودّعك فردّ بجملة قصيرة دافئة فقط. وإذا كان سؤاله عن موقف يقلقه فابدأ بكلمة تطمين قصيرة ثم الجواب.
- بعد الجواب أضف سطراً أخيراً يبدأ بالرمز § وفيه سؤالان قصيران قد يسألهما الزائر بعد ذلك ويكون جوابهما في الأنظمة التي عندك، يفصل بينهما الرمز | (مثال: § كيف أبلّغ عن فساد؟ | هل هوية المبلّغ محمية؟). لا تذكر هذا السطر في الجواب نفسه.

عن جامعة حائل: جامعة حكومية سعودية في مدينة حائل تأسست عام 1426هـ الموافق 2005م، وهي الجهة المنظمة لهذه الفعالية. اكتفِ بهذه المعلومات ولا تخترع أرقاماً أو أسماء.

قنوات البلاغ عن الفساد لدى نزاهة: الرقم المجاني 980، والبريد الإلكتروني 980@nazaha.gov.sa، وموقع الهيئة الإلكتروني وتطبيقها. ويمكن تقديم البلاغ دون ذكر الاسم إذا كانت المعلومات قابلة للتحقق.

حدودك:
- أنت لا تستقبل بلاغات ولا تحفظ بيانات؛ إذا أراد الزائر أن يبلّغ فوجّهه للقنوات الرسمية أعلاه، ولا تطلب منه أسماء أو تفاصيل شخصية.
- السؤال العام والافتراضي سؤالٌ عن الحكم لا اعترافٌ بمخالفة، ولو جاء بصيغة المتكلم: «لو موظف سوّى كذا وش عقوبته؟»، «ماذا لو شخص...»، «إذا واحد...»، «لو أنا سويت كذا علي شي؟». أجب عنه كاملاً من المرجع بالحكم والعقوبة واسم النظام ورقم المادة، بلا تحفظ، ولا تذكر المحامي ولا الاستشارة القانونية.
- لا تقل «لا أستطيع أن أجيبك» ولا «ما أقدر أفتي لك» أبداً إذا كان الجواب في المرجع.
- فقط إذا قال الزائر صراحة إن له قضية قائمة فعلاً (قضية أو تحقيق أو دعوى منظورة الآن) وطلب توقّع نتيجتها أو خطة لها: أعطه الحكم العام من المرجع أولاً، ثم جملة واحدة قصيرة أن تفاصيل قضيته يقدّرها محامٍ أو الجهة المختصة.
- في أسئلة التظلم ورفع الدعاوى والاعتراض على الأحكام أمام ديوان المظالم: اذكر المدد والشروط كما وردت في المادة، ولا تحسب للزائر مواعيد حالته ولا تحكم بقبول تظلمه أو دعواه أو رفضها؛ وإذا كانت له قضية قائمة فتكفي جملة واحدة أن المختص يقدّر تفاصيلها.
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

/* ---------- حارس الجواب (v34) ----------
   كل جملة من رد النموذج تُفحص قبل أن تصل للصوت والشاشة:
   1) تُحذف كلمات الانتظار («لحظة»، «خلني أشوف») والجمل التي تتكلم عن المصادر («النص المتاح أمامي»...).
   2) أي رقم مادة، أو عدد معه مدة أو مبلغ (سنوات، أشهر، أيام، ريال)، لا يوجد في نصوص المواد المرسلة مع السؤال: تُحذف جملته،
      ويقول نزيه بدلها «ما عندي معلومة مؤكدة». الجمل المحذوفة تُكتب في سجل الخادم (guard:) للمراجعة. */
const nrm = (s) => String(s || '').replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي');
const AR = '\\u0621-\\u064A';
const ONES = { واحد: 1, واحده: 1, احد: 1, اثنان: 2, اثنين: 2, اثنتان: 2, اثنتين: 2, ثلاث: 3, ثلاثه: 3, اربع: 4, اربعه: 4, خمس: 5, خمسه: 5, ست: 6, سته: 6, سبع: 7, سبعه: 7, ثمان: 8, ثماني: 8, ثمانيه: 8, تسع: 9, تسعه: 9 };
const TENS = { عشرون: 20, عشرين: 20, ثلاثون: 30, ثلاثين: 30, اربعون: 40, اربعين: 40, خمسون: 50, خمسين: 50, ستون: 60, ستين: 60, سبعون: 70, سبعين: 70, ثمانون: 80, ثمانين: 80, تسعون: 90, تسعين: 90 };
function numWord(w) {
  if (ONES[w]) return ['u', ONES[w]];
  if (TENS[w]) return ['u', TENS[w]];
  if (w === 'عشر' || w === 'عشره') return ['u', 10];
  if (w === 'مئه' || w === 'مائه') return ['h', 100];
  if (/^(?:مئتا|مئتان|مئتين|مائتا|مائتان|مائتين)$/.test(w)) return ['u', 200];
  const m = w.match(/^(ثلاث|اربع|خمس|ست|سبع|ثمان|تسع)(?:مئه|مائه)$/); if (m) return ['u', ONES[m[1]] * 100];
  if (/^(?:الف|الاف|الفا)$/.test(w)) return ['k', 1e3];
  if (/^(?:الفان|الفين)$/.test(w)) return ['k2', 2e3];
  if (/^(?:مليون|ملايين|مليونا)$/.test(w)) return ['k', 1e6];
  if (/^(?:مليونان|مليونين)$/.test(w)) return ['k2', 2e6];
  if (/^(?:مليار|مليارات)$/.test(w)) return ['k', 1e9];
  return null;
}
const UNIT_RE = /^(?:سنه|سنوات|سنين|عام|عاما|اعوام|شهر|شهرا|اشهر|شهور|يوم|يوما|ايام|اسبوع|اسبوعا|اسابيع|ساعه|ساعات|ريال|ريالا|ريالات)$/;
const DUAL_RE = /^(?:سنتين|سنتان|عامين|عامان|شهرين|شهران|يومين|يومان|اسبوعين|اسبوعان)$/;
const toks = (n) => n.replace(/(\d)[,٬](?=\d{3})/g, '$1').replace(new RegExp(`[^${AR}0-9\\u0660-\\u0669\\s]`, 'g'), ' ').split(/\s+/).filter(Boolean);
/* كل الأعداد في نص (بالأرقام أو بالحروف)، ومعها هل يليها تمييز مدة أو مبلغ */
function numPhrases(n) {
  const t = toks(n), out = [];
  for (let i = 0; i < t.length;) {
    if (DUAL_RE.test(t[i])) { out.push({ v: 2, unit: true }); i++; continue; }
    if (/^[0-9٠-٩]+$/.test(t[i])) { out.push({ v: Number(t[i].replace(/[٠-٩]/g, (d) => d.charCodeAt(0) - 0x660)), unit: UNIT_RE.test(t[i + 1] || '') }); i++; continue; }
    let total = 0, cur = 0, got = false, j = i;
    for (; j < t.length; j++) {
      const w = t[j]; let p = numWord(w);
      if (!p && w.length > 2 && w[0] === 'و') p = numWord(w.slice(1));
      if (!p) break;
      got = true;
      const [k, v] = p;
      if (k === 'u') cur += v; else if (k === 'h') cur = (cur || 1) * 100;
      else if (k === 'k') { total += (cur || 1) * v; cur = 0; } else { total += v; cur = 0; }
    }
    if (got) { out.push({ v: total + cur, unit: UNIT_RE.test(t[j] || '') }); i = j; } else i++;
  }
  return out;
}
/* رقم المادة من «الرابعه»، «الثامنه عشره»، «الحاديه والعشرين»، «12» */
const ORD = [['عشرون', 20], ['عشرين', 20], ['ثلاثون', 30], ['ثلاثين', 30], ['اربعون', 40], ['اربعين', 40], ['خمسون', 50], ['خمسين', 50], ['ستون', 60], ['ستين', 60], ['سبعون', 70], ['سبعين', 70], ['ثمانون', 80], ['ثمانين', 80], ['تسعون', 90], ['تسعين', 90],
  ['حادي', 1], ['احدي', 1], ['احد', 1], ['واحد', 1], ['اثن', 2], ['ثلاث', 3], ['اربع', 4], ['خمس', 5], ['ست', 6], ['سبع', 7], ['ثمان', 8], ['تسع', 9], ['اول', 1], ['ثاني', 2], ['ثالث', 3], ['رابع', 4], ['خامس', 5], ['سادس', 6], ['سابع', 7], ['ثامن', 8], ['تاسع', 9], ['عاشر', 10]];
function ordWord(w) {
  w = w.replace(/^و/, '').replace(/^ال/, '');
  if (/^[0-9٠-٩]+$/.test(w)) return Number(w.replace(/[٠-٩]/g, (d) => d.charCodeAt(0) - 0x660));
  if (w === 'عشر' || w === 'عشره') return 10;
  const hit = ORD.find(([k]) => w.startsWith(k));
  return hit ? hit[1] : null;
}
function artNum(str) {
  let total = 0, got = false;
  for (const tk of toks(str).slice(0, 3)) { const v = ordWord(tk); if (v === null) break; total += v; got = true; if (/^[0-9٠-٩]+$/.test(tk)) break; }
  return got ? total : null;
}
const ART_RE = new RegExp(`(?:^|[^${AR}])(?:و|ف)?(?:ال|لل|بال)?ماده\\s+([^\\n]{1,40})`, 'g');
const artRefs = (n) => [...n.matchAll(ART_RE)].map((m) => artNum(m[1])).filter((x) => x);
/* الحقائق المسموح بها لسؤال واحد: أرقام المواد في عناوين المرجع ونصوصه، والأعداد الواردة فيه وفي التعليمات */
/* v35: الأعداد المسموحة مع مدة أو مبلغ تأتي من نصوص المواد فقط. كانت أعداد التعليمات تُضاف أيضاً، والتعليمات فيها أمثلة مثل «ثلاث سنوات»
   فكانت عقوبة مخترعة بثلاث سنوات (أو عشر) تمر دون أن يكتشفها الفحص. (أرقام البلاغ والجامعة في التعليمات لا تأتي مع مدة أو مبلغ فلا تتأثر.) */
function groundFacts(context) {
  const n = nrm(context), laws = new Map(), arts = new Set();
  for (const m of n.matchAll(/【([^】—]+?)\s+—\s+([^】]+)】/g)) {
    const num = artNum(m[2].replace(/^.*?ماده\s*/, '')); if (!num) continue;
    const name = m[1].trim(); if (!laws.has(name)) laws.set(name, new Set());
    laws.get(name).add(num); arts.add(num);
  }
  artRefs(n).forEach((x) => arts.add(x));
  return { laws, arts, nums: new Set(numPhrases(n).map((p) => p.v)) };
}
const FILLER_RE = /(^|[\s،.!؟])(?:لحظ[ةه](?:[\s،.!…]+لحظ[ةه])*|لحظات|خل(?:ي)?ني\s+(?:أ|ا)?(?:شوف|تأكد|تاكد|دور|بحث)|دعني\s+(?:أ|ا)?(?:تحقق|رى|بحث|تأكد|تاكد))(?=[\s،.!؟…]|$)[\s،.!…]*/g;
const META_RE = new RegExp([
  `(?:النص|النصوص|المواد|الماده|المعلومات|المرجع)\\s+(?:ال)?(?:متاح|متوفر|مرفق|مرسل|موجود[هت]? امامي|اللي (?:وصل|عندي|قدامي)|التي (?:وصل|لدي|امامي))`,
  `(?:^|[^${AR}])(?:امامي|قدامي)(?![${AR}])`, `وصلني|وصلتني|وصلتنا`, `الاجوبه (?:ال)?معتمده|الاجوبه الموثقه|الانظمه المضافه|قائمه الانظمه`,
  `حسب ما (?:لدي|عندي) من (?:نصوص|مواد)`, `(?:^|[^${AR}])(?:مرجعي|مرجعك)(?![${AR}])`,
].join('|'));
// v36: بلا «تتصفح الأنظمة من الشاشة» (ملاحظة المشرف: نزيه لا يحيل الزائر للشاشة بدل الجواب)
const UNSURE = 'ما عندي معلومة مؤكدة عن هذا. اسألني عنه بصيغة ثانية، أو عن الرشوة أو التزوير أو حماية المبلّغين.';
let guardLogs = 0;
/* يرجع الجملة بعد التنظيف، أو null إذا يجب حذفها */
function checkSentence(s, f) {
  const t = s.replace(FILLER_RE, '$1');
  if (!new RegExp(`[${AR}0-9]`).test(t)) return { text: t.trim() ? t : '', drop: false, empty: true };
  const n = nrm(t);
  let why = META_RE.test(n) ? 'meta' : '';
  if (!why && f) {
    const named = [...f.laws.keys()].filter((name) => n.includes(name));
    for (const num of artRefs(n)) {
      const ok = f.arts.has(num) && (!named.length || named.some((name) => f.laws.get(name).has(num)) || artRefs(n).length > 1);
      if (!ok) { why = `article ${num}`; break; }
    }
    if (!why) for (const p of numPhrases(n)) if (p.unit && !f.nums.has(p.v)) { why = `number ${p.v}`; break; }
  }
  if (why) { if (guardLogs++ < 200) console.log(`guard: dropped (${why}): ${t.trim().slice(0, 160)}`); return { text: '', drop: true }; }
  return { text: t, drop: false };
}
function makeGuard(context) {
  const f = groundFacts(context);
  let buf = '', tail = false, said = 0, noted = false;
  const emit = (s) => {
    if (!s) return '';
    const r = checkSentence(s, f);
    if (r.empty) return r.text;
    if (!r.drop) { said++; return r.text; }
    if (noted) return '';
    noted = true; said++;
    return s.match(/^\s*/)[0] + (said > 1 ? 'وما عندي معلومة مؤكدة عن بقية التفاصيل.' : 'ما عندي معلومة مؤكدة عن هذا.');
  };
  const closing = () => (said ? '' : UNSURE);
  return {
    push(t) {
      if (tail) return t;
      buf += t;
      const k = buf.indexOf('§'), ans = k >= 0 ? buf.slice(0, k) : buf;
      let out = '', last = 0, m; const re = /[.؟?!؛](?=\s)|\n/g;      // جملة مكتملة: علامة نهاية بعدها فراغ (لا تنقسم 980@nazaha.gov.sa)
      while ((m = re.exec(ans))) { out += emit(ans.slice(last, m.index + 1)); last = m.index + 1; }
      if (k < 0) { buf = ans.slice(last); return out; }
      out += emit(ans.slice(last)) + closing();
      tail = true; const rest = buf.slice(k); buf = '';
      return out + (/\n$/.test(out) ? '' : '\n') + rest;
    },
    end() { if (tail) return ''; const out = emit(buf) + closing(); buf = ''; return out; },
  };
}
/* الردود السابقة ترجع للنموذج مع كل سؤال: تُنظف من كلمات الانتظار والكلام عن المصادر حتى لا يقلدها */
const scrub = (text) => text.split(/(?<=[.؟?!؛\n])\s+/).map((s) => checkSentence(s, null)).filter((r) => !r.drop).map((r) => r.text.trim()).filter(Boolean).join(' ');

// ---------- نقاط الـ API ----------
async function handleChat(req, res) {
  if (needKey(res)) return;
  const body = JSON.parse((await readBody(req, 300_000)).toString('utf8') || '{}');
  const history = Array.isArray(body.messages) ? body.messages.slice(-10) : [];
  const context = typeof body.context === 'string' ? body.context.slice(0, 20000) : '';
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT + (context ? `\n\nمرجعك لهذا السؤال (نصوص رسمية، وهي وحدها مصدر أحكامك النظامية):\n"""\n${context}\n"""` : '\n\nلا يوجد نص نظامي متعلق بهذا السؤال: لا تذكر أي حكم نظامي، وإن كان السؤال عن حكم نظامي فقل «ما عندي معلومة مؤكدة عن هذا».') },
    ...history
      .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .map((m) => ({ role: m.role, content: (m.role === 'assistant' ? scrub(m.content) || '.' : m.content).slice(0, 2500) })),
  ];
  const guard = makeGuard(context);
  const stream = body.stream === true, t0 = Date.now();
  warmTts();
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
    // v35: no-transform يمنع Cloudflare (أمام Render) من ضغط البث بـ Brotli: كان الضغط يحبس الجواب فيصل أول كلامه بعد ~4 ثوانٍ بدل ~2
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store, no-transform', 'X-Accel-Buffering': 'no', 'X-Chat': lastChat.replace(/[^\x20-\x7e]/g, ''), 'Server-Timing': `model;dur=${Date.now() - t0}` });
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
          let t = ''; try { t = JSON.parse(d).choices?.[0]?.delta?.content || ''; } catch {}
          if (t) { const out = guard.push(t); if (out) res.write(out); }
        }
      }
      if (!res.destroyed) { const out = guard.end(); if (out) res.write(out); }
    } catch (e) { if (e.name !== 'AbortError') console.warn('stream:', e.message); }
    clearTimeout(killer);
    return res.end();
  }
  const data = await r.json();
  clearTimeout(killer);
  const raw0 = data.choices?.[0]?.message?.content?.trim() || '';
  const raw = (guard.push(raw0) + guard.end()).trim();
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
/* صوتان: صوت للشاشة الرئيسية وصوت لبقية الأجهزة (الجوالات). إذا وُجد مفتاحا Azure و ElevenLabs معاً فالشاشة الرئيسية
   تنطق بصوت ElevenLabs والجوالات بصوت Azure تلقائياً (أوفر: الصوت الأغلى على جهاز واحد). للتحكم يدوياً: TTS_SCREEN_PROVIDER. */
const SCREEN_PROVIDER = (process.env.TTS_SCREEN_PROVIDER || (EL_KEY && EL_VOICE ? 'elevenlabs' : TTS_PROVIDER)).toLowerCase();
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

/* ---------- تهيئة النص للنطق (v22) ----------
   النص المكتوب للعين غير النص المنطوق: هنا يُنظَّف ما لا يُنطق (رموز، أقواس الترقيم) وتُضبط كلمات يخطئ فيها الصوت الآلي.
   - لفظ الجلالة: يُفخَّم بعد الفتح والضم (حياك الله، إن شاء الله، والله) ويبقى مرققاً بعد الكسر (بسم الله، لله، بالله).
     طريقة كتابته للصوت تُختار بالمتغير TTS_ALLAH (رقم من 0 إلى 5، جرّبها من صفحة ‎/say.html‎ واختر ما يُنطق صح مع صوتك). 0 = بدون تغيير.
   - لإضافة كلمة يخطئ فيها الصوت: TTS_FIXES في Environment بصيغة «كلمة=نطقها» مفصولة بفاصلة منقوطة، مثل: نزاهة=نَزاهة;حائل=حائِل */
const ALLAH_FORMS = ['', 'اللهُ', 'اللَّه', 'اللّٰه', 'اللاه', 'ٱللَّه'];
const ALLAH_PICK = Math.min(5, Math.max(0, parseInt(process.env.TTS_ALLAH ?? '2', 10) || 0));
const THIN_BEFORE = '(?:و?رحمة|بسم|باسم|بإذن|باذن|بعون|بفضل|بحمد|بتوفيق|برحمة|بأمر|بقدرة|بمشيئة|في سبيل|على بركة|في ذمة|لوجه|في أمان|في حفظ|إلى|الى)';
/* نطق العبارات الدارجة (الحائلية) في الترحيب: الكتابة على الشاشة تبقى عادية، والصوت يستلمها مشكولة حتى لا ينطقها فصحى.
   القائمة قصيرة عمداً وفيها المؤكد فقط؛ الباقي يُضاف عبر TTS_FIXES بعد أن يسمعه صاحب اللهجة من صفحة ‎/say.html‎. */
const B0 = '(?<![\\u0621-\\u0652\\u0670\\u0671])', B1 = '(?![\\u0621-\\u0652\\u0670\\u0671])';
const DIALECT_SAY = [
  ['يا بعد حيي', 'يَا بَعَدْ حَيِّي'], ['يا هلا', 'يَا هَلَا'], ['وشلون', 'وِشْلُون'], ['وش', 'وِشْ'], ['بغيت', 'بَغَيْت'],
  ['أبشر', 'أَبْشِرْ'], ['ابشر', 'أَبْشِرْ'], ['حيّاك', 'حَيَّاك'], ['حياك', 'حَيَّاك'], ['تبي', 'تَبِي'], ['عشان', 'عَشَان'],
].map(([a, b]) => [new RegExp(B0 + a + (a === 'وشلون' ? '' : B1), 'g'), b]);
const USER_FIXES = (process.env.TTS_FIXES || '').split(/[;؛\n]/).map((x) => x.split('=').map((y) => y.trim())).filter((x) => x.length === 2 && x[0] && x[1]);
function sayable(text, allah = ALLAH_PICK) {
  let t = String(text);
  // ما لا يُنطق
  t = t.replace(/[•*§«»"“”]/g, ' ').replace(/\s[—–-]\s/g, '، ').replace(/[—–]/g, '، ');
  t = t.replace(/(^|\n)\s*\(\s*([أ-ي]|\d{1,2})\s*\)\s*(?=\S)/g, '$1$2، ');                       // (أ) (1) في أول البنود
  t = t.replace(/(^|\n)\s*([أ-ي]|\d{1,2})\s*[.)\-]\s+/g, '$1$2، ');                   // أ. / 1- في أول السطر
  t = t.replace(/[()\[\]]/g, ' ');
  t = t.replace(/\n{2,}/g, '. ').replace(/([^.؟!،؛:\s])\s*\n/g, '$1. ').replace(/\n/g, ' ');
  // اختصارات وأرقام
  t = t.replace(/م\s*\/\s*(\d+)/g, 'ميم $1').replace(/أ\s*\/\s*(\d+)/g, 'ألف $1');
  t = t.replace(/(\d)\s*هـ?(?![\u0621-\u0652\u0670\u0671])/g, (m, d) => (/ه/.test(m) ? `${d} هجري` : m)).replace(/(\d{4})\s*م(?![\u0621-\u0652\u0670\u0671])/g, '$1 ميلادي');
  t = t.replace(/(\d)\s*%/g, '$1 بالمئة').replace(/(?<![\d@.\/])980(?![\d@.\/])/g, 'تسعمئة وثمانين');
  t = t.replace(/\bQR\b/gi, 'كيو آر');
  for (const [re, b] of DIALECT_SAY) t = t.replace(re, b);
  // لفظ الجلالة
  const form = ALLAH_FORMS[allah];
  if (form) {
    const keep = '\u0001';                                                              // علامة مؤقتة لما يبقى مرققاً
    t = t.replace(new RegExp(`(${THIN_BEFORE})\\s+الله(?![\\u0621-\\u0652\\u0670\\u0671])`, 'g'), `$1 ${keep}`);
    t = t.replace(/(?<![\u0621-\u0652\u0670\u0671])اللهم(?![\u0621-\u0652\u0670\u0671])/g, `${form}ُمَّ`);
    t = t.replace(/(?<![\u0621-\u0652\u0670\u0671])([وفت])الله(?![\u0621-\u0652\u0670\u0671])/g, (m, p) => `${p}َ${form}`);
    t = t.replace(/(?<![\u0621-\u0652\u0670\u0671])الله(?![\u0621-\u0652\u0670\u0671])/g, form);
    t = t.split(keep).join('الله');
  }
  for (const [a, b] of USER_FIXES) t = t.split(a).join(b);
  return t.replace(/\s+([،.؟!؛:])/g, '$1').replace(/،\s*،/g, '،').replace(/\s{2,}/g, ' ').trim();
}
/* v35: تسخين الاتصال بمزوّد الصوت. Node يغلق الاتصال الخامل بعد نحو 4 ثوانٍ، فكانت أول جملة في كل جواب تدفع ثمن اتصال جديد
   (ElevenLabs نحو 0.66 ثانية بدل 0.24، وOpenAI نحو 1.2 بدل 0.3). عند وصول صوت الزائر للتحويل لنص أو بدء التفكير في سؤال مكتوب
   يُرسل طلب مجاني صغير (قائمة النماذج/الأصوات) فيبقى الاتصال حاراً حين تصل أول جملة. لا يُرسل والشاشة خاملة. */
let ttsWarmAt = 0;
function warmTts() {
  const now = Date.now(); if (now - ttsWarmAt < 2500) return; ttsWarmAt = now;
  for (const p of new Set([SCREEN_PROVIDER, TTS_PROVIDER])) {
    let u = '', h = {};
    if (p === 'elevenlabs' && EL_KEY) { u = `${EL_BASE}/v1/models`; h = { 'xi-api-key': EL_KEY }; }
    else if (p === 'azure' && AZ_KEY) { u = `${AZ_BASE}/cognitiveservices/voices/list`; h = { 'Ocp-Apim-Subscription-Key': AZ_KEY }; }
    else if (p === 'openai' && API_KEY) { u = `${OPENAI_BASE}/models`; h = { Authorization: `Bearer ${API_KEY}` }; }
    if (u) fetch(u, { headers: h, signal: withTimeout(8000) }).then((r) => r.arrayBuffer()).catch(() => {});
  }
}
let ttsWarned = 0;
async function ttsFetch(text, pcm, signal, want = TTS_PROVIDER) {
  text = text.startsWith('\u0002') ? text.slice(1) : sayable(text);          // \u0002 في أول النص = انطقه كما هو (صفحة التجربة)
  // الترتيب: الصوت المطلوب، ثم صوت الجوالات، ثم صوت OpenAI الاحتياطي حتى لا يسكت نزيه
  for (const p of [...new Set([want, TTS_PROVIDER])]) {
    if (p === 'openai') continue;
    try {
      const out = await ttsRequest(p, text, pcm, signal);
      if (out.r.ok) return { ...out, provider: p };
      const why = await out.r.text().catch(() => '');
      if (ttsWarned++ < 20) console.warn(`TTS ${p} ${out.r.status}: ${why.slice(0, 200)} — trying the next voice for this clip`);
    } catch (e) { if (e.name === 'AbortError') throw e; if (ttsWarned++ < 20) console.warn(`TTS ${p}: ${e.message} — trying the next voice`); }
  }
  return { ...(await ttsRequest('openai', text, pcm, signal)), provider: 'openai' };
}
async function handleTTS(req, res) {
  if (needKey(res)) return;
  const { text, raw, allah, screen } = JSON.parse((await readBody(req, 50_000)).toString('utf8') || '{}');
  if (!text) return sendJSON(res, 400, { error: 'no text' });
  // raw: انطق النص كما هو. allah: جرّب طريقة كتابة أخرى للفظ الجلالة (لصفحة التجربة ‎/say.html‎)
  let key = raw === true ? '\u0002' + String(text).slice(0, 1500) : Number.isInteger(allah) && allah >= 0 && allah <= 5 ? '\u0002' + sayable(String(text).slice(0, 1500), allah) : String(text).slice(0, 1500);
  const want = screen === true ? SCREEN_PROVIDER : TTS_PROVIDER, text0 = key; key = want + '|' + key;
  const cached = TTS_CACHE.get(key);
  if (cached) { TTS_CACHE.delete(key); TTS_CACHE.set(key, cached); return sendAudio(res, cached, true); }
  const { r, provider } = await ttsFetch(text0, false, withTimeout(30_000), want);
  if (!r.ok) { const e = await r.text(); return sendJSON(res, 502, { error: e.slice(0, 300) }); }
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.length < TTS_CACHE_MAX / 4) {
    if (provider === want) { TTS_CACHE.set(key, buf); ttsBytes += buf.length; }       // لا نحفظ الصوت الاحتياطي حتى يعود الصوت الأصلي حين يتعافى المزوّد
    while (ttsBytes > TTS_CACHE_MAX) { const [k, v] = TTS_CACHE.entries().next().value; TTS_CACHE.delete(k); ttsBytes -= v.length; }
  }
  sendAudio(res, buf, false);
}

/* صوت متدفق للوجه الحي: يُرسل إلى المتصفح أول بأول وهو يتولّد (PCM16 أحادي 16 كيلوهرتز، الصيغة التي يطلبها Simli)،
   فيبدأ نزيه الكلام بعد جزء من الثانية بدل انتظار المقطع كاملاً. المقطع يُحفظ بعد أول مرة مثل ‎/api/tts‎. */
/* v34: التكبير مع الضغط يجعل طاقة الصوت مرتفعة ثابتة، والوجه الحي يحرّك الرأس والعينين حسب طاقة الصوت فتبالغ حركته.
   خُفِّض التكبير، وصار لكل نوع متغيره (كان TTS_GAIN يغيّر الاثنين معاً بالخطأ). 1 = الصوت كما يصل من المزوّد بلا ضغط. */
const TTS_GAIN_OTHER = Number(process.env.TTS_GAIN_OTHER || 1);   // أصوات Azure و ElevenLabs (كان 1.25)
const TTS_GAIN = Number(process.env.TTS_GAIN || 1.3);              // صوت OpenAI يصل أخفض (كان 1.6)
function makeResampler(ratio, gain) {                             // ratio = تردد الدخل ÷ تردد الخرج (24000/16000 = 1.5)
  let carry = Buffer.alloc(0), pos = 0;
  return (chunk) => {
    const data = carry.length ? Buffer.concat([carry, chunk]) : chunk, n = data.length >> 1;
    const out = Buffer.alloc((Math.ceil(n / ratio) + 2) * 2); let o = 0, p = pos;
    while (p + 1 < n) {
      const i = Math.floor(p), f = p - i, a = data.readInt16LE(i * 2), b = data.readInt16LE(i * 2 + 2);
      const x = (a + (b - a) * f) / 32768;
      const v = (gain === 1 ? x : Math.tanh(x * gain)) * 32767;            // تكبير مع حد ناعم يمنع التشويش (بلا تكبير: الصوت كما هو)
      out.writeInt16LE(Math.round(v), o); o += 2; p += ratio;
    }
    const k = Math.min(Math.floor(p), n);
    carry = Buffer.from(data.subarray(k * 2)); pos = p - k;
    return out.subarray(0, o);
  };
}
const PCM_CACHE = new Map(); let pcmBytes = 0;
/* v35: توليد الصوت المتدفق مرة واحدة لكل نص. إذا طُلب النص نفسه وهو ما زال يتولّد (تجهيز مسبق + نطق، أو شاشتان)
   يشترك الطلب الثاني في التوليد الجاري ويستلم قطعه أول بأول، بدل أن يُطلب من مزوّد الصوت مرة ثانية. */
const PCM_LIVE = new Map();
function pcmStart(want, text0) {
  const key = want + '|' + text0;
  let live = PCM_LIVE.get(key);
  if (live) return live;
  live = { key, chunks: [], done: false, err: null, provider: '', firstMs: 0, waiters: new Set() };
  PCM_LIVE.set(key, live);
  const wake = () => { const w = [...live.waiters]; live.waiters.clear(); w.forEach((f) => f()); };
  (async () => {
    const ac = new AbortController(), killer = setTimeout(() => ac.abort(), 40_000), t0 = Date.now();
    let ok = false;
    try {
      const { r, rate, provider } = await ttsFetch(text0, true, ac.signal, want);
      if (!r.ok) { const e = await r.text().catch(() => ''); throw new Error(`TTS ${r.status} ${e.slice(0, 200)}`); }
      live.provider = provider;
      const rs = makeResampler(rate / 16000, provider === 'openai' ? TTS_GAIN : TTS_GAIN_OTHER);
      for await (const chunk of r.body) { const out = rs(Buffer.from(chunk)); if (out.length) { if (!live.firstMs) live.firstMs = Date.now() - t0; live.chunks.push(Buffer.from(out)); wake(); } }
      ok = true;
    } catch (e) { live.err = e; if (e.name !== 'AbortError') console.warn('tts-pcm:', e.message); }
    finally {
      clearTimeout(killer); live.done = true; PCM_LIVE.delete(key); wake();
      if (ok && live.chunks.length && live.provider === want) {                // لا نحفظ الصوت الاحتياطي حتى يعود الصوت الأصلي حين يتعافى المزوّد
        const buf = Buffer.concat(live.chunks);
        if (buf.length < TTS_CACHE_MAX / 4) {
          PCM_CACHE.set(key, buf); pcmBytes += buf.length;
          while (pcmBytes > TTS_CACHE_MAX) { const [k, v] = PCM_CACHE.entries().next().value; PCM_CACHE.delete(k); pcmBytes -= v.length; }
        }
      }
    }
  })();
  return live;
}
/* قطع الصوت لنص: من الذاكرة إن وُجد، وإلا من التوليد الجاري أو توليد جديد. signal يوقف القراءة فقط (التوليد يكمل ويُحفظ) */
async function* pcmChunks(want, text0, signal, info = {}) {
  const key = want + '|' + text0, cached = PCM_CACHE.get(key);
  if (cached) { PCM_CACHE.delete(key); PCM_CACHE.set(key, cached); info.cache = 'hit'; info.provider = want; yield cached; return; }
  const live = pcmStart(want, text0); info.cache = 'miss';
  let i = 0, wakeMe = null;
  const onAbort = () => { if (wakeMe) wakeMe(); };
  signal?.addEventListener?.('abort', onAbort, { once: true });
  try {
    for (;;) {
      while (i < live.chunks.length) { info.provider = live.provider; yield live.chunks[i++]; }
      if (live.done) { if (live.err && !i) throw live.err; return; }
      if (signal?.aborted) return;
      await new Promise((r) => { wakeMe = r; live.waiters.add(r); });
    }
  } finally { signal?.removeEventListener?.('abort', onAbort); }
}
async function handleTTSPcm(req, res) {
  if (needKey(res)) return;
  const { text, screen, warm, wait } = JSON.parse((await readBody(req, 50_000)).toString('utf8') || '{}');
  if (!text) return sendJSON(res, 400, { error: 'no text' });
  const want = screen === true ? SCREEN_PROVIDER : TTS_PROVIDER, text0 = String(text).slice(0, 1500), key = want + '|' + text0;
  // warm: تجهيز مسبق في ذاكرة الخادم فقط (بلا تنزيل للمتصفح): الجواب الجاهز أو الجملة التالية يُنطقان فوراً حين يأتي دورهما.
  // wait: يرد بعد اكتمال التوليد (للتجهيز المتتابع للأجوبة الجاهزة)
  if (warm === true) {
    const hit = PCM_CACHE.has(key);
    // للشاشة الرئيسية فقط، ولا يزيد ما يتولّد مسبقاً في نفس اللحظة على 4 مقاطع (حماية الذاكرة وفاتورة الصوت)
    if (screen !== true || (!hit && !PCM_LIVE.has(key) && PCM_LIVE.size >= 4)) { res.writeHead(204, { 'Cache-Control': 'no-store', 'X-Cache': 'busy' }); return res.end(); }
    if (!hit) {
      const live = pcmStart(want, text0);
      if (wait === true) await new Promise((r) => { const check = () => (live.done ? r() : live.waiters.add(check)); check(); });
    }
    res.writeHead(204, { 'Cache-Control': 'no-store', 'X-Cache': hit ? 'hit' : 'warming' }); return res.end();
  }
  const head = { 'Content-Type': 'application/octet-stream', 'Cache-Control': 'no-store, no-transform', 'X-Sample-Rate': '16000' };
  const cached = PCM_CACHE.get(key);
  if (cached) { PCM_CACHE.delete(key); PCM_CACHE.set(key, cached); res.writeHead(200, { ...head, 'Content-Length': cached.length, 'X-Cache': 'hit', 'X-TTS': want }); return res.end(cached); }
  const ac = new AbortController(), t0 = Date.now();
  res.on('close', () => { if (!res.writableEnded) ac.abort(); });
  const info = {}; let started = false;
  try {
    for await (const part of pcmChunks(want, text0, ac.signal, info)) {
      if (!started) { started = true; res.writeHead(200, { ...head, 'X-Cache': info.cache || 'miss', 'X-Accel-Buffering': 'no', 'X-TTS': info.provider || want, 'Server-Timing': `tts;dur=${Date.now() - t0}` }); }
      res.write(part);
    }
  } catch (e) { if (!started && !res.headersSent && !res.destroyed) return sendJSON(res, 502, { error: String(e.message || e).slice(0, 300) }); }
  if (!started && !res.headersSent && !res.destroyed) return sendJSON(res, 504, { error: 'تأخر الصوت' });
  res.end();
}

/* v35: تحويل الكلام إلى نص في قاعة مزدحمة.
   - اللغة مثبّتة على العربية، ومع الطلب قائمة قصيرة بمفردات الموضوع حتى تُكتب صحيحة (رشوة، اختلاس، غسل الأموال، المبلّغ...).
     القائمة قصيرة عمداً: النموذج إذا لم يسمع كلاماً واضحاً قد «يكتب» كلمات من القائمة نفسها، والمتصفح يكشف ذلك ويتجاهله.
   - يُطلب مع النص «احتمال كل كلمة» (logprobs) فيعرف الموقع إن كان السمع ضعيفاً (ضجيج) فيقول «ما سمعتك زين» بدل أن يخمّن.
     إن لم يقبل النموذج هذا الخيار يُرسل الطلب بدونه تلقائياً. */
const STT_PROMPT = process.env.STT_PROMPT || 'سؤال لنزيه عن النزاهة ومكافحة الفساد: نزاهة، الرشوة، الفساد، البلاغ، المبلّغ، الاختلاس، غسل الأموال، التزوير، المال العام، هيئة الرقابة ومكافحة الفساد، الخدمة المدنية، الانضباط الوظيفي، جامعة حائل.';
let sttLogprobs = process.env.STT_LOGPROBS !== '0' && /gpt-4o/.test(STT_MODEL);
async function sttCall(audio, type, ext, withLogprobs) {
  const form = new FormData();
  form.append('file', new Blob([audio], { type }), `speech.${ext}`);
  form.append('model', STT_MODEL);
  form.append('language', 'ar');
  form.append('temperature', '0');
  form.append('prompt', STT_PROMPT);
  form.append('response_format', 'json');
  if (withLogprobs) form.append('include[]', 'logprobs');
  return fetch(`${OPENAI_BASE}/audio/transcriptions`, { method: 'POST', headers: { Authorization: `Bearer ${API_KEY}` }, body: form, signal: withTimeout(30_000) });
}
async function handleSTT(req, res) {
  if (needKey(res)) return;
  const audio = await readBody(req, 3 * 1024 * 1024);   // 25 ثانية صوت لا تتجاوز مئات الكيلوبايت
  if (audio.length < 1000) return sendJSON(res, 400, { error: 'audio too short' });
  warmTts();                                             // الجواب سيحتاج صوتاً بعد ثانية أو ثانيتين: الاتصال يُجهَّز الآن
  const type = (req.headers['content-type'] || 'audio/webm').split(';')[0];
  const ext = type.includes('mp4') ? 'mp4' : type.includes('ogg') ? 'ogg' : type.includes('wav') ? 'wav' : type.includes('mpeg') ? 'mp3' : 'webm';
  const t0 = Date.now();
  let r = await sttCall(audio, type, ext, sttLogprobs), data = null;
  if (!r.ok && sttLogprobs && (r.status === 400 || r.status === 422)) {
    const why = await r.text().catch(() => '');
    // يُطفأ الخيار فقط إن كان الرفض بسببه هو (لا بسبب ملف صوت تالف مثلاً)، ثم يُعاد الطلب بدونه
    if (/include|logprob/i.test(why)) { console.log('STT logprobs rejected, continuing without:', why.slice(0, 160).replace(/\s+/g, ' ')); sttLogprobs = false; r = await sttCall(audio, type, ext, false); }
    else { try { data = JSON.parse(why); } catch { data = {}; } }
  }
  if (!data) data = await r.json().catch(() => ({}));
  if (!r.ok) return sendJSON(res, 502, { error: data.error?.message || 'STT error' });
  const out = { text: (data.text || '').trim(), ms: Date.now() - t0 };
  const lp = Array.isArray(data.logprobs) ? data.logprobs.map((x) => Number(x && x.logprob)).filter((x) => Number.isFinite(x)) : [];
  if (lp.length) out.conf = { avg: +(lp.reduce((a, b) => a + b, 0) / lp.length).toFixed(3), low: +(lp.filter((x) => x < -2.3).length / lp.length).toFixed(3), n: lp.length };
  res.setHeader('Server-Timing', `stt;dur=${out.ms}`);
  sendJSON(res, 200, out);
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
/* الوجه الحي للجوالات (اختياري): SIMLI_PHONES=1. كل جوال يفتح جلسة تُحسب دقائقها، وعدد الجلسات المتزامنة محدود بخطتك في Simli
   (Hobby جلستان، Pro عشر، Scale خمسون). من يزيد على الحد يرى صورة نزيه وصوته تلقائياً. جلسة الجوال تُقفل أسرع من الشاشة لتوفير الدقائق. */
const SIMLI_PHONES = /^(1|true|yes)$/i.test(process.env.SIMLI_PHONES || '') && !!SIMLI_KEY && !!SIMLI_FACE;
const SIMLI_PHONE_IDLE = Number(process.env.SIMLI_PHONE_IDLE_SECONDS || 40);
const SIMLI_PHONE_MAX = Number(process.env.SIMLI_PHONE_MAX_SECONDS || 300);
async function handleSimliToken(req, res) {
  if (!SIMLI_KEY || !SIMLI_FACE) return sendJSON(res, 503, { error: 'Simli غير مضبوط: أضف SIMLI_API_KEY و SIMLI_FACE_ID في Environment' });
  const body = JSON.parse((await readBody(req, 2000)).toString('utf8') || '{}');
  const isScreen = body.screen === true;
  if (!isScreen && !SIMLI_PHONES) return sendJSON(res, 403, { error: 'الوجه الحي للشاشة الرئيسية فقط' });
  if (isScreen && SIMLI_CODE && body.code !== SIMLI_CODE) return sendJSON(res, 403, { error: 'رمز الشاشة غير صحيح' });
  const portrait = body.portrait === true;
  const r = await fetch(`${SIMLI_BASE}/compose/token`, {
    method: 'POST',
    headers: { 'x-simli-api-key': SIMLI_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      faceId: SIMLI_FACE, handleSilence: true, maxSessionLength: isScreen ? SIMLI_MAX : SIMLI_PHONE_MAX, maxIdleTime: isScreen ? SIMLI_IDLE : SIMLI_PHONE_IDLE,
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

// ---------- LemonSlice: وجه حي بديل للشاشة الرئيسية (الوضع ‎/?avatar=lemon‎) ----------
/* LemonSlice يحرّك الوجه فقط على صوت نزيه: لا يسمع ولا يجاوب ولا يولّد صوتاً. العقل والصوت العربي كما هما.
   الطريقة الموثقة عندهم (websocket-livekit): الخادم يفتح جلسة بمفتاح LemonSlice، والمتصفح يرسل صوت نزيه إلى LemonSlice عبر WebSocket،
   وLemonSlice ينشر فيديو الوجه في «غرفة» على LiveKit Cloud، والشاشة تدخل الغرفة لتعرضه. لذلك يلزم حساب LiveKit أيضاً.
   المتغيرات (في Render فقط، لا في الكود):
     LEMONSLICE_API_KEY   مفتاح LemonSlice (سري)
     LEMONSLICE_AGENT_ID  رقم الأفتار (الافتراضي agent_b36d37772d5d847d)
     LIVEKIT_URL          عنوان مشروع LiveKit، مثل wss://xxxx.livekit.cloud
     LIVEKIT_API_KEY و LIVEKIT_API_SECRET   من إعدادات مشروع LiveKit (السر سري)
     LEMON_IDLE_SECONDS   (اختياري) تُقفل الجلسة بعد هذا السكوت، الافتراضي 120
   رمز الشاشة: LEMON_CODE إن وُضع، وإلا SIMLI_CODE (نفس رابط ‎&code=‎). */
const LEMON_KEY = process.env.LEMONSLICE_API_KEY || '';
const LEMON_AGENT = process.env.LEMONSLICE_AGENT_ID || 'agent_b36d37772d5d847d';
const LEMON_BASE = process.env.LEMONSLICE_BASE || 'https://lemonslice.com';
const LEMON_IDLE = Number(process.env.LEMON_IDLE_SECONDS || 90);       // v35: 90 (كان 120). LemonSlice يحسب الدقائق من فتح الجلسة إلى إقفالها، والسكوت يُحسب كالكلام
const LEMON_CODE = process.env.LEMON_CODE || SIMLI_CODE;
const LK_URL = (process.env.LIVEKIT_URL || '').trim(), LK_KEY = process.env.LIVEKIT_API_KEY || '', LK_SECRET = process.env.LIVEKIT_API_SECRET || '';
const LEMON_READY = !!(LEMON_KEY && LK_URL && LK_KEY && LK_SECRET);
/* تذكرة دخول غرفة LiveKit (JWT موقّع بسر المشروع) بدون أي مكتبة. الصلاحيات تُكتب كلها صراحة: ما يُترك يُمنح افتراضياً */
const b64url = (x) => Buffer.from(x).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
function livekitToken(identity, room, publish, ttl = 7200) {
  const now = Math.floor(Date.now() / 1000);
  const head = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64url(JSON.stringify({ iss: LK_KEY, sub: identity, nbf: now - 10, exp: now + ttl,
    video: { room, roomJoin: true, canPublish: publish, canPublishData: publish, canSubscribe: true, roomCreate: false, roomAdmin: false, roomList: false, roomRecord: false } }));
  const sig = crypto.createHmac('sha256', LK_SECRET).update(`${head}.${body}`).digest('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
  return `${head}.${body}.${sig}`;
}
/* مهلة نهاية الكلام عند LemonSlice: إن انقطع تدفق الصوت هذه المدة يَعتبر الجواب انتهى. كانت 2 ثانية فكانت أي سكتة بين جملتين
   (العقل ما زال يكتب، أو الصوت يتأخر) تُنهي الكلام عند الوجه ثم يبدأ من جديد (تقطّع). الآن 5 ثوانٍ احتياطاً فقط،
   ونهاية الجواب تُعلَن صراحة بـ audio_end حين يخلص نزيه. */
const LEMON_DONE_S = Number(process.env.LEMON_RESPONSE_DONE_SECONDS || 5);
/* simulcast: LemonSlice يرسل الفيديو بأكثر من جودة، فإن ضعفت شبكة الشاشة تأخذ الأخف بدل أن يتقطع (توصية LemonSlice للشبكات غير المستقرة).
   للإيقاف: LEMON_SIMULCAST=0 */
const LEMON_SIMULCAST = process.env.LEMON_SIMULCAST !== '0';
function lemonCreateBody(room) {
  return { transport_type: 'websocket-livekit', agent_id: LEMON_AGENT, audio_sample_rate: 16000, idle_timeout: LEMON_IDLE, response_done_timeout: LEMON_DONE_S,
    livekit_properties: { livekit_url: LK_URL, livekit_token: livekitToken('lemonslice-avatar', room, true), ...(LEMON_SIMULCAST ? { video_codec: 'vp8', simulcast: true } : {}) } };
}
async function lemonCreate(room) {
  const r = await fetch(`${LEMON_BASE}/api/liveai/sessions`, {
    method: 'POST', headers: { 'X-API-Key': LEMON_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(lemonCreateBody(room)), signal: withTimeout(25_000),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok || !data.websocket_address) {
    const why = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail || data.error || data).slice(0, 300);
    console.warn('LemonSlice session:', r.status, why);
    throw new Error(why || `LemonSlice ${r.status}`);
  }
  return data;
}
async function lemonTerminateById(id) {                    // احتياط: جلسة فُتحت والشاشة انصرفت قبل أن تستلمها
  if (!id) return;
  try { await fetch(`${LEMON_BASE}/api/liveai/sessions/${encodeURIComponent(id)}/control`, { method: 'POST', headers: { 'X-API-Key': LEMON_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ event: 'terminate' }), signal: withTimeout(10_000) }); } catch {}
}

/* ---------- v35: الخادم يرسل صوت نزيه إلى LemonSlice بنفسه ----------
   قبل: الخادم (في أمريكا) يرسل الصوت إلى المتصفح (في السعودية)، والمتصفح يعيد رفعه إلى LemonSlice (في أمريكا).
   كل مقطع يعبر الإنترنت مرتين ذهاباً وإياباً، وأي بطء في شبكة الشاشة يؤخر الكلام أو يقطّعه.
   الآن: الخادم يفتح قناة LemonSlice بنفسه ويرسل الصوت مباشرة من مزوّد الصوت إلى الوجه، والمتصفح يرسل نص الجملة فقط
   ويشاهد الفيديو من LiveKit. قناة LemonSlice لا تصل للمتصفح أصلاً. للرجوع للطريقة القديمة: LEMON_RELAY=0 */
const LEMON_RELAY = process.env.LEMON_RELAY !== '0';
const LEMON_MAX = Number(process.env.LEMON_MAX_SESSIONS || 4);
const LEMON_CHUNK = 3200;                                 // 0.1 ثانية من PCM16 بتردد 16 كيلوهرتز (المستحسن عندهم 80–100 ملّي ثانية)
const lemonSessions = new Map();
/* عميل WebSocket: المدمج في Node 22 فأحدث، وإلا عميل صغير مكتوب هنا (RFC 6455) حتى يعمل على أي إصدار بلا مكتبات */
function wsOpen(url, timeoutMs = 10_000) {
  const api = { onmessage: null, onclose: null, open: false, send() {}, close() {} };
  if (typeof WebSocket === 'function' && process.env.WS_MINIMAL !== '1') {
    return new Promise((resolve, reject) => {
      let done = false; const ws = new WebSocket(url);
      const t = setTimeout(() => { if (!done) { done = true; try { ws.close(); } catch {} reject(new Error('انتهت مهلة قناة LemonSlice')); } }, timeoutMs);
      api.send = (s) => { if (ws.readyState === 1) ws.send(s); };
      api.close = () => { try { ws.close(); } catch {} };
      ws.addEventListener('open', () => { if (done) return; done = true; clearTimeout(t); api.open = true; resolve(api); });
      ws.addEventListener('message', (e) => { try { api.onmessage?.(typeof e.data === 'string' ? e.data : Buffer.from(e.data).toString('utf8')); } catch {} });
      ws.addEventListener('close', (e) => { const was = api.open; api.open = false; if (!done) { done = true; clearTimeout(t); reject(new Error(`أُغلقت قناة LemonSlice (${e.code})`)); } else if (was) api.onclose?.(e.code); });
      ws.addEventListener('error', () => { if (!done) { done = true; clearTimeout(t); reject(new Error('تعذّر فتح قناة LemonSlice')); } });
    });
  }
  return new Promise((resolve, reject) => {
    const u = new URL(url), key = crypto.randomBytes(16).toString('base64'), secure = u.protocol === 'wss:';
    const req = require(secure ? 'https' : 'http').request({ host: u.hostname, port: u.port || (secure ? 443 : 80), path: (u.pathname || '/') + u.search, method: 'GET',
      headers: { Connection: 'Upgrade', Upgrade: 'websocket', 'Sec-WebSocket-Version': '13', 'Sec-WebSocket-Key': key, 'User-Agent': 'nazih-kiosk' } });
    const t = setTimeout(() => req.destroy(new Error('انتهت مهلة قناة LemonSlice')), timeoutMs);
    req.on('upgrade', (resp, sock, head) => {
      clearTimeout(t);
      if (resp.headers['sec-websocket-accept'] !== crypto.createHash('sha1').update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64')) { sock.destroy(); return reject(new Error('رد غير صحيح من قناة LemonSlice')); }
      sock.setNoDelay(true);
      const frame = (op, payload) => {
        const n = payload.length, mask = crypto.randomBytes(4); let h;
        if (n < 126) { h = Buffer.alloc(2); h[1] = 0x80 | n; } else if (n < 65536) { h = Buffer.alloc(4); h[1] = 0x80 | 126; h.writeUInt16BE(n, 2); } else { h = Buffer.alloc(10); h[1] = 0x80 | 127; h.writeBigUInt64BE(BigInt(n), 2); }
        h[0] = 0x80 | op; const body = Buffer.allocUnsafe(n); for (let i = 0; i < n; i++) body[i] = payload[i] ^ mask[i & 3];
        return Buffer.concat([h, mask, body]);
      };
      let buf = head && head.length ? Buffer.from(head) : Buffer.alloc(0), frags = [], closedOnce = false;
      const finish = (code) => { if (closedOnce) return; closedOnce = true; const was = api.open; api.open = false; if (was) api.onclose?.(code); };
      api.send = (s) => { if (api.open) { try { sock.write(frame(1, Buffer.from(s, 'utf8'))); } catch {} } };
      api.close = () => { if (!api.open) return; try { sock.write(frame(8, Buffer.alloc(0))); } catch {} api.open = false; setTimeout(() => sock.destroy(), 500); };
      const parse = () => {
        for (;;) {
          if (buf.length < 2) return;
          const b0 = buf[0], b1 = buf[1]; let n = b1 & 0x7f, off = 2;
          if (n === 126) { if (buf.length < 4) return; n = buf.readUInt16BE(2); off = 4; } else if (n === 127) { if (buf.length < 10) return; n = Number(buf.readBigUInt64BE(2)); off = 10; }
          const masked = (b1 & 0x80) !== 0; if (masked) off += 4;
          if (buf.length < off + n) return;
          let p = buf.subarray(off, off + n);
          if (masked) { const mk = buf.subarray(off - 4, off), q = Buffer.allocUnsafe(n); for (let i = 0; i < n; i++) q[i] = p[i] ^ mk[i & 3]; p = q; }
          buf = buf.subarray(off + n);
          const op = b0 & 0x0f, fin = (b0 & 0x80) !== 0;
          if (op === 8) { try { sock.write(frame(8, Buffer.alloc(0))); } catch {} sock.end(); finish(n >= 2 ? p.readUInt16BE(0) : 1005); return; }
          if (op === 9) { try { sock.write(frame(10, p)); } catch {} continue; }
          if (op === 10) continue;
          frags.push(Buffer.from(p));
          if (fin) { const msg = Buffer.concat(frags).toString('utf8'); frags = []; try { api.onmessage?.(msg); } catch {} }
        }
      };
      sock.on('data', (d) => { buf = buf.length ? Buffer.concat([buf, d]) : d; parse(); });
      sock.on('close', () => finish(1006));
      sock.on('error', () => {});
      api.open = true; resolve(api); parse();
    });
    req.on('response', (resp) => { clearTimeout(t); resp.resume(); reject(new Error(`قناة LemonSlice رفضت الاتصال (${resp.statusCode})`)); });
    req.on('error', (e) => { clearTimeout(t); reject(e); });
    req.end();
  });
}
function lemonSend(s, obj) { if (s.closed || !s.ws || !s.ws.open) return false; try { s.ws.send(JSON.stringify(obj)); return true; } catch { return false; } }
function lemonWake(s, msg) { const w = [...s.waiters]; s.waiters.clear(); w.forEach((f) => f(msg)); }
function lemonClose(s, why) {
  if (s.closed) return;
  s.closed = true; lemonSessions.delete(s.key); clearInterval(s.beat);
  if (s.job) { s.job.aborted = true; s.job.ac.abort(); }
  try { if (s.ws?.open) s.ws.send(JSON.stringify({ command: 'terminate' })); } catch {}
  setTimeout(() => { try { s.ws?.close(); } catch {} }, 300);
  lemonWake(s, { closed: true });
  console.log(`LemonSlice: أُقفلت الجلسة ${s.id} (${why}) بعد ${Math.round((Date.now() - s.created) / 1000)} ثانية، صوت ${Math.round(s.sentBytes / 32000)} ثانية`);
}
function lemonAdopt(data, ws, room) {
  const s = { key: crypto.randomBytes(18).toString('base64url'), id: data.session_id || '', room, ws, created: Date.now(), lastUse: Date.now(), closed: false,
    chain: Promise.resolve(), gen: 0, turn: 0, job: null, waiters: new Set(), turnStart: 0, turnBytes: 0, lastAudio: 0, lastFinished: 0, endSent: 0, sentBytes: 0, beat: null };
  ws.onmessage = (txt) => {
    let m = null; try { m = JSON.parse(txt); } catch { return; }
    // «انتهى بعد مقاطعة» لا يوقظ من ينتظر نهاية الجواب الجديد (المقاطعة نفسها توقظه)، حتى لا يُعلَن «سكت» والجواب الجديد ما زال يُنطق
    if (m?.command === 'playback_finished') { s.lastFinished = Date.now(); if (!m.interrupted) lemonWake(s, { finished: true, pos: m.playback_position }); }
  };
  ws.onclose = (code) => lemonClose(s, `أغلقها LemonSlice ${code}`);
  s.beat = setInterval(() => lemonSend(s, { command: 'heartbeat', timestamp: Date.now() }), 15_000);
  s.beat.unref?.();
  lemonSessions.set(s.key, s);
  return s;
}
setInterval(() => {                                         // جلسة انصرفت عنها الشاشة (أُغلق الجهاز أو انقطع) تُقفل حتى لا تُحسب دقائقها
  const now = Date.now();
  for (const s of lemonSessions.values()) if (now - s.lastUse > (LEMON_IDLE + 30) * 1000) lemonClose(s, 'لا استخدام');
}, 20_000).unref();
/* مقاطعة بدور (turn): كل مقاطعة من الشاشة ترفع رقم الدور. أول جملة من الجواب الجديد تحمل الرقم الجديد فتطبّق المقاطعة بنفسها قبل أن تُرسل،
   فلا يهم أيهما يصل للخادم أولاً (طلب المقاطعة أم الجملة). كان طلب المقاطعة المتأخر يقطع أول جملة من الجواب الجديد أو يُسقطها. */
function lemonInterrupt(s, t) {
  if (t) s.turn = t;
  s.gen++; if (s.job) { s.job.aborted = true; s.job.ac.abort(); }
  lemonSend(s, { command: 'interrupt' }); s.turnStart = 0; s.turnBytes = 0;
  lemonWake(s, { finished: true, interrupted: true });
}

async function handleLemonToken(req, res) {
  if (!LEMON_READY) return sendJSON(res, 503, { error: 'LemonSlice غير مضبوط: أضف LEMONSLICE_API_KEY و LIVEKIT_URL و LIVEKIT_API_KEY و LIVEKIT_API_SECRET في Environment' });
  const body = JSON.parse((await readBody(req, 2000)).toString('utf8') || '{}');
  if (LEMON_CODE && body.code !== LEMON_CODE) return sendJSON(res, 403, { error: 'رمز الشاشة غير صحيح' });
  const room = 'nazih-' + crypto.randomBytes(6).toString('hex');
  const viewer = livekitToken('screen-' + crypto.randomBytes(4).toString('hex'), room, false);
  if (body.v !== 2) {                                       // صفحة قديمة ما زالت مفتوحة (قبل v35): الطريقة القديمة كما هي
    let data; try { data = await lemonCreate(room); } catch (e) { return sendJSON(res, 502, { error: e.message }); }
    console.log(`LemonSlice: جلسة جديدة ${data.session_id || ''} في الغرفة ${room} (صفحة قديمة)`);
    return sendJSON(res, 200, { ws: data.websocket_address, url: LK_URL, token: viewer, session: data.session_id || '' });
  }
  /* v35: الرد على سطرين. الأول فوراً (عنوان LiveKit وتذكرة المشاهدة) فتبدأ الشاشة دخول الغرفة الآن، بالتوازي مع فتح الجلسة عند LemonSlice،
     والثاني حين تجهز الجلسة. كانت الخطوات تتتابع واحدة بعد الأخرى. */
  // الحد الأعلى للجلسات: تُقفل جلسة خاملة (أكثر من دقيقة بلا استخدام) لتفسح، ولا تُقفل جلسة الشاشة وهي تتحاور
  if (LEMON_RELAY && lemonSessions.size >= LEMON_MAX) {
    const old = [...lemonSessions.values()].filter((x) => Date.now() - x.lastUse > 60_000).sort((a, b) => a.lastUse - b.lastUse)[0];
    if (old) lemonClose(old, 'جلسة أحدث'); else return sendJSON(res, 503, { error: 'جلسات الوجه الحي مشغولة الآن' });
  }
  res.writeHead(200, { 'Content-Type': 'application/x-ndjson; charset=utf-8', 'Cache-Control': 'no-store, no-transform', 'X-Accel-Buffering': 'no' });
  res.write(JSON.stringify({ url: LK_URL, token: viewer, room }) + '\n');
  let gone = false; res.on('close', () => { if (!res.writableEnded) gone = true; });
  const t0 = Date.now(); let data = null;
  try {
    data = await lemonCreate(room);
    const tCreate = Date.now() - t0;
    if (!LEMON_RELAY) {
      if (gone || res.destroyed) { lemonTerminateById(data.session_id); return; }       // انصرفت الشاشة قبل أن تجهز: لا تبقى الجلسة تُحسب
      res.end(JSON.stringify({ ws: data.websocket_address, session: data.session_id || '', ms: { create: tCreate } }) + '\n'); return;
    }
    const ws = await wsOpen(data.websocket_address, 10_000);
    const s = lemonAdopt(data, ws, room);
    const tWs = Date.now() - t0 - tCreate;
    console.log(`LemonSlice: جلسة جديدة ${s.id} في الغرفة ${room} (فتح الجلسة ${tCreate} ملّي ثانية، القناة ${tWs})`);
    if (gone || res.destroyed) { lemonClose(s, 'انصرفت الشاشة قبل أن تجهز'); return; }
    res.end(JSON.stringify({ key: s.key, session: s.id, relay: true, ms: { create: tCreate, ws: tWs } }) + '\n');
  } catch (e) {
    if (data?.session_id) lemonTerminateById(data.session_id);
    console.warn('LemonSlice connect:', e.message);
    if (!res.destroyed) res.end(JSON.stringify({ error: String(e.message || e).slice(0, 300) }) + '\n');
  }
}
/* جملة من نزيه: الخادم يولّد صوتها (أو يأخذه من الذاكرة) ويرسله إلى LemonSlice أول بأول، ويخبر الشاشة بسطرين:
   first (بدأ الصوت يصل للوجه) و done (أُرسل المقطع كله، ومدته). الجمل تُرسل بالترتيب، وLemonSlice يصفّها خلف بعضها بلا سكتة. */
async function handleLemonSay(req, res) {
  const body = JSON.parse((await readBody(req, 10_000)).toString('utf8') || '{}');
  const s = lemonSessions.get(String(body.key || ''));
  if (!s || s.closed) return sendJSON(res, 410, { error: 'انتهت جلسة الوجه' });
  const text0 = String(body.text || '').trim().slice(0, 1500);
  if (!text0) return sendJSON(res, 400, { error: 'no text' });
  if (needKey(res)) return;
  s.lastUse = Date.now();
  const t = Number(body.turn) || 0;
  if (t && t < s.turn) return sendJSON(res, 200, { e: 'done', bytes: 0, dropped: true, stale: true });   // جملة من جواب قوطع
  if (t > s.turn) lemonInterrupt(s, t);                      // أول جملة بعد مقاطعة: تطبّقها هي (انظر lemonInterrupt)
  const myGen = s.gen, prev = s.chain; let release = null;
  s.chain = new Promise((r) => { release = r; });
  const job = { aborted: false, ac: new AbortController() };
  res.on('close', () => { if (!res.writableEnded) { job.aborted = true; job.ac.abort(); } });
  res.writeHead(200, { 'Content-Type': 'application/x-ndjson; charset=utf-8', 'Cache-Control': 'no-store, no-transform', 'X-Accel-Buffering': 'no' });
  const tIn = Date.now();
  try { await prev; } catch {}
  let total = 0, first = 0;
  try {
    if (job.aborted || s.closed || s.gen !== myGen) { res.end(JSON.stringify({ e: 'done', bytes: 0, dropped: true }) + '\n'); return; }
    s.job = job;
    const t0 = Date.now(), info = {};
    let carry = Buffer.alloc(0);
    const sendChunk = (c) => {
      if (!lemonSend(s, { command: 'audio', audio: c.toString('base64'), sampleRate: 16000, encoding: 'PCM16' })) throw new Error('انقطعت قناة LemonSlice');
      if (!first) { first = Date.now(); if (!s.turnStart) { s.turnStart = first; s.turnBytes = 0; } res.write(JSON.stringify({ e: 'first', ms: first - t0, wait: t0 - tIn, cache: info.cache, tts: info.provider }) + '\n'); }
      total += c.length; s.turnBytes += c.length; s.sentBytes += c.length; s.lastAudio = Date.now();
    };
    for await (const part of pcmChunks(SCREEN_PROVIDER, text0, job.ac.signal, info)) {
      if (job.aborted || s.closed || s.gen !== myGen) break;
      const data = carry.length ? Buffer.concat([carry, part]) : part;
      let i = 0; for (; i + LEMON_CHUNK <= data.length; i += LEMON_CHUNK) sendChunk(data.subarray(i, i + LEMON_CHUNK));
      carry = Buffer.from(data.subarray(i));
    }
    if (!job.aborted && !s.closed && s.gen === myGen && carry.length >= 2) sendChunk(carry.subarray(0, carry.length - (carry.length % 2)));
    s.lastUse = Date.now();
    if (!res.destroyed) res.end(JSON.stringify({ e: 'done', bytes: total, ms: Date.now() - t0, aborted: job.aborted || s.gen !== myGen }) + '\n');
  } catch (e) {
    console.warn('lemon-say:', e.message);
    if (!res.destroyed) res.end(JSON.stringify({ e: 'error', error: String(e.message || e).slice(0, 200), bytes: total }) + '\n');
  } finally { if (s.job === job) s.job = null; release(); }
}
/* أوامر الجلسة: interrupt (الزائر قاطع: يسكت فوراً ويُلغى ما في الطابور)، end (انتهى الجواب: audio_end ثم انتظار انتهاء النطق فعلاً)،
   terminate (إقفال الجلسة)، keep (الشاشة ما زالت هنا) */
async function handleLemonCtl(req, res) {
  const body = JSON.parse((await readBody(req, 2000)).toString('utf8') || '{}');
  const s = lemonSessions.get(String(body.key || ''));
  if (!s || s.closed) return sendJSON(res, 410, { error: 'انتهت جلسة الوجه' });
  s.lastUse = Date.now();
  const cmd = String(body.cmd || ''), t = Number(body.turn) || 0;
  if (cmd === 'interrupt') {
    if (t && t <= s.turn) return sendJSON(res, 200, { ok: true, stale: true });      // الجملة الجديدة سبقته وطبّقت المقاطعة بنفسها
    lemonInterrupt(s, t || s.turn + 1);
    return sendJSON(res, 200, { ok: true });
  }
  if (cmd === 'terminate') { lemonClose(s, 'طلب الشاشة'); return sendJSON(res, 200, { ok: true }); }
  if (cmd === 'keep') return sendJSON(res, 200, { ok: true });
  if (cmd === 'end') {
    if (t && t < s.turn) return sendJSON(res, 200, { finished: true, stale: true });
    try { await s.chain; } catch {}                          // ينتظر آخر جملة في الطابور حتى تُرسل كلها
    if (s.closed) return sendJSON(res, 410, { error: 'انتهت جلسة الوجه' });
    if (!s.turnStart) return sendJSON(res, 200, { finished: true, empty: true });
    const est = s.turnStart + (s.turnBytes / 32000) * 1000, t0 = Date.now();
    s.endSent = t0; s.turnStart = 0; s.turnBytes = 0;
    lemonSend(s, { command: 'audio_end' });
    /* تنتهي بإشارة LemonSlice أنه خلص النطق، أو احتياطاً بعد مدة الصوت المتبقية + 4 ثوانٍ. إشارة «انتهى» قبل الموعد المتوقع بأكثر من ثانية
       تخص جواباً سابقاً (LemonSlice ينهي الجواب إن انقطع الصوت 5 ثوانٍ) فلا يُعتد بها، حتى لا يُفتح المايك ونزيه ما زال يتكلم */
    const deadline = t0 + Math.min(10 * 60_000, Math.max(1500, est - t0 + 4000));
    let out = null;
    while (!out) {
      const left = deadline - Date.now();
      if (left <= 0) { out = { finished: true, estimated: true }; break; }
      let timer = null, wake = null;
      const msg = await new Promise((r) => { wake = r; s.waiters.add(r); timer = setTimeout(() => r(null), left); });
      clearTimeout(timer); s.waiters.delete(wake);
      if (!msg) out = { finished: true, estimated: true };
      else if (msg.closed || msg.interrupted || Date.now() >= est - 1000) out = msg;
    }
    s.lastUse = Date.now();
    if (out.closed) return sendJSON(res, 410, { error: 'انتهت جلسة الوجه' });
    return sendJSON(res, 200, { ...out, waited: Date.now() - t0 });
  }
  return sendJSON(res, 400, { error: 'unknown cmd' });
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
const newDay = () => ({ sessions: 0, screen: 0, phone: 0, qr: 0, newDevs: 0, q: 0, src: {}, kind: {}, bank: {}, act: {}, hours: new Array(24).fill(0), rate: [0, 0, 0, 0, 0], quizN: 0, quizSum: 0, quizMax: 0, quizDist: {}, scn: {}, cert: 0, qp: 0 });
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
    case 'cert': d.cert = (d.cert || 0) + 1; break;
    case 'qp': d.qp = (d.qp || 0) + 1; break;                    // جولة في صفحة «تحدي النزاهة» (‎/quiz‎)
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
/* v35: عند إيقاف الخادم (كل نشر جديد على Render) تُقفل جلسات الوجه الحي التي يمسكها الخادم، فلا تبقى تُحسب حتى مهلة السكوت عند LemonSlice */
['SIGTERM', 'SIGINT'].forEach((sig) => process.on(sig, () => {
  saveStats(true);
  const live = [...lemonSessions.values()];
  for (const s of live) { lemonClose(s, 'إيقاف الخادم'); lemonTerminateById(s.id); }
  setTimeout(() => process.exit(0), live.length ? 1500 : 0);
}));
/* أرقام اليوم لشاشات العرض (أعداد عامة فقط، بدون رمز دخول) */
function handleLive(req, res) {
  const d = statDay();
  const perfect = Object.entries(d.quizDist || {}).reduce((a, [k, n]) => { const [sc, m] = k.split('/').map(Number); return a + (sc === m ? n : 0); }, 0);
  sendJSON(res, 200, { sessions: d.sessions, q: d.q, quizN: d.quizN, quizAvg: d.quizMax ? Math.round((d.quizSum / d.quizMax) * 100) : 0, perfect, rounds: d.qp || 0 });
}
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
      if (req.url.startsWith('/api/live')) return handleLive(req, res);
      if (req.url.startsWith('/api/stats')) return await handleStats(req, res);
      if (req.url.startsWith('/api/chat')) return await handleChat(req, res);
      if (req.url.startsWith('/api/tts-pcm')) return await handleTTSPcm(req, res);
      if (req.url.startsWith('/api/tts')) return await handleTTS(req, res);
      if (req.url.startsWith('/api/stt')) return await handleSTT(req, res);
      if (req.url.startsWith('/api/simli-token')) return await handleSimliToken(req, res);
      if (req.url.startsWith('/api/lemon-token')) return await handleLemonToken(req, res);
      if (req.url.startsWith('/api/lemon-say')) return await handleLemonSay(req, res);
      if (req.url.startsWith('/api/lemon-ctl')) return await handleLemonCtl(req, res);
      return sendJSON(res, 404, { error: 'not found' });
    }
    if (/^\/stats\/?(\?.*)?$/.test(req.url)) req.url = '/stats.html';      // لوحة الإحصائيات: ‎/stats‎
    // روابط قصيرة: ‎/quiz‎ صفحة التحدي للجوال، ‎/screen2‎ شاشة «جرّب نزيه من جوالك»، ‎/screen3‎ شاشة «تحدي النزاهة»
    { const m = req.url.match(/^\/(quiz|screen2|screen3)\/?(\?.*)?$/);
      if (m) req.url = m[1] === 'quiz' ? '/quiz.html' + (m[2] || '') : '/screen.html?show=' + (m[1] === 'screen3' ? 'quiz' : 'site'); }
    // v35: عنوان مشروع LiveKit (ليس سراً) حتى تسخّن الشاشة الاتصال به من فتح الصفحة دون فتح جلسة
    if (/^\/js\/runtime\.js(\?.*)?$/.test(req.url)) { res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8', 'Cache-Control': 'no-cache' }); return res.end(`window.NAZIH_PHONE_SIMLI=${SIMLI_PHONES};${LEMON_READY ? `window.NAZIH_LK_URL=${JSON.stringify(LK_URL)};` : ''}`); }
    serveStatic(req, res);
  } catch (e) {
    const timeout = e?.name === 'TimeoutError' || e?.name === 'AbortError';
    if (!timeout) console.error(e);
    if (!res.headersSent && !res.destroyed) sendJSON(res, timeout ? 504 : 500, { error: timeout ? 'تأخر الرد، حاول مرة ثانية' : 'خطأ في الخادم' });
  }
}).listen(PORT, () => {
  console.log(`✅ نزيه يعمل على: http://localhost:${PORT}`);
  if (SIMLI_PHONES) console.log(`✅ الوجه الحي مفعّل للجوالات أيضاً (تُقفل الجلسة بعد ${SIMLI_PHONE_IDLE} ثانية سكوت، وأقصاها ${SIMLI_PHONE_MAX} ثانية)`);
  console.log(SIMLI_KEY && SIMLI_FACE ? '✅ Simli مضبوط (الوجه الحي للشاشة: /?avatar=simli)' : `ℹ️  Simli غير مفعّل${SIMLI_KEY ? ' — ينقص SIMLI_FACE_ID' : ''}`);
  console.log(LEMON_READY ? `✅ LemonSlice مضبوط (الوجه الحي للشاشة: /?avatar=lemon، الأفتار ${LEMON_AGENT}، الصوت ${LEMON_RELAY ? 'من الخادم مباشرة' : 'عبر المتصفح'}، Node ${process.version}${typeof WebSocket === 'function' ? '' : '، عميل WebSocket الداخلي'})` : `ℹ️  LemonSlice غير مفعّل${LEMON_KEY || LK_URL ? ' — ينقص: ' + [!LEMON_KEY && 'LEMONSLICE_API_KEY', !LK_URL && 'LIVEKIT_URL', !LK_KEY && 'LIVEKIT_API_KEY', !LK_SECRET && 'LIVEKIT_API_SECRET'].filter(Boolean).join('، ') : ''}`);
  // v35: الملفات الكبيرة تُضغط مسبقاً عند التشغيل، فلا ينتظر أول زائر بعد كل نشر ضغطها (الخادم المجاني بطيء المعالجة)
  for (const f of ['index.html', 'js/app.js', 'js/law-data.js', 'css/style.css']) {
    const fp = path.join(PUBLIC_DIR, f);
    fs.stat(fp, (err, st) => { if (err) return; fs.readFile(fp, (e, raw) => { if (e) return; zlib.gzip(raw, { level: 9 }, (e2, buf) => { if (!e2) GZ_CACHE.set(fp, { etag: `"${st.size.toString(16)}-${Math.floor(st.mtimeMs).toString(16)}"`, buf }); }); }); });
  }
  console.log(`🔊 الصوت: ${TTS_PROVIDER}${TTS_PROVIDER === 'azure' ? ` (${AZ_VOICE} @ ${AZ_REGION})` : TTS_PROVIDER === 'elevenlabs' ? ` (${EL_VOICE}, ${EL_MODEL})` : ` (${TTS_VOICE})`}`);
  if (SCREEN_PROVIDER !== TTS_PROVIDER) console.log(`🔊 صوت الشاشة الرئيسية: ${SCREEN_PROVIDER}${SCREEN_PROVIDER === 'elevenlabs' ? ` (${EL_VOICE}, ${EL_MODEL})` : ''}`);
  console.log(`🧠 العقل: ${CHAT_PROVIDERS.map((p) => p.model).join(' ← احتياطي: ')}`);
  console.log(STATS_KEY ? `📊 لوحة الإحصائيات: /stats (${process.env.STATS_DIR ? 'حفظ دائم في ' + STATS_FILE : 'حفظ مؤقت: يُمسح عند إعادة النشر، نزّل نسخة من اللوحة'})` : 'ℹ️  لوحة الإحصائيات غير مفعّلة (أضف STATS_KEY)');
  if (!API_KEY) console.log('⚠️  لم يتم ضبط OPENAI_API_KEY — الموقع سيعمل لكن المساعد سيرد بإجابات محلية محدودة فقط.');
});
