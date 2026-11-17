/* =========================================================
 *  نزيه — شاشة واحدة تفاعلية لليوم العالمي لمكافحة الفساد
 *  الإعدادات وبنك الأسئلة في أعلى الملف
 * ========================================================= */
const CONFIG = {
  apiBase: '',                 // اتركه فارغاً إذا كان الموقع والخادم على نفس الدومين
  avatarImage: 'assets/avatar.jpg',
  idleResetSeconds: 120,       // يرجع لشاشة الترحيب بعد دقيقتين بدون تفاعل
  maxRecordSeconds: 25,
  silenceMs: 900,              // يوقف التسجيل تلقائياً بعد هذا الصمت (أقل = رد أسرع، لكن قد يقطع من يتوقف ليفكر)
  handsFree: true,             // true: نزيه يسمع تلقائياً بدون ضغط زر. false: لازم ضغط زر التحدث. (يمكن التبديل من الرابط: ‎?mic=auto‎ أو ‎?mic=button‎)
  autoMinLevel: 0.045,         // أقل مستوى صوت يُعتبر كلاماً في الاستماع التلقائي (ارفعه في الأماكن المزعجة)
  bargeIn: false,              // المقاطعة بالصوت: نزيه يسكت إذا تكلم الزائر أثناء جوابه (تجريبي، فعّله بالرابط ‎?barge=1‎ وجرّبه في مكان الفعالية)
  autoMinSpeechMs: 450,        // أقصر كلام يُقبل (يتجاهل الطقطقة والأصوات القصيرة)
  showWelcome: false,          // true لإظهار رسالة الترحيب عند فتح الموقع وبعد الخمول
  quizLength: 5,               // عدد أسئلة «اختبر نفسك» في كل مرة
  scenarioLength: 4,           // عدد مواقف «وش تسوي لو؟» في كل جولة
  attract: true,               // شاشة الترحيب على الشاشة الرئيسية وقت الخمول (الجوالات لا تتأثر)
  attractEverySeconds: 75,     // نزيه يرحّب بالمارّين كل هذه المدة ما دامت الشاشة فاضية
  attractLines: [              // عبارات الترحيب (تتبدل بالدور). اللهجة حائلية في الترحيب فقط؛ عدّلها بكلامك أنت
    'يا هلا والله ومرحبا. أنا نزيه، وش بغيت تعرف عن النزاهة يا بعد حيي؟',
    'حيّاك الله يا بعد حيي. عندك سؤال عن الرشوة أو البلاغات؟ قرّب واسألني.',
    'يا هلا والله. جرّب معي مواقف وش تسوي لو، وشف كيف تتصرف صح.',
    'حيّاك الله. تبي تختبر معلوماتك في النزاهة؟ قل اختبرني.',
    'يا هلا ومرحبا. إذا الشاشة مشغولة، صوّر الرمز وكمّل معي على جوالك.',
  ],
  stats: true,                 // إرسال أعداد مجهولة (زيارات، أسئلة، تقييم، اختبار) للوحة الإحصائيات
  idleStatus: 'اضغط للتحدث',
  didStatus: 'تحدّث مع نزيه مباشرة من الأعلى، أو اختر سؤالاً',   // نص الحالة عند تشغيل شخصية D-ID
  didWaitSeconds: 12,
  ownBrain: true,              // true: الموقع يسمع ويفهم ويبحث في الأنظمة ويجاوب، وشخصية D-ID تنطق فقط. false: الرجوع لعقل D-ID
  pushToTalk: true,            // المايك مقفل دائماً، ويفتح فقط عند ضغط زر «اضغط للتحدث» (يمنع التقاط كلام من حول الشاشة)
  talkMaxSeconds: 30,          // أقصى مدة لفتح المايك في الضغطة الواحدة          // مدة انتظار تحميل D-ID قبل اعتماد الصورة المتحركة
  waitIncomplete: true,        // إذا توقف الزائر في نص الجملة («وش الفرق بين الرشوة و...») ينتظر نزيه تكملتها بدل أن يجاوب على سؤال ناقص
  fillerAfterMs: 1100,         // بعد هذا الانتظار (ملّي ثانية) دون جواب يقول نزيه عبارة قصيرة. 0 = إيقاف
  fillers: ['أبشر، لحظة.', 'سَمّ، لحظة.', 'أبشر يا بعد حيي.', 'أبشر.'],
  ownMouth: false,             // أفتار الموقع (الجوالات): false = صورة نزيه بحركة رأس ورمش خفيفة والصوت فقط، true = يحرّك الفم أيضاً
  simliSdk: ['https://esm.sh/simli-client', 'https://cdn.jsdelivr.net/npm/simli-client/+esm'],   // مكتبة Simli للمتصفح (تُحمَّل عند الحاجة فقط)
  simliConnectWait: 9,         // أقصى انتظار (ثوانٍ) لاتصال Simli قبل أن يُنطق الجواب بصورة نزيه
  greeting: 'يا هلا والله، حيّاك الله! أنا نزيه. وش بغيت تعرف عن النزاهة ومكافحة الفساد؟ اسألني، أو اختر من الأسئلة، أو قل: اختبرني.',
};

/* إحداثيات الوجه بمقاس صورة الشخصية (2322×768). لو غيّرت الصورة عدّل هذه الأرقام فقط.
   جرّب بعد التعديل: ‎/?test=open‎ (فم مفتوح) و ‎/?test=blink‎ (عين مغمضة) و ‎/?test=1‎ (كلام تجريبي) */
const FACE = {
  mouthX: 1196, mouthY: 563,   // منتصف خط التقاء الشفتين
  mouthHalfW: 70,              // نصف عرض الفم
  jaw: { x0: 1010, x1: 1387, yBottom: 691 },  // حدود الفك والذقن
  maxOpen: 16,                 // أقصى فتحة للفم بالبكسل
  eyes: [{ x: 1103, y: 366, rx: 42, ry: 15 }, { x: 1291, y: 366, rx: 42, ry: 15 }],
  head: { cx: 1196, cy: 395, rx: 406, ry: 395 }, // المنطقة التي تتحرك (الرأس والشماغ فقط)
  pivot: { x: 1196, y: 760 },  // نقطة ارتكاز حركة الرأس (الرقبة)
};

/* أفتار الموقع الخاص: صورة الاستديو كاملة (assets/avatar-own.jpg بمقاس 2322×1306) تملأ الشاشة،
   والموقع نفسه يحرّك الفم والعينين والرأس مع الصوت. لا يحتاج أي خدمة خارجية للشخصية.
   لو غيّرت الصورة: احفظها بنفس المقاس وعدّل هذه الإحداثيات ثم جرّب ‎/?look=open‎ و ‎/?look=blink‎ */
const OWN = document.body.classList.contains('own-avatar');
if (OWN) {
  Object.assign(FACE, {
    mouthX: 1200, mouthY: 612, mouthHalfW: 72,
    jaw: { x0: 1014, x1: 1391, yBottom: 752 },
    maxOpen: 23,
    eyes: [{ x: 1117, y: 411, rx: 45, ry: 13 }, { x: 1295, y: 416, rx: 46, ry: 13 }],
    head: { cx: 1200, cy: 442, rx: 350, ry: 395 },
    pivot: { x: 1200, y: 808 },
  });
  CONFIG.avatarImage = 'assets/avatar-own.jpg';
  const c = document.getElementById('cv'); c.width = 2322; c.height = 1306;
}

/* ---------------- بنك الأسئلة المتحركة ----------------
   q: نص السؤال | a: الجواب الجاهز (يُنطق مباشرة فيكون سريعاً ودقيقاً) | k: كلمات تدل عليه لو كتبه الزائر بصيغته */
const BANK = [
  { id: 'day', icon: 'cal', q: 'لماذا 9 ديسمبر يوم عالمي لمكافحة الفساد؟', k: ['ديسمبر', 'اليوم العالمي', 'المناسبة'],
    a: 'في التاسع من ديسمبر عام ألفين وثلاثة فُتح باب التوقيع على اتفاقية الأمم المتحدة لمكافحة الفساد، ومنذ ذلك الوقت أصبح هذا اليوم مناسبة عالمية للتوعية بخطر الفساد وتأكيد أن مكافحته مسؤولية الجميع. والمملكة دولة طرف في هذه الاتفاقية.' },
  { id: 'role', icon: 'shield', q: 'ما هو دور نزاهة؟', k: ['دور نزاهه', 'اختصاص', 'مهام', 'وش تسوي نزاهه', 'ما هي نزاهه'],
    a: 'هيئة الرقابة ومكافحة الفساد، نزاهة، تُعنى بالرقابة الإدارية على الجهات العامة، وحماية النزاهة وتعزيز الشفافية ومكافحة الفساد. ومن اختصاصاتها تلقي البلاغات، والتحري والتحقيق في جرائم الفساد، ومتابعة استرداد الأموال، ونشر الوعي في المجتمع.' },
  { id: 'report', icon: 'horn', q: 'كيف أبلّغ عن حالة فساد؟', k: ['ابلغ', 'بلاغ', 'بلغ', 'تبليغ'], sheet: 'report',
    a: 'أبشر. يمكنك الإبلاغ عن أي شبهة فساد عبر الرقم المجاني تسعمئة وثمانين، أو البريد الإلكتروني 980@nazaha.gov.sa، أو موقع نزاهة وتطبيقها. ويمكنك تقديم البلاغ دون ذكر اسمك إذا كانت معلوماتك قابلة للتحقق.' },
  { id: 'protect', icon: 'lock', q: 'هل هوية المبلّغ محمية؟', k: ['محمي', 'حمايه', 'سريه', 'هويه المبلغ', 'اخاف'],
    a: 'نعم. من اختصاصات الهيئة حسب المادة الرابعة من نظامها اتخاذ الإجراءات اللازمة لحماية من يبلّغ أو يدلي بمعلومات عن جرائم الفساد. وهناك أيضاً نظام خاص لحماية المبلّغين والشهود والخبراء والضحايا يحفظ سرية هوياتهم.' },
  { id: 'crimes', icon: 'scale', q: 'ما هي جرائم الفساد في النظام؟', k: ['جرائم', 'جريمه', 'انواع الفساد', 'صور الفساد'],
    a: 'حسب المادة الثانية من نظام هيئة الرقابة ومكافحة الفساد، جرائم الفساد هي: جرائم الرشوة، وجرائم الاعتداء على المال العام، وجرائم إساءة استعمال السلطة، وأي جريمة أخرى يُنص على أنها جريمة فساد بناءً على نظام.' },
  { id: 'gift', icon: 'gift', q: 'ما الفرق بين الهدية والرشوة؟', k: ['هديه', 'رشوه', 'عطيه'],
    a: 'العبرة بالسبب لا بالاسم. إذا قُدِّمت العطية للموظف العام مقابل أداء عمل من أعمال وظيفته أو الامتناع عنه فهي رشوة يعاقب عليها النظام ولو سُمّيت هدية، ويُعاقب معه الراشي والوسيط. وعند الشك، الأسلم أن تعتذر عن قبولها وتسأل الجهة المختصة في عملك.' },
  { id: 'student', icon: 'cap', q: 'ما دوري كطالب في تعزيز النزاهة؟', k: ['طالب', 'دوري', 'الغش', 'الامانه العلميه'],
    a: 'النزاهة تبدأ منك. التزم بالأمانة العلمية في اختباراتك وبحوثك، وانسب كل عمل إلى صاحبه، واحترم الأنظمة والمال العام في جامعتك، وكن قدوة لزملائك. وإذا رأيت شبهة فساد فبلّغ عنها عبر القنوات الرسمية.' },
  { id: 'wealth', icon: 'coin', q: 'ماذا لو تضخمت ثروة الموظف فجأة؟', k: ['ثروه', 'تضخم', 'زادت امواله', 'اثراء'],
    a: 'حسب المادة التاسعة عشرة من النظام، إذا زادت ثروة الموظف العام زيادة لا تتناسب مع دخله، يكون عليه هو أن يثبت أنه اكتسبها بطريقة مشروعة، ويشمل ذلك زوجه وأولاده وأقاربه من الدرجة الأولى.' },
  { id: 'rights', icon: 'user', q: 'ما هي حقوقي كمواطن؟', k: ['حقوقي', 'حقوق المواطن', 'حقي'],
    a: 'من حقك أن تحصل على الخدمة العامة دون أي مقابل غير نظامي، وأن تبلّغ عن أي شبهة فساد عبر القنوات الرسمية بسرية تامة، وأن تتمتع بالحماية التي كفلتها الأنظمة للمبلّغين والشهود.' },
  { id: 'oversight', icon: 'eye', q: 'كيف تتم الرقابة والمساءلة؟', k: ['الرقابه', 'المساءله', 'المحاسبه', 'محكمه'],
    a: 'تمارس الهيئة الرقابة الإدارية على الجهات العامة، وتتلقى البلاغات وتتحرى عنها وتحقق في جرائم الفساد، ثم تُحال القضايا إلى المحكمة المختصة. وحسب المرسوم الملكي تختص المحكمة الجزائية في مدينة الرياض بالنظر في جرائم الفساد.' },
  { id: 'why', icon: 'heart', q: 'ما أهمية مكافحة الفساد؟', k: ['اهميه', 'ليش نكافح', 'خطر الفساد', 'اضرار', 'لماذا نكافح'],
    a: 'مكافحة الفساد تحفظ المال العام، وتضمن وصول الفرص والخدمات إلى مستحقيها بعدل، وتقوّي ثقة الناس بالجهات العامة وتدعم التنمية. ولكل واحد منا دور: أن يلتزم بالأمانة في دراسته وعمله، وأن يبلّغ إذا رأى شبهة فساد.' },
  { id: 'examples', icon: 'list', q: 'أعطني أمثلة على صور الفساد', k: ['امثله', 'مثال'],
    a: 'من صور الفساد: أن يطلب موظف مبلغاً لإنهاء معاملة، وهذه رشوة. أو أن يستخدم ممتلكات جهته وأموالها لمصلحته الشخصية، وهذا اعتداء على المال العام. أو أن يستغل منصبه ليمنح نفسه أو غيره ما لا يستحق، وهذه إساءة لاستعمال السلطة.' },
  { id: 'uoh', icon: 'cap', q: 'ما دور جامعة حائل في التوعية؟', k: ['جامعه', 'حائل'],
    a: 'جامعة حائل جامعة حكومية تأسست عام ألف وأربعمئة وستة وعشرين للهجرة، وهي تنظّم هذه الفعالية بمناسبة اليوم العالمي لمكافحة الفساد لنشر ثقافة النزاهة والأمانة بين طلابها ومنسوبيها وزوارها، وتعريفهم بالأنظمة وطرق الإبلاغ.' },
];
/* بطاقات تفتح وظيفة بدل سؤال */
const ACTIONS = [
  { id: 'quiz', icon: 'check', q: 'اختبر نفسك', cls: 'gold' },
  { id: 'scenario', icon: 'scale', q: 'وش تسوي لو؟', cls: 'gold' },
  { id: 'laws', icon: 'book', q: 'تصفّح الأنظمة', cls: 'action' },
  { id: 'rate', icon: 'star', q: 'قيّم تجربتك', cls: 'action' },
];
const ICONS = {
  cal: '<rect x="3.500" y="5" width="17" height="15" rx="2"/><path d="M3.500 10h17M8 3v4M16 3v4"/>',
  shield: '<path d="M12 2 4 5v6c0 5 3.400 9.300 8 11 4.600-1.700 8-6 8-11V5z"/><path d="m8.500 12 2.500 2.500 4.500-5"/>',
  horn: '<path d="M3 10v4h3l8 5V5l-8 5z"/><path d="M18 9a4 4 0 0 1 0 6"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  scale: '<path d="M12 3v18M7 21h10M5 7h14M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z"/>',
  gift: '<rect x="4" y="10" width="16" height="10" rx="1.500"/><path d="M3 7h18v3H3zM12 7v13M12 7c-1.500-4-6-3-4.500 0M12 7c1.500-4 6-3 4.500 0"/>',
  cap: '<path d="M2 9 12 4l10 5-10 5z"/><path d="M6 11.500V16c0 1.500 2.700 3 6 3s6-1.500 6-3v-4.500"/>',
  coin: '<circle cx="12" cy="12" r="9"/><path d="M14.500 9.500c-.500-1-1.500-1.500-2.500-1.500-1.500 0-2.500.900-2.500 2s1 1.700 2.500 2 2.500.900 2.500 2-1 2-2.500 2c-1 0-2-.500-2.500-1.500M12 6.500V8m0 8v1.500"/>',
  user: '<circle cx="12" cy="8" r="3.500"/><path d="M5 20c.500-4 3.500-6 7-6s6.500 2 7 6"/>',
  eye: '<path d="M2 12s3.500-6.500 10-6.500S22 12 22 12s-3.500 6.500-10 6.500S2 12 2 12z"/><circle cx="12" cy="12" r="2.800"/>',
  heart: '<path d="M12 20s-7-4.400-7-9.500A4 4 0 0 1 12 8a4 4 0 0 1 7 2.500c0 5.100-7 9.500-7 9.500z"/>',
  list: '<path d="M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="m8.500 12 2.500 2.500 4.500-5"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 21V5M9 7h6"/>',
  star: '<path d="m12 3 2.700 5.600 6.100.800-4.500 4.200 1.200 6-5.500-3-5.500 3 1.200-6L3.200 9.400l6.100-.800z"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.500 2.500M15.500 15.500 18 18M18 6l-2.500 2.500M8.500 15.500 6 18"/>',
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const params = new URLSearchParams(location.search);
const app = $('#app');
const TEST = params.get('test');
const LOOK = params.get('look') || TEST;      // ‎?look=open‎ / ‎?look=blink‎ / ‎?look=1‎ لمعاينة حركة الوجه مع بقاء شكل الصفحة النهائي
try {
  const m = params.get('mic');
  if (m === 'auto' || m === 'button') localStorage.setItem('nazih.mic', m);
  const saved = localStorage.getItem('nazih.mic');
  if (saved) CONFIG.handsFree = saved === 'auto';
  const bg = params.get('barge');
  if (bg === '1' || bg === '0') localStorage.setItem('nazih.barge', bg);
  const sb = localStorage.getItem('nazih.barge');
  if (sb) CONFIG.bargeIn = sb === '1';
} catch {}
const buzz = (ms = 10) => { try { navigator.vibrate?.(ms); } catch {} };
/* توحيد الحروف العربية للمقارنة: بدون تشكيل، والهمزات ألف، والتاء المربوطة هاء */
const norm = (s) => String(s || '').replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').toLowerCase();
function escapeHTML(s) { return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

/* ---------------- الإعدادات (تُحفظ في المتصفح) ---------------- */
const settings = { volume: 1, voice: true, text: true, big: false };
try { Object.assign(settings, JSON.parse(localStorage.getItem('nazih-settings') || '{}')); } catch {}
if (params.get('kiosk')) settings.text = false;
function saveSettings() { try { localStorage.setItem('nazih-settings', JSON.stringify(settings)); } catch {} }
function applySettings() {
  document.body.classList.toggle('no-text', !settings.text);
  document.body.classList.toggle('big', !!settings.big);
  if (gainNode) gainNode.gain.value = settings.volume * VOICE_BOOST;
  const sa = document.getElementById('simliAudio'); if (sa) sa.volume = settings.volume;
  $('#setVol').value = settings.volume; $('#setVoice').checked = settings.voice; $('#setText').checked = settings.text; $('#setBig').checked = !!settings.big;
}

/* ---------------- الصوت ---------------- */
const VOICE_BOOST = 1.8;      // تكبير صوت نزيه (1 = بدون تكبير)
let audioCtx = null, analyser = null, gainNode = null, timeArr = null, freqArr = null, currentSrc = null;
let talking = false, fakeTalk = false, micLevel = 0;

function ensureAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser(); analyser.fftSize = 1024; analyser.smoothingTimeConstant = 0.55;
    timeArr = new Uint8Array(analyser.fftSize); freqArr = new Uint8Array(analyser.frequencyBinCount);
    gainNode = audioCtx.createGain(); gainNode.gain.value = settings.volume * VOICE_BOOST;
    // صوت أقوى وأوضح على سماعات الجوال والشاشة: ضاغط يساوي مستوى الكلام ثم تكبير
    const comp = audioCtx.createDynamicsCompressor();
    comp.threshold.value = -22; comp.knee.value = 14; comp.ratio.value = 5; comp.attack.value = 0.004; comp.release.value = 0.2;
    analyser.connect(comp); comp.connect(gainNode); gainNode.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
}
function setTalking(on, fake = false) { talking = on; fakeTalk = on && fake; app.classList.toggle('talking', on); }

/* =========================================================
 *  الشخصية: الخلفية ثابتة تماماً، والحركة للرأس فقط
 *  - الفك ينزل والشفة السفلى تتمدد معه، والشفة العليا ترتفع قليلاً
 *  - داخل الفم: أسنان عليا، لسان، وأسنان سفلى عند الفتحة الواسعة
 *  - عرض الفم يتغير مع نوع الصوت (ضيق مع الحروف المضمومة، أعرض مع المفتوحة)
 * ========================================================= */
const cv = $('#cv'), ctx = cv.getContext('2d');
const W = cv.width, H = cv.height;
const img = new Image();
const HB = (() => { const h = FACE.head; const x = Math.max(0, Math.round(h.cx - h.rx)), y = Math.max(0, Math.round(h.cy - h.ry));
  return { x, y, w: Math.min(W, Math.round(h.cx + h.rx)) - x, h: Math.min(H, Math.round(h.cy + h.ry)) - y }; })();
const work = document.createElement('canvas'); work.width = HB.w; work.height = HB.h;
const wctx = work.getContext('2d');
const mask = document.createElement('canvas'); mask.width = HB.w; mask.height = HB.h;
let voicePeak = 0.06;
let mouthOpen = 0, mouthWide = 1, voiceLevel = 0, blinkT = -1, nextBlink = performance.now() + 2500, bgDrawn = false;

function buildMask() {
  const m = mask.getContext('2d'), h = FACE.head;
  m.save(); m.translate(h.cx - HB.x, h.cy - HB.y); m.scale(1, h.ry / h.rx);
  const g = m.createRadialGradient(0, 0, h.rx * 0.62, 0, 0, h.rx);
  g.addColorStop(0, '#000'); g.addColorStop(1, 'rgba(0,0,0,0)');
  m.fillStyle = g; m.fillRect(-h.rx, -h.rx * 2, h.rx * 2, h.rx * 4); m.restore();
}

function readVoice(t) {
  let open = 0, wide = 1, level = 0;
  if (talking && analyser && !fakeTalk) {
    analyser.getByteTimeDomainData(timeArr);
    let s = 0; for (let i = 0; i < timeArr.length; i++) { const v = (timeArr[i] - 128) / 128; s += v * v; }
    const rms = Math.sqrt(s / timeArr.length);
    // فتحة الفم نسبةً إلى أعلى مستوى في كلام نزيه نفسه، فتظهر الحركة كاملة مهما كان الصوت منخفضاً أو مرتفعاً
    voicePeak = Math.max(voicePeak * 0.9985, rms, 0.03);
    open = Math.min(1, Math.max(0, (rms / voicePeak - 0.1) * 1.55));
    analyser.getByteFrequencyData(freqArr);
    const hz = audioCtx.sampleRate / analyser.fftSize, band = (a, b) => { let x = 0, n = 0; for (let i = Math.round(a / hz); i < Math.round(b / hz); i++) { x += freqArr[i]; n++; } return x / (n || 1); };
    const lo = band(250, 900), hi = band(1800, 4500);
    wide = 0.8 + Math.min(1, (hi / (lo + hi + 1)) * 2.4) * 0.34;      // 0.80 (مضموم) … 1.14 (مفتوح عريض)
    level = Math.min(1, rms * 6);
  } else if (fakeTalk || LOOK === '1') {
    open = (Math.sin(t / 95) * 0.5 + 0.5) * (Math.sin(t / 640) > -0.35 ? 1 : 0) * (0.55 + 0.45 * Math.sin(t / 233));
    wide = 0.95 + 0.17 * Math.sin(t / 410); level = open * 0.7;
  }
  if (LOOK === 'open') { open = 1; wide = 1; }
  voiceLevel += (level - voiceLevel) * 0.4;
  mouthOpen += (open - mouthOpen) * (open > mouthOpen ? 0.5 : 0.28);
  mouthWide += (wide - mouthWide) * 0.25;
}

/* يرسم الوجه (فم + رمش) داخل لوحة الرأس بإحداثيات الصورة */
function drawFace(c, t) {
  const d = mouthOpen * FACE.maxOpen;
  if (d > 0.35 && (!OWN || CONFIG.ownMouth || LOOK)) {
    const { x0, x1, yBottom } = FACE.jaw, top = FACE.mouthY, mx = FACE.mouthX;
    const hw = FACE.mouthHalfW * mouthWide, spread = (x1 - x0) / 2, K = 26, U = 18;
    const drop = (x) => { const u = Math.abs(x - mx) / spread; return u >= 1 ? 0 : d * Math.pow(Math.cos(u * Math.PI / 2), 1.5); };       // نزول الفك
    const gapF = (x) => { const u = Math.abs(x - mx) / hw; return u >= 1 ? 0 : Math.pow(Math.cos(u * Math.PI / 2), 1.05); };                 // شكل فتحة الفم
    const lift = (x) => d * 0.14 * gapF(x);                                                                                               // ارتفاع الشفة العليا
    for (let x = x0; x < x1; x++) {
      const dx = drop(x); if (dx < 0.05) continue;
      const gap = dx * gapF(x) * 0.92, st = dx - gap;
      // الشفة السفلى وما تحتها مباشرة: تنزل بمقدار الفتحة وتتمدد بالباقي (بدون تكرار بكسلات)
      c.drawImage(img, x, top, 1, K, x, top + gap, 1.5, K + st);
      // بقية الذقن واللحية: تنضغط حتى حد الفك
      c.drawImage(img, x, top + K, 1, yBottom - top - K, x, top + gap + K + st, 1.5, yBottom - top - K - dx);
      const l = lift(x);
      if (l > 0.2) c.drawImage(img, x, top - U, 1, U, x, top - U, 1.5, U - l);
    }
    // تجويف الفم
    const xa = mx - hw, xb = mx + hw;
    c.beginPath(); c.moveTo(xa, top);
    for (let x = xa; x <= xb; x += 2) c.lineTo(x, top - lift(x) - 0.5);
    for (let x = xb; x >= xa; x -= 2) c.lineTo(x, top + drop(x) * gapF(x) * 0.92 + 0.8);
    c.closePath();
    const cav = c.createLinearGradient(0, top - 3, 0, top + d);
    cav.addColorStop(0, 'rgb(38,10,12)'); cav.addColorStop(1, 'rgb(74,22,26)');
    c.fillStyle = cav; c.fill();
    c.save(); c.clip();
    // اللسان
    if (d > 5) { c.fillStyle = `rgba(178,82,88,${Math.min(0.75, (d - 5) / 9)})`; c.beginPath(); c.ellipse(mx, top + d * 0.98, hw * 0.6, d * 0.42, 0, 0, Math.PI * 2); c.fill(); }
    // الأسنان العليا
    const th = Math.min(4.6, d * 0.3);
    c.fillStyle = `rgba(238,231,222,${Math.min(0.8, d / 9)})`;
    c.beginPath(); c.ellipse(mx, top - d * 0.14 - 1.5, hw * 0.55, th + 1, 0, 0, Math.PI); c.fill();
    // الأسنان السفلى عند الفتحة الواسعة
    if (d > 9) { c.fillStyle = `rgba(226,220,212,${Math.min(0.7, (d - 9) / 8)})`; c.beginPath(); c.ellipse(mx, top + d * 0.94, hw * 0.5, 3.2, 0, Math.PI, 0); c.fill(); }
    // ظل تحت الشفة العليا
    const sh = c.createLinearGradient(0, top - 3, 0, top + 5); sh.addColorStop(0, 'rgba(0,0,0,.5)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = sh; c.fillRect(xa, top - 4, hw * 2, 9);
    c.restore();
  }
  // رمش العين: الجفن ينزل فوق العين
  if (t > nextBlink && blinkT < 0) blinkT = t;
  let k = 0;
  if (blinkT >= 0) { const p = (t - blinkT) / 180; k = p < 0.5 ? p * 2 : 2 - p * 2; if (p >= 1) { blinkT = -1; nextBlink = t + 2200 + Math.random() * 3800; k = 0; } }
  if (LOOK === 'blink') k = 1;
  if (LOOK === 'half') k = 0.5;
  if (k > 0.03) drawLids(c, k);
}

/* رمش طبيعي: جلد الجفن العلوي نفسه (من الصورة) ينزل فوق العين ومعه خط الرموش، عموداً عموداً، فلا يظهر أي لون مرسوم */
function drawLids(c, k) {
  // في أفتار الموقع نقرأ من نسخة مؤقتة لمنطقة العينين (بعد رفع الحاجبين)، حتى لا يقرأ عمودٌ ما كتبه العمود الذي قبله
  let src = img, ox = 0, oy = 0;
  if (OWN && ownLayer) {
    const top = Math.floor(Math.min(...FACE.eyes.map((e) => e.y)) - 70), hh = 110;
    if (!lidTmp) { lidTmp = document.createElement('canvas'); lidTmp.width = BODY.w; lidTmp.height = hh; }
    const lc = lidTmp.getContext('2d'); lc.clearRect(0, 0, BODY.w, hh); lc.drawImage(ownLayer, 0, top - BODY.y, BODY.w, hh, 0, 0, BODY.w, hh);
    src = lidTmp; ox = BODY.x; oy = top;
  }
  for (const e of FACE.eyes) {
    const S = e.ry * 1.15, B = Math.max(3, e.ry * 0.45);
    for (let x = Math.ceil(e.x - e.rx); x < e.x + e.rx; x++) {
      const u = (x - e.x) / e.rx, arc = Math.sqrt(Math.max(0, 1 - u * u));
      const yT = e.y - e.ry * arc, yB = e.y + e.ry * 0.85 * arc;
      const shift = k * (yB - yT) * 0.96; if (shift < 0.3) continue;
      const a = yT - S, lash = yT - B + 2;
      c.drawImage(src, x - ox, lash - oy, 1, B, x, lash + shift, 1.5, B);               // خط الرموش ينزل كما هو
      c.drawImage(src, x - ox, a - oy, 1, lash - a, x, a, 1.5, lash - a + shift);       // جلد الجفن يتمدد للأسفل
    }
  }
}
/* رفع الحاجبين قليلاً عند التشديد في الكلام (يعطي الوجه حياة) */
function drawBrows(c, b) {
  if (b < 0.25) return;
  for (const e of FACE.eyes) {
    const y0 = e.y - 78, y1 = e.y - 46, y2 = e.y - 17, y3 = e.y - 13, R = 88;
    for (let x = Math.ceil(e.x - R); x < e.x + R; x++) {
      const u = (x - e.x) / R, d = b * Math.pow(Math.cos(u * Math.PI / 2), 2); if (d < 0.2) continue;
      c.drawImage(img, x, y0, 1, y1 - y0, x, y0, 1.5, y1 - y0 - d);          // الجبهة تنضغط
      c.drawImage(img, x, y1, 1, y2 - y1, x, y1 - d, 1.5, y2 - y1);          // الحاجب يرتفع
      c.drawImage(img, x, y2, 1, y3 - y2, x, y2 - d, 1.5, y3 - y2 + d);      // ما تحته يتمدد
    }
  }
}

/* =========================================================
 *  أفتار الموقع (v14): نزيه مفصول عن الاستديو
 *  - assets/avatar-own.jpg  الصورة الأصلية   - assets/avatar-mask.png  قناع الشخص   - assets/avatar-bg.jpg  الاستديو بدون الشخص
 *  الرأس كله (مع الشماغ والعقال) يميل ويومئ ويتمايل مع الكلام فوق استديو ثابت، والكتفان ثابتان،
 *  والرقبة تنثني بينهما بسلاسة. الفم والرمش والحاجبان تتحرك داخل الوجه.
 * ========================================================= */
const BODY = { x: 380, y: 50, w: 1600, bottom: 960, rigid: 772, anchor: 945 };   // rigid: أسفل الذقن، anchor: مستوى الكتفين (لا حركة تحته)
let lidTmp = null;
let ownLayer = null, ownCtx = null, ownMask = null, ownBg = null, ownReady = false;
let talkAmt = 0, lvlSlow = 0, emph = 0, lastOwnDraw = 0, gest = { at: 0, dur: 1, tilt: 0, nod: 0, sway: 0 }, nextGest = 0;
function initOwn(bgImg, maskImg) {
  const h = BODY.bottom - BODY.y;
  ownMask = document.createElement('canvas'); ownMask.width = BODY.w; ownMask.height = h;
  ownMask.getContext('2d').drawImage(maskImg, BODY.x, BODY.y, BODY.w, h, 0, 0, BODY.w, h);
  ownLayer = document.createElement('canvas'); ownLayer.width = BODY.w; ownLayer.height = h;
  ownCtx = ownLayer.getContext('2d'); ownBg = bgImg; ownReady = true;
}
const smooth = (v) => { v = Math.min(1, Math.max(0, v)); return v * v * (3 - 2 * v); };
function drawOwn(t) {
  requestAnimationFrame(drawOwn);
  if (t - lastOwnDraw < 24) return;                       // 40 إطاراً في الثانية كحد أقصى
  const dt = Math.min(80, t - lastOwnDraw || 16); lastOwnDraw = t;
  readVoice(t);
  if (!bgDrawn) { ctx.drawImage(img, 0, 0); bgDrawn = true; }
  // --- إشارات الحركة ---
  const speaking = talking || LOOK === '1';
  talkAmt += ((speaking ? 1 : 0) - talkAmt) * Math.min(1, dt / 260);
  lvlSlow += (voiceLevel - lvlSlow) * Math.min(1, dt / 900);
  emph += (Math.max(0, voiceLevel - lvlSlow * 0.9) - emph) * Math.min(1, dt / 140);       // نبرة التشديد
  // إيماءة عشوائية كل بضع ثوانٍ أثناء الكلام (ميل أو إيماءة أو التفاتة خفيفة) حتى لا تتكرر الحركة
  if (speaking && t > nextGest) {
    gest = { at: t, dur: 900 + Math.random() * 900, tilt: (Math.random() - 0.5) * 0.034, nod: (Math.random() - 0.3) * 9, sway: (Math.random() - 0.5) * 12 };
    nextGest = t + gest.dur + 500 + Math.random() * 1800;
  }
  const gp = Math.min(1, (t - gest.at) / gest.dur), gk = Math.sin(gp * Math.PI) * talkAmt;  // تصعد ثم ترجع
  const TA = talkAmt * (CONFIG.ownMouth || LOOK ? 1 : 0.45);            // بدون تحريك الفم: حركة الرأس أهدأ
  const tilt = 0.0045 * Math.sin(t / 2700) + 0.002 * Math.sin(t / 1130 + 1) + TA * (0.007 * Math.sin(t / 830) + 0.004 * Math.sin(t / 410 + 2)) + gk * gest.tilt;
  const nod = 1.6 * Math.sin(t / 1900) + TA * (2.2 * Math.sin(t / 560) + 1.2 * Math.sin(t / 233 + 1)) + emph * 9 + mouthOpen * 1.5 + gk * gest.nod;
  const sway = 2.2 * Math.sin(t / 3300) + TA * 2.5 * Math.sin(t / 1500 + 1) + gk * gest.sway;
  const zoom = 0.0025 * Math.sin(t / 2300) + TA * 0.004 + emph * 0.006;
  const brow = Math.min(3.2, emph * 9 + (gk > 0.6 ? 0.8 : 0));
  // --- طبقة نزيه: الصورة + الوجه المتحرك، ثم القناع ---
  const h = BODY.bottom - BODY.y;
  ownCtx.globalCompositeOperation = 'source-over';
  ownCtx.setTransform(1, 0, 0, 1, 0, 0);
  ownCtx.drawImage(img, BODY.x, BODY.y, BODY.w, h, 0, 0, BODY.w, h);
  ownCtx.setTransform(1, 0, 0, 1, -BODY.x, -BODY.y);
  drawBrows(ownCtx, LOOK === 'brow' ? 3.2 : brow);
  drawFace(ownCtx, t);
  ownCtx.setTransform(1, 0, 0, 1, 0, 0);
  ownCtx.globalCompositeOperation = 'destination-in'; ownCtx.drawImage(ownMask, 0, 0);
  // --- التركيب: استديو نظيف ثم نزيه بحركته ---
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(ownBg, BODY.x, BODY.y, BODY.w, h, BODY.x, BODY.y, BODY.w, h);
  const px = FACE.pivot.x, py = BODY.anchor;
  const place = (wv) => {
    const a = tilt * wv, sc = 1 + zoom * wv, co = Math.cos(a) * sc, si = Math.sin(a) * sc;
    ctx.setTransform(co, si, -si, co, px + sway * wv - (co * px - si * py), py + nod * wv - (si * px + co * py));
  };
  const SH = 5, rigidH = BODY.rigid - BODY.y;
  // من الأسفل إلى الأعلى حتى يغطي الرأس أي فرق بسيط عند الرقبة
  const n = Math.ceil((BODY.bottom - BODY.rigid) / SH);
  for (let i = n - 1; i >= 0; i--) {
    const y = BODY.rigid + i * SH, hh = Math.min(SH + 2, BODY.bottom - y);
    place(smooth((BODY.anchor - (y + SH / 2)) / (BODY.anchor - BODY.rigid)));
    ctx.drawImage(ownLayer, 0, y - BODY.y, BODY.w, hh, BODY.x, y, BODY.w, hh);
  }
  place(1);
  ctx.drawImage(ownLayer, 0, 0, BODY.w, rigidH + 2, BODY.x, BODY.y, BODY.w, rigidH + 2);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  drawWave(t);
}

// (طريقة قديمة غير مستخدمة) صورة «العين المغمضة»: جفن بلون الجلد المحيط بكل عين مع خط الرموش وحواف ناعمة
let eyePatches = [];
function buildEyePatches() {
  const tmp = document.createElement('canvas'); tmp.width = W; tmp.height = H;
  const tc = tmp.getContext('2d', { willReadFrequently: true }); tc.drawImage(img, 0, 0);
  eyePatches = FACE.eyes.map((e) => {
    const m = 4, mt = 1, x = Math.round(e.x - e.rx - m), y = Math.round(e.y - e.ry - mt),
      w = Math.round(e.rx * 2 + m * 2), h = Math.round(e.ry * 2 + mt + m + 2);
    const src = tc.getImageData(x, y, w, h).data;
    const pc = document.createElement('canvas'); pc.width = w; pc.height = h;
    const p = pc.getContext('2d'), out = p.createImageData(w, h);
    const avg = (yy, xx) => { let r = 0, g = 0, b = 0, n = 0;
      for (let dx = -4; dx <= 4; dx++) { const X = Math.min(w - 1, Math.max(0, xx + dx)); const i = (yy * w + X) * 4; r += src[i]; g += src[i + 1]; b += src[i + 2]; n++; }
      return [r / n, g / n, b / n]; };
    for (let xx = 0; xx < w; xx++) {
      const b = avg(h - 1, xx), a = [b[0] * 0.9, b[1] * 0.88, b[2] * 0.87];   // الجفن بلون الخد تحته، أغمق قليلاً من الأعلى
      for (let yy = 0; yy < h; yy++) {
        const f = Math.pow(yy / (h - 1), 1.2), i = (yy * w + xx) * 4;
        const shade = 0.96 + 0.04 * Math.sin(Math.PI * yy / h);          // انحناء الجفن
        out.data[i] = (a[0] * (1 - f) + b[0] * f) * shade; out.data[i + 1] = (a[1] * (1 - f) + b[1] * f) * shade;
        out.data[i + 2] = (a[2] * (1 - f) + b[2] * f) * shade; out.data[i + 3] = 255;
      }
    }
    p.putImageData(out, 0, 0);
    p.strokeStyle = 'rgba(38,24,20,0.55)'; p.lineWidth = 1.8; p.lineCap = 'round';   // خط الرموش
    p.beginPath(); p.ellipse(w / 2, mt + e.ry * 1.3, e.rx * 0.8, e.ry * 0.45, 0, 0.25, Math.PI - 0.25); p.stroke();
    p.globalCompositeOperation = 'destination-in';
    p.save(); p.translate(w / 2, h / 2); p.scale(1, h / w);
    const g = p.createRadialGradient(0, 0, w * 0.3, 0, 0, w / 2);
    g.addColorStop(0, '#000'); g.addColorStop(0.6, '#000'); g.addColorStop(1, 'rgba(0,0,0,0)');
    p.fillStyle = g; p.fillRect(-w / 2, -w / 2, w, w); p.restore();
    return { cv: pc, x, y };
  });
}

function drawFrame(t) {
  readVoice(t);
  // الاستديو ثابت لا يتحرك: يُرسم كاملاً مرة واحدة، ثم يُعاد رسم منطقة الرأس فقط في كل إطار (أخف على الجوالات)
  if (!bgDrawn) { ctx.drawImage(img, 0, 0); bgDrawn = true; }
  else { const m = 10, x = Math.max(0, HB.x - m), y = Math.max(0, HB.y - m), w = Math.min(W - x, HB.w + 2 * m), h = Math.min(H - y, HB.h + 2 * m); ctx.drawImage(img, x, y, w, h, x, y, w, h); }
  // لوحة الرأس
  wctx.globalCompositeOperation = 'source-over';
  wctx.clearRect(0, 0, HB.w, HB.h);
  wctx.save(); wctx.translate(-HB.x, -HB.y);
  wctx.drawImage(img, HB.x, HB.y, HB.w, HB.h, HB.x, HB.y, HB.w, HB.h);
  drawFace(wctx, t);
  wctx.restore();
  wctx.globalCompositeOperation = 'destination-in'; wctx.drawImage(mask, 0, 0);
  // حركة خفيفة للرأس فقط (تنفس وإيماءة مع الكلام)
  const sp = talking ? 1 : 0;
  const dy = Math.sin(t / 1800) * 1.1 + sp * (Math.sin(t / 370) * 0.9 - mouthOpen * 1.6);
  const dxh = Math.sin(t / 2900) * 0.7;
  const rot = Math.sin(t / 2600) * 0.003 + sp * Math.sin(t / 540) * 0.0045;
  ctx.save();
  ctx.translate(FACE.pivot.x + dxh, FACE.pivot.y + dy); ctx.rotate(rot); ctx.translate(-FACE.pivot.x, -FACE.pivot.y);
  ctx.drawImage(work, HB.x, HB.y);
  ctx.restore();
  drawWave(t);
  requestAnimationFrame(drawFrame);
}
if (OWN) {
  const load = (src) => new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = src; });
  img.onload = () => { ctx.drawImage(img, 0, 0); bgDrawn = true; };          // الصورة تظهر فوراً، والحركة تبدأ حين يكتمل القناع والخلفية
  Promise.all([new Promise((r) => img.addEventListener('load', r)), load('assets/avatar-bg.jpg'), load('assets/avatar-mask.png')])
    .then(([, bg, mk]) => { initOwn(bg, mk); requestAnimationFrame(drawOwn); })
    .catch((e) => { console.warn('avatar layers:', e); buildMask(); requestAnimationFrame(drawFrame); });   // تعذّر التحميل: الحركة البسيطة القديمة
} else img.onload = () => { buildMask(); requestAnimationFrame(drawFrame); };
img.src = CONFIG.avatarImage;

/* ---------------- موجة الصوت حول المايك ---------------- */
const BARS = 22;
const waveBars = ['#waveR', '#waveL'].map((id, side) => {
  const box = $(id);
  return Array.from({ length: BARS }, (_, i) => {
    const s = document.createElement('span'); box.appendChild(s);
    return { s, near: side === 0 ? i / (BARS - 1) : 1 - i / (BARS - 1), ph: Math.random() * 6.28 };
  });
}).flat();
function drawWave(t) {
  const level = talking ? Math.max(voiceLevel, 0.15) : micLevel;
  for (const b of waveBars) {
    const env = 0.25 + 0.75 * Math.sin(b.near * Math.PI * 0.5 + 0.2) * (0.6 + 0.4 * Math.sin(b.near * 9));
    const wob = 0.55 + 0.45 * Math.sin(t / 110 + b.ph);
    const idle = 0.1 + 0.12 * env * (0.5 + 0.5 * Math.sin(t / 600 + b.ph));
    b.s.style.transform = `scaleY(${Math.min(1, idle + level * env * wob * 1.6).toFixed(3)})`;
  }
}

/* ---------------- شخصية D-ID الحية ----------------
   إذا اشتغل وسم D-ID في index.html يظهر الأفتار الحي مكان الصورة، وهو يتولى المايك والمحادثة،
   والأسئلة المتحركة تجعله ينطق إجاباتها الجاهزة. وإذا لم يشتغل (نطاق غير مسموح، انتهاء الرصيد، انقطاع)
   يبقى الموقع على الصورة المتحركة وصوت OpenAI كما كان. */
let did = null;
function didVideoPlaying() {                 // هل بدأ بث فيديو الأفتار فعلاً؟ (يبحث داخل عناصر D-ID المغلقة أيضاً)
  const walk = (root) => {
    for (const el of root.querySelectorAll('*')) {
      if (el.tagName === 'VIDEO' && el.videoWidth > 0 && !el.paused && el.readyState >= 2) return true;
      if (el.shadowRoot && walk(el.shadowRoot)) return true;
    }
    return false;
  };
  try { return walk(document.getElementById('did') || document); } catch { return false; }
}
function didLoaded() {
  if (!document.body.classList.contains('did-loading')) return;
  document.body.classList.remove('did-loading');
  $('#didCover span').textContent = 'تكلّم أو المس الشاشة للبدء';
  if (DEBUG) { T.connect = (performance.now() / 1000).toFixed(1) + 's'; T.show(); }
}
function initDID() {
  const noDid = () => { document.body.classList.remove('did-on', 'did-loading'); };
  if ((TEST && TEST !== 'did') || (!OWN && window.NAZIH_DID === false)) return noDid();
  const started = performance.now();
  const timer = setInterval(() => {
    const api = window.DID_AGENTS_API;
    if (api?.functions) {
      clearInterval(timer);
      did = api;
      // الصورة الثابتة تبقى ظاهرة حتى يبدأ بث الفيديو فعلاً (أو 10 ثوانٍ كحد أقصى)
      const t1 = performance.now();
      const vt = setInterval(() => { if (didVideoPlaying() || performance.now() - t1 > 10000) { clearInterval(vt); didLoaded(); } }, 200);
      document.body.classList.add('did-on');
      CONFIG.idleStatus = CONFIG.didStatus; setStatus(CONFIG.idleStatus);
      try {
        api.events?.on('agentActivity', ({ state }) => {
          didTalking = state === 'TALKING' && performance.now() > ignoreTalkUntil; if (didTalking) T.mark('talking');
          app.classList.toggle('talking', didTalking);
          if (CONFIG.ownBrain) muteDid();
          else if (CONFIG.pushToTalk && didTalking) setMic(false);      // نزيه بدأ يجاوب: يُقفل المايك
        });
        api.events?.on('connection', () => { if (CONFIG.ownBrain) muteDid(); else if (CONFIG.pushToTalk) setMic(false); });
        api.events?.on('error', ({ error }) => console.warn('D-ID:', error));
      } catch (e) { console.warn(e); }
      setInterval(watchDid, 1500);
      if (CONFIG.ownBrain) { document.body.classList.add('ptt'); muteDid(); setInterval(muteDid, 4000); setStatus(CONFIG.idleStatus); if (CONFIG.handsFree) startAutoListen(); }
      else if (CONFIG.pushToTalk) { document.body.classList.add('ptt'); setMic(false); setTimeout(() => setMic(micOpen), 3000); }
    } else if (performance.now() - started > CONFIG.didWaitSeconds * 1000) { clearInterval(timer); noDid(); }
  }, 100);
}

/* قياس زمن الاستجابة: افتح الموقع بـ ‎?debug=1‎ فيظهر أسفل الشاشة زمن كل مرحلة بعد كل سؤال */
const DEBUG = params.get('debug') === '1';
const T = { marks: {}, mark(k) { if (DEBUG && !(k in this.marks)) { this.marks[k] = performance.now(); this.show(); } }, reset() { this.marks = {}; },
  show() {
    let el = document.getElementById('dbg');
    if (!el) { el = document.createElement('div'); el.id = 'dbg'; el.style.cssText = 'position:fixed;left:8px;top:8px;z-index:99;background:rgba(0,0,0,.78);color:#9f9;font:13px/1.5 monospace;padding:8px 10px;border-radius:8px;direction:ltr;text-align:left;white-space:pre'; document.body.appendChild(el); }
    const m = this.marks, d = (a, b) => (m[a] && m[b] ? ((m[b] - m[a]) / 1000).toFixed(1) + 's' : '-');
    el.textContent = `avatar connect: ${this.connect || '-'}\nsilence wait : ${d('lastWord', 'recEnd')}\nspeech->text : ${d('recEnd', 'sttDone')}\nthinking     : ${d('askStart', 'firstText')}\nfirst sound  : ${d('lastWord', 'talking')}${m.filler ? ' (filler)' : ''}\nanswer ready : ${d('lastWord', 'firstText')}${this.model ? '\nmodel        : ' + this.model : ''}${this.voice ? '\nvoice        : ' + this.voice : ''}${m.exact ? '\n(exact article)' : ''}${m.bank ? '\n(ready answer)' : ''}`;
  } };

/* انقطاع D-ID عند الخمول: D-ID يفصل الجلسة بعد فترة بلا كلام ويعرض «Are you still here? / Reconnect».
   نغطي الرسالة بصورة نزيه، ونعيد الاتصال تلقائياً عند أول كلام أو لمسة أو سؤال. */
let didDown = false, didReconnecting = null;
function didFindButton(re) {
  const walk = (root) => {
    for (const el of root.querySelectorAll('*')) {
      if ((el.tagName === 'BUTTON' || el.getAttribute?.('role') === 'button') && re.test(el.textContent || '')) return el;
      if (el.shadowRoot) { const r = walk(el.shadowRoot); if (r) return r; }
    }
    return null;
  };
  try { return walk(document.getElementById('did') || document) || walk(document); } catch { return null; }
}
function setDidDown(v) {
  if (didDown === v) return;
  didDown = v; document.body.classList.toggle('did-down', v);
  if (v) { didTalking = false; app.classList.remove('talking'); }
}
function watchDid() { if (did && !didReconnecting) setDidDown(!!didFindButton(/reconnect/i)); }
function ensureDidConnected() {
  if (!did) return Promise.resolve();
  if (did.ensure) { did.ensure(); return Promise.resolve(); }      // Simli: يبدأ الاتصال في الخلفية، والنطق ينتظره
  watchDid();
  if (!didDown) return Promise.resolve();
  if (didReconnecting) return didReconnecting;
  document.body.classList.add('did-reconnecting');
  $('#didCover span').textContent = 'لحظة.. نزيه يستعد';
  didReconnecting = (async () => {
    const t0 = performance.now();
    try { didFindButton(/reconnect/i)?.click(); } catch {}
    try { const f = did.functions; await Promise.resolve((f.reconnect || f.connect)?.call(f)).catch(() => {}); } catch {}
    while (performance.now() - t0 < 15000) {                 // ننتظر حتى تختفي رسالة إعادة الاتصال
      await sleep(400);
      if (!didFindButton(/reconnect/i)) break;
      if (performance.now() - t0 > 5000) { try { didFindButton(/reconnect/i)?.click(); } catch {} await sleep(1500); }
    }
    await sleep(1200);                                       // مهلة قصيرة حتى يجهز البث
    didReconnecting = null;
    document.body.classList.remove('did-reconnecting');
    $('#didCover span').textContent = 'تكلّم أو المس الشاشة للبدء';
    setDidDown(!!didFindButton(/reconnect/i)); muteDid();
  })();
  return didReconnecting;
}
['pointerdown', 'keydown'].forEach((ev) => window.addEventListener(ev, () => { if (did && (didDown || did.ensure)) ensureDidConnected(); }, { passive: true }));

/* عقل الموقع: مايك D-ID يبقى مكتوماً دائماً، والموقع هو الذي يسمع ويجاوب */
let didTalking = false;
setInterval(() => {                         // أثناء كلام نزيه: الزر يتحول إلى «اضغط للمقاطعة»
  if (!did) return;
  const on = (speakingNow || didTalking) && !autoMic?.recording && !recState;
  if (micBtn.classList.contains('stop') === on) return;
  micBtn.classList.toggle('stop', on);
  $('#pttLabel').textContent = on ? (CONFIG.bargeIn ? 'تكلّم أو اضغط للمقاطعة' : 'اضغط هنا للمقاطعة') : pttIdleLabel();
}, 200);
const pttIdleLabel = () => (autoMic && audioCtx?.state === 'running' ? 'تكلّم مباشرة.. أنا أسمعك' : CONFIG.handsFree ? 'المس الشاشة لتفعيل الاستماع' : 'اضغط للتحدث');
function muteDid() { try { Promise.resolve(did?.functions.toggleMicState(true)).catch(() => {}); } catch {} }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function waitDidDone(len) {            // ينتظر حتى ينتهي نزيه من نطق المقطع
  const t0 = performance.now(), est = 2500 + len * 95;
  while (!didTalking && performance.now() - t0 < 6000) await sleep(150);       // حتى يبدأ
  if (!didTalking) { await sleep(Math.min(est, 20000)); return; }              // لا توجد إشارة: انتظار تقديري
  while (didTalking && performance.now() - t0 < est * 2 + 15000) await sleep(200);
}
function splitForSpeech(text, max = 700) {   // تقسيم النص الطويل عند نهايات الجمل
  const parts = []; let cur = '';
  for (const seg of String(text).split(/(?<=[.؟!؛:\n])\s+/)) {
    if ((cur + ' ' + seg).length > max && cur) { parts.push(cur.trim()); cur = seg; } else cur += ' ' + seg;
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts;
}

/* اضغط للتحدث: فتح وقفل مايك D-ID من زر الموقع */
let micOpen = false, micTimer;
function setMic(open) {
  micOpen = open; clearTimeout(micTimer);
  try { Promise.resolve(did?.functions.toggleMicState(!open)).catch(() => {}); } catch {}   // true = كتم
  micBtn.classList.toggle('listening', open);
  $('#pttLabel').textContent = open ? 'أسمعك... تكلّم الآن، واضغط عند الانتهاء' : 'اضغط للتحدث';
  if (open) micTimer = setTimeout(() => setMic(false), CONFIG.talkMaxSeconds * 1000);
}

/* ---------------- النطق ---------------- */
const ttsCache = new Map();   // المقاطع المنطوقة تُحفظ فتصير الإجابات الجاهزة فورية في المرة التالية
let speakSeq = 0;
function stopSpeaking() {
  speakSeq++; if (speakingNow) { speakingNow = false; lastSpokeAt = performance.now(); }
  if (did) { try { Promise.resolve(did.functions.interrupt()).catch(() => {}); } catch {} return; }
  if (currentSrc) { try { currentSrc.stop(); } catch {} currentSrc = null; }
  if (window.speechSynthesis) speechSynthesis.cancel();
  setTalking(false);
}

/* إذا تعطلت شخصية D-ID أثناء العمل (انتهاء الرصيد، بلوغ حد الجلسات المتزامنة، انقطاع لا يعود):
   يتحول الموقع فوراً إلى الصورة المتحركة وصوت OpenAI بدل أن يبقى نزيه ساكتاً.
   الشاشة تعيد تحميل نفسها عند أول فترة خمول لتحاول استرجاع الأفتار الحي. */
const IDLE_STATUS_LOCAL = CONFIG.idleStatus;
let didDropped = false;
function dropDid(why) {
  if (!did) return;
  console.warn('D-ID متوقف، التحويل للصوت الاحتياطي:', why || '');
  try { Promise.resolve(did.functions.interrupt()).catch(() => {}); } catch {}
  did = null; didDropped = true; didTalking = false; didDown = false;
  try { autoMic?.stop(); } catch {}
  document.body.classList.remove('did-on', 'did-loading', 'did-down', 'did-reconnecting', 'ptt', 'typing');
  app.classList.remove('talking'); micBtn.classList.remove('stop', 'listening');
  clearTimeout(showCaption.timer); capEl.classList.add('show');
  CONFIG.idleStatus = IDLE_STATUS_LOCAL; $('#pttLabel').textContent = CONFIG.idleStatus;
  applySettings(); setStatus(CONFIG.idleStatus);
}

/* صوت OpenAI لمقطع واحد (يُحفظ بعد أول مرة) */
function ttsBuffer(text) {            // الطلب نفسه لا يتكرر: من يطلب المقطع أثناء تحميله ينتظر التحميل الجاري
  ensureAudio();
  let p = ttsCache.get(text);
  if (p) return p;
  p = (async () => {
    const r = await fetch(`${CONFIG.apiBase}/api/tts`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) });
    if (!r.ok) throw new Error('tts');
    return audioCtx.decodeAudioData(await r.arrayBuffer());
  })();
  p.catch(() => { if (ttsCache.get(text) === p) ttsCache.delete(text); });
  if (ttsCache.size > 80) ttsCache.delete(ttsCache.keys().next().value);
  ttsCache.set(text, p);
  return p;
}
function playBuffer(buf) {
  return new Promise((res) => {
    const src = audioCtx.createBufferSource(); src.buffer = buf; src.connect(analyser);
    currentSrc = src; setTalking(true);
    if (!did) setStatus('نزيه يتكلم... (اضغط المايك للمقاطعة)');
    src.onended = () => { if (currentSrc === src) currentSrc = null; res(); };
    src.start();
  });
}
function browserSpeak(text) {       // بديل أخير: صوت المتصفح مع حركة فم تقريبية
  if (!window.speechSynthesis) return Promise.resolve();
  return new Promise((res) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ar-SA'; u.volume = settings.volume;
    const v = speechSynthesis.getVoices().find((x) => x.lang?.startsWith('ar'));
    if (v) u.voice = v;
    const done = () => { clearTimeout(guard); res(); };
    const guard = setTimeout(done, 4000 + text.length * 120);
    u.onstart = () => { setTalking(true, true); setStatus('نزيه يتكلم... (اضغط المايك للمقاطعة)'); };
    u.onend = u.onerror = done;
    speechSynthesis.speak(u);
  });
}

/* ---------------- أفتار الموقع الخاص ----------------
   يقدّم للموقع نفس الواجهة التي كانت تقدمها D-ID (speak / interrupt / إشارة «يتكلم»)،
   فيبقى كل شيء كما هو: الشاشة الكاملة، الاستماع التلقائي، المقاطعة، بثّ الجواب جملة جملة.
   الصوت من ‎/api/tts‎ (OpenAI عبر خادمك)، وحركة الفم من تحليل الصوت نفسه. */
function makeOwnAvatar() {
  const subs = {}; let token = 0;
  const emit = (state) => (subs.agentActivity || []).forEach((f) => { try { f({ state }); } catch {} });
  return {
    own: true, emit,
    events: { on(ev, f) { (subs[ev] = subs[ev] || []).push(f); } },
    functions: {
      async speak({ input }) {
        const my = ++token; let buf = null;
        try { buf = await ttsBuffer(input); } catch {}
        if (my !== token) return;
        emit('TALKING');
        (buf ? playBuffer(buf) : browserSpeak(input)).then(() => { if (my === token) { setTalking(false); emit('IDLE'); } });
      },
      interrupt() {
        token++;
        if (currentSrc) { try { currentSrc.stop(); } catch {} currentSrc = null; }
        if (window.speechSynthesis) speechSynthesis.cancel();
        setTalking(false); emit('IDLE');
      },
      toggleMicState() {}, reconnect() {}, connect() {},
    },
  };
}
/* ---------------- وجه Simli الحي (للشاشة الرئيسية) ----------------
   Simli وجه فقط: الموقع يجهّز الجواب والصوت كما هو، ثم يرسل الصوت إلى Simli فيرجع فيديو بشفاه مطابقة.
   - يتصل عند أول لمسة أو كلام، ويُقفل تلقائياً بعد فترة سكوت (فلا تُستهلك الدقائق والشاشة واقفة) ثم يعود عند الحاجة.
   - إذا تعذّر الاتصال (انتهت الدقائق، بلغ حد الجلسات، انقطاع) يكمل نزيه بصورته وصوته دون أن يسكت. */
function makeSimliAvatar(own) {
  const video = $('#simliVideo'), audio = $('#simliAudio');
  let client = null, connecting = null, sdk = null, fails = 0, token = 0, talkT = null, lastFail = 0;
  const live = () => !!client;
  const setLive = (v) => document.body.classList.toggle('simli-live', v);
  async function loadSdk() {
    if (sdk) return sdk;
    for (const url of CONFIG.simliSdk) {
      try { const m = await import(url); if (m.SimliClient) return (sdk = m); } catch (e) { console.warn('Simli SDK:', url, e?.message); }
    }
    throw new Error('تعذّر تحميل مكتبة Simli');
  }
  function connect() {
    if (client) return Promise.resolve(true);
    if (connecting) return connecting;
    if (fails >= 3 && performance.now() - lastFail < 120000) return Promise.resolve(false);     // بعد ثلاث محاولات فاشلة: استراحة دقيقتين
    connecting = (async () => {
      try {
        const { SimliClient, LogLevel } = await loadSdk();
        let code = ''; try { code = localStorage.getItem('nazih.code') || ''; } catch {}
        const r = await fetch(`${CONFIG.apiBase}/api/simli-token`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ portrait: innerHeight > innerWidth, code }) });
        const d = await r.json().catch(() => ({}));
        if (!r.ok || !d.session_token) throw new Error(d.error || 'token');
        const c = new SimliClient(d.session_token, video, audio, null, LogLevel?.ERROR ?? LogLevel?.INFO);
        c.on?.('stop', () => { if (client === c) { client = null; setLive(false); console.log('Simli: انتهت الجلسة'); } });
        c.on?.('error', (m) => console.warn('Simli:', m));
        await c.start();
        client = c; fails = 0; audio.volume = settings.volume; setLive(true);
        CONFIG.fillers.forEach((f) => pcmFetch(f));                      // تجهيز عبارات الانتظار مسبقاً
        if (DEBUG) { T.connect = 'simli ' + (performance.now() / 1000).toFixed(1) + 's'; T.show(); }
        return true;
      } catch (e) {
        console.warn('Simli connect:', e?.message || e); fails++; lastFail = performance.now(); setLive(false);
        if (DEBUG) setStatus('Simli: ' + (e?.message || e), 'err');
        return false;
      } finally { connecting = null; }
    })();
    return connecting;
  }
  /* تحويل الصوت إلى الصيغة التي يطلبها Simli: ‏PCM16 أحادي بتردد 16 كيلوهرتز، مع رفع المستوى */
  async function toPCM(buf) {
    const oc = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, Math.max(1, Math.ceil(buf.duration * 16000)), 16000);
    const src = oc.createBufferSource(); src.buffer = buf; src.connect(oc.destination); src.start();
    const f = (await oc.startRendering()).getChannelData(0);
    let peak = 0.05; for (let i = 0; i < f.length; i++) { const a = Math.abs(f[i]); if (a > peak) peak = a; }
    const g = Math.min(3, 0.95 / peak), out = new Int16Array(f.length);
    for (let i = 0; i < f.length; i++) out[i] = Math.max(-1, Math.min(1, f[i] * g)) * 32767;
    return new Uint8Array(out.buffer);
  }
  const stopTalk = () => { clearTimeout(talkT); talkT = null; };
  const pcmPending = new Map();                       // طلبات صوت بدأت مسبقاً (المقطع التالي يُجهَّز أثناء نطق الحالي)
  function pcmFetch(text) {
    let p = pcmPending.get(text);
    if (!p) {
      p = fetch(`${CONFIG.apiBase}/api/tts-pcm`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) });
      p.catch(() => {});
      if (pcmPending.size > 12) pcmPending.delete(pcmPending.keys().next().value);
      pcmPending.set(text, p);
    }
    return p;
  }
  return {
    own: true, simli: true,
    events: own.events,
    ensure: connect,
    prefetch(text) { if (client) pcmFetch(text); return !!client; },
    functions: {
      async speak({ input }) {
        const my = ++token;
        if (attractOn) return own.functions.speak({ input });                   // ترحيب الخمول بصورة نزيه وصوته: لا يفتح جلسة Simli ولا يستهلك دقائقها
        const ok = client ? true : await Promise.race([connect(), sleep(CONFIG.simliConnectWait * 1000).then(() => false)]);
        if (my !== token) return;
        if (!ok || !client) return own.functions.speak({ input });             // الاحتياطي: صورة نزيه وصوته
        // الصوت يصل متدفقاً من الخادم ويُرسل إلى Simli أول بأول، فيبدأ الكلام قبل اكتمال توليد المقطع
        let r = null;
        try { r = await pcmFetch(input); pcmPending.delete(input); } catch {}
        if (my !== token) return;
        if (!r || !r.ok || !r.body || !client) return own.functions.speak({ input });
        if (DEBUG) { T.voice = r.headers.get('x-tts') || ''; }
        const reader = r.body.getReader(); let carry = null, total = 0, t0 = 0;
        try {
          for (;;) {
            const { done, value } = await reader.read();
            if (my !== token || !client) { try { reader.cancel(); } catch {} return; }
            if (done) break;
            let u = value;
            if (carry) { const m = new Uint8Array(carry.length + u.length); m.set(carry); m.set(u, carry.length); u = m; carry = null; }
            if (u.length % 2) { carry = u.slice(u.length - 1); u = u.subarray(0, u.length - 1); }   // العيّنة 2 بايت: لا نقطعها
            for (let i = 0; i < u.length; i += 6000) client.sendAudioData(u.slice(i, i + 6000));
            if (!total && u.length) { t0 = performance.now(); audio.volume = settings.volume; own.emit('TALKING'); stopTalk(); }
            total += u.length;
          }
        } catch (e) { console.warn('Simli stream:', e?.message); }
        if (!total) return own.functions.speak({ input });
        const remain = (total / 32000) * 1000 - (performance.now() - t0) + 200;                     // 32000 بايت = ثانية صوت
        stopTalk(); talkT = setTimeout(() => { talkT = null; if (my === token) own.emit('IDLE'); }, Math.max(200, remain));
      },
      interrupt() {
        token++; stopTalk();
        try { client?.ClearBuffer(); } catch {}
        own.functions.interrupt();
      },
      toggleMicState() {}, reconnect: connect, connect,
    },
    stop() { const c = client; client = null; setLive(false); try { c?.stop(); } catch {} },
  };
}
if (OWN) window.DID_AGENTS_API = window.NAZIH_SIMLI ? makeSimliAvatar(makeOwnAvatar()) : makeOwnAvatar();
window.addEventListener('pagehide', () => { try { window.DID_AGENTS_API?.stop?.(); } catch {} });

/* طابور النطق: ينطق أول جملة فور وصولها ثم بقية الرد.
   مع D-ID تنطق الشخصية الحية، وبدونها (أو إذا تعطلت) صوت OpenAI مقطعاً مقطعاً مع تجهيز المقطع التالي مسبقاً. */
let speakingNow = false, lastSpokeAt = 0;
function makeSpeaker() {
  const my = ++speakSeq, q = [], pre = new Map(); let done = false, wake = null, cur = null;
  const live = () => my === speakSeq;
  const tts = (t) => { if (!pre.has(t)) { const p = ttsBuffer(t); p.catch(() => {}); pre.set(t, p); } return pre.get(t); };
  const next = async () => { for (;;) { if (!live()) return null; if (q.length) return q.shift(); if (done) return null; await new Promise((r) => { wake = r; }); } };
  const run = (async () => {
    speakingNow = true;
    try {
      // ---- شخصية D-ID ----
      while (did) {
        if (cur === null) cur = await next();
        if (cur === null) return;
        if (did.own && !settings.voice) { cur = null; continue; }
        let ok = false, err = null;
        for (let attempt = 0; attempt < 2 && !ok && live() && did; attempt++) {     // محاولة ثانية قبل اعتبار D-ID متعطلاً
          try {
            await ensureDidConnected();
            if (!live()) return;
            if (didDown) throw new Error('not connected');
            T.mark('speakCall');
            await Promise.race([did.functions.speak({ type: 'text', input: cur }), sleep(20000).then(() => { throw new Error('speak timeout'); })]);
            ok = true;
          } catch (e) { err = e; if (live() && attempt === 0) await sleep(800); }
        }
        if (!live()) return;
        if (!ok) { dropDid(err?.message); break; }                 // cur يبقى ليُنطق بالصوت الاحتياطي
        await waitDidDone(cur.length); cur = null;
      }
      // ---- الصوت الاحتياطي (OpenAI ثم صوت المتصفح) ----
      for (;;) {
        if (cur === null) cur = await next();
        if (cur === null || !live()) return;
        const text = cur; cur = null;
        if (!settings.voice) continue;
        let buf = null;
        try { buf = await tts(text); } catch {}
        if (!live()) return;
        if (q[0]) tts(q[0]);                                       // جهّز المقطع التالي أثناء نطق الحالي
        await (buf ? playBuffer(buf) : browserSpeak(text));
      }
    } catch (e) { console.warn('speak:', e); }
    finally { if (live()) { speakingNow = false; lastSpokeAt = performance.now(); if (!did) setTalking(false); resetIdle(); } }
  })();
  const kick = () => { const w = wake; wake = null; if (w) w(); };
  return {
    push(t) { t = (t || '').trim(); if (!t) return; q.push(t); if ((!did || did.own) && settings.voice && q.length <= 2 && !did?.prefetch?.(t)) tts(t); kick(); },
    end() { done = true; kick(); return run; },
  };
}
const speechChunk = () => (did && !did.own ? 700 : 320);    // مقاطع أقصر للصوت الاحتياطي حتى يبدأ النطق أسرع
async function speak(text) {
  stopSpeaking();
  if (!text || (!did && !settings.voice)) return;
  const sp = makeSpeaker();
  // أول مقطع قصير (الجملة الأولى) ليبدأ الكلام بسرعة، ثم البقية بمقاطع أطول
  const m = /[.؟?!،؛:\n]/.exec(text.slice(25)), cut = m ? 25 + m.index + 1 : 0;
  if (cut && cut <= 170 && cut < text.length - 15) { sp.push(text.slice(0, cut)); splitForSpeech(text.slice(cut), speechChunk()).forEach((x) => sp.push(x)); }
  else splitForSpeech(text, speechChunk()).forEach((x) => sp.push(x));
  await sp.end();
}

let fillerI = Math.floor(Math.random() * 4);
const nextFiller = () => CONFIG.fillers[fillerI++ % CONFIG.fillers.length];

/* ---------------- المحادثة ---------------- */
const capEl = $('#caption'), capQ = $('#capQ'), capA = $('#capA'), micBtn = $('#micBtn');
let history = [], busy = false, session = 0;

function setStatus(t, cls = '') {
  const s = $('#status'); s.textContent = t; s.className = `status ${cls}`;
  clearTimeout(setStatus.timer);
  if (did && !micBtn.classList.contains('stop')) $('#pttLabel').textContent = (cls === 'err' || t === CONFIG.idleStatus) ? pttIdleLabel() : t;
  if (did && cls === 'err') setStatus.timer = setTimeout(() => { s.className = 'status'; }, 5000);   // تنبيه مؤقت فوق الفيديو
}
function showCaption(q, a, thinking = false) {
  capEl.classList.toggle('asked', !!q);
  capQ.hidden = !q; capQ.textContent = q || '';
  if (thinking) capA.innerHTML = '<span class="dots" aria-label="نزيه يفكر"><i></i><i></i><i></i></span>'; else capA.textContent = a;
  capEl.scrollTop = 0;
  // مع شخصية D-ID: الإجابة المكتوبة تظهر مؤقتاً فوق الفيديو ثم تختفي
  clearTimeout(showCaption.timer);
  const visible = thinking || !!q || (!!a && a !== CONFIG.greeting);
  capEl.classList.toggle('show', visible);
  if (did && visible && !thinking) showCaption.timer = setTimeout(() => capEl.classList.remove('show'), Math.max(9000, String(a).length * 110));
}
capEl.addEventListener('click', () => { if (did) capEl.classList.remove('show'); });
function setBusy(on) { busy = on; micBtn.classList.toggle('busy', on); }
/* مقاطعة نزيه: يوقف الكلام ويلغي الجواب الجاري، ليبدأ سؤال جديد فوراً */
let askAbort = null, ignoreTalkUntil = 0;
function interrupt() {
  session++;
  try { askAbort?.abort(); } catch {}
  askAbort = null; clearTimeout(pendingT); pendingQ = ''; pendingN = 0;
  stopSpeaking(); didTalking = false; app.classList.remove('talking'); lastSpokeAt = 0;
  ignoreTalkUntil = did?.own ? 0 : performance.now() + 1500;      // D-ID يتأخر لحظة في إيقاف الكلام: نتجاهل إشاراته خلالها
  setBusy(false); setStatus(CONFIG.idleStatus);
}
const nazihActive = () => busy || speakingNow || didTalking;

/* تحديد نية الزائر: يفتح الوظيفة المناسبة بدل الجواب النصي */
function detectIntent(text) {
  // الأمر الصريح فقط يفتح اللوحة («اختبرني»، «افتح الأنظمة»، «أبي أقيّم»). أما السؤال الذي ترد فيه الكلمة عرَضاً
  // («هل الغش في الاختبار فساد؟»، «ما القيم التي تعزز النزاهة؟») فيذهب للجواب.
  const n = norm(text).replace(/[؟?!.,،:«»"']/g, ' ').replace(/\s+/g, ' ').trim();
  const words = n.split(' '), short = words.length <= 2;
  const has = (...w) => w.some((x) => n.includes(x)), word = (...w) => w.some((x) => words.includes(x));
  const ask = '(?:ابي|ابغي|ابغا|اريد|ودي|بغيت|نبي|عطني|اعطني|سو لي|سوي لي|افتح|افتح لي|ابدا|ابدء|شغل|ورني|اعرض|اعرض لي|خلنا نسوي|يلا)';
  const cmd = (things) => new RegExp(`${ask} (?:ال)?(?:${things})`).test(n);
  if (has('وش تسوي لو', 'ماذا تفعل لو', 'وش اسوي لو') || cmd('موقف|مواقف') || (short && word('موقف', 'مواقف', 'المواقف'))) return 'scenario';
  if (word('اختبرني', 'اختبرنا', 'كويز') || has('اختبر نفسي', 'اختبر معلوماتي', 'اختبر نفسك') || cmd('اختبار|اختبر|مسابقه|تحدي|امتحان') || (short && word('اختبار', 'الاختبار', 'اختبر', 'مسابقه', 'المسابقه', 'تحدي', 'امتحان'))) return 'quiz';
  if (has('قيم تجربتك', 'اقيم تجربتي', 'اقيم التجربه', 'تقييم التجربه', 'تقييم تجربتي', 'اقيمك', 'ابي اقيم', 'ابغي اقيم', 'اريد ان اقيم') || cmd('تقييم|نجوم') || (short && word('تقييم', 'التقييم', 'اقيم', 'قيم', 'نجوم'))) return 'rate';
  if (has('تصفح الانظمه', 'تصفح النظام', 'قائمه الانظمه', 'لوحه الانظمه') || cmd('انظمه|نظام|لوائح|نص النظام|مواد النظام') && !/ماده|عقوب/.test(n) && words.length <= 5 || (short && word('الانظمه', 'انظمه', 'تصفح', 'اللوائح'))) return 'laws';
  return null;
}
const INTENT_LINES = {
  quiz: 'أبشر، لنختبر معلوماتك في النزاهة. اختر الإجابة الصحيحة لكل سؤال.',
  rate: 'يسعدني رأيك. اختر عدد النجوم الذي يعبّر عن تجربتك.',
  scenario: 'أبشر، بعرض عليك مواقف من الواقع، واختر وش تسوي.',
  laws: 'تفضّل، هذه الأنظمة ذات العلاقة. يمكنك البحث في مواد نظام الهيئة.',
};
function findBank(text) { const n = norm(text); return BANK.find((b) => norm(b.q) === n) || BANK.find((b) => b.k.some((k) => n.includes(k))); }

/* =========================================================
 *  البحث في الأنظمة (محلياً داخل الموقع)
 * ========================================================= */
const LAW_ALIASES = {
  // اللوائح قبل أنظمتها: «لائحة الانضباط» تُقدَّم على «نظام الانضباط»
  'discipline-reg': ['لائحه الانضباط', 'لائحه نظام الانضباط', 'التنفيذيه لنظام الانضباط', 'التنفيذيه للانضباط'], 'hr-reg': ['لائحه الموارد البشريه', 'التنفيذيه للموارد البشريه', 'لائحه الخدمه المدنيه', 'التنفيذيه لنظام الخدمه المدنيه'], 'non-saudi-staff': ['غير السعوديين', 'غير سعوديين', 'توظيف غير السعودي'],
  basic: ['اساسي للحكم', 'نظام الحكم', 'النظام الاساسي'], shura: ['شوري'], regions: ['نظام المناطق', 'مناطق المملكه', 'امير المنطقه', 'امراء المناطق'], cabinet: ['مجلس الوزراء'], bayah: ['بيعه'],
  nazaha: ['هيئه الرقابه', 'نظام نزاهه', 'نظام الهيئه', 'نظام مكافحه الفساد'], bribery: ['رشوه', 'رشاوي', 'راشي', 'مرتشي'], protect: ['مبلغين', 'حمايه المبلغ', 'الشهود', 'حمايه الشاهد'], aml: ['غسل الاموال', 'غسيل الاموال', 'غسل اموال', 'غسيل اموال'],
  forgery: ['تزوير', 'مزور', 'محرر رسمي', 'محرر عرفي'], discipline: ['انضباط'], civil: ['خدمه المدنيه', 'خدمه مدنيه'],
  faculty: ['هيئه التدريس', 'منسوبي الجامعات', 'استاذ مساعد', 'استاذ مشارك', 'التفرغ العلمي'],
};
const textLaws = () => (window.LAWS || []).filter((l) => !l.pages && !l.pdf && l.id !== 'forgery-old');
let lastLawId = null;
function detectLaws(n) {                     // كل الأنظمة المذكورة في السؤال (قد يسأل الزائر عن أكثر من نظام)
  const ids = Object.entries(LAW_ALIASES).filter(([, keys]) => keys.some((k) => n.includes(k))).map(([id]) => id);
  for (const l of textLaws()) if (l.id.startsWith('extra-') && n.includes(norm(l.name).split(' ').slice(0, 3).join(' '))) ids.push(l.id);
  return ids;
}
function detectLaw(n) { return detectLaws(n)[0] || null; }
/* تحويل «الثامنة» / «الحادية والعشرون» / «12» إلى رقم */
const NUM_WORDS = [['عشرون', 20], ['عشرين', 20], ['ثلاثون', 30], ['ثلاثين', 30], ['اربعون', 40], ['اربعين', 40], ['خمسون', 50], ['خمسين', 50], ['ستون', 60], ['ستين', 60], ['سبعون', 70], ['سبعين', 70], ['ثمانون', 80], ['ثمانين', 80], ['تسعون', 90], ['تسعين', 90],
  ['حادي', 1], ['احدي', 1], ['احد', 1], ['واحد', 1], ['اثن', 2], ['ثلاث', 3], ['اربع', 4], ['خمس', 5], ['ست', 6], ['سبع', 7], ['ثمان', 8], ['تسع', 9], ['اول', 1], ['ثاني', 2], ['ثالث', 3], ['رابع', 4], ['خامس', 5], ['سادس', 6], ['سابع', 7], ['ثامن', 8], ['تاسع', 9], ['عاشر', 10]];
function wordNum(w) {
  w = w.replace(/^و/, '').replace(/^ال/, '');
  if (/^[0-9٠-٩]+$/.test(w)) return Number(w.replace(/[٠-٩]/g, (d) => d.charCodeAt(0) - 0x660));
  if (w === 'عشر' || w === 'عشره') return 10;
  const hit = NUM_WORDS.find(([k]) => w.startsWith(k));
  return hit ? hit[1] : null;
}
function articleNumber(str) {                 // من نص بعد كلمة «المادة»
  const toks = norm(str).replace(/[()«»"':،.؟?]/g, ' ').trim().split(/\s+/).slice(0, 3);
  let total = 0, got = false;
  for (const tk of toks) { const v = wordNum(tk); if (v === null) break; total += v; got = true; if (/^[0-9٠-٩]+$/.test(tk)) break; }
  return got ? total : null;
}
function lookupArticle(text) {
  const n = norm(text), m = n.match(/(?:الماده|ماده)\s+(.{1,40})/);
  if (!m) return null;
  const num = articleNumber(m[1]); if (!num) return null;
  const lawId = detectLaw(n) || lastLawId;
  if (!lawId) return 'أبشر، من أي نظام تريد هذه المادة؟ اذكر اسم النظام مع رقم المادة، مثل: المادة الثامنة من النظام الجزائي لجرائم التزوير.';
  const law = textLaws().find((l) => l.id === lawId); if (!law) return null;
  lastLawId = lawId;
  const art = law.articles.find((a) => !/مكرر/.test(a.title) && articleNumber(a.title.replace(/^.*?ماده\s*|^المادة\s*/, '')) === num);
  if (!art) return `لم أجد المادة رقم ${num} في ${law.name}، وعدد مواده ${law.articles.filter((a) => !/مكرر|ملحق/.test(a.title)).length}.`;
  return `${art.title} من ${law.name}: ${art.body}`;
}
/* اختيار المواد الأقرب للسؤال لإرسالها مع السؤال إلى الذكاء الاصطناعي */
const STOP = new Set('من في علي الي عن ما هو هي هل كم ماذا متي اين كيف وش ايش ليش لماذا هذا هذه ذلك التي الذي او ان اذا لو مع بين كل قد لا نعم ابي ابغي اريد عطني اذكر اقرا لي نص نظام النظام الماده ماده عقوبه العقوبه'.split(' '));
let LAW_INDEX = null;
function buildIndex() {
  LAW_INDEX = [];
  for (const law of textLaws()) for (const a of law.articles) LAW_INDEX.push({ law, a, n: norm(law.name + ' ' + a.title + ' ' + a.chapter + ' ' + a.body) });
}
function retrieveContext(text) {
  if (!LAW_INDEX) buildIndex();
  const n = norm(text), lawIds = detectLaws(n); if (lawIds.length) lastLawId = lawIds[0];
  const terms = [...new Set(n.replace(/[^ء-ي0-9\s]/g, ' ').split(/\s+/).map((w) => w.replace(/^(وال|بال|لل|ال|و)/, '')).map((w) => (w.length > 5 ? w.replace(/(ات|ين|ون)$/, '') : w)).filter((w) => w.length > 2 && !STOP.has(w)))];
  // إذا ذُكر نظام واحد بعينه وكان قصيراً يُرسل كاملاً، فيجد الذكاء الاصطناعي المادة المطلوبة أياً كانت صياغة السؤال
  if (lawIds.length === 1) {
    const named = textLaws().find((l) => l.id === lawIds[0]);
    const whole = named ? named.articles.map((a) => `【${named.name} — ${a.title}】\n${a.body}\n\n`).join('') : '';
    if (whole && whole.length <= 11000) return whole;
  }
  if (!terms.length && !lawIds.length) return '';
  // وزن كل كلمة بحسب ندرتها: الكلمة التي ترد في أغلب المواد (مثل «هيئة التدريس» داخل لائحتها) لا تميّز مادة عن أخرى
  const N = LAW_INDEX.length;
  const counts = terms.map((tm) => LAW_INDEX.map((e) => e.n.split(tm).length - 1));
  const idf = counts.map((cs) => Math.log(1 + N / (1 + cs.filter(Boolean).length)));
  const all = LAW_INDEX.map((e, i) => {
    let sc = 0;
    terms.forEach((tm, t) => { const c = counts[t][i]; if (c) sc += Math.min(c, 3) * idf[t] * (tm.length > 4 ? 1.3 : 1); });
    if (sc && lawIds.includes(e.law.id)) sc += 4;
    return { e, sc };
  });
  const picked = [];
  // لكل نظام مذكور: أفضل ثلاث مواد مطابقة + مادته الأولى (غالباً التعريفات)، حتى لا يضيع جزء من سؤال متعدد
  for (const id of lawIds) {
    const mine = all.filter((x) => x.e.law.id === id);
    if (mine[0]) picked.push(mine[0]);
    picked.push(...mine.filter((x) => x.sc > 0).sort((x, y) => y.sc - x.sc).slice(0, 3));
  }
  picked.push(...all.filter((x) => x.sc > 0).sort((x, y) => y.sc - x.sc).slice(0, 8));
  let out = ''; const seen = new Set();
  for (const { e } of picked) {
    if (seen.has(e)) continue; seen.add(e);
    const block = `【${e.law.name} — ${e.a.title}】\n${e.a.body.slice(0, 1600)}\n\n`;
    if (out.length + block.length > 10000) break;
    out += block;
  }
  return out;
}

async function ask(text, item = null) {
  text = (text || '').trim();
  if (!text) return;
  if (nazihActive()) interrupt();                // سؤال جديد أثناء الجواب: يقطع القديم
  resetIdle();                                   // السؤال بالصوت يُحسب تفاعلاً مثل اللمس
  const my = session;
  stopSpeaking(); closeSheets();
  const intent = item ? null : detectIntent(text);
  if (intent) { runAction(intent, text); return; }

  if (!T.marks.recEnd) T.reset();
  T.mark('askStart');
  setBusy(true); ensureDidConnected();
  showCaption(text, '', true);
  history.push({ role: 'user', content: text });
  setStatus('نزيه يفكر...');
  let reply, suggestions = [], hit = item, streamed = null;
  const exact = hit ? null : lookupArticle(text);        // «المادة كذا من نظام كذا»: تُقرأ حرفياً من ملف الأنظمة
  if (exact) { reply = exact; T.mark('exact'); T.mark('firstText'); }
  track('q', { kind: hit ? 'bank' : exact ? 'exact' : 'ai', id: hit ? hit.id : '', src: takeSrc(), text: hit ? '' : text });
  if (!hit && !exact) {
    // إذا تأخر الجواب أكثر من لحظة يقول نزيه عبارة قصيرة («أبشر، لحظة») فيحس الزائر أنه سُمع، ثم يكمل بالجواب دون انقطاع
    let sp = null, firstSaid = false;
    const fillT = CONFIG.fillerAfterMs > 0 && settings.voice ? setTimeout(() => {
      if (my !== session || firstSaid || sp) return;
      stopSpeaking(); sp = makeSpeaker(); streamed = sp; sp.push(nextFiller()); T.mark('filler');
    }, CONFIG.fillerAfterMs) : null;
    try {
      const r = await fetch(`${CONFIG.apiBase}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history, context: retrieveContext(text), stream: true }), signal: (askAbort = new AbortController()).signal });
      if (r.ok && r.body && (r.headers.get('content-type') || '').startsWith('text/plain')) {
        if (DEBUG) T.model = r.headers.get('x-chat') || '';
        // رد متدفق: ننطق أول جملة فور اكتمالها بدل انتظار الرد كله
        const reader = r.body.getReader(), dec = new TextDecoder();
        let full = '', spoken = 0;
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          if (my !== session) { try { reader.cancel(); } catch {} return; }
          full += dec.decode(value, { stream: true });
          const ans = full.split('§')[0];
          if (!firstSaid) {
            const m1 = /[.؟?!\n]/.exec(ans.slice(18)), m2 = /[،؛:]/.exec(ans.slice(45));
            const cut = Math.min(m1 ? 18 + m1.index + 1 : Infinity, m2 ? 45 + m2.index + 1 : Infinity);
            if (cut < full.length) {
              spoken = cut;
              T.mark('firstText'); clearTimeout(fillT); firstSaid = true;
              if (!sp) { stopSpeaking(); sp = makeSpeaker(); streamed = sp; }
              sp.push(ans.slice(0, spoken));
            }
          }
          if (ans.trim()) showCaption(text, ans.trim());
        }
        const [ans, extra = ''] = full.split('§');
        reply = ans.trim();
        if (!reply) throw new Error('empty');
        suggestions = extra.split('|').map((x) => x.trim().replace(/^[-•\s]+/, '')).filter((x) => x.length > 3 && x.length < 70).slice(0, 2);
        clearTimeout(fillT); firstSaid = true;
        if (!sp) { stopSpeaking(); sp = makeSpeaker(); streamed = sp; }
        splitForSpeech(ans.slice(spoken), speechChunk()).forEach((x) => sp.push(x));
      } else {
        clearTimeout(fillT); firstSaid = true; streamed = null;
        const data = await r.json();
        if (!r.ok || !data.reply) throw new Error(data.error);
        reply = data.reply; suggestions = data.suggestions || [];
      }
    } catch (e) {
      clearTimeout(fillT); firstSaid = true; streamed = null;
      if (my !== session) return;                  // قوطع عمداً
      console.warn('chat fallback:', e?.message);
      hit = findBank(text);
      reply = hit ? hit.a : 'سؤال جميل! أنا الآن أعمل بالوضع المحدود، فاختر من الأسئلة الجاهزة أمامك، أو جرّب «اختبر نفسك».';
    }
  }
  if (hit) reply = hit.a;
  setBusy(false);
  if (my !== session) return;
  history.push({ role: 'assistant', content: reply }); history = history.slice(-10);
  showCaption(text, reply);
  if (suggestions.length) addFollowUps(suggestions);
  if (hit?.sheet) openSheet(hit.sheet);
  setStatus(CONFIG.idleStatus);
  if (streamed && !hit) await streamed.end(); else await speak(reply);
  if (my === session && !recState && !busy && !did) setStatus(CONFIG.idleStatus);
}

async function runAction(name, said = '') {
  const my = session;
  stopSpeaking();
  resetIdle(); track('q', { kind: 'action', id: name, src: takeSrc() });
  if (name === 'quiz') startQuiz();
  openSheet(name);
  if (name === 'scenario') { showCaption(said, ''); setStatus(CONFIG.idleStatus); startScenario(); return; }   // نزيه يقرأ الموقف نفسه
  showCaption(said, INTENT_LINES[name]);
  setStatus(CONFIG.idleStatus);
  await speak(INTENT_LINES[name]);
  if (my === session && !recState && !busy) setStatus(CONFIG.idleStatus);
}

function newChat() {
  session++; stopSpeaking(); setBusy(false);
  history = []; showCaption('', CONFIG.greeting); setStatus(CONFIG.idleStatus);
}

$('#kbBtn').addEventListener('click', () => {      // مع الأفتار الحي: زر لوحة المفاتيح يُظهر خانة الكتابة ويخفيها
  const on = document.body.classList.toggle('typing'); buzz(10);
  if (on) { ensureAudio(); $('#textInput').focus(); } else $('#textInput').blur();
});
$('#textForm').addEventListener('submit', (e) => {
  e.preventDefault(); ensureAudio(); document.body.classList.remove('typing');
  const v = $('#textInput').value; $('#textInput').value = ''; $('#textInput').blur();
  askSrc = 'text'; ask(v);
});

/* ---------------- الأسئلة المتحركة ---------------- */
const carousel = $('#carousel');
let followUps = [];
const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const chipHTML = (c, cls = '') => `<button class="chip ${cls} ${c.cls || ''}" role="listitem" data-id="${escapeHTML(c.id)}"><svg viewBox="0 0 24 24">${ICONS[c.icon] || ICONS.spark}</svg><span>${escapeHTML(c.q)}</span></button>`;
function renderCarousel(reshuffle = false) {
  if (reshuffle || !renderCarousel.order) {
    // بطاقات الوظائف موزعة بين الأسئلة: الاختبار أولاً، ثم الأسئلة بترتيب متنوع كل مرة
    const qs = shuffle(BANK);
    renderCarousel.order = [ACTIONS[0], ...qs.slice(0, 2), ACTIONS[1], ...qs.slice(2, 6), ACTIONS[2], ...qs.slice(6, 10), ACTIONS[3], ...qs.slice(10)];
  }
  carousel.innerHTML = followUps.map((q, i) => chipHTML({ id: `ai:${i}`, icon: 'spark', q }, 'ai')).join('') + renderCarousel.order.map((c) => chipHTML(c)).join('');
  carousel.scrollTo({ left: 0 });
}
function addFollowUps(list) { followUps = list.slice(0, 2); renderCarousel(); }

// الضغط على بطاقة (مع تجاهل الضغط إذا كان سحباً)
let dragMoved = false;
carousel.addEventListener('click', (e) => {
  const chip = e.target.closest('.chip'); if (!chip || dragMoved) return;
  ensureAudio(); buzz(12); askSrc = 'chip';
  const id = chip.dataset.id;
  if (id.startsWith('ai:')) return ask(followUps[Number(id.slice(3))]);
  if (ACTIONS.some((a) => a.id === id)) return runAction(id, '');
  const item = BANK.find((b) => b.id === id);
  if (item) ask(item.q, item);
});
// السحب بالماوس على الكمبيوتر (اللمس يعمل تلقائياً)
let dragX = null, dragLeft = 0;
carousel.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; dragX = e.clientX; dragLeft = carousel.scrollLeft; dragMoved = false; });
window.addEventListener('pointermove', (e) => {
  if (dragX === null) return;
  const dx = e.clientX - dragX;
  if (Math.abs(dx) > 6) { dragMoved = true; carousel.classList.add('drag'); }
  if (dragMoved) carousel.scrollLeft = dragLeft - dx;
});
window.addEventListener('pointerup', () => { if (dragX === null) return; dragX = null; carousel.classList.remove('drag'); setTimeout(() => { dragMoved = false; }, 0); });
carousel.addEventListener('wheel', (e) => { if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { carousel.scrollLeft -= e.deltaY; e.preventDefault(); } }, { passive: false });
// اهتزاز خفيف عند الانتقال من بطاقة لأخرى
let lastSnap = 0;
carousel.addEventListener('scroll', () => {
  const w = carousel.firstElementChild?.offsetWidth || 1, i = Math.round(Math.abs(carousel.scrollLeft) / w);
  if (i !== lastSnap) { lastSnap = i; buzz(6); }
}, { passive: true });

/* ---------------- التسجيل الصوتي ---------------- */
let recState = null;
micBtn.addEventListener('click', () => {
  if (did && CONFIG.ownBrain) {               // عقل الموقع: الزر يسجّل سؤال الزائر ثم يتوقف تلقائياً عند الصمت
    buzz(15);
    if (recState) { recState.stop(); return; }
    ensureAudio();
    if (nazihActive()) interrupt();              // ضغطة أثناء الجواب: يسكت نزيه ويسمع السؤال الجديد
    if (autoMic) { autoMic.toggle(); return; }
    if (navigator.mediaDevices?.getUserMedia && window.MediaRecorder) startRecording();
    else startBrowserRecognition();
    return;
  }
  if (did && CONFIG.pushToTalk) {            // مع شخصية D-ID: الزر يفتح المايك أو يقفله
    buzz(15);
    if (!micOpen) { try { Promise.resolve(did.functions.interrupt()).catch(() => {}); } catch {} }
    setMic(!micOpen); return;
  }
  ensureAudio(); buzz(15);
  const wasTalking = talking;
  stopSpeaking();
  if (recState) { recState.stop(); return; }
  if (busy) return;
  if (wasTalking) setStatus(CONFIG.idleStatus);
  if (navigator.mediaDevices?.getUserMedia && window.MediaRecorder) startRecording();
  else startBrowserRecognition();
});

async function startRecording() {
  let stream;
  try { stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } }); }
  catch { setStatus('لم أستطع الوصول للمايك — اسمح للمتصفح باستخدامه', 'err'); return; }

  const mime = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'].find((m) => MediaRecorder.isTypeSupported(m)) || '';
  const recorder = new MediaRecorder(stream, mime ? { mimeType: mime, audioBitsPerSecond: 32000 } : { audioBitsPerSecond: 32000 });
  const chunks = [];
  const src = audioCtx.createMediaStreamSource(stream);
  const micAnalyser = audioCtx.createAnalyser(); micAnalyser.fftSize = 512; src.connect(micAnalyser);
  const buf = new Uint8Array(micAnalyser.frequencyBinCount);
  let heardSpeech = false, lastLoud = performance.now(), stopped = false;
  const startedAt = performance.now();
  const stop = () => { if (stopped) return; stopped = true; try { recorder.stop(); } catch {} };
  recState = { stop };

  recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
  recorder.onstop = async () => {
    stream.getTracks().forEach((t) => t.stop());
    src.disconnect(); recState = null; micLevel = 0;
    micBtn.classList.remove('listening');
    if (!heardSpeech) { setStatus('ما سمعتك، حاول مرة ثانية 😊', 'err'); return; }
    processSpeech(new Blob(chunks, { type: recorder.mimeType || 'audio/webm' }), false);
  };

  const monitor = () => {
    if (stopped) return;
    micAnalyser.getByteTimeDomainData(buf);
    let sum = 0; for (let i = 0; i < buf.length; i++) { const v = (buf[i] - 128) / 128; sum += v * v; }
    const rms = Math.sqrt(sum / buf.length);
    micLevel += (Math.min(1, rms * 8) - micLevel) * 0.4;
    const now = performance.now();
    if (rms > 0.035) { heardSpeech = true; lastLoud = now; }
    if (heardSpeech && now - lastLoud > CONFIG.silenceMs) return stop();
    if (!heardSpeech && now - startedAt > 7000) return stop();
    if (now - startedAt > CONFIG.maxRecordSeconds * 1000) return stop();
    requestAnimationFrame(monitor);
  };
  recorder.start();
  micBtn.classList.add('listening');
  setStatus('أسمعك... تكلّم الآن', 'listening');
  monitor();
}

let pendingQ = '', pendingN = 0, pendingT = null;
/* علامات السؤال الناقص: ينتهي بنقاط، أو بحرف عطف أو جر أو أداة معلّقة */
const DANGLING = /(?:\.{2,}|…)\s*$|(?:^|\s)(?:و|أو|او|ثم|بين|من|في|على|عن|الى|إلى|مع|وال|ال|بال|لل|وبين|ولا|لو|اذا|إذا|يعني|اللي|الذي|التي|لكن|بس)\s*$/;
/* تحويل التسجيل إلى نص ثم سؤال نزيه. quiet=true في الاستماع التلقائي: يتجاهل ما لا يُفهم بدون رسالة خطأ */
const STT_NOISE = ['اشتركوا في القناه', 'ترجمه نانسي', 'شكرا للمشاهده', 'شكرا علي المشاهده', 'موسيقي', 'تصفيق', 'ترجمه', 'subtitles', 'thank you for watching'];
async function processSpeech(blob, quiet) {
  setStatus('جاري تحويل كلامك لنص...'); setBusy(true);
  const my = session;
  try {
    const r = await fetch(`${CONFIG.apiBase}/api/stt`, { method: 'POST', headers: { 'Content-Type': blob.type }, body: blob });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error);
    setBusy(false);
    if (my !== session) return;
    T.mark('sttDone');
    const text = (data.text || '').trim(), n = norm(text);
    const junk = !text || (quiet && (n.replace(/\s/g, '').length < 4 || STT_NOISE.some((x) => n.includes(x) && n.length < x.length + 12)));
    if (junk) { if (!pendingQ) setStatus(quiet ? CONFIG.idleStatus : 'ما فهمتك، حاول مرة ثانية 😊', quiet ? '' : 'err'); return; }
    // سؤال انقطع في منتصفه (الزائر توقف ليفكر): نحتفظ به وننتظر التكملة، ثم نرسل الجملة كاملة
    const full = (pendingQ ? pendingQ + (/(?:^|\s)(?:و?ال|بال|لل)$/.test(pendingQ) ? '' : ' ') : '') + text;      // «وال» + «هدية» = «والهدية»
    clearTimeout(pendingT);
    if (CONFIG.waitIncomplete && pendingN < 2 && DANGLING.test(full)) {
      pendingQ = full.replace(/(?:\.{2,}|…)\s*$/, '').trim(); pendingN++;
      showCaption(pendingQ + ' …', '');
      setStatus('كمّل سؤالك.. أسمعك', 'listening');
      const fire = () => {
        if (autoMic?.recording || recState || busy) { pendingT = setTimeout(fire, 1500); return; }     // ما زال يتكلم: انتظر
        const q = pendingQ; pendingQ = ''; pendingN = 0; if (q) ask(q);
      };
      pendingT = setTimeout(fire, 5000);
      return;
    }
    pendingQ = ''; pendingN = 0;
    ask(full);
  } catch (e) {
    if (my !== session) return;
    console.warn('stt:', e?.message); setBusy(false);
    setStatus(quiet ? CONFIG.idleStatus : 'تعذّر سماعك الآن — اختر من الأسئلة أو اكتب سؤالك 😊', quiet ? '' : 'err');
  }
}

/* ---------------- الاستماع التلقائي (بدون ضغط) ----------------
   المايك يبقى مفتوحاً للموقع فقط، ويبدأ التسجيل عند سماع كلام واضح قريب، ويتوقف بعد الصمت.
   يتوقف عن السمع تماماً ونزيه يتكلم أو يفكر حتى لا يسمع نفسه، ويتكيّف مع ضجيج المكان. */
let autoMic = null;
async function startAutoListen() {
  if (autoMic || !CONFIG.handsFree || !did || !CONFIG.ownBrain) return;
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) return;
  let stream;
  try { stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } }); }
  catch { setStatus('اسمح للمتصفح باستخدام المايك، أو اضغط زر التحدث', 'err'); return; }
  if (autoMic) { stream.getTracks().forEach((t) => t.stop()); return; }
  ensureAudio();
  const src = audioCtx.createMediaStreamSource(stream);
  const an = audioCtx.createAnalyser(); an.fftSize = 512; src.connect(an);
  const buf = new Uint8Array(an.fftSize);
  const mime = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'].find((m) => MediaRecorder.isTypeSupported(m)) || '';
  let noise = 0.012, rec = null, chunks = [], loudMs = 0, lastLoud = 0, startedAt = 0, last = performance.now(), forced = false, barge = false;
  const finish = (keep) => {
    const r = rec; if (!r) return;
    if (keep) { T.reset(); T.marks.lastWord = lastLoud; T.mark('recEnd'); }
    rec = null; forced = false; barge = false; micLevel = 0; micBtn.classList.remove('listening');
    const parts = chunks; chunks = [];
    r.onstop = keep ? () => processSpeech(new Blob(parts, { type: r.mimeType || 'audio/webm' }), true) : null;
    try { r.stop(); } catch {}
    if (!keep) setStatus(CONFIG.idleStatus);
  };
  const begin = (now) => {
    chunks = []; const mine = chunks;
    rec = new MediaRecorder(stream, mime ? { mimeType: mime, audioBitsPerSecond: 32000 } : { audioBitsPerSecond: 32000 });
    rec.ondataavailable = (e) => e.data.size && mine.push(e.data);
    rec.start(); startedAt = now; lastLoud = now; loudMs = 0;
    if (barge) return;                                       // تسجيل صامت أثناء كلام نزيه (مقاطعة محتملة)
    ensureDidConnected();                                    // جهّز الأفتار أثناء كلام الزائر
    resetIdle();
    micBtn.classList.add('listening'); setStatus('أسمعك... تكلّم الآن', 'listening');
  };
  const blocked = () => busy || speakingNow || didTalking || recState || document.hidden || performance.now() - lastSpokeAt < 700;
  const timer = setInterval(() => {
    if (audioCtx.state === 'suspended') return;
    const now = performance.now(), dt = Math.min(200, now - last); last = now;
    an.getByteTimeDomainData(buf);
    let sum = 0; for (let i = 0; i < buf.length; i++) { const v = (buf[i] - 128) / 128; sum += v * v; }
    const rms = Math.sqrt(sum / buf.length);
    if (CONFIG.bargeIn && (speakingNow || didTalking) && !recState && !document.hidden) {
      // المقاطعة بالصوت: يلزم صوت قريب وواضح (أعلى بكثير من صوت نزيه المرتد من السماعة) لنصف ثانية متصلة تقريباً
      const loudB = rms > Math.max(0.10, noise * 5);
      if (!rec) { if (loudB) { barge = true; begin(now); } return; }
      if (barge) {
        if (loudB) { loudMs += dt; lastLoud = now; }
        if (loudMs >= 500) {
          barge = false; interrupt();
          micBtn.classList.add('listening'); setStatus('أسمعك... تكلّم الآن', 'listening');
        } else if (now - lastLoud > 400) finish(false);
        return;
      }
    }
    if (blocked()) { if (rec) finish(false); return; }
    const thr = Math.max(CONFIG.autoMinLevel, noise * 3), loud = rms > thr;
    noise += (rms - noise) * (loud ? 0.002 : 0.05);            // تقدير ضجيج المكان
    if (!rec) { if (!loud) return; begin(now); }
    micLevel += (Math.min(1, rms * 8) - micLevel) * 0.4;
    if (loud) { loudMs += dt; lastLoud = now; }
    if (now - lastLoud > CONFIG.silenceMs) finish(loudMs >= CONFIG.autoMinSpeechMs);
    else if (forced && !loudMs && now - startedAt > 7000) finish(false);
    else if (now - startedAt > CONFIG.maxRecordSeconds * 1000) finish(true);
  }, 50);
  autoMic = {
    get recording() { return !!rec; },
    toggle() { if (rec) return finish(loudMs >= 200); forced = true; begin(performance.now()); },   // ضغطة الزر: ابدأ أو أنهِ يدوياً
    stop() { clearInterval(timer); if (rec) finish(false); stream.getTracks().forEach((t) => t.stop()); try { src.disconnect(); } catch {} autoMic = null; },
  };
  setStatus(CONFIG.idleStatus);
}
// المتصفحات تشترط لمسة واحدة من المستخدم قبل تشغيل الصوت والمايك
['pointerdown', 'keydown'].forEach((ev) => window.addEventListener(ev, () => { if (did && CONFIG.handsFree) { ensureAudio(); Promise.resolve(audioCtx.resume?.()).then(() => startAutoListen()).then(() => { if (!busy && !speakingNow && !didTalking && !recState && !autoMic?.recording) setStatus(CONFIG.idleStatus); }).catch(() => {}); } }, { passive: true }));

// بديل: التعرف على الكلام من المتصفح
function startBrowserRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { setStatus('المتصفح لا يدعم المايك — اكتب سؤالك بالأسفل', 'err'); return; }
  const rec = new SR();
  rec.lang = 'ar-SA'; rec.interimResults = false; rec.maxAlternatives = 1;
  recState = { stop: () => rec.stop() };
  micBtn.classList.add('listening');
  setStatus('أسمعك... تكلّم الآن', 'listening');
  rec.onresult = (e) => ask(e.results[0][0].transcript);
  rec.onend = () => { recState = null; micBtn.classList.remove('listening'); };
  rec.onerror = () => setStatus('ما فهمتك، حاول مرة ثانية 😊', 'err');
  rec.start();
}

/* ---------------- اللوحات ---------------- */
function openSheet(name) {
  $$('.sheet').forEach((s) => { s.hidden = s.id !== `sheet-${name}`; });
  const s = $(`#sheet-${name}`); if (s) { $('.sheet-body', s).scrollTop = 0; if (name === 'rate') resetRate(); }
}
function closeSheets() { $$('.sheet').forEach((s) => { s.hidden = true; }); }
$$('[data-close]').forEach((b) => b.addEventListener('click', () => { closeSheets(); buzz(8); }));

/* الأنظمة */
/* تقسيم نص نظام ملصوق في laws-extra.js إلى مواد أو بنود */
function parseLawText(text) {
  const lines = String(text || '').replace(/\r/g, '').split('\n').map((l) => l.trimEnd());
  const ART = /^(ال)?مادة\s*[(\d\u0600-\u06FF\s)]{0,40}:?\s*$/;
  const ORD = /^(أولاً|ثانياً|ثالثاً|رابعاً|خامساً|سادساً|سابعاً|ثامناً|تاسعاً|عاشراً)\s*:/;
  const HEAD = /^(الباب|الفصل)\s+(الأول|الثاني|الثالث|الرابع|الخامس|السادس|السابع|الثامن|التاسع|العاشر|الحادي)/;
  const byArticle = lines.some((l) => ART.test(l.trim()) && l.trim().length < 45);
  const arts = [], pre = []; let cur = null, chapter = '';
  for (const l of lines) {
    const s = l.trim();
    if (byArticle && HEAD.test(s) && s.length < 90) { chapter = s; cur = null; continue; }
    if (byArticle && ART.test(s) && s.length < 45) {
      cur = { title: s.replace(/:$/, '').replace(/\s+/g, ' ').replace(/^مادة\s*/, 'المادة '), chapter, body: [] }; arts.push(cur); continue;
    }
    if (!byArticle && ORD.test(s)) { cur = { title: 'البند ' + s.match(ORD)[1], chapter: '', body: [l] }; arts.push(cur); continue; }
    (cur ? cur.body : pre).push(l);
  }
  const join = (a) => a.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  arts.forEach((x) => { x.body = join(x.body); });
  return { preamble: join(pre), articles: arts };
}
(function mergeExtraLaws() {
  const all = window.LAWS || [], extra = (window.EXTRA_LAWS || []).map((e, i) => ({ id: 'extra-' + i, name: e.name || '', decree: e.decree || '', note: e.note || '', preLabel: 'تمهيد', ...parseLawText(e.text) }));
  const at = all.findIndex((l) => l.pages || l.pdf);   // الإضافات قبل اللوائح المصوّرة
  window.LAWS = at < 0 ? [...all, ...extra] : [...all.slice(0, at), ...extra, ...all.slice(at)];
})();

/* نمط بحث يتجاهل التشكيل واختلاف الهمزات والتاء المربوطة */
function searchRegex(q) {
  const map = { 'ا': '[اأإآ]', 'ه': '[هة]', 'ي': '[يى]' };
  const body = [...norm(q)].map((ch) => map[ch] || ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('[\u064B-\u0652\u0640]*');
  return new RegExp(body, 'g');
}
function renderLaw(filter = '') {
  const box = $('#lawList'), laws = window.LAWS || [];
  let f = filter.trim(), re = f ? searchRegex(f) : null;
  const match = (a) => { re.lastIndex = 0; if (re.test(a.title)) return true; re.lastIndex = 0; return re.test(a.body); };
  const itemsOf = (law) => (law.preamble ? [{ title: law.preLabel || (law.decree.startsWith('أمر ملكي') ? 'الأمر الملكي' : 'المرسوم الملكي وقرار مجلس الوزراء'), chapter: '', body: law.preamble }] : []).concat(law.articles);
  if (f.startsWith('ال') && f.length > 3 && !laws.some((l) => itemsOf(l).some(match))) { f = f.slice(2); re = searchRegex(f); }   // «الثروة» ← «ثروة»
  const hl = (t) => { const safe = escapeHTML(t); return re ? safe.replace(re, (m) => `<mark>${m}</mark>`) : safe; };
  let total = 0;
  const html = laws.map((law) => {
    if (law.pdf) {     // لائحة مصوّرة تُفتح كملف PDF (غير قابلة للبحث)
      if (f) return '';
      return `<details class="law pages" data-pdf="1">
        <summary><span class="law-name">${escapeHTML(law.name)}<small>${escapeHTML(law.decree)}</small></span><span class="badge">${law.pdfPages || ''} صفحة</span></summary>
        <div class="pdf-box"><p>هذه اللائحة متاحة كنسخة مصوّرة من الطبعة الرسمية.</p><a class="pdf-open" href="${law.pdf}" target="_blank" rel="noopener">فتح اللائحة (PDF)</a></div></details>`;
    }
    if (law.pages) {   // لائحة معروضة كصور صفحات (غير قابلة للبحث)
      if (f) return '';
      return `<details class="law pages" data-law="${law.id}">
        <summary><span class="law-name">${escapeHTML(law.name)}<small>${escapeHTML(law.decree)}</small></span><span class="badge">${law.pages.length} صفحة</span></summary>
        <div class="pages-box"></div></details>`;
    }
    const shown = itemsOf(law).filter((a) => !f || match(a));
    if (!shown.length) return '';
    total += shown.length;
    total += 0; const count = f ? `${shown.length} نتيجة` : `${law.articles.filter((a) => !/^(ال)?ملحق/.test(a.title)).length} ${(law.articles[0]?.title || '').startsWith('البند') ? 'بنود' : 'مادة'}`;
    return `<details class="law" ${f ? 'open' : ''}>
      <summary><span class="law-name">${escapeHTML(law.name)}<small>${escapeHTML(law.decree)}${!law.decree || /هـ|م$/.test(law.decree) ? '' : 'هـ'}</small></span><span class="badge">${count}</span></summary>
      ${law.note ? `<p class="law-note">${escapeHTML(law.note)}</p>` : ''}
      <div class="articles">${shown.map((a) => `<details ${f ? 'open' : ''}><summary><span>${hl(a.title)}<span class="chapter">${escapeHTML(a.chapter || '')}</span></span></summary><div class="body">${hl(a.body)}</div></details>`).join('')}</div>
    </details>`;
  }).join('');
  box.innerHTML = html || '<p>لا توجد نتائج مطابقة.</p>';
  // صور الصفحات تُحمّل فقط عند فتح اللائحة
  $$('details.law.pages:not([data-pdf])', box).forEach((d) => d.addEventListener('toggle', () => {
    const pb = $('.pages-box', d); if (!d.open || pb.childElementCount) return;
    const law = laws.find((l) => l.id === d.dataset.law);
    pb.innerHTML = law.pages.map((p, i) => `<img loading="lazy" src="${p}" alt="${escapeHTML(law.name)} — صفحة ${i + 1}">`).join('');
  }));
  $('#lawCount').textContent = f ? (total ? `${total} نتيجة في الأنظمة واللوائح` : '') : `${laws.length} أنظمة ولوائح — اضغط على الاسم للعرض`;
}
renderLaw();
let lawTimer;
$('#lawSearch').addEventListener('input', (e) => { clearTimeout(lawTimer); lawTimer = setTimeout(() => renderLaw(e.target.value), 250); });

/* الاختبار التفاعلي */
let quiz = null;
function startQuiz() { quiz = { items: shuffle(window.QUIZ).slice(0, CONFIG.quizLength), i: 0, score: 0, picks: [] }; renderQuiz(); }
function renderQuiz() {
  const box = $('#quiz'), n = quiz.items.length;
  if (quiz.i >= n) {
    const pct = quiz.score / n;
    const msg = pct >= 0.8 ? 'ممتاز! أنت سفير للنزاهة' : pct >= 0.5 ? 'جيد! وتستطيع الوصول للعلامة الكاملة' : 'لا بأس، تصفّح الأنظمة وحاول مرة ثانية';
    box.innerHTML = `<div class="score">${quiz.score} / ${n}</div><p class="score-msg">${msg}</p>
      <div class="btn-row"><button class="btn" id="qAgain">اختبار جديد</button><button class="btn ghost" id="qShare">مشاركة النتيجة</button></div>
      <div class="review">${quiz.items.map((it, i) => `<div class="card"><b>${i + 1}. ${escapeHTML(it.q)}</b><br>
        <span class="${quiz.picks[i] === it.a ? 'ok' : 'no'}">${quiz.picks[i] === it.a ? 'إجابتك صحيحة' : 'إجابتك: ' + escapeHTML(it.o[quiz.picks[i]])}</span><br>
        الإجابة الصحيحة: ${escapeHTML(it.o[it.a])}<br><span class="meta">${escapeHTML(it.e)}</span></div>`).join('')}</div>`;
    $('#qAgain').onclick = () => { startQuiz(); $('#quiz').scrollTop = 0; };
    $('#qShare').onclick = async (e) => {
      const text = `حصلت على ${quiz.score} من ${n} في اختبار النزاهة مع «نزيه» — اليوم العالمي لمكافحة الفساد، جامعة حائل.`;
      try { if (navigator.share) await navigator.share({ text }); else { await navigator.clipboard.writeText(text); e.target.textContent = 'تم نسخ النتيجة'; } } catch {}
    };
    track('quiz', { score: quiz.score, n });
    const line = `نتيجتك ${quiz.score} من ${n}. ${msg}.`;
    showCaption('', line); speak(line);
    return;
  }
  const it = quiz.items[quiz.i];
  box.innerHTML = `<div class="q-progress"><div style="width:${(quiz.i / n) * 100}%"></div></div>
    <div class="q-num">السؤال ${quiz.i + 1} من ${n}</div>
    <div class="q-text">${escapeHTML(it.q)}</div>
    <div class="q-opts">${it.o.map((o, i) => `<button class="q-opt" data-i="${i}">${escapeHTML(o)}</button>`).join('')}</div>
    <div id="qAfter"></div>`;
  $$('.q-opt', box).forEach((b) => b.addEventListener('click', () => {
    const i = Number(b.dataset.i), ok = i === it.a;
    quiz.picks[quiz.i] = i; buzz(ok ? 12 : [20, 40, 20]);
    $$('.q-opt', box).forEach((x) => { x.disabled = true; if (Number(x.dataset.i) === it.a) x.classList.add('correct'); });
    if (ok) quiz.score++; else b.classList.add('wrong');
    $('#qAfter').innerHTML = `<div class="q-exp"><b>${ok ? 'إجابة صحيحة!' : 'الإجابة الصحيحة موضحة بالأخضر.'}</b>${escapeHTML(it.e)}</div>
      <button class="btn" id="qNext">${quiz.i + 1 < n ? 'السؤال التالي' : 'النتيجة'}</button>`;
    $('#qNext').onclick = () => { quiz.i++; renderQuiz(); $('#quiz').scrollTop = 0; };
    $('#qNext').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }));
}

/* التقييم (يُحفظ عدده في متصفح الشاشة فقط) */
function resetRate() { $('#rateMsg').textContent = 'كيف كانت تجربتك؟ اختر عدد النجوم.'; $$('#stars button').forEach((b) => b.classList.remove('on')); }
$$('#stars button').forEach((b) => b.addEventListener('click', () => {
  const v = Number(b.dataset.v); buzz(12);
  $$('#stars button').forEach((x) => x.classList.toggle('on', Number(x.dataset.v) <= v));
  try { const r = JSON.parse(localStorage.getItem('nazih-ratings') || '[0,0,0,0,0]'); r[v - 1]++; localStorage.setItem('nazih-ratings', JSON.stringify(r)); } catch {}
  track('rate', { v });
  $('#rateMsg').textContent = 'شكراً لك! رأيك يساعدنا على التطوير.';
  setTimeout(() => { if (!$('#sheet-rate').hidden) closeSheets(); }, 2200);
}));


/* ---------------- مواقف «وش تسوي لو؟» ---------------- */
let scn = null;
const VERDICT = { best: 'التصرف الأمثل', ok: 'مقبول، وفيه أكمل منه', bad: 'تصرف خاطئ' };
function startScenario() { scn = { items: shuffle(window.SCENARIOS || []).slice(0, CONFIG.scenarioLength), i: 0, best: 0 }; renderScenario(); }
function renderScenario() {
  const box = $('#scn'), n = scn.items.length;
  if (scn.i >= n) {
    const msg = scn.best === n ? 'ما شاء الله، كل اختياراتك هي التصرف الأمثل' : scn.best >= n / 2 ? 'تصرفاتك طيبة، وبعضها فيه أكمل منه' : 'المواقف هذي تحتاج وقفة، والنزاهة تبدأ بالتصرف الصح';
    box.innerHTML = `<div class="score">${scn.best} / ${n}</div><p class="score-msg">${msg}</p>
      <p class="meta">عدد المواقف التي اخترت فيها التصرف الأمثل</p>
      <div class="btn-row"><button class="btn" id="scnAgain">مواقف جديدة</button><button class="btn ghost" id="scnQuiz">اختبر نفسك</button></div>`;
    $('#scnAgain').onclick = () => { startScenario(); };
    $('#scnQuiz').onclick = () => { runAction('quiz', ''); };
    const line = `اخترت التصرف الأمثل في ${scn.best} من ${n} مواقف. ${msg}.`;
    showCaption('', line); speak(line);
    return;
  }
  const it = scn.items[scn.i], order = shuffle(it.o.map((_, i) => i));
  box.innerHTML = `<div class="q-progress"><div style="width:${(scn.i / n) * 100}%"></div></div>
    <div class="q-num">الموقف ${scn.i + 1} من ${n}</div>
    <div class="q-text">${escapeHTML(it.s)}</div>
    <div class="q-opts">${order.map((i) => `<button class="q-opt" data-i="${i}">${escapeHTML(it.o[i].t)}</button>`).join('')}</div>
    <div id="scnAfter"></div>`;
  $('#scn').scrollTop = 0;
  speak(it.s);
  $$('.q-opt', box).forEach((b) => b.addEventListener('click', () => {
    const o = it.o[Number(b.dataset.i)]; resetIdle();
    buzz(o.v === 'bad' ? [20, 40, 20] : 12);
    $$('.q-opt', box).forEach((x) => { x.disabled = true; const v = it.o[Number(x.dataset.i)].v; if (v === 'best') x.classList.add('correct'); });
    if (o.v === 'bad') b.classList.add('wrong'); else if (o.v === 'ok') b.classList.add('partial');
    if (o.v === 'best') scn.best++;
    track('scn', { id: it.id, v: o.v });
    $('#scnAfter').innerHTML = `<div class="q-exp v-${o.v}"><b>${VERDICT[o.v]}</b>${escapeHTML(o.c)}</div>
      <button class="btn" id="scnNext">${scn.i + 1 < n ? 'الموقف التالي' : 'النتيجة'}</button>`;
    $('#scnNext').onclick = () => { stopSpeaking(); scn.i++; renderScenario(); };
    box.scrollTo({ top: box.scrollHeight, behavior: 'smooth' });
    showCaption('', o.c); speak(o.c);
  }));
}

/* ---------------- الإحصائيات (أعداد مجهولة تُرسل للخادم، بدون أسماء ولا تسجيل صوت) ---------------- */
const SCREEN = (() => {                              // هل هذا الجهاز هو الشاشة الرئيسية؟ (وجه Simli، أو ‎?screen=1‎ مرة واحدة)
  try { const q = params.get('screen'); if (q === '1' || q === '0') localStorage.setItem('nazih.screen', q); if (localStorage.getItem('nazih.screen') === '0') return false; return !!window.NAZIH_SIMLI || localStorage.getItem('nazih.screen') === '1'; } catch { return !!window.NAZIH_SIMLI; }
})();
const FROM_QR = params.get('from') === 'qr';
const DEV = (() => { try { let d = localStorage.getItem('nazih.dev'); if (!d) { d = Math.random().toString(36).slice(2, 12) + Date.now().toString(36); localStorage.setItem('nazih.dev', d); } return d; } catch { return ''; } })();
let askSrc = '', sessionOpen = false;
const takeSrc = () => { const v = askSrc || 'voice'; askSrc = ''; return v; };
function track(t, d = {}) {
  if (!CONFIG.stats || TEST) return;
  const send = (o) => { try { const b = new Blob([JSON.stringify(o)], { type: 'text/plain' }); if (!navigator.sendBeacon?.(`${CONFIG.apiBase}/api/event`, b)) fetch(`${CONFIG.apiBase}/api/event`, { method: 'POST', body: b, keepalive: true }).catch(() => {}); } catch {} };
  if (!sessionOpen && t !== 'open') { sessionOpen = true; send({ t: 'session', dev: DEV, screen: SCREEN, qr: FROM_QR }); }   // جلسة = زائر بدأ يتفاعل (على الشاشة: كل زائر جديد بعد الخمول)
  send({ t, screen: SCREEN, ...d });
}
if (FROM_QR) track('open', { qr: true });

/* ---------------- رمز QR وشاشة الترحيب (للشاشة الرئيسية فقط) ---------------- */
let attractOn = false, attractT = null, attractI = Math.floor(Math.random() * 5);
const attractEl = $('#attract');
function initScreen() {
  if (!SCREEN) return;
  document.body.classList.add('screen');
  try {
    const url = `${location.origin}/?from=qr`, svg = window.NazihQR.svg(url);
    $$('.qr-code').forEach((el) => { el.innerHTML = svg; });
  } catch (e) { console.warn('QR:', e?.message); document.body.classList.add('no-qr'); }
}
function attractSay() {
  clearTimeout(attractT);
  if (!attractOn) return;
  attractT = setTimeout(attractSay, CONFIG.attractEverySeconds * 1000);
  if (busy || recState || speakingNow || didTalking || autoMic?.recording || document.hidden) return;
  speak(CONFIG.attractLines[attractI++ % CONFIG.attractLines.length]);       // إن لم يُلمس الجهاز بعد فتح الصفحة يمنع المتصفح الصوت، فتبقى الدعوة مكتوبة فقط
}
function enterAttract() {
  if (!SCREEN || !CONFIG.attract || attractOn) return;
  attractOn = true; document.body.classList.add('attract'); attractEl.hidden = false;
  try { if (did?.simli) did.stop(); } catch {}                                // لا تبقى جلسة Simli مفتوحة والشاشة فاضية
  attractT = setTimeout(attractSay, 4000);
}
function leaveAttract() {
  if (!attractOn) return;
  attractOn = false; clearTimeout(attractT); document.body.classList.remove('attract'); attractEl.hidden = true;
  if (speakingNow) stopSpeaking();
}
attractEl?.addEventListener('click', () => { ensureAudio(); });

/* ---------------- نافذة الإعدادات ---------------- */
const dlg = $('#settings');
$('#settingsBtn').addEventListener('click', () => { applySettings(); dlg.showModal(); });
$('#setClose').addEventListener('click', () => dlg.close());
dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
$('#setVol').addEventListener('input', (e) => { settings.volume = Number(e.target.value); saveSettings(); applySettings(); });
$('#setVoice').addEventListener('change', (e) => { settings.voice = e.target.checked; if (!settings.voice) stopSpeaking(); saveSettings(); });
$('#setText').addEventListener('change', (e) => { settings.text = e.target.checked; saveSettings(); applySettings(); });
$('#setBig').addEventListener('change', (e) => { settings.big = e.target.checked; saveSettings(); applySettings(); });
$('#setNew').addEventListener('click', () => { newChat(); closeSheets(); dlg.close(); });
$('#setFull').addEventListener('click', () => { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen?.().catch(() => {}); });

/* ---------------- الترحيب ---------------- */
const onboard = $('#onboard');
$('#startBtn').addEventListener('click', () => {
  ensureAudio(); buzz(15);
  onboard.hidden = true;
  if (did) return;                                  // شخصية D-ID ترحّب بنفسها عند بدء المحادثة
  speak(CONFIG.greeting).then(() => { if (!recState && !busy) setStatus(CONFIG.idleStatus); });   // نزيه يرحّب بصوته وفمه يتحرك
});

/* ---------------- إعادة الضبط عند الخمول (للشاشة التفاعلية) ---------------- */
let idleTimer;
function resetIdle(keep) {
  clearTimeout(idleTimer);
  if (keep !== true) leaveAttract();
  idleTimer = setTimeout(() => {
    if (attractOn) return resetIdle(true);          // شاشة الترحيب شغالة: تبقى إلى أن يأتي زائر
    // لا يُمسح الحوار ونزيه يتكلم أو يسمع (في الاستماع التلقائي يتحاور الزائر دقائق بدون أي لمسة)
    if (talking || busy || recState || speakingNow || didTalking || autoMic?.recording) return resetIdle(true);
    if (didDropped) { location.reload(); return; }      // الأفتار الحي تعطل سابقاً: أعد التحميل لاسترجاعه
    if (dlg.open) dlg.close();
    closeSheets(); newChat();
    followUps = []; renderCarousel(true);
    $('#lawSearch').value = ''; renderLaw();
    onboard.hidden = !CONFIG.showWelcome;
    sessionOpen = false;                             // الزائر التالي يُحسب جلسة جديدة
    enterAttract();
  }, CONFIG.idleResetSeconds * 1000);
}
['pointerdown', 'keydown'].forEach((ev) => document.addEventListener(ev, () => resetIdle()));

/* ---------------- البداية ---------------- */
applySettings();
initDID();
renderCarousel(true);
showCaption('', CONFIG.greeting);
if (TEST || !CONFIG.showWelcome) onboard.hidden = true;
initScreen();
resetIdle();
if (!TEST) enterAttract();                         // الشاشة الرئيسية تبدأ بالترحيب إلى أن يأتي أول زائر
