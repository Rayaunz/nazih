/* =========================================================
 *  نزيه — شاشة واحدة تفاعلية لليوم العالمي لمكافحة الفساد
 *  الإعدادات وبنك الأسئلة في أعلى الملف
 * ========================================================= */
const CONFIG = {
  apiBase: '',                 // اتركه فارغاً إذا كان الموقع والخادم على نفس الدومين
  avatarImage: 'assets/avatar.jpg',
  idleResetSeconds: 120,       // يرجع لشاشة الترحيب بعد دقيقتين بدون تفاعل
  maxRecordSeconds: 25,
  maxAutoSeconds: 12,          // v35: أقصى مدة للتسجيل التلقائي بدون ضغط (يحدّ من تسجيل ضجيج طويل)
  silenceMs: 750,              // (v34: كان 900) يوقف التسجيل تلقائياً بعد هذا الصمت (أقل = رد أسرع، لكن قد يقطع من يتوقف ليفكر)
  handsFree: true,             // true: نزيه يسمع تلقائياً بدون ضغط زر. false: لازم ضغط زر التحدث. (يمكن التبديل من الرابط: ‎?mic=auto‎ أو ‎?mic=button‎)
  autoMinLevel: 0.045,         // أقل مستوى صوت يُعتبر كلاماً في الاستماع التلقائي (ارفعه في الأماكن المزعجة)
  bargeIn: true,               // المقاطعة بالصوت: نزيه يسكت إذا تكلم الزائر أثناء جوابه أو تفكيره (v34: مفعّلة افتراضياً. لإيقافها في جهاز: ‎?barge=0‎)
  autoMinSpeechMs: 450,        // أقصر كلام يُقبل (يتجاهل الطقطقة والأصوات القصيرة)
  showWelcome: false,          // true لإظهار رسالة الترحيب عند فتح الموقع وبعد الخمول
  quizLength: 5,               // عدد أسئلة «اختبر نفسك» في كل مرة
  cert: false,                 // شهادة «سفير النزاهة» (مؤجلة: اجعلها true لتفعيلها)
  certMin: 0.75,               // أقل نسبة للحصول على شهادة «سفير النزاهة» (0.75 = ثلاثة أرباع الإجابات)
  certTitle: 'شهادة سفير النزاهة',
  certLine: 'لاجتياز تحدي النزاهة مع المساعد الافتراضي «نزيه»',
  certEvent: 'اليوم العالمي لمكافحة الفساد — جامعة حائل بالتعاون مع هيئة الرقابة ومكافحة الفساد (نزاهة)',
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
  openingSpeech:               // كلمة الافتتاح الافتراضية (تُعدَّل من الإعدادات على الشاشة الرئيسية وتُحفظ في ذلك الجهاز)
    'بسم الله الرحمن الرحيم. السلام عليكم ورحمة الله وبركاته. يا هلا والله ومرحبا براعي الحفل، وبأصحاب السعادة، وبالحضور الكريم. '
    + 'أنا نزيه، المساعد الافتراضي لجامعة حائل في اليوم العالمي لمكافحة الفساد، الذي تنظمه الجامعة بالتعاون مع هيئة الرقابة ومكافحة الفساد. '
    + 'النزاهة أمانة نحملها جميعاً، ومكافحة الفساد مسؤولية كل واحد منا، في دراسته وفي عمله. '
    + 'واليوم أنا بينكم، أجاوب على أسئلتكم عن الأنظمة وطرق البلاغ وحماية المبلّغين، وأختبر معلوماتكم، وأعرض عليكم مواقف من الواقع. '
    + 'حيّاكم الله، وتفضلوا اسألوني. معاً لمجتمع نزيه وشفاف.',
  stats: true,                 // إرسال أعداد مجهولة (زيارات، أسئلة، تقييم، اختبار) للوحة الإحصائيات
  idleStatus: 'اضغط للتحدث',
  didStatus: 'تحدّث مع نزيه مباشرة من الأعلى، أو اختر سؤالاً',   // نص الحالة عند تشغيل شخصية D-ID
  didWaitSeconds: 12,
  ownBrain: true,              // true: الموقع يسمع ويفهم ويبحث في الأنظمة ويجاوب، وشخصية D-ID تنطق فقط. false: الرجوع لعقل D-ID
  pushToTalk: true,            // المايك مقفل دائماً، ويفتح فقط عند ضغط زر «اضغط للتحدث» (يمنع التقاط كلام من حول الشاشة)
  talkMaxSeconds: 30,          // أقصى مدة لفتح المايك في الضغطة الواحدة          // مدة انتظار تحميل D-ID قبل اعتماد الصورة المتحركة
  waitIncomplete: true,        // إذا توقف الزائر في نص الجملة («وش الفرق بين الرشوة و...») ينتظر نزيه تكملتها بدل أن يجاوب على سؤال ناقص
  /* كلمة قصيرة فور انتهاء كلام الزائر («أبشر») ليعرف أنه سُمع، ثم يأتي الجواب. بلا «لحظة».
     ack: 'auto' مع أول سؤال صوتي فقط من كل زائر · 'always' مع كل سؤال صوتي · 'never' لا تُقال. تُغيَّر من الإعدادات في الشاشة.
     (v33: أُلغيت الكلمة المتأخرة: كانت تُقال قبل الجواب بجزء من الثانية فتؤخره ولا تفيد.)
     v34: الافتراضي 'never' حسب ملاحظة المشرف: نزيه يجاوب مباشرة. (جهاز اختير فيه خيار آخر من الإعدادات يبقى على اختياره) */
  ack: 'never',
  fillers: ['أبشر.', 'سَمّ.', 'طيّب.'],
  ownMouth: false,             // أفتار الموقع (الجوالات): false = صورة نزيه بحركة رأس ورمش خفيفة والصوت فقط، true = يحرّك الفم أيضاً
  /* مكتبة Simli للمتصفح (تُحمَّل عند الحاجة فقط). v34: مثبّتة على إصدار محدد. كانت تُحمَّل «آخر إصدار» دائماً،
     وصدرت ثلاثة إصدارات بين 19 و27 أكتوبر 2026، فيتغيّر سلوك الوجه دون أي تعديل في الموقع.
     3.2.0 (27 أكتوبر) هو الإصدار الذي يطابق الكود الحالي، وفيه صار الاتصال عبر LiveKit افتراضياً بدل الاتصال المباشر (P2P).
     للمقارنة على الشاشة بالإصدار الذي قبله (اتصال مباشر): ‎?simliv=3.1.0‎ ، وللرجوع: ‎?simliv=3.2.0‎ (يُحفظ في ذلك الجهاز).
     لا تستعمل 3.0.x: واجهتها مختلفة (close بدل stop) فلا يعمل معها الوجه الحي. */
  simliVersion: '3.2.0',
  livekitVersion: '2.24.1',    // مكتبة LiveKit للمتصفح (وضع lemon فقط): تعرض فيديو وجه LemonSlice
  lemonConnectWait: 4,         // أقصى انتظار (ثوانٍ) للوجه قبل أن يُنطق الجواب بصوت نزيه فوق صورة الشخصية (والوجه يكمل حين يجهز). v35: 4 (كان 15)
  lemonIdleSeconds: 90,        // تُقفل جلسة LemonSlice بعد هذا السكوت (لا تُحسب دقائق والشاشة واقفة). v35: 90 (كان 120)
  simliConnectWait: 9,       // أقصى انتظار (ثوانٍ) لاتصال Simli قبل أن يُنطق الجواب بصورة نزيه
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
  const sk = document.getElementById('setAck'); if (sk) sk.value = ackMode();
  const fr = document.getElementById('faceRow');
  if (fr) {
    const f = window.NAZIH_FACE || { state: 'idle', why: '' };
    fr.hidden = !window.NAZIH_SIMLI;
    document.getElementById('faceState').textContent = f.state === 'live' ? 'متصل ✓' : f.state === 'connecting' ? 'يتصل الآن…' : f.state === 'off' ? 'غير متاح: ' + (f.why || 'تعذّر الاتصال').slice(0, 90) : 'يتصل عند أول سؤال';
    fr.classList.toggle('bad', f.state === 'off');
  }
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
  if (k > 0.03 && !(window.NAZIH_SIMLI && !LOOK)) drawLids(c, k);
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
    // v34: نصف السعة السابقة. العينان في الصورة ثابتتان، فكلما زاد ميل الرأس والتفاته بدت النظرة تائهة
    gest = { at: t, dur: 1100 + Math.random() * 900, tilt: (Math.random() - 0.5) * 0.017, nod: (Math.random() - 0.3) * 4.5, sway: (Math.random() - 0.5) * 6 };
    nextGest = t + gest.dur + 500 + Math.random() * 1800;
  }
  const gp = Math.min(1, (t - gest.at) / gest.dur), gk = Math.sin(gp * Math.PI) * talkAmt;  // تصعد ثم ترجع
  const TA = talkAmt * (CONFIG.ownMouth || LOOK ? 1 : 0.3);             // بدون تحريك الفم: حركة الرأس أهدأ (v34: كان 0.45)
  const M = window.NAZIH_SIMLI && !LOOK ? 0 : 1;                         // v31: إذا تعذّر الوجه الحي تبقى الصورة ثابتة مع الصوت (رأس يتمايل وفم لا يتحرك شكله غريب)
  const tilt = M * (0.0045 * Math.sin(t / 2700) + 0.002 * Math.sin(t / 1130 + 1) + TA * (0.007 * Math.sin(t / 830) + 0.004 * Math.sin(t / 410 + 2)) + gk * gest.tilt);
  const nod = M * (1.6 * Math.sin(t / 1900) + TA * (2.2 * Math.sin(t / 560) + 1.2 * Math.sin(t / 233 + 1)) + emph * 4 + mouthOpen * 1.5 + gk * gest.nod);   // v34: إيماءة التشديد كانت emph * 9
  const sway = M * (2.2 * Math.sin(t / 3300) + TA * 2.5 * Math.sin(t / 1500 + 1) + gk * gest.sway);
  const zoom = M * (0.0025 * Math.sin(t / 2300) + TA * 0.004 + emph * 0.006);
  const brow = M * Math.min(3.2, emph * 9 + (gk > 0.6 ? 0.8 : 0));
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
          const was = didTalking;
          didTalking = state === 'TALKING' && performance.now() > ignoreTalkUntil; if (didTalking) T.mark('talking');
          if (was && !didTalking) lastTalkEnd = performance.now();       // v35: متى سكت نزيه فعلاً (لا يُفتح المايك على صدى آخر كلمة)
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
    const m = this.marks, d = (a, b) => (m[a] && m[b] ? ((m[b] - m[a]) / 1000).toFixed(1) + 's' : '-'), b0 = m.lastWord ? 'lastWord' : 'askStart';
    // v35: «face audio» = وصل أول صوت إلى الوجه الحي، «first lip» = بدأ صوت الوجه فعلاً (الشفاه تتحرك معه). البداية: آخر كلمة من الزائر، أو لحظة السؤال إن كان مكتوباً
    el.textContent = `avatar connect: ${this.connect || '-'}\nsilence wait : ${d('lastWord', 'recEnd')}\nspeech->text : ${d('recEnd', 'sttDone')}${this.stt ? ' (' + this.stt + ')' : ''}\nthinking     : ${d('askStart', 'firstText')}\nfirst sound  : ${d(b0, 'talking')}${m.filler ? ' (filler)' : ''}\nanswer ready : ${d(b0, 'firstText')}${m.faceAudio ? '\nface audio   : ' + d(b0, 'faceAudio') : ''}${m.lip ? '\nfirst lip    : ' + d(b0, 'lip') + ' (after face audio ' + d('faceAudio', 'lip') + ')' : ''}${this.lemon ? '\nface         : ' + this.lemon : ''}${this.mic ? '\nmic          : ' + this.mic : ''}${this.model ? '\nmodel        : ' + this.model : ''}${this.voice ? '\nvoice        : ' + this.voice : ''}${this.stream ? '\nvoice stream : ' + this.stream : ''}${this.ctx ? '\ncontext      : ' + this.ctx : ''}${m.exact ? '\n(exact article)' : ''}${m.bank ? '\n(ready answer)' : ''}`;
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
/* v35: لا يُفتح الوجه الحي (Simli أو LemonSlice) والشاشة في وضع الترحيب: كانت عبارات الترحيب الدورية تفتح جلسة كل مرة
   فتُحسب الدقائق والشاشة فاضية. الاتصال يبدأ من لمسة الزائر أو كلامه أو سؤاله فقط. */
function ensureDidConnected(why = '') {
  if (!did) return Promise.resolve();
  if (did.ensure) { if (!attractOn || why === 'touch') did.ensure(why); return Promise.resolve(); }      // Simli/LemonSlice: يبدأ الاتصال في الخلفية، والنطق ينتظره
  watchDid();
  if (!didDown) return Promise.resolve();
  if (didReconnecting) return didReconnecting;
  document.body.classList.add('did-reconnecting');
  $('#didCover span').textContent = 'نزيه يستعد…';
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
['pointerdown', 'keydown'].forEach((ev) => window.addEventListener(ev, () => { if (did && (didDown || did.ensure)) ensureDidConnected('touch'); }, { passive: true }));

/* عقل الموقع: مايك D-ID يبقى مكتوماً دائماً، والموقع هو الذي يسمع ويجاوب */
let didTalking = false, lastTalkEnd = 0;
/* v35: «اضغط وتكلّم» (‎?ptt=1‎، ويُحفظ في الجهاز؛ ‎?ptt=0‎ للإلغاء): الزائر يضغط زر المايك مع الاستمرار وهو يتكلم ويتركه عند الانتهاء.
   الأضمن في الضوضاء الشديدة: لا يسجّل نزيه إلا ما بين الضغط والترك، ولا يلتقط كلام من حول الشاشة. */
const HOLD = (() => { try { const q = params.get('ptt'); if (q === '1' || q === '0') localStorage.setItem('nazih.ptt', q); return localStorage.getItem('nazih.ptt') === '1'; } catch { return params.get('ptt') === '1'; } })();
if (HOLD) document.body.classList.add('hold');
setInterval(() => {                         // أثناء كلام نزيه: الزر يتحول إلى «اضغط للمقاطعة»
  if (!did) return;
  const on = (speakingNow || didTalking) && !autoMic?.recording && !recState;
  if (micBtn.classList.contains('stop') === on) return;
  micBtn.classList.toggle('stop', on);
  $('#pttLabel').textContent = on ? (HOLD ? 'اضغط مع الاستمرار للمقاطعة' : CONFIG.bargeIn ? 'تكلّم أو اضغط للمقاطعة' : 'اضغط هنا للمقاطعة') : pttIdleLabel();
}, 200);
const pttIdleLabel = () => (HOLD ? 'اضغط مع الاستمرار وتكلّم' : autoMic && audioCtx?.state === 'running' ? 'تكلّم مباشرة.. أنا أسمعك' : CONFIG.handsFree ? 'المس الشاشة لتفعيل الاستماع' : 'اضغط للتحدث');
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
    const r = await fetch(`${CONFIG.apiBase}/api/tts`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, screen: SCREEN }) });
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
  const wait = $('#simliWait'), poster = $('#simliPoster'), box = $('#simliBox'), pkey = () => 'nazih.poster.' + (innerHeight > innerWidth ? 'p' : 'l');
  const B = document.body.classList;
  const setLive = (v) => { B.toggle('simli-live', v); if (v) B.remove('simli-off'); };
  /* v25: لا تظهر الصورة الثابتة القديمة قبل الوجه الحي. يُغطّى مكانها بلقطة من الوجه الحي نفسه (تُحفظ في الجهاز بعد أول اتصال)
     فلا يتبدّل الشكل عند دخول الوجه، وإن لم توجد لقطة بعد تظهر بطاقة انتظار هادئة. الصورة القديمة تبقى فقط إن تعذّر الوجه الحي. */
  function setPoster(url) { if (!poster) return; if (!url) { poster.hidden = true; wait?.classList.remove('has-poster'); return; } poster.src = url; poster.hidden = false; wait?.classList.add('has-poster'); }
  try { setPoster(localStorage.getItem(pkey())); } catch {}
  function grabPoster(tries = 8) {
    try {
      const w = video.videoWidth, h = video.videoHeight;
      if (w && h) {
        const c = document.createElement('canvas'), k = Math.min(1, 720 / Math.max(w, h)); c.width = Math.round(w * k); c.height = Math.round(h * k);
        const g = c.getContext('2d'); g.drawImage(video, 0, 0, c.width, c.height);
        const px = g.getImageData(c.width >> 1, c.height >> 1, 1, 1).data;
        if (px[0] + px[1] + px[2] > 60) { const url = c.toDataURL('image/jpeg', 0.82); setPoster(url); try { localStorage.setItem(pkey(), url); } catch {} return; }   // ليست لقطة سوداء
      }
    } catch (e) { console.warn('poster:', e?.message); return; }
    if (tries > 0 && client) setTimeout(() => grabPoster(tries - 1), 250);
  }
  async function loadSdk() {
    if (sdk) return sdk;
    let v = CONFIG.simliVersion;
    try { const q = params.get('simliv'); if (q && /^[\d.]+$/.test(q)) localStorage.setItem('nazih.simliv', q); v = localStorage.getItem('nazih.simliv') || v; } catch {}
    for (const url of [`https://esm.sh/simli-client@${v}`, `https://cdn.jsdelivr.net/npm/simli-client@${v}/+esm`]) {
      try { const m = await import(url); if (m.SimliClient) return (sdk = m); } catch (e) { console.warn('Simli SDK:', url, e?.message); }
    }
    throw new Error('تعذّر تحميل مكتبة Simli');
  }
  function connect() {
    if (client) return Promise.resolve(true);
    if (connecting) return connecting;
    if (fails >= 3 && performance.now() - lastFail < 120000) return Promise.resolve(false);     // بعد ثلاث محاولات فاشلة: استراحة دقيقتين
    B.add('simli-connecting'); face('connecting');
    connecting = (async () => {
      try {
        const { SimliClient, LogLevel } = await loadSdk();
        let code = ''; try { code = localStorage.getItem('nazih.code') || ''; } catch {}
        const r = await fetch(`${CONFIG.apiBase}/api/simli-token`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ portrait: innerHeight > innerWidth, code, screen: !!window.NAZIH_SCREEN }) });
        const d = await r.json().catch(() => ({}));
        if (!r.ok || !d.session_token) throw new Error(d.error || 'token');
        const c = new SimliClient(d.session_token, video, audio, null, LogLevel?.ERROR ?? LogLevel?.INFO);
        c.on?.('stop', () => { if (client === c) { client = null; setLive(false); face('idle'); console.log('Simli: انتهت الجلسة'); } });
        c.on?.('error', (m) => console.warn('Simli:', m));
        // v31: مهلة للاتصال. بعض الشبكات (خصوصاً شبكات الجهات) تمنع البث المباشر فيبقى الاتصال معلّقاً بلا نهاية؛ بعد المهلة يكمل نزيه بصورته وصوته
        try { await Promise.race([c.start(), sleep(14000).then(() => { throw new Error('انتهت مهلة الاتصال (قد تكون الشبكة تمنع البث المباشر)'); })]); }
        catch (e) { try { c.stop?.(); } catch {} throw e; }
        client = c; fails = 0; audio.volume = settings.volume; setLive(true); grabPoster(); face('live');
        if (ackMode() !== 'never') CONFIG.fillers.forEach((f) => pcmFetch(f));   // تجهيز كلمات الرد القصيرة مسبقاً
        if (window.NAZIH_SCREEN) setTimeout(warmAnswers, 5000);
        if (DEBUG) { T.connect = 'simli ' + (performance.now() / 1000).toFixed(1) + 's (sdk ' + (localStorage.getItem('nazih.simliv') || CONFIG.simliVersion) + ')'; T.show(); }
        return true;
      } catch (e) {
        console.warn('Simli connect:', e?.message || e); fails++; lastFail = performance.now(); setLive(false); B.add('simli-off');   // تعذّر الوجه الحي: تظهر صورة نزيه ليكمل بها
        face('off', String(e?.message || e));
        if (DEBUG) { T.connect = 'simli FAILED: ' + String(e?.message || e).slice(0, 60); T.show(); setStatus('Simli: ' + (e?.message || e), 'err'); }
        return false;
      } finally { connecting = null; B.remove('simli-connecting'); }
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
  /* v32: إذا دوّر الزائر جواله والوجه الحي شغال بقي البث بمقاس الاتجاه القديم، فيتكبّر الوجه ويقع الشعاران فوقه.
     الآن تُعاد الجلسة بمقاس الاتجاه الجديد، وتختفي شعارات الجدار ما دام البث طولياً. */
  const markShape = () => box?.classList.toggle('tall', video.videoHeight > video.videoWidth);
  video.addEventListener('resize', markShape); video.addEventListener('loadedmetadata', markShape);
  const flip = () => {
    let url = null; try { url = localStorage.getItem(pkey()); } catch {}
    setPoster(url);
    if (client) { const c = client; client = null; playEnd = 0; setLive(false); face('idle'); try { c.stop(); } catch {} connect(); }
  };
  try { const mq = matchMedia('(orientation: portrait)'); mq.addEventListener ? mq.addEventListener('change', flip) : mq.addListener(flip); } catch {}
  const face = (state, why = '') => { window.NAZIH_FACE = { state, why }; };      // تظهر في الإعدادات: هل الوجه الحي متصل ولماذا لا
  let playEnd = 0, via = 'own';                      // متى ينتهي ما أُرسل إلى الوجه الحي، وبأي طريق نُطق آخر مقطع
  const pcmPending = new Map();                       // طلبات صوت بدأت مسبقاً (المقطع التالي يُجهَّز أثناء نطق الحالي)
  function pcmFetch(text) {
    let p = pcmPending.get(text);
    if (!p) {
      p = fetch(`${CONFIG.apiBase}/api/tts-pcm`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, screen: SCREEN }) });
      p.catch(() => {});
      if (pcmPending.size > 12) pcmPending.delete(pcmPending.keys().next().value);
      pcmPending.set(text, p);
    }
    return p;
  }
  return {
    own: true, simli: true,
    events: own.events,
    ensure: connect, preload() { loadSdk().catch(() => {}); },
    prefetch(text) { if (client) pcmFetch(text); return !!client; },
    functions: {
      async speak({ input }) {
        const my = ++token;
        if (attractOn) return own.functions.speak({ input });                   // ترحيب الخمول بصورة نزيه وصوته: لا يفتح جلسة Simli ولا يستهلك دقائقها
        const ok = client ? true : await Promise.race([connect(), sleep((window.NAZIH_SCREEN ? CONFIG.simliConnectWait : 8) * 1000).then(() => false)]);   // الجوال لا ينتظر طويلاً إن امتلأت الجلسات
        if (my !== token) return;
        if (!ok || !client) return own.functions.speak({ input });             // الاحتياطي: صورة نزيه وصوته
        // الصوت يصل متدفقاً من الخادم ويُرسل إلى Simli أول بأول، فيبدأ الكلام قبل اكتمال توليد المقطع
        let r = null;
        try { r = await pcmFetch(input); pcmPending.delete(input); } catch {}
        if (my !== token) return;
        if (!r || !r.ok || !r.body || !client) return own.functions.speak({ input });
        if (DEBUG) { T.voice = r.headers.get('x-tts') || ''; }
        /* v28: مخزن صغير قبل الإرسال. كان الصوت يُرسل إلى الوجه الحي فور وصوله من الشبكة، فإذا وصل متقطعاً أو أبطأ من سرعة الكلام
           فرغ ما عند الوجه فسكت لحظات وتوقف الفم (تقطيع وعدم تطابق). الآن يُجمع أول 0.7 ثانية، وإن كان الوصول أبطأ من الكلام يُجمع المقطع كله ثم يُرسل متصلاً. */
        const reader = r.body.getReader(); let carry = null, total = 0, t0 = 0, got = 0, tIn = 0, hold = [], held = 0, mode = 'pre';
        via = 'own';
        const PRE = 12800, send = (u) => {                                                         // 12800 بايت = 0.4 ثانية (v34: كان 0.7)
          for (let i = 0; i < u.length; i += 6000) client.sendAudioData(u.slice(i, i + 6000));
          if (!total && u.length) { t0 = Math.max(performance.now(), playEnd); audio.volume = settings.volume; own.emit('TALKING'); stopTalk(); }   // يبدأ بعد نهاية ما سبقه عند الوجه
          total += u.length;
        };
        const flush = () => { const h = hold; hold = []; held = 0; h.forEach(send); };
        try {
          for (;;) {
            const { done, value } = await reader.read();
            if (my !== token || !client) { try { reader.cancel(); } catch {} if (my === token) { stopTalk(); via = 'own'; own.emit('IDLE'); } return; }
            if (done) break;
            let u = value;
            if (carry) { const m = new Uint8Array(carry.length + u.length); m.set(carry); m.set(u, carry.length); u = m; carry = null; }
            if (u.length % 2) { carry = u.slice(u.length - 1); u = u.subarray(0, u.length - 1); }   // العيّنة 2 بايت: لا نقطعها
            if (!u.length) continue;
            if (!tIn) tIn = performance.now();
            got += u.length;
            if (mode === 'pass') { send(u); continue; }
            hold.push(u); held += u.length;
            if (mode === 'pre' && held >= PRE) {
              const el = Math.max(1, performance.now() - tIn), speed = (got / 32000) / (el / 1000);   // سرعة الوصول ÷ سرعة الكلام
              if (el < 60 || speed >= 1.3) { mode = 'pass'; flush(); } else mode = 'full';            // وصول بطيء: انتظر المقطع كاملاً
            }
          }
          if (my === token && client) flush();
        } catch (e) { console.warn('Simli stream:', e?.message); if (my === token && client) flush(); }
        if (DEBUG && got) { T.stream = `${((got / 32000) / (Math.max(1, performance.now() - tIn) / 1000)).toFixed(1)}x ${mode}`; T.show(); }
        if (!total) return own.functions.speak({ input });
        playEnd = t0 + (total / 32000) * 1000; via = 'simli';                                        // 32000 بايت = ثانية صوت
        const remain = playEnd - performance.now() + 200;
        stopTalk(); talkT = setTimeout(() => { talkT = null; if (my === token) own.emit('IDLE'); }, Math.max(200, remain));
      },
      /* v29: كم ينتظر طابور النطق قبل إرسال المقطع التالي. يُرسل قبل نهاية الحالي بقليل فيتصل الكلام عند الوجه بلا سكتة بين الجمل.
         -1 = المقطع نُطق بالصوت الاحتياطي، فيُنتظر انتهاؤه بالطريقة المعتادة. */
      leadMs() { return via === 'simli' && client ? Math.max(0, playEnd - performance.now() - 450) : -1; },
      interrupt() {
        token++; stopTalk(); playEnd = 0;
        try { client?.ClearBuffer(); } catch {}
        own.functions.interrupt();
      },
      toggleMicState() {}, reconnect: connect, connect,
    },
    stop() { const c = client; client = null; playEnd = 0; setLive(false); try { c?.stop(); } catch {} },
  };
}
/* ---------------- وجه LemonSlice الحي (‎/?avatar=lemon‎، للشاشة الرئيسية) ----------------
   مثل Simli من جهة الموقع: نزيه يسمع ويفكر ويجهّز الصوت العربي بنفسه، وLemonSlice يحرّك الوجه فقط.
   v35:
   - الخادم هو الذي يرسل صوت نزيه إلى LemonSlice مباشرة (من مزوّد الصوت إلى الوجه داخل أمريكا)، والشاشة ترسل نص الجملة فقط
     (‎/api/lemon-say‎) وتشاهد الفيديو من LiveKit. كانت الشاشة تنزّل الصوت ثم ترفعه، فيتأخر ويتقطّع على الشبكات البطيئة.
   - الاتصال: الخادم يرد فوراً بتذكرة الغرفة فتدخلها الشاشة، وفي نفس الوقت يفتح الجلسة عند LemonSlice (كانت الخطوات متتابعة).
   - أثناء الاتصال تظهر صورة الشخصية الجديدة نفسها (لا دائرة تحميل)، ولا تُفتح جلسة والشاشة في وضع الترحيب.
   - يُقفل بعد السكوت وعند شاشة الترحيب. وإذا تعذّر يكمل نزيه بصورته وصوته.
   - إن أطفأ الخادم هذه الطريقة (LEMON_RELAY=0) ترجع الشاشة تلقائياً إلى إرسال الصوت بنفسها كما في v34. */
async function* ndjson(resp) {                      // سطور JSON متتابعة من رد متدفق
  const reader = resp.body.getReader(), dec = new TextDecoder(); let buf = '';
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (value) buf += dec.decode(value, { stream: true });
      let i;
      while ((i = buf.indexOf('\n')) >= 0) { const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1); if (line) { let o = null; try { o = JSON.parse(line); } catch {} if (o) yield o; } }
      if (done) { const line = buf.trim(); if (line) { let o = null; try { o = JSON.parse(line); } catch {} if (o) yield o; } return; }
    }
  } finally { try { reader.releaseLock(); } catch {} }
}
function makeLemonAvatar(own) {
  const video = $('#simliVideo'), audio = $('#simliAudio'), box = $('#simliBox'), poster = $('#simliPoster'), wait = $('#simliWait');
  const B = document.body.classList, stage = $('#stage'), topBar = $('.top');
  let room = null, ws = null, key = '', connecting = null, sdk = null, fails = 0, lastFail = 0, token = 0, talkT = null, idleT = null, beatT = null, keepT = null;
  let playEnd = 0, via = 'own', sending = false, sayAbort = null, endSeq = 0, tokAbort = null, preRoom = null, pendingKey = '', turn = 0, gaveUpOn = null;
  const relay = () => !!key;
  const live = () => !!(room && (key || (ws && ws.readyState === 1)));
  const face = (state, why = '') => { window.NAZIH_FACE = { state, why }; };
  const setLive = (v) => { B.toggle('simli-live', v); if (v) B.remove('simli-off'); };
  const api = (path, body, extra = {}) => fetch(`${CONFIG.apiBase}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), ...extra });
  const ctl = (cmd, k = key, keepalive = false, extra = {}) => (k ? api('/api/lemon-ctl', { key: k, cmd, ...extra }, { keepalive }).then(async (r) => ({ status: r.status, ...(await r.json().catch(() => ({}))) })).catch(() => ({ status: 0 })) : Promise.resolve({ status: 410 }));
  const beacon = (k) => { let sent = false; try { sent = navigator.sendBeacon?.(`${CONFIG.apiBase}/api/lemon-ctl`, new Blob([JSON.stringify({ key: k, cmd: 'terminate' })], { type: 'text/plain' })); } catch {} if (!sent) ctl('terminate', k, true); };
  /* ---- الشكل: نسبة الفيديو، وأسفل الشريط العلوي حتى لا يغطي الرأس في الشاشات العريضة (انظر v35 في style.css) ---- */
  const setAR = (w, h) => { if (w > 0 && h > 0) stage.style.setProperty('--lemon-ar', (w / h).toFixed(4)); };
  const setHdr = () => {
    try {
      const tr = topBar.getBoundingClientRect(), sr = stage.getBoundingClientRect();
      const v = tr.height && getComputedStyle(topBar).position === 'absolute' ? Math.max(0, Math.round(tr.bottom - sr.top + 6)) : 0;
      stage.style.setProperty('--hdr', v + 'px');
    } catch {}
  };
  setHdr(); addEventListener('resize', setHdr); try { new ResizeObserver(setHdr).observe(topBar); } catch {}
  document.fonts?.ready?.then(setHdr).catch(() => {});
  const markShape = () => { box?.classList.toggle('tall', video.videoHeight > video.videoWidth); setAR(video.videoWidth, video.videoHeight); };
  video.addEventListener('resize', markShape); video.addEventListener('loadedmetadata', markShape);
  /* ---- صورة الشخصية أثناء الاتصال: لقطة من الوجه الحي نفسه في هذا الجهاز إن وُجدت، وإلا الصورة المرفقة مع الموقع ---- */
  const PKEY = 'nazih.lposter', DEFAULT_POSTER = 'assets/lemon-poster.jpg';
  function setPoster(url) { if (!poster) return; poster.src = url; poster.hidden = false; wait?.classList.add('has-poster'); }
  poster?.addEventListener('load', () => { if (!video.videoWidth) setAR(poster.naturalWidth, poster.naturalHeight); });
  poster?.addEventListener('error', () => { if (!poster.src.endsWith(DEFAULT_POSTER)) { try { localStorage.removeItem(PKEY); } catch {} setPoster(DEFAULT_POSTER); } });
  let saved = null; try { saved = localStorage.getItem(PKEY); } catch {}
  setPoster(saved || DEFAULT_POSTER);
  function grabPoster(tries = 12) {
    try {
      const w = video.videoWidth, h = video.videoHeight;
      if (w && h) {
        const c = document.createElement('canvas'), k = Math.min(1, 900 / Math.max(w, h)); c.width = Math.round(w * k); c.height = Math.round(h * k);
        const g = c.getContext('2d'); g.drawImage(video, 0, 0, c.width, c.height);
        const px = g.getImageData(c.width >> 1, c.height >> 1, 1, 1).data;
        if (px[0] + px[1] + px[2] > 60) { const url = c.toDataURL('image/jpeg', 0.84); setPoster(url); try { localStorage.setItem(PKEY, url); } catch {} return; }   // ليست لقطة سوداء
      }
    } catch (e) { console.warn('poster:', e?.message); return; }
    if (tries > 0 && room) setTimeout(() => grabPoster(tries - 1), 300);
  }
  async function loadSdk() {
    if (sdk) return sdk;
    const v = CONFIG.livekitVersion;
    let test = null; try { test = DEBUG && localStorage.getItem('nazih.lksdk'); } catch {}       // للتجربة المحلية فقط (‎?debug=1‎ + مكتبة بديلة)
    // v35: jsDelivr أولاً (ملف واحد، ويُحمَّل مسبقاً من رأس الصفحة)، وesm.sh احتياطاً (سلسلة ملفات)
    for (const url of [...(test ? [test] : []), `https://cdn.jsdelivr.net/npm/livekit-client@${v}/+esm`, `https://esm.sh/livekit-client@${v}`]) {
      try { const m = await import(url); if (m.Room) return (sdk = m); } catch (e) { console.warn('LiveKit SDK:', url, e?.message); }
    }
    throw new Error('تعذّر تحميل مكتبة LiveKit');
  }
  const send = (o) => { try { if (ws && ws.readyState === 1) ws.send(JSON.stringify(o)); } catch {} };       // الطريقة القديمة فقط
  /* ---- قياس (‎?debug=1‎): أين يذهب وقت الاتصال، ومتى يُسمع أول صوت من الوجه فعلاً ---- */
  const LT = { t: {}, show() { if (!DEBUG) return; const t = this.t, s = (a, b) => (t[a] && t[b] ? ((t[b] - t[a]) / 1000).toFixed(1) + 's' : '-');
    T.connect = `lemon: tap→room ticket ${s('start', 'ticket')} | room joined ${s('start', 'joined')} | session ready ${s('start', 'session')}${t.srv ? ` (LemonSlice ${(t.srv.create / 1000).toFixed(1)}s + channel ${(t.srv.ws / 1000).toFixed(1)}s)` : ''} | first frame ${s('start', 'frame')}`; T.show(); } };
  let lipAn = null, lipBuf = null;
  function watchLip() {                                   // متى يبدأ صوت الوجه فعلاً بعد إرسال أول صوت (= أول حركة شفاه تقريباً، لأن الصوت والفيديو متزامنان)
    if (!DEBUG || !audio.srcObject) return;
    try {
      ensureAudio();
      const src = audioCtx.createMediaStreamSource(audio.srcObject); lipAn = audioCtx.createAnalyser(); lipAn.fftSize = 512; src.connect(lipAn); lipBuf = new Float32Array(lipAn.fftSize);
      setInterval(() => {
        if (!lipAn || !T.marks.faceAudio || T.marks.lip) return;
        lipAn.getFloatTimeDomainData(lipBuf); let s2 = 0; for (let i = 0; i < lipBuf.length; i++) s2 += lipBuf[i] * lipBuf[i];
        if (Math.sqrt(s2 / lipBuf.length) > 0.01) T.mark('lip');
      }, 15);
    } catch (e) { console.warn('lip meter:', e?.message); }
  }
  /* ---- إقفال الجلسة: عند الخادم (أو terminate في الطريقة القديمة)، وإلا تبقى تُحسب حتى مهلة السكوت عندهم ---- */
  let connGen = 0;                                   // يزيد مع كل إقفال: اتصال كان جارياً وقت الإقفال يُلغى حين يكتمل (لا تبقى جلسة مفتوحة تُحسب)
  function close(why, tellServer = true) {
    connGen++; endSeq++;                             // endSeq: طلب «انتهى الجواب» المعلّق لا يعيد ضبط شيء بعد الإقفال
    const r = room, w = ws, k = key, pk = pendingKey; room = null; ws = null; key = ''; pendingKey = ''; playEnd = 0; sending = false;
    clearInterval(beatT); clearInterval(keepT); clearTimeout(idleT); clearTimeout(talkT); talkT = null;
    try { sayAbort?.abort(); } catch {} sayAbort = null;
    try { tokAbort?.abort(); } catch {} tokAbort = null;
    if (k && tellServer) beacon(k);
    if (pk && pk !== k) beacon(pk);                  // جلسة وصل مفتاحها والوجه لم يظهر بعد (أُغلقت الصفحة في هذه اللحظة)
    try { if (w && w.readyState === 1) { w.send(JSON.stringify({ command: 'terminate' })); setTimeout(() => { try { w.close(); } catch {} }, 300); } else w?.close(); } catch {}
    try { r?.disconnect(); } catch {}
    setLive(false); face('idle');
    if (via === 'lemon') { via = 'own'; own.emit('IDLE'); }
    if (why) console.log('LemonSlice:', why);
  }
  const armIdle = () => { clearTimeout(idleT); if (!live()) return; idleT = setTimeout(() => { if (!live()) return; if (!didTalking && !speakingNow) close('أُقفلت الجلسة بعد السكوت'); else armIdle(); }, CONFIG.lemonIdleSeconds * 1000); };
  function connect() {
    if (live()) return Promise.resolve(true);
    if (connecting) return connecting;
    if (fails >= 3 && performance.now() - lastFail < 120000) return Promise.resolve(false);     // بعد ثلاث محاولات فاشلة: استراحة دقيقتين
    // v35: لا تظهر صورة نزيه القديمة في وضع lemon أبداً: تبقى صورة الشخصية الجديدة أثناء الاتصال، وعند التعذّر يكمل نزيه بصوته فوقها
    B.remove('simli-off'); B.add('simli-connecting'); face('connecting');
    LT.t = { start: performance.now() };
    try { preRoom?.startAudio?.()?.catch?.(() => {}); } catch {}               // داخل لمسة الزائر: يفك قفل الصوت في iPad/iPhone قبل أي انتظار
    const myGen = connGen;
    const cancelled = () => { if (myGen !== connGen) throw new Error('أُلغي الاتصال (رجعت شاشة الترحيب أو أُقفلت الصفحة)'); };
    connecting = (async () => {
      let r0 = null, w0 = null, k0 = '';
      try {
        let code = ''; try { code = localStorage.getItem('nazih.code') || ''; } catch {}
        const sdkP = loadSdk();                                                    // حُمّلت غالباً من فتح الصفحة
        sdkP.catch(() => {});
        tokAbort = new AbortController();
        const resp = await api('/api/lemon-token', { code, screen: true, v: 2 }, { signal: tokAbort.signal });
        if (!resp.ok || !resp.body) { const d = await resp.json().catch(() => ({})); throw new Error(d.error || `token ${resp.status}`); }
        const lines = ndjson(resp);
        const n1 = await lines.next();
        if (n1.done || !n1.value) throw new Error('رد ناقص من الخادم');
        if (n1.value.error) throw new Error(n1.value.error);
        const d1 = n1.value; LT.t.ticket = performance.now();
        // غرفة LiveKit: تبدأ الآن بالتوازي مع فتح الجلسة عند LemonSlice
        const { Room, RoomEvent } = await sdkP;
        // الغرفة المسخّنة من فتح الصفحة (prepareConnection) تُستعمل مرة واحدة، وبعدها غرفة جديدة
        r0 = preRoom || new Room(); preRoom = null;
        let gotVideo = null; const firstFrame = new Promise((ok) => { gotVideo = ok; });
        r0.on(RoomEvent.TrackSubscribed, (track) => {
          if (track.kind === 'video') { track.attach(video); video.play?.().catch(() => {}); if (video.readyState >= 2) gotVideo(); else video.addEventListener('loadeddata', () => gotVideo(), { once: true }); }
          else if (track.kind === 'audio') { track.attach(audio); audio.volume = settings.volume; watchLip(); }
        });
        r0.on(RoomEvent.Disconnected, () => { if (room === r0) close('انقطع البث'); });
        // رسائل LemonSlice في الغرفة: bot_ready (بدأ البث)، metric بعد كل جواب (time_to_first_push = من أول صوت إلى أول صورة)
        if (RoomEvent.DataReceived) r0.on(RoomEvent.DataReceived, (payload, p, kind, topic) => {
          if (topic && topic !== 'lemonslice') return;
          let m = null; try { m = JSON.parse(new TextDecoder().decode(payload)); } catch { return; }
          if (m?.type === 'bot_ready') { LT.t.botReady = performance.now(); }
          else if (m?.type === 'metric' && DEBUG) { T.lemon = `face first push ${m.time_to_first_push ?? m.data?.time_to_first_push ?? '?'}${m.tts_audio_delay || m.data?.tts_audio_delay ? ', audio arrived late' : ''}`; T.show(); }
          else if ((m?.type === 'error' || m?.type === 'video_generation_error') && DEBUG) console.warn('LemonSlice:', m);
        });
        const joinP = r0.connect(d1.url, d1.token).then(() => { LT.t.joined = performance.now(); LT.show(); });
        joinP.catch(() => {});
        if (d1.url && !d1.ws && !d1.key) {                                    // السطر الثاني: الجلسة جاهزة عند LemonSlice
          const n2 = await lines.next();
          if (n2.done || !n2.value) throw new Error('انقطع الرد قبل أن تجهز الجلسة');
          if (n2.value.error) throw new Error(n2.value.error);
          Object.assign(d1, n2.value);
        }
        try { lines.return?.(); } catch {}
        LT.t.session = performance.now(); LT.t.srv = d1.ms && d1.ms.ws != null ? d1.ms : null; LT.show();
        tokAbort = null;
        if (d1.key) { k0 = pendingKey = d1.key; cancelled(); }
        else if (d1.ws) {                                                     // الخادم أطفأ الإرسال المباشر: الشاشة ترسل الصوت بنفسها (طريقة v34)
          w0 = new WebSocket(d1.ws);
          await Promise.race([new Promise((ok, bad) => { w0.onopen = ok; w0.onerror = () => bad(new Error('تعذّر فتح قناة الصوت')); }), sleep(10000).then(() => { throw new Error('انتهت مهلة قناة الصوت'); })]);
          w0.onmessage = (ev) => {
            let m = null; try { m = JSON.parse(ev.data); } catch { return; }
            if (m?.command === 'playback_finished' && w0 === ws && !sending) {
              const my = token; clearTimeout(talkT); talkT = setTimeout(() => { if (my === token && !sending) { talkT = null; via = 'own'; own.emit('IDLE'); armIdle(); } }, 150);
            }
          };
          w0.onclose = () => { if (ws === w0) close('انقطعت قناة الصوت'); };
        } else throw new Error('رد غير متوقع من الخادم');
        await joinP; cancelled();
        // LemonSlice يحتاج ثوانٍ ليجهّز الوجه: ننتظر أول صورة قبل اعتباره متصلاً
        await Promise.race([firstFrame, sleep(25000).then(() => { throw new Error('انتهت مهلة ظهور الوجه'); })]);
        cancelled();
        LT.t.frame = performance.now(); LT.show();
        room = r0; ws = w0; key = k0; pendingKey = ''; fails = 0; audio.volume = settings.volume; setLive(true); grabPoster(); face('live'); armIdle();
        clearInterval(beatT); clearInterval(keepT);
        if (key) keepT = setInterval(() => { if (key) ctl('keep').then((d) => { if (d.status === 410 && key) close('انتهت الجلسة عند الخادم', false); }); }, 30000);
        else beatT = setInterval(() => send({ command: 'heartbeat', timestamp: Date.now() }), 15000);
        if (window.NAZIH_SCREEN) setTimeout(() => warmAnswers(), 3000);
        return true;
      } catch (e) {
        try { tokAbort?.abort(); } catch {} tokAbort = null;                  // الخادم يُقفل الجلسة إن انصرفت الشاشة قبل أن تجهز
        if (k0) ctl('terminate', k0, true);
        if (pendingKey === k0) pendingKey = '';
        try { if (w0 && w0.readyState === 1) w0.send(JSON.stringify({ command: 'terminate' })); w0?.close(); } catch {}
        try { r0?.disconnect(); } catch {}
        if (myGen !== connGen) { console.log('LemonSlice:', e?.message || e); return false; }     // إلغاء مقصود: ليس تعطلاً
        // تعذّر: تبقى صورة الشخصية الجديدة ونزيه يكمل بصوته (لا تُضاف simli-off التي تُظهر الصورة القديمة)
        console.warn('LemonSlice connect:', e?.message || e); fails++; lastFail = performance.now(); setLive(false);
        face('off', String(e?.message || e));
        if (DEBUG) { T.connect = 'lemon FAILED: ' + String(e?.message || e).slice(0, 60); T.show(); setStatus('LemonSlice: ' + (e?.message || e), 'err'); }
        return false;
      } finally { connecting = null; B.remove('simli-connecting'); }
    })();
    return connecting;
  }
  /* ---- الطريقة القديمة (الشاشة ترسل الصوت بنفسها) تبقى احتياطاً إن أطفأها الخادم ---- */
  const pcmPending = new Map();
  function pcmFetch(text) {
    let p = pcmPending.get(text);
    if (!p) {
      p = fetch(`${CONFIG.apiBase}/api/tts-pcm`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, screen: SCREEN }) });
      p.catch(() => {});
      if (pcmPending.size > 12) pcmPending.delete(pcmPending.keys().next().value);
      pcmPending.set(text, p);
    }
    return p;
  }
  const b64 = (u) => { let s = ''; for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000)); return btoa(s); };
  const CHUNK = 3200;                                  // 3200 بايت = 0.1 ثانية بتردد 16 كيلوهرتز (المستحسن عندهم 80–100 ملّي ثانية)
  async function speakViaBrowser(my, input) {
    let r = null;
    try { r = await pcmFetch(input); pcmPending.delete(input); } catch {}
    if (my !== token) return;
    if (!r || !r.ok || !r.body || !live()) return own.functions.speak({ input });
    if (DEBUG) { T.voice = r.headers.get('x-tts') || ''; }
    const reader = r.body.getReader(); let carry = new Uint8Array(0), total = 0, t0 = 0;
    clearTimeout(talkT); talkT = null; clearTimeout(idleT); sending = true; via = 'lemon';
    const out = (u) => {
      send({ command: 'audio', audio: b64(u), sampleRate: 16000, encoding: 'PCM16' });
      if (!total) { t0 = Math.max(performance.now(), playEnd); audio.volume = settings.volume; T.mark('faceAudio'); own.emit('TALKING'); }
      total += u.length;
    };
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (my !== token || !live()) { try { reader.cancel(); } catch {} if (my === token) { sending = false; via = 'own'; own.emit('IDLE'); } return; }
        if (done) break;
        const m = new Uint8Array(carry.length + value.length); m.set(carry); m.set(value, carry.length);
        let i = 0; for (; i + CHUNK <= m.length; i += CHUNK) out(m.slice(i, i + CHUNK));
        carry = m.slice(i);
      }
      if (carry.length >= 2) out(carry.slice(0, carry.length - (carry.length % 2)));
    } catch (e) { console.warn('LemonSlice stream:', e?.message); }
    sending = false;
    if (!total) return own.functions.speak({ input });
    playEnd = t0 + (total / 32000) * 1000;                                    // 32000 بايت = ثانية صوت
    clearTimeout(talkT); talkT = setTimeout(() => { if (my === token) { talkT = null; via = 'own'; own.emit('IDLE'); armIdle(); } }, Math.max(500, playEnd - performance.now() + 5000));
  }
  const warm = (text) => { api('/api/tts-pcm', { text, screen: true, warm: true }).catch(() => {}); };
  return {
    own: true, simli: true, lemon: true,
    events: own.events,
    /* من فتح الصفحة (مجاناً، بلا جلسة): تنزيل مكتبة LiveKit وتسخين الاتصال بخادمها (DNS وTLS واختيار أقرب منطقة) */
    ensure: connect, preload() { loadSdk().then((m) => { if (window.NAZIH_LK_URL && !preRoom && m.Room) { try { preRoom = new m.Room(); Promise.resolve(preRoom.prepareConnection?.(window.NAZIH_LK_URL)).catch(() => {}); } catch {} } }).catch(() => {}); },
    /* الجملة التالية: صوتها يُجهَّز في الخادم الآن، فيُنطق فور انتهاء الجملة الحالية بلا انتظار */
    prefetch(text) { if (relay() || (connecting && !ws)) { warm(text); return true; } if (live()) { pcmFetch(text); return true; } return false; },
    functions: {
      async speak({ input }) {
        const my = ++token;
        if (attractOn) return own.functions.speak({ input });                    // ترحيب الخمول بصورة نزيه وصوته: لا يفتح جلسة
        /* انتظار قصير للوجه (lemonConnectWait). إن لم يجهز يُنطق الكلام بصوت نزيه نفسه فوق صورة الشخصية فوراً، ويكمل الوجه ما بعده حين يجهز.
           ولا يُنتظر الاتصال نفسه مرة ثانية في الجواب نفسه (كانت كل جملة تنتظر من جديد فتطول السكتات) */
        let ok = live();
        if (!ok && !(connecting && connecting === gaveUpOn)) {
          ok = await Promise.race([connect(), sleep(CONFIG.lemonConnectWait * 1000).then(() => false)]);
          if (!ok && connecting) gaveUpOn = connecting;
        }
        if (my !== token) return;
        if (!ok || !live()) return own.functions.speak({ input });                // الاحتياطي: صوت نزيه فوق صورة الشخصية
        if (!relay()) return speakViaBrowser(my, input);
        const ac = new AbortController(); sayAbort = ac;
        clearTimeout(talkT); talkT = null; clearTimeout(idleT); sending = true; via = 'lemon';
        let r = null;
        try { r = await api('/api/lemon-say', { key, text: input, turn }, { signal: ac.signal }); } catch {}
        if (my !== token) { sending = false; return; }
        if (!r || r.status === 410 || !r.ok || !r.body) {
          sending = false; via = 'own';
          if (r && r.status === 410) close('انتهت الجلسة عند الخادم', false);
          return own.functions.speak({ input });
        }
        let bytes = 0, t0 = 0;
        try {
          for await (const m of ndjson(r)) {
            if (my !== token) { try { ac.abort(); } catch {} return; }
            if (m.e === 'first') {
              t0 = Math.max(performance.now(), playEnd);
              if (DEBUG) { T.voice = `${m.tts || ''} ${m.cache || ''}, server tts ${m.ms}ms`; }
              T.mark('faceAudio'); audio.volume = settings.volume;
              if (!didTalking) own.emit('TALKING');
            } else if (m.e === 'done' || m.e === 'error') { bytes = m.bytes || 0; if (m.e === 'error') console.warn('lemon-say:', m.error); }
          }
        } catch (e) { if (my !== token) return; }
        if (sayAbort === ac) sayAbort = null;
        sending = false;
        if (my !== token) return;
        if (!bytes) { via = 'own'; return own.functions.speak({ input }); }      // لم يصل شيء للوجه: صوت نزيه الاحتياطي
        playEnd = (t0 || performance.now()) + (bytes / 32000) * 1000;
        // احتياط إن تأخر خبر «انتهى النطق»: يُعتبر انتهى بعد مدة الصوت وهامش تأخّر الوجه
        clearTimeout(talkT); talkT = setTimeout(() => { if (my === token) { talkT = null; via = 'own'; own.emit('IDLE'); armIdle(); } }, Math.max(800, playEnd - performance.now() + 6000));
      },
      /* الإرسال المباشر: الجملة التالية تُرسل فوراً (LemonSlice يصفّها خلف الحالية بلا سكتة). الطريقة القديمة: قبل نهاية الحالية بقليل */
      leadMs() { return via === 'lemon' && live() ? (relay() ? 0 : Math.max(0, playEnd - performance.now() - 450)) : -1; },
      /* نهاية الجواب كله: audio_end، ثم يبقى «يتكلم» حتى يخبر LemonSlice أنه خلص النطق فعلاً (فلا يُفتح المايك على آخر كلمة) */
      flush() {
        if (via !== 'lemon' || !live()) return;
        if (!relay()) { send({ command: 'audio_end' }); return; }
        const my = token, seq = ++endSeq;
        ctl('end', key, false, { turn }).then((d) => {
          if (my !== token || seq !== endSeq) return;
          if (d.status === 410) { close('انتهت الجلسة عند الخادم', false); return; }
          if (d.status !== 200) return;              // تعثّر الطلب (شبكة، إعادة تشغيل): يبقى الاحتياط «مدة الصوت + 6 ثوانٍ» هو الذي يعلن السكوت
          const goIdle = () => { if (my === token && seq === endSeq) { talkT = null; via = 'own'; own.emit('IDLE'); armIdle(); } };
          const rest = playEnd - performance.now();
          clearTimeout(talkT);
          // لا يُعلَن «سكت» قبل موعد نهاية الصوت المتوقع (الجواب الطويل أو خبر «انتهى» يخص جواباً قبله)
          if (!d.estimated && rest < 1500) goIdle(); else talkT = setTimeout(goIdle, Math.max(300, rest + 1200));
        });
      },
      interrupt() {
        const wasLemon = via === 'lemon' || sending || playEnd > performance.now() - 5000;
        token++; sending = false; clearTimeout(talkT); talkT = null; playEnd = 0; endSeq++;
        try { sayAbort?.abort(); } catch {} sayAbort = null;
        // دور جديد: أول جملة بعد المقاطعة تحمل رقمه فتُطبَّق المقاطعة قبلها في الخادم مهما كان ترتيب وصول الطلبين
        if (wasLemon) { if (relay()) { turn++; ctl('interrupt', key, false, { turn }); } else send({ command: 'interrupt' }); }
        via = 'own'; own.functions.interrupt();
        if (live()) armIdle();
      },
      toggleMicState() {}, reconnect: connect, connect,
    },
    stop() { close(''); },
  };
}
if (OWN) window.DID_AGENTS_API = window.NAZIH_SIMLI ? (window.NAZIH_LEMON ? makeLemonAvatar(makeOwnAvatar()) : makeSimliAvatar(makeOwnAvatar())) : makeOwnAvatar();
if (OWN && window.NAZIH_SIMLI) setTimeout(() => window.DID_AGENTS_API.preload(), window.NAZIH_LEMON ? 0 : 1200);   // مكتبة الوجه الحي تُحمَّل من فتح الصفحة (مجاناً) فيقصر الانتظار بعد اللمسة
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
        const lead = did.functions.leadMs ? did.functions.leadMs() : -1;
        if (lead < 0) await waitDidDone(cur.length);
        else for (const end = performance.now() + lead; live() && performance.now() < end;) await sleep(Math.min(120, Math.max(10, end - performance.now())));
        cur = null;
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
    // flush: نهاية الجواب كله (وضع lemon فقط). v35: resetIdle(attractOn): عبارة ترحيب الخمول لا تُنهي شاشة الترحيب (كانت تختفي بعد كل عبارة)
    finally { if (live()) { speakingNow = false; lastSpokeAt = performance.now(); if (!did) setTalking(false); try { did?.functions?.flush?.(); } catch {} resetIdle(attractOn); } }
  })();
  const kick = () => { const w = wake; wake = null; if (w) w(); };
  return {
    push(t) { t = (t || '').trim(); if (!t) return; noteSaid(t); q.push(t); if ((!did || did.own) && settings.voice && q.length <= 2 && !did?.prefetch?.(t)) tts(t); kick(); },
    end() { done = true; kick(); return run; },
  };
}
const speechChunk = () => (did && !did.own ? 700 : 320);    // مقاطع أقصر للصوت الاحتياطي حتى يبدأ النطق أسرع
function speechParts(text) {
  // أول مقطع قصير (الجملة الأولى) ليبدأ الكلام بسرعة، ثم البقية بمقاطع أطول
  const m = /[.؟?!،؛:\n]/.exec(text.slice(25)), cut = m ? 25 + m.index + 1 : 0;
  if (cut && cut <= 170 && cut < text.length - 15) return [text.slice(0, cut), ...splitForSpeech(text.slice(cut), speechChunk())];
  return splitForSpeech(text, speechChunk());
}
async function speak(text) {
  stopSpeaking();
  if (!text || (!did && !settings.voice)) return;
  const sp = makeSpeaker();
  speechParts(text).forEach((x) => sp.push(x));
  await sp.end();
}
/* v34: صوت الأجوبة الجاهزة يُجهَّز في ذاكرة الخادم (وقت الفراغ فقط)، فيُنطق فوراً حين يختارها زائر.
   v35: يُجهَّز من فتح الصفحة على الشاشة الرئيسية (لا بعد أول اتصال)، في الخادم فقط بلا تنزيل الصوت إلى الشاشة،
   ويُعاد كل 20 دقيقة على الأكثر (إن أُعيد تشغيل الخادم ضاعت ذاكرته). المكرر في الذاكرة لا يُطلب من مزوّد الصوت. التكلفة: مرة بعد كل تشغيل للخادم. */
let warmedAt = 0, warming = false;
async function warmAnswers() {
  if (warming || (warmedAt && performance.now() - warmedAt < 20 * 60 * 1000)) return;
  warming = true;
  try {
    const m = ackMode();
    for (const b of BANK) for (const part of speechParts(m === 'never' ? b.a.replace(ACK_LEAD, '') : b.a)) {
      while (nazihActive() || autoMic?.recording || recState) await sleep(2000);
      // wait: الخادم يرد بعد اكتمال توليد المقطع، فتُجهَّز المقاطع واحداً بعد الآخر ولا تُطلب كلها من مزوّد الصوت في نفس اللحظة
      const r = await fetch(`${CONFIG.apiBase}/api/tts-pcm`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: part, screen: SCREEN, warm: true, wait: true }) });
      if (r.status !== 204) await r.arrayBuffer();               // خادم قديم لا يعرف warm: يرسل الصوت كاملاً
      if (!r.ok) return;
    }
    warmedAt = performance.now();
  } catch {} finally { warming = false; }
}

let fillerI = Math.floor(Math.random() * 3);
const nextFiller = () => CONFIG.fillers[fillerI++ % CONFIG.fillers.length];
function ackMode() { return ['auto', 'always', 'never'].includes(settings.ack) ? settings.ack : CONFIG.ack; }
const ACK_LEAD = /^\s*(?:أبشر|سَمّ|سم|طيّب|طيب)[.،!,\s]+/;
let askCount = 0, acksThisChat = 0;            // في وضع auto تُقال «أبشر» مرة واحدة لكل زائر
/* v27: العبارة المبكرة. تبدأ مع تحويل الصوت إلى نص، ثم يكمل الجواب على المتكلّم نفسه دون انقطاع. إن لم يأتِ سؤال (ضجيج، خطأ) تنتهي بهدوء. */
let earlyFill = null;
function startEarlyFill(quiet, loudMs) {
  const m = ackMode();
  if (m === 'never' || (m === 'auto' && acksThisChat > 0) || !settings.voice || speechMode || pendingQ || speakingNow || didTalking) return;
  if (quiet && loudMs < 900) return;               // في الاستماع التلقائي: لا يرد على صوت قصير قد يكون ضجيجاً
  const sp = makeSpeaker(); sp.push(nextFiller()); T.mark('filler');
  earlyFill = { sp, my: session };
}
function dropEarlyFill() { const e = earlyFill; earlyFill = null; if (e) e.sp.end(); }

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
  session++; speechMode = false;
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

/* =========================================================
 *  البحث في الأنظمة (محلياً داخل الموقع)
 * ========================================================= */
const LAW_ALIASES = {
  // اللوائح قبل أنظمتها: «لائحة الانضباط» تُقدَّم على «نظام الانضباط»
  'discipline-reg': ['لائحه الانضباط', 'لائحه نظام الانضباط', 'التنفيذيه لنظام الانضباط', 'التنفيذيه للانضباط'], 'hr-reg': ['لائحه الموارد البشريه', 'التنفيذيه للموارد البشريه', 'لائحه الخدمه المدنيه', 'التنفيذيه لنظام الخدمه المدنيه'], 'non-saudi-staff': ['غير السعوديين', 'غير سعوديين', 'توظيف غير السعودي'],
  'bog-proc': ['المرافعات امام ديوان المظالم', 'مرافعات ديوان المظالم', 'المرافعات امام الديوان', 'المرافعات الاداريه'], bog: ['ديوان المظالم', 'القضاء الاداري'],
  basic: ['اساسي للحكم', 'نظام الحكم', 'النظام الاساسي'], shura: ['شوري'], regions: ['نظام المناطق', 'مناطق المملكه', 'امير المنطقه', 'امراء المناطق'], cabinet: ['مجلس الوزراء'], bayah: ['بيعه'],
  nazaha: ['هيئه الرقابه', 'نظام نزاهه', 'نظام الهيئه', 'نظام مكافحه الفساد'], bribery: ['رشوه', 'رشاوي', 'راشي', 'مرتشي'], protect: ['مبلغين', 'حمايه المبلغ', 'الشهود', 'حمايه الشاهد'], aml: ['غسل الاموال', 'غسيل الاموال', 'غسل اموال', 'غسيل اموال'],
  forgery: ['تزوير', 'مزور', 'محرر رسمي', 'محرر عرفي'], discipline: ['انضباط'], civil: ['خدمه المدنيه', 'خدمه مدنيه'],
  faculty: ['هيئه التدريس', 'منسوبي الجامعات', 'استاذ مساعد', 'استاذ مشارك', 'التفرغ العلمي'],
};
const textLaws = () => (window.LAWS || []).filter((l) => !l.pages && !l.pdf && l.id !== 'forgery-old');
let lastLawId = null;
function detectLaws(n) {                     // كل الأنظمة المذكورة في السؤال (قد يسأل الزائر عن أكثر من نظام)
  const hits = Object.entries(LAW_ALIASES).map(([id, keys]) => [id, keys.filter((k) => n.includes(k))]).filter(([, ks]) => ks.length);
  const ids = hits.filter(([id, ks]) => !ks.every((k) => { const left = hits.filter(([o]) => o !== id).flatMap(([, oks]) => oks).filter((ok) => ok.includes(k) && ok !== k).reduce((t, ok) => t.split(ok).join(' '), n); return !left.includes(k); })).map(([id]) => id);
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
/* اختيار ما يُرسل مع السؤال إلى الذكاء الاصطناعي.
   v31: البحث صار يفهم كلام الناس. الزائر يقول «هدية» و«واسطة» و«أخاف أبلّغ»، والنظام يقول «عطية» و«وساطة» و«المبلِّغ»،
   فكانت المواد الصحيحة لا تصل إلى النموذج فيجاوب من معلوماته العامة. الآن:
   1) خريطة مفاهيم تربط كلام الزائر بالنظام والمواد التي تجاوب عنه.
   2) السؤال القصير التابع («تأكد»، «وش عقوبتها؟») يُبحث عنه مع السؤال الذي قبله.
   3) تُرسل مع المواد قائمة الأنظمة المضافة والأجوبة المعتمدة القريبة، فيعرف النموذج ما عنده وما ليس عنده. */
const STOP = new Set(('من في علي الي عن ما هو هي هل كم ماذا متي اين كيف وش ايش ليش لماذا هذا هذه ذلك التي الذي او ان اذا لو مع بين كل قد لا نعم ابي ابغي اريد عطني اذكر اقرا لي نص نظام النظام الماده ماده عقوبه العقوبه ' +
  'طيب زين يعني بس تري يا والله ممكن ودي تقدر قل قول شنو فيه عندي عندك عنده لازم يصير صار اللي الي كذا هاذي هذي ذي شي واحد احد اي ايه سلام عليكم حالك اخبارك علومك هلا مرحبا اهلا صباح مساء خير نور شكرا مشكور يعطيك عافيه سلامه بخير الحمد لله تمام انت اسمك الله شاء بسم يسلمك تسلم فرق مقارنه معني تعريف مفهوم مقصود قصد نوع انواع امثله مثال شرح اشرح وضح انظمه قوانين قانون سؤال جواب معلومه معلومات موضوع').split(' '));
/* كلمة الزائر ← كلمات النظام */
const SYN = {
  هديه: ['عطيه', 'هدايا'], هدايا: ['عطيه'], اكراميه: ['اكراميات', 'عطيه'], فلوس: ['مال', 'مبلغ'], واسطه: ['وساطه'], فزعه: ['وساطه', 'رجاء'],
  يسجن: ['سجن'], ينسجن: ['سجن'], حبس: ['سجن'], طرد: ['فصل'], يطرد: ['فصل'], يفصل: ['فصل'], ينفصل: ['فصل'], يفصلوني: ['فصل'], معاش: ['راتب'],
  دكتور: ['عضو هيئه التدريس'], دوام: ['وقت العمل'], اجازتي: ['اجازه'], مدير: ['رئيس'], مديري: ['رئيس'], مزوره: ['زور'], مزور: ['زور'], يزور: ['زور'], وقعت: ['توقيع'], اوقع: ['توقيع'],
  ابلغ: ['بلاغ', 'مبلغ'], يبلغ: ['بلاغ', 'مبلغ'], بلغت: ['بلاغ'], تبليغ: ['بلاغ'], استقيل: ['استقاله'], اغيب: ['غياب', 'انقطاع'], غبت: ['غياب', 'انقطاع'], اسمي: ['هويه'], هويتي: ['هويه'], يبصم: ['حضور', 'انصراف'], يعين: ['تعيين'], يحاكم: ['محكمه'], محاكمه: ['محكمه'], يحاسب: ['محاسبه', 'مساءله'], يراقب: ['رقابه'], يعينون: ['تعيين'], يعينه: ['تعيين'], اترقي: ['ترقيه'], يترقي: ['ترقيه'],
};
/* المفاهيم: إذا مسّ السؤال واحداً منها أُرسلت أنظمته ومواده المثبّتة ولو لم يذكر الزائر اسم النظام.
   re على النص بعد التوحيد (norm). laws: أنظمة تُرجَّح موادها. pins: مواد تُرسل دائماً {النظام: [أرقام المواد]}. terms: كلمات بحث إضافية. */
const CONCEPTS = [
  { id: 'gift', re: /هدي[هت]|هدايا|اكرامي|حلاو[هت]|بقشيش|عمول[هت]|تحت الطاول|مقابل (?:مالي|مادي)|يرشي|ارشي|يدفع ل|دفعت ل|ادفع ل|اعطي(?:ه|ت)? (?:ال)?موظف|فلوس ل(?:ل)?موظف|عزيم|عزوم|عزم|عشاء|غداء|ذبيح|ضياف|(?:طلب|يطلب|يبي|يبغي|ياخذ|اخذ|استلم|عطيت|عطاني|عطاه|دفع)\S*\s+(?:\S+\s+){0,3}(?:فلوس|مبلغ|مال\b|مقابل|ريال)|معامل\S*.{0,40}(?:فلوس|مبلغ|مقابل)|(?:فلوس|مبلغ|مقابل).{0,40}معامل/, laws: ['bribery'], pins: { bribery: [1, 2, 3, 9, 10, 12, 16], civil: [12], 'hr-reg': [209] }, terms: ['عطيه', 'وعد'] },
  { id: 'wasta', re: /واسط|وساط|وسيط|وسطاء|فزع[هت]|توصي[هت]|محسوبي|يتوسط|توسط|يعرف احد|معرف[هت] (?:ب|في)|قدم(?:ه|ني|ته)? علي|يقدمني|دور(?:ي|ه)? (?:قبل|بعد)/, laws: ['bribery'], pins: { bribery: [4, 10, 16], civil: [12] }, terms: ['وساطه', 'توصيه', 'رجاء'] },
  { id: 'power', re: /نفوذ|استغل|يستغل|اساء[هت] استعمال|اساء[هت] استخدام|صلاحيات(?:ه|ي)?|منصب(?:ه|ي)?/, laws: ['nazaha'], pins: { bribery: [5], nazaha: [2], civil: [12], 'hr-reg': [209] }, terms: ['نفوذ', 'اساءه استعمال السلطه'] },
  { id: 'report', re: /(?:^|\s)(?:ا|ي|ن|ت)بلغ(?:\s|$)|بلاغ|تبليغ|مبلغين|ابلاغ|اشتكي|شكوي|اخاف|خايف|يعرفون(?:ي)?|يكشف|هويتي|هويه (?:ال)?مبلغ|حمايه (?:ال)?مبلغ|سري[هت]|ينتقم|يضروني|يفصلوني|شاهد|شهود/, laws: ['protect', 'nazaha'], pins: { protect: [2, 15, 16, 17, 18, 22, 24], nazaha: [4] }, terms: ['بلاغ', 'مبلغ', 'هويه', 'حمايه'] },
  { id: 'reward', re: /مكافا[هت] (?:ال)?(?:مبلغ|بلاغ|من يبلغ|اللي يبلغ)|يعطوني (?:شي|فلوس|مكافا)|لي مكافا/, laws: ['bribery'], pins: { bribery: [17] }, terms: ['مكافاه', 'ارشد'] },
  { id: 'forgery', re: /زور|تزوير|مزور|توقيع|وقع(?:ت)? علي|اوقع|محضر|ختم|خاتم|وثيق[هت]|مستند|تقليد|تحريف|تقرير طبي|عذر طبي|سكليف|حضور وانصراف|بصم/, laws: ['forgery'], pins: { forgery: [1, 8, 9, 12, 19, 25] }, terms: ['زور', 'محرر'] },
  { id: 'forgery-med', re: /تقرير طبي|عذر طبي|سكليف|اجاز[هت] مرضي|شهاد[هت] طبي/, laws: ['forgery'], pins: { forgery: [14] }, terms: [] },
  { id: 'forgery-att', re: /بصم|حضور وانصراف|تحضير/, laws: ['forgery'], pins: { forgery: [16] }, terms: [] },
  { id: 'forgery-exam', re: /اوراق (?:ال)?(?:اجاب|اختبار)|رصد (?:ال)?درجات|(?:عدل|غير|يعدل|يغير|تعديل|تغيير) (?:ال)?(?:درج|نتيج)/, laws: ['forgery'], pins: { forgery: [15] }, terms: [] },
  { id: 'grievance', re: /تظلم|ديوان المظالم|(?:محكم[هت]|محاكم) (?:ال)?(?:اداري|استئناف)|قضاء (?:ال)?اداري|قرار(?:ات)? (?:ال)?اداري|الغاء (?:ال)?قرار|(?:اعترض|اعتراض|اطعن|طعن) (?:علي|في) (?:ال)?(?:قرار|حكم)|(?:^| )[ابلن]?رفعت? (?:ال)?(?:دعوي|قضي[هت])(?! (?:ال)?(?:جزائي|جنائي|عام))|دعوي (?:ال)?(?:اداري|تاديبي|تعويض|الغاء)|تعويض (?:عن (?:ال)?قرار|من (?:ال)?(?:جه[هت]|دوله|حكومه|وزاره|جامعه))|يوقف (?:ال)?تنفيذ|وقف (?:ال)?تنفيذ|استئناف|استانف|اعاد[هت] النظر/, laws: ['bog-proc', 'bog'], pins: { bog: [13], 'bog-proc': [5, 8, 9, 33] }, terms: ['تظلم', 'دعوي'] },
  { id: 'attempt', re: /شروع|شرع في|حاول|محاول[هت]|ما (?:كمل|تم|نجح)/, laws: [], pins: { forgery: [20], bribery: [9], aml: [2], protect: [29] }, terms: [] },
  { id: 'public', re: /المال العام|اموال (?:الدول|عام|الجه)|ممتلكات|سيار[هت] (?:العمل|الدوام|حكومي|الجه)|اختلاس|اختلس|يختلس|تبديد|عهد[هت]/, laws: ['nazaha'], pins: { nazaha: [2, 4, 18] }, terms: ['المال العام', 'جرائم فساد'] },
  { id: 'wealth', re: /ثرو[هت]|تضخم|من اين لك|اثراء|غني فجا|زادت (?:ا)?موال/, laws: ['nazaha'], pins: { nazaha: [19] }, terms: ['ثروه', 'زياده لا تتناسب'] },
  { id: 'corruption', re: /فساد|فاسد/, laws: ['nazaha'], pins: { nazaha: [2, 4, 18] }, terms: ['جرائم فساد'] },
  { id: 'nazaha', re: /نزاه[هت]|هيئ[هت] (?:ال)?رقاب/, laws: ['nazaha'], pins: { nazaha: [3, 4] }, terms: [] },
  { id: 'duties', re: /واجبات|محظور|ممنوع علي|يحظر|اسرار|افشاء|تجار[هت]|سجل تجاري|اشتغل ب|عمل (?:ثاني|اخر|اضافي)|اخلاقيات|مدون[هت] السلوك/, laws: ['civil', 'hr-reg'], pins: { civil: [11, 12, 13], 'hr-reg': [208, 209] }, terms: ['يحظر', 'يجب علي الموظف'] },
  { id: 'discipline', re: /يفصل|فصل(?:ه|ي|وني)?(?:\s|$)|انذار|حسم|خصم (?:من )?(?:ال)?راتب|تاديب|مخالف[هت] (?:وظيفي|اداري|مالي)|غياب|اغيب|غبت|تاخر(?:ت)? عن|كف اليد|لفت نظر|جزاء(?:ات)?|تحقيق اداري/, laws: ['discipline', 'discipline-reg'], pins: {}, terms: ['مخالفه', 'جزاء'] },
  { id: 'hr', re: /اجاز[هت]|ترقي[هت]|راتب|رواتب|بدل(?:ات)?(?:\s|$)|علاو[هت]|نقل(?:ي|ه)?(?:\s|$)|اعار[هت]|استقال[هت]|استقيل|تقاعد|دوام|تكليف|انتداب|ابتعاث|تعيين|توظيف|مرتب[هت]|تقويم الاداء|تقييم الاداء/, laws: ['hr-reg', 'civil'], pins: {}, terms: [] },
  { id: 'faculty', re: /دكتور|دكاتر|استاذ|اعضاء? هيئ[هت] (?:ال)?تدريس|محاضر|معيد|تفرغ علمي|نصاب|ساعات (?:ال)?تدريس|مجلس (?:ال)?(?:قسم|كلي|جامع)|عميد|رئيس (?:ال)?قسم/, laws: ['faculty'], pins: {}, terms: ['عضو هيئه التدريس'] },
  { id: 'contract', re: /متعاقد|غير سعودي|اجنبي|وافد|تذاكر|مكافا[هت] نهاي/, laws: ['non-saudi-staff'], pins: {}, terms: ['متعاقد'] },
  { id: 'state', re: /الملك|ولي العهد|دستور|حقوق (?:ال)?(?:انسان|مواطن)|القضاء|السلط[هت] (?:ال)?(?:قضائي|تنفيذي|تنظيمي)/, laws: ['basic'], pins: {}, terms: [] },
];
const WHOLE = new Set(['bribery']);          // قصير وهو قلب الفعالية: يُرسل كاملاً متى مسّه السؤال
const CTX_BUDGET = 9500;                     // حروف المواد المرسلة مع السؤال (v34: كان 13000؛ أقل = يبدأ الرد أسرع وأقل خلطاً)
const FOLLOW_RE = /(?:^|\s)(?:تاكد|متاكد|اكيد|صدق|وضح|فصل لي|تفصيل|اكثر|كمل|اشرح|عيد|اعد|مثال|عقوبتها|عقوبته|عقوبتهم|حكمها|حكمه|عنها|عنه|فيها|منها|عليها|عليه|هالشي|نفس الشي|وغيره|وغيرها)(?:\s|$)/;
let LAW_INDEX = null, prevQ = null;          // prevQ: آخر سؤال له موضوع (للأسئلة التابعة)
const artNo = (a) => (/مكرر|ملحق|تمهيد/.test(a.title) ? null : articleNumber(a.title.replace(/^.*?ماده\s*|^المادة\s*/, '')));
function buildIndex() {
  LAW_INDEX = [];
  for (const law of textLaws()) law.articles.forEach((a, i) => LAW_INDEX.push({ law, a, i, num: artNo(a), n: norm(law.name + ' ' + a.title + ' ' + a.chapter + ' ' + a.body) }));
}
/* كلمة لا ترد في أي مادة بصيغتها («لأستاذ»، «إجازتي»، «يفصلوني»): تُجرَّب بلا حرف الجر أو المضارعة وبلا الضمير، وتُعتمد أول صيغة ترد في الأنظمة */
const STEMS = new Map(), DFS = new Map();
const df = (t) => { if (!DFS.has(t)) DFS.set(t, LAW_INDEX.reduce((c, e) => c + (e.n.includes(t) ? 1 : 0), 0)); return DFS.get(t); };
function stemFallback(t) {
  if (STEMS.has(t)) return STEMS.get(t);
  let out = t; const d0 = t.length >= 4 ? df(t) : 99;
  // حرف جر ملتصق («لأستاذ»، «بسيارة»): إن كانت الكلمة بدونه أشيع في الأنظمة فهي المقصودة
  const bare = t.replace(/^[لبكف](?=.{4})/, '');
  if (bare !== t && !STOP.has(bare) && df(bare) >= Math.max(1, d0 * 1.5)) out = bare;
  else if (d0 === 0) {
    const sfx = (x) => { const y = x.replace(/(?:وني|ها|هم|هن|كم|نا|ني|ه|ي|ك)$/, ''); return y === x ? [] : /ت$/.test(y) ? [y, y.slice(0, -1) + 'ه'] : [y]; };
    const verb = t.replace(/^[يتنا](?=.{3})/, ''), prep = t.replace(/^[لبكف](?=.{3})/, '');
    const cands = [...sfx(t).filter((c) => c.length >= 4), ...(verb !== t ? [verb, ...sfx(verb)] : []), ...(prep !== t ? [prep, ...sfx(prep)].filter((c) => c.length >= 4) : [])];
    out = cands.find((c) => c.length >= 3 && !STOP.has(c) && df(c) > 0) || t;
  }
  STEMS.set(t, out); return out;
}
const baseTerms = (n) => [...new Set(n.replace(/[^ء-ي0-9\s]/g, ' ').split(/\s+/).map((w) => w.replace(/^(وال|بال|لل|ال|و)(?=.{3})/, '')).map((w) => (w.length > 5 ? w.replace(/(ات|ين|ون)$/, '') : w)).filter((w) => w.length > 2 && !STOP.has(w)))];
function analyze(n) {                        // ماذا يطلب هذا النص: أنظمة مذكورة بالاسم، مفاهيم، كلمات بحث
  const lawIds = detectLaws(n), concepts = CONCEPTS.filter((c) => c.re.test(n)), base = baseTerms(n), terms = new Map();
  base.forEach((t) => { terms.set(stemFallback(t), 1); (SYN[t] || []).forEach((x) => { if (!terms.has(x)) terms.set(x, 0.8); }); });
  concepts.forEach((c) => c.terms.forEach((x) => { if (!terms.has(x)) terms.set(x, 0.8); }));
  return { lawIds, concepts, base, terms };
}
/* سؤال تابع لما قبله؟ قصير أو فيه إحالة («تأكد»، «وش عقوبتها»، «طيب والوسيط؟») */
const isFollowUp = (n, an) => !an.lawIds.length && (an.base.length <= 2 || n.length <= 18 || FOLLOW_RE.test(n) || (/^(?:طيب|زين|و|ف)\s*و/.test(n) && an.base.length <= 4));
let lastCtxInfo = '';                        // لمربع القياس: ما الذي أُرسل مع آخر سؤال
function retrieveContext(text) {
  if (!LAW_INDEX) buildIndex();
  const n = norm(text), cur = analyze(n);
  if (cur.lawIds.length) lastLawId = cur.lawIds[0];
  const follow = prevQ && performance.now() - prevQ.at < 240000 && isFollowUp(n, cur) ? analyze(prevQ.n) : null;
  if (!follow || cur.concepts.length) prevQ = { n: follow && !cur.concepts.length ? prevQ.n : n, at: performance.now() }; else prevQ.at = performance.now();
  // دمج السؤال الحالي مع السابق (بوزن أقل) إن كان تابعاً له
  const lawIds = [...new Set([...cur.lawIds, ...(follow ? follow.lawIds : [])])];
  const concepts = [...new Set([...cur.concepts, ...(follow ? follow.concepts : [])])];
  const cLaws = [...new Set(concepts.flatMap((c) => c.laws))].filter((id) => !lawIds.includes(id));
  const terms = new Map(cur.terms); if (follow) follow.terms.forEach((wgt, t) => { if (!terms.has(t)) terms.set(t, wgt * 0.5); });
  if (!lastLawId && cLaws.length) lastLawId = cLaws[0];
  // وزن كل كلمة بحسب ندرتها: الكلمة التي ترد في أغلب المواد لا تميّز مادة عن أخرى
  const N = LAW_INDEX.length, tl = [...terms.keys()];
  const counts = tl.map((tm) => LAW_INDEX.map((e) => e.n.split(tm).length - 1));
  const dfs = counts.map((cs) => cs.filter(Boolean).length), idf = dfs.map((d) => Math.log(1 + N / (1 + d)));
  const all = LAW_INDEX.map((e, i) => {
    let sc = 0;
    tl.forEach((tm, t) => { const c = counts[t][i]; if (c) sc += Math.min(c, 3) * idf[t] * (tm.length > 4 ? 1.3 : 1) * terms.get(tm); });
    if (sc && lawIds.includes(e.law.id)) sc += 4; else if (sc && cLaws.includes(e.law.id)) sc += 3;
    let m = 0, rare = false; tl.forEach((tm, t) => { if (counts[t][i]) { m++; if (dfs[t] <= N * 0.05) rare = true; } });
    return { e, sc, m, rare };
  });
  const byLaw = (id) => all.filter((x) => x.e.law.id === id), best = (xs, k) => xs.filter((x) => x.sc > 0).sort((x, y) => y.sc - x.sc).slice(0, k);
  const picked = [];                          // بترتيب الأولوية: المثبّتة، ثم النظام الكامل، ثم الأقرب من كل نظام، ثم الأقرب إجمالاً
  for (const c of concepts) for (const [id, nums] of Object.entries(c.pins)) for (const num of nums) { const x = all.find((y) => y.e.law.id === id && y.e.num === num); if (x) picked.push({ ...x, pin: true }); }
  const named = lawIds.length === 1 ? textLaws().find((l) => l.id === lawIds[0]) : null;
  const wholeIds = [...new Set([...(named && named.articles.reduce((s, a) => s + a.body.length + 60, 0) <= CTX_BUDGET - 400 ? [named.id] : []), ...[...lawIds, ...cLaws].filter((id) => WHOLE.has(id))])];
  for (const id of wholeIds) picked.push(...byLaw(id).map((x) => ({ ...x, pin: true })));
  for (const id of lawIds) { const mine = byLaw(id); picked.push(...best(mine, 6)); if (mine[0]) picked.push(mine[0]); }
  if (!lawIds.length && !concepts.length) {     // سؤال عام: المتصل فعلاً فقط. مادة لا يجمعها بالسؤال إلا كلمة شائعة («جريمة») تُترك، وإلا ذكرها النموذج حشواً
    const top = best(all.filter((x) => tl.length <= 1 || x.m >= 2 || x.rare), 6); if (top.length) picked.push(...top.filter((x) => x.sc >= top[0].sc * 0.5));
  }
  else {
    picked.push(...best(all, 6));
    for (const id of cLaws) picked.push(...best(byLaw(id), lawIds.length ? 2 : 3));
    picked.push(...best(all, 10));
  }
  const chosen = []; const seen = new Set(); let used = 0;
  for (const x of picked) {
    if (seen.has(x.e)) continue; seen.add(x.e);
    const body = x.e.a.body.slice(0, x.pin ? 4200 : 1600), len = body.length + x.e.law.name.length + x.e.a.title.length + 12;
    if (used + len > CTX_BUDGET) continue;    // لا تتوقف عند مادة طويلة: قد تتسع التي بعدها
    used += len; chosen.push({ e: x.e, body });
  }
  const order = [...new Set(chosen.map((c) => c.e.law.id))];
  chosen.sort((a, b) => order.indexOf(a.e.law.id) - order.indexOf(b.e.law.id) || a.e.i - b.e.i);
  // الأجوبة المعتمدة القريبة من السؤال (كتبها ووافق عليها فريق الفعالية)
  const qn = follow ? prevQ.n + ' ' + n : n;
  const hay = qn + ' ' + tl.join(' ');
  const courtQ = concepts.some((c) => c.id === 'grievance') || lawIds.some((id) => id === 'bog' || id === 'bog-proc');     // سؤال عن التظلم والمحاكم الإدارية: أجوبة نزاهة المعتمدة لا تُرفق إلا إذا طابقته بوضوح
  const hayB = hay.replace(/تحقيق/g, ' ');     // «التحقيق» ليست «حقّي»
  // v34: كلمة قصيرة عامة وحدها («حائل»، «مثال»، «حقي»، «اخاف») لا تكفي لإرفاق جواب جاهز، وإلا ذكره النموذج في سؤال لا علاقة له به
  const bank = BANK.map((b) => { const ks = b.k.filter((k) => hayB.includes(k)); return { b, m: ks.length, strong: ks.some((k) => k.length >= 5) }; })
    .filter((x) => x.m >= 2 || (!courtQ && x.m === 1 && x.strong)).sort((x, y) => y.m - x.m).slice(0, 2).map((x) => x.b);
  lastCtxInfo = (order.map((id) => `${id}(${chosen.filter((c) => c.e.law.id === id).length})`).join(' ') || '-') + (bank.length ? ' | bank:' + bank.map((b) => b.id).join(',') : '') + (follow ? ' | follow-up' : '');
  // v34: العناوين بصيغة لا يقلدها النموذج في كلامه («المتاح أمامي»...). الخادم يقرأ عناوين المواد 【النظام — المادة】 ليتحقق من أرقامها
  return '【الأنظمة التي تعرفها، ولا تعرف غيرها】\n' + textLaws().map((l) => l.name).join('؛ ') + '.\n\n'
    + (bank.length ? '【أجوبة موثقة】\n' + bank.map((b) => `س: ${b.q}\nج: ${b.a}`).join('\n') + '\n\n' : '')
    + '【نصوص المواد】\n' + (chosen.length ? chosen.map((c) => `【${c.e.law.name} — ${c.e.a.title}】\n${c.body}`).join('\n\n') : '(لا يوجد نص يتعلق بهذا السؤال)');
}

/* سؤال الزائر يطابق سؤالاً معتمداً (بعد حذف أدوات السؤال والحشو)؟ */
function exactBank(text) {
  const key = (x) => norm(x).replace(/[^ء-ي0-9\s]/g, ' ').split(/\s+/).map((w) => w.replace(/^(وال|بال|لل|ال|و)(?=.{3})/, '')).filter((w) => w.length > 1 && !STOP.has(w)).join(' ');
  const k = key(text);
  return k.length >= 6 ? BANK.find((b) => key(b.q) === k) || null : null;
}
function ctxFor(text) { const c = retrieveContext(text); if (DEBUG) { T.ctx = lastCtxInfo; T.show(); } return c; }
async function ask(text, item = null) {
  text = (text || '').trim();
  if (!text) return;
  if (speechMode) { if (!askSrc) { dropEarlyFill(); return; } speechMode = false; }     // أثناء كلمة الافتتاح: أصوات القاعة لا تقطعها، واللمس أو الكتابة يقطعها
  const ef = earlyFill; earlyFill = null;
  const early = ef && !item && ef.my === session ? ef.sp : null;      // «أبشر» بدأت قبل قليل (وضع always): الجواب يكمل بعدها
  if (ef && !early) ef.sp.end();
  if (early) acksThisChat++;
  if (!early && nazihActive()) interrupt();      // سؤال جديد أثناء الجواب: يقطع القديم
  resetIdle();                                   // السؤال بالصوت يُحسب تفاعلاً مثل اللمس
  const my = session, earlySeq = early ? speakSeq : -1;
  if (!early) stopSpeaking();
  closeSheets();
  const intent = item ? null : detectIntent(text);
  if (intent) { runAction(intent, text); return; }

  if (!T.marks.recEnd) T.reset();
  T.mark('askStart');
  setBusy(true); ensureDidConnected();
  showCaption(text, '', true);
  history.push({ role: 'user', content: text });
  setStatus('نزيه يفكر...');
  askCount++;
  let reply, suggestions = [], hit = item || exactBank(text), streamed = null;      // سؤال مطابق لسؤال معتمد: يُجاب بجوابه المعتمد كما هو
  const exact = hit ? null : lookupArticle(text);        // «المادة كذا من نظام كذا»: تُقرأ حرفياً من ملف الأنظمة
  if (exact) { reply = exact; T.mark('exact'); T.mark('firstText'); }
  track('q', { kind: hit ? 'bank' : exact ? 'exact' : 'ai', id: hit ? hit.id : '', src: takeSrc(), text: hit ? '' : text });
  if (!hit && !exact) {
    // إذا تأخر الجواب قال نزيه كلمة واحدة («أبشر») فيعرف الزائر أنه سُمع، ثم يكمل بالجواب دون انقطاع. انظر CONFIG.ack
    let sp = early, firstSaid = false;
    if (sp) streamed = sp;
    const fillT = null;
    try {
      const r = await fetch(`${CONFIG.apiBase}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history, context: ctxFor(text), stream: true }), signal: (askAbort = new AbortController()).signal });
      if (r.ok && r.body && (r.headers.get('content-type') || '').startsWith('text/plain')) {
        if (DEBUG) T.model = r.headers.get('x-chat') || '';
        // رد متدفق: ننطق أول جملة فور اكتمالها بدل انتظار الرد كله
        const reader = r.body.getReader(), dec = new TextDecoder();
        let full = '', spoken = 0;
        // D-ID الحقيقي يحتاج 1–2 ثانية ليبدأ كل مقطع، فيبقى له سلوك v34 (الجملة الأولى ثم الباقي دفعة واحدة). الوجوه الأخرى تصف المقاطع بلا سكتة
        const incremental = !did || did.own || !!did.functions?.leadMs;
        /* v35: كل جملة تكتمل تذهب للنطق فوراً والعقل ما زال يكتب ما بعدها. كان كل ما بعد الجملة الأولى ينتظر اكتمال الجواب كله،
           فيسكت نزيه بعد أول جملة حتى ينتهي العقل من الكتابة (سبب للتقطع). الخادم يرسل الجواب جملة كاملة جملة كاملة. */
        const pushReady = (ans, final) => {
          const rest = ans.slice(spoken);
          if (final) { if (rest.trim()) splitForSpeech(rest, speechChunk()).forEach((x) => sp.push(x)); spoken = ans.length; return; }
          let end = -1; const re = /[.؟?!؛\n](?=\s)|[؟?!]$|(?<![A-Za-z0-9@])\.$/g; let m;
          while ((m = re.exec(rest))) end = m.index + 1;
          if (end < 0) return;
          const ready = rest.slice(0, end);
          if (ready.trim().length < 20) return;          // جملة قصيرة جداً: تنتظر ما بعدها حتى لا يتقطع الصوت مقاطع صغيرة
          splitForSpeech(ready, speechChunk()).forEach((x) => sp.push(x));
          spoken += end;
        };
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          if (my !== session) { try { reader.cancel(); } catch {} return; }
          full += dec.decode(value, { stream: true });
          const ans = full.split('§')[0];
          if (!firstSaid) {
            /* v35: الخادم يرسل الجملة كاملة بلا مسافة بعدها، فتُقبل نهاية الجملة في آخر ما وصل أيضاً (كانت الأولى تنتظر وصول الثانية) */
            const m1 = /[.؟?!\n](?=\s)|[؟?!]$|(?<![A-Za-z0-9@])\.$/.exec(ans.slice(18)), m2 = /[،؛:](?=\s)/.exec(ans.slice(45));
            const cut = Math.min(m1 ? 18 + m1.index + 1 : Infinity, m2 ? 45 + m2.index + 1 : Infinity);
            if (cut <= ans.length) {
              spoken = cut;
              T.mark('firstText'); clearTimeout(fillT); firstSaid = true;
              if (!sp) { stopSpeaking(); sp = makeSpeaker(); streamed = sp; }
              sp.push(ans.slice(0, spoken));
              if (incremental) pushReady(ans, false);           // ما اكتمل بعدها في نفس الدفعة يُرسل الآن أيضاً
            }
          } else if (incremental) pushReady(ans, false);
          if (ans.trim()) showCaption(text, ans.trim());
        }
        const [ans, extra = ''] = full.split('§');
        reply = ans.trim();
        if (!reply) throw new Error('empty');
        suggestions = extra.split('|').map((x) => x.trim().replace(/^[-•\s]+/, '')).filter((x) => x.length > 3 && x.length < 70).slice(0, 2);
        clearTimeout(fillT); firstSaid = true;
        if (!sp) { stopSpeaking(); sp = makeSpeaker(); streamed = sp; }
        pushReady(ans, true);
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
      // v34: لا يُخمَّن جواب جاهز بكلمة مفتاحية (كان قد يجيب على سؤال بجواب سؤال آخر)
      reply = 'ما عندي معلومة مؤكدة الآن، لأن الاتصال ضعيف. اختر من الأسئلة الجاهزة أمامك، أو أعد سؤالك بعد قليل.';
    }
  }
  if (hit) {
    reply = hit.a;
    if (ACK_LEAD.test(reply)) {                    // جواب معتمد يبدأ بـ«أبشر»: تبقى الكلمة فقط إذا كان خيار الإعدادات يسمح بها الآن، وتُحسب
      const m = ackMode();
      if (early || m === 'never' || (m === 'auto' && acksThisChat > 0)) reply = reply.replace(ACK_LEAD, ''); else acksThisChat++;
    }
  }
  setBusy(false);
  if (my !== session) return;
  history.push({ role: 'assistant', content: reply }); history = history.slice(-10);
  showCaption(text, reply);
  if (suggestions.length) addFollowUps(suggestions);
  if (hit?.sheet) openSheet(hit.sheet);
  setStatus(CONFIG.idleStatus);
  if (streamed && !hit) await streamed.end();
  else if (early && my === session && speakSeq === earlySeq) { splitForSpeech(reply.replace(ACK_LEAD, ''), speechChunk()).forEach((x) => early.push(x)); await early.end(); }   // جواب جاهز أو نص مادة: يُكمل بعد «أبشر» دون قطعها
  else await speak(reply);
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
  history = []; prevQ = null; lastLawId = null; askCount = 0; acksThisChat = 0; showCaption('', CONFIG.greeting); setStatus(CONFIG.idleStatus);
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
    // الأهم أولاً بترتيب ثابت (البلاغ، حماية المبلّغ، الهدية والرشوة)، ثم بقية الأسئلة بترتيب متنوع كل مرة
    const TOP = ['report', 'protect', 'gift'], top = TOP.map((id) => BANK.find((b) => b.id === id)).filter(Boolean);
    const qs = shuffle(BANK.filter((b) => !TOP.includes(b.id)));
    renderCarousel.order = [ACTIONS[0], ...top.slice(0, 2), ACTIONS[1], ...top.slice(2), ...qs.slice(0, 3), ACTIONS[2], ...qs.slice(3, 7), ACTIONS[3], ...qs.slice(7)];
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
  if (HOLD && did && CONFIG.ownBrain) return;  // v35: «اضغط وتكلّم» يعمل بالضغط المستمر (انظر pointerdown)، لا بالنقر
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
/* v34: أُخرجت «يعني» و«بس» و«اللي» (يختم بها الناس أسئلة كاملة: «وش الرشوة يعني») وكانت تؤخر الجواب 5 ثوانٍ */
const DANGLING = /(?:\.{2,}|…)\s*$|(?:^|\s)(?:و|أو|او|ثم|بين|من|في|على|عن|الى|إلى|مع|وال|ال|بال|لل|وبين|ولا|لو|اذا|إذا|الذي|التي|لكن)\s*$/;
const DANGLING_WAIT = 1800;                  // كم ينتظر نزيه تكملة السؤال الناقص (كان 5000)
/* تحويل التسجيل إلى نص ثم سؤال نزيه. quiet=true في الاستماع التلقائي: يتجاهل ما لا يُفهم بدون رسالة خطأ */
const STT_NOISE = ['اشتركوا في القناه', 'لا تنسوا الاشتراك', 'ترجمه نانسي', 'شكرا للمشاهده', 'شكرا علي المشاهده', 'شكرا لكم علي المشاهده', 'موسيقي', 'تصفيق', 'ترجمه', 'subtitles', 'thank you for watching', 'thanks for watching'];
/* v35: نص لا يُبنى عليه جواب. أنواعه: empty (لا كلام)، noise (نص من الضجيج أو مما «يتخيله» النموذج)، echo (صوت نزيه نفسه رجع من السماعة)،
   unclear (السمع ضعيف: احتمال الكلمات منخفض). عند الشك لا يخمّن نزيه: يتجاهل الضجيج، أو يقول «ما سمعتك زين، ممكن تعيد؟» إن كان الزائر يكلّمه فعلاً. */
const stripAl = (w) => w.replace(/^(وال|بال|لل|ال|و)(?=.{3})/, '');
const words3 = (s) => norm(s).replace(/[^ء-ي\s]/g, ' ').split(/\s+/).map(stripAl).filter((w) => w.length >= 3);
const STT_PROMPT_WORDS = new Set(words3('سؤال لنزيه عن النزاهة ومكافحة الفساد: نزاهة، الرشوة، الفساد، البلاغ، المبلّغ، الاختلاس، غسل الأموال، التزوير، المال العام، هيئة الرقابة ومكافحة الفساد، الخدمة المدنية، الانضباط الوظيفي، جامعة حائل.'));
const ASKING = /(?:^|\s)(?:وش|ايش|شو|كيف|ليش|لماذا|ماذا|متي|هل|كم|وين|اين|ما|من|ابي|ابغي|ابغا|اريد|عطني|اعطني|قول|اشرح|وضح|عرف|يعني)(?:\s|$)/;
const ASK_START = /^\s*(?:و|ف)?(?:وش|ايش|شو|كيف|ليش|لماذا|ماذا|متي|هل|كم|وين|اين|ما|من|ابي|ابغي|ابغا|اريد|عطني|اعطني|قول|اشرح|وضح|عرف|طيب|زين|طب)(?:\s|$)/;
const SHORT_OK = /^(?:اي|ايه|ايوه|ايوا|اكيد|نعم|لا|لا شكرا|تم|طيب|زين|كمل|شكرا|مشكور)$/;     // ردود قصيرة صحيحة («تبي أفصّل؟» ← «إي»)
let recentSaid = '', recentSaidAt = 0;           // ما قاله نزيه للتو (لكشف صوته المرتد من السماعة)
function noteSaid(t) {
  const now = performance.now();
  if (now - Math.max(recentSaidAt, lastTalkEnd) > 20000 && !speakingNow && !didTalking) recentSaid = '';     // لا يُمسح ونزيه ما زال يتكلم
  recentSaid = (recentSaid + ' ' + t).slice(-1500); recentSaidAt = now;
}
let lastInteractAt = 0;                          // آخر لمسة أو سؤال مقبول من زائر
const recentVisitor = () => performance.now() - lastInteractAt < 45000;
['pointerdown', 'keydown'].forEach((ev) => document.addEventListener(ev, () => { lastInteractAt = performance.now(); }, { passive: true }));
const trigrams = (ws) => { const s = new Set(); for (let i = 0; i + 2 < ws.length; i++) s.add(ws[i] + ' ' + ws[i + 1] + ' ' + ws[i + 2]); return s; };
const inOrder = (ws, said) => { let j = 0; for (const w of said) { if (w === ws[j]) j++; if (j === ws.length) return true; } return false; };
function sttVerdict(text, conf, meta = {}) {
  const n = norm(text), ar = (n.match(/[ء-ي]/g) || []).length, la = (n.match(/[a-z]/g) || []).length;
  const bare = n.replace(/[^ء-ي\s]/g, ' ').replace(/\s+/g, ' ').trim();
  // «إي» أو «لا» جواباً على سؤال سأله نزيه للتو، أو بالضغط على الزر: رد صحيح وليس ضجيجاً
  if (SHORT_OK.test(bare) && (meta.explicit || (performance.now() - Math.max(recentSaidAt, lastTalkEnd) < 15000 && /[؟?]\s*$/.test(recentSaid.trim())))) return null;
  if (!text || ar < 3) return 'empty';
  if (la > ar) return 'noise';                                                       // «Thank you.» وأشباهها من ضجيج القاعة
  if (STT_NOISE.some((x) => n.includes(x) && n.length < x.length + 14)) return 'noise';
  if (/سؤال لنزيه|لنزيه عن النزاهه/.test(n)) return 'noise';                         // أول جملة من تعليمات التحويل نفسها (لا يقولها زائر)
  const ws = words3(text);
  if (ws.length >= 4) { let run = 1; for (let i = 1; i < ws.length; i++) { run = ws[i] === ws[i - 1] ? run + 1 : 1; if (run >= 4) return 'noise'; } }   // كلمة تتكرر
  if (ws.length >= 3 && ws.filter((w) => STT_PROMPT_WORDS.has(w)).length / ws.length >= 0.8 && !ASKING.test(n)) return 'noise';   // كتب النموذج قائمة المفردات نفسها
  /* صوت نزيه الراجع: يُفحص فقط في تسجيل بدأ ونزيه يتكلم (المقاطعة بالصوت)، لأنه وحده يمكن أن يحوي صوته (بعد سكوته يُقفل المايك 0.8 ثانية).
     ويلزم دليل قوي: ثلاث كلمات متتالية من كلامه بالترتيب في 70% من النص فأكثر، ولا يبدأ بأداة سؤال. فالسؤال الذي يقتبس كلامه يُجاب */
  if (meta.nearTalk && recentSaid && !ASK_START.test(n)) {
    const said = words3(recentSaid);
    if (ws.length >= 4) { const sg = trigrams(said), mine = [...trigrams(ws)], hit = mine.filter((g) => sg.has(g)).length; if (hit >= Math.min(3, mine.length) && hit / mine.length >= 0.7) return 'echo'; }
    else if (ws.length && inOrder(ws, said)) return 'echo';
  }
  if (conf && Number.isFinite(conf.avg) && (conf.avg < -1.1 || conf.low > 0.4)) return 'unclear';
  return null;
}
let askRepeatAt = 0;
function askRepeat() {                           // بدل التخمين: يطلب من الزائر أن يعيد (مرة كل 6 ثوانٍ على الأكثر)
  if (performance.now() - askRepeatAt < 6000) { setStatus(HOLD ? pttIdleLabel() : CONFIG.idleStatus); return; }
  askRepeatAt = performance.now();
  const line = 'ما سمعتك زين، ممكن تعيد؟';
  showCaption('', line); setStatus(HOLD ? pttIdleLabel() : CONFIG.idleStatus); speak(line);
}
let sttBusy = false;
/* meta: كيف بدأ التسجيل (explicit = بالزر أو «اضغط وتكلّم»)، ومدة الكلام فيه وقوته فوق ضجيج المكان (snr)؛ تقرر عند الشك: يُعاد السؤال أم يُتجاهل الضجيج */
async function processSpeech(blob, quiet, loudMs = 0, meta = {}) {
  setStatus('جاري تحويل كلامك لنص...'); setBusy(true);
  const my = session;
  startEarlyFill(quiet, loudMs);
  sttBusy = true;
  try {
    const r = await fetch(`${CONFIG.apiBase}/api/stt`, { method: 'POST', headers: { 'Content-Type': blob.type }, body: blob });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error);
    setBusy(false);
    sttBusy = false;
    if (my !== session) { dropEarlyFill(); return; }
    T.mark('sttDone');
    if (DEBUG) { T.stt = `server ${data.ms ?? '?'}ms${data.conf ? `, conf ${data.conf.avg} low ${data.conf.low}` : ''}`; T.show(); }
    const text = (data.text || '').trim();
    const v = sttVerdict(text, data.conf, meta);
    if (v) {
      dropEarlyFill();
      if (DEBUG) console.log('stt ignored:', v, JSON.stringify(text), data.conf || '');
      /* الزائر يكلّم نزيه فعلاً (ضغط الزر، أو كلام طويل وواضح فوق ضجيج المكان وهناك زائر يتحاور قبل قليل) لكن ما انفهم: يطلب الإعادة.
         غير ذلك ضجيج يُتجاهل بصمت (لا يرد نزيه على القاعة)، ويتعلّم المايك أن هذا المستوى ضجيج في هذا المكان */
      const talkingToUs = (meta.explicit ?? !quiet) || ((meta.voicedMs || loudMs) >= 900 && (meta.snr || 0) >= 4 && v !== 'empty' && recentVisitor());
      if (!talkingToUs && (v === 'noise' || v === 'empty')) autoMic?.learnNoise?.();
      if (!pendingQ) { if (v !== 'echo' && talkingToUs) askRepeat(); else setStatus(HOLD ? pttIdleLabel() : CONFIG.idleStatus); }
      return;
    }
    lastInteractAt = performance.now();               // سؤال مفهوم: زائر يتحاور الآن
    // سؤال انقطع في منتصفه (الزائر توقف ليفكر): نحتفظ به وننتظر التكملة، ثم نرسل الجملة كاملة
    const full = (pendingQ ? pendingQ + (/(?:^|\s)(?:و?ال|بال|لل)$/.test(pendingQ) ? '' : ' ') : '') + text;      // «وال» + «هدية» = «والهدية»
    clearTimeout(pendingT);
    if (CONFIG.waitIncomplete && pendingN < 2 && DANGLING.test(full)) {
      dropEarlyFill();
      pendingQ = full.replace(/(?:\.{2,}|…)\s*$/, '').trim(); pendingN++;
      showCaption(pendingQ + ' …', '');
      setStatus('كمّل سؤالك.. أسمعك', 'listening');
      const fire = () => {
        if (autoMic?.recording || recState || busy) { pendingT = setTimeout(fire, 1500); return; }     // ما زال يتكلم: انتظر
        const q = pendingQ; pendingQ = ''; pendingN = 0; if (q) ask(q);
      };
      pendingT = setTimeout(fire, DANGLING_WAIT);
      return;
    }
    pendingQ = ''; pendingN = 0;
    ask(full);
  } catch (e) {
    sttBusy = false; dropEarlyFill();
    if (my !== session) return;
    console.warn('stt:', e?.message); setBusy(false);
    setStatus(quiet ? CONFIG.idleStatus : 'تعذّر سماعك الآن — اختر من الأسئلة أو اكتب سؤالك 😊', quiet ? '' : 'err');
  }
}

/* ---------------- الاستماع التلقائي (بدون ضغط) ----------------
   المايك يبقى مفتوحاً للموقع فقط، ويبدأ التسجيل عند سماع كلام واضح قريب، ويتوقف بعد الصمت.
   يتوقف عن السمع تماماً ونزيه يتكلم أو يفكر حتى لا يسمع نفسه، ويتكيّف مع ضجيج المكان.
   v35 (قاعة مزدحمة) — جُرّب بمحاكاة 20 دقيقة لكل حالة: هدوء، جمع كثير، شخصان يتحادثان قرب الشاشة، تصفيق مفاجئ:
   - المستوى يُقاس في نطاق الصوت البشري فقط (250–3600 هرتز)، فلا يُحسب هدير التكييف والخطوات وطبول الموسيقى.
   - ضجيج المكان بمقياسين: القريب (آخر 5 ثوانٍ والمايك لا يسجّل: «أرضيته» و«أعلاه المعتاد»)، والأوسع (وسيط آخر 30 ثانية،
     ويدخل فيه ما رُفض من تسجيلات لأنه ليس كلام زائر). فيتعلّم صوت من يتحادثون قرب الشاشة ولا يحسبه سؤالاً.
   - يبدأ التسجيل بصوت أعلى من الضجيج المعتاد بنحو 4 ديسيبل، ويُعدّ الزائر «ما زال يتكلم» ما دام صوته أعلى منه بنحو 3 ديسيبل
     في إطارين من كل ثلاثة (فلا تمدّ قمم الضجيج المتفرقة التسجيل بعد أن يسكت)، ويُقبل إن كان فيه كلام كافٍ (0.4 ثانية) منه
     0.2 ثانية أعلى من الضجيج بنحو 6 ديسيبل. والطرقة أو الضحكة القصيرة تُلغى فوراً، والتسجيل التلقائي لا يتجاوز 12 ثانية.
   - ما يرفضه التحويل لنص لأنه ضجيج يُضاف لضجيج المكان أيضاً، فلا يتكرر.
   - الصوت وحده لا يُعدّ تفاعلاً: لا يظهر «أسمعك» ولا يُفتح الوجه الحي (المحسوب بالدقيقة) ولا يُؤجَّل الرجوع لشاشة الترحيب إلا بكلام مؤكد،
     ولا يُفتح الوجه بالصوت إلا إن كان هناك زائر يتحاور خلال آخر 45 ثانية (وإلا يُفتح حين يُقبل سؤاله).
   - بعد أن يسكت نزيه بـ 0.8 ثانية فقط يبدأ السمع (لا يلتقط صدى آخر كلمة)، والمقاطعة بالصوت تحتاج صوتاً أعلى من صوت نزيه الراجع للمايك بوضوح. */
let autoMic = null;
async function startAutoListen() {
  if (autoMic || !(CONFIG.handsFree || HOLD) || !did || !CONFIG.ownBrain) return;
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) return;
  let stream;
  try { stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: CONFIG.micAgc !== false, channelCount: 1 } }); }
  catch { setStatus('اسمح للمتصفح باستخدام المايك، أو اضغط زر التحدث', 'err'); return; }
  if (autoMic) { stream.getTracks().forEach((t) => t.stop()); return; }
  ensureAudio();
  const src = audioCtx.createMediaStreamSource(stream);
  const an = audioCtx.createAnalyser(); an.fftSize = 1024; an.smoothingTimeConstant = 0; src.connect(an);
  const tb = new Float32Array(an.fftSize), fb = new Float32Array(an.frequencyBinCount);
  const binHz = audioCtx.sampleRate / an.fftSize, b0 = Math.max(1, Math.round(250 / binHz)), b1 = Math.min(fb.length - 1, Math.round(3600 / binHz));
  const mime = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'].find((m) => MediaRecorder.isTypeSupported(m)) || '';
  const hist = [], wide = [], echo = [], above = []; let floor = 0.006, amb = 0.008, bg = 0, echoLvl = 0, lastSort = 0, recAll = [], lastAll = [];
  const pct = (arr, p) => { if (!arr.length) return 0; const s = [...arr].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(p * s.length))]; };
  const learn = () => {
    if (hist.length >= 20) { floor = Math.max(0.003, pct(hist, 0.15), pct(hist.slice(-40), 0.15)); amb = Math.max(floor, pct(hist, 0.8)); }
    if (wide.length >= 40) bg = pct(wide, 0.5);
  };
  const near = (x) => { hist.push(x); if (hist.length > 100) hist.shift(); };          // آخر 5 ثوانٍ
  const far = (x) => { wide.push(x); if (wide.length > 600) wide.shift(); };           // آخر 30 ثانية
  const room = (x) => { near(x); far(x); };                                             // صوت المكان: لا زائر يتكلم ولا نزيه
  let rec = null, chunks = [], voicedMs = 0, strongMs = 0, peak = 0, lastVoiced = 0, startedAt = 0, last = performance.now(), forced = false, barge = false, bargeRec = false, hold = false, holdStart = 0, confirmed = false;
  const idle = () => (HOLD ? pttIdleLabel() : CONFIG.idleStatus);
  // learnIt: التسجيل رُفض لأنه ليس كلام زائر، فالأهدأ من نصفه (ما بين الكلمات) صوتٌ للمكان
  const finish = (keep, learnIt = false) => {
    const r = rec, heard = voicedMs; if (!r) return;
    const meta = { explicit: forced || hold, voicedMs, snr: amb > 0 ? +(peak / amb).toFixed(1) : 0, nearTalk: barge || bargeRec };
    if (keep) { T.reset(); T.marks.lastWord = lastVoiced || performance.now(); T.mark('recEnd'); lastAll = meta.explicit || bargeRec ? [] : recAll; }
    else if (learnIt && recAll.length) { for (const x of recAll.slice().sort((a, b) => a - b).slice(0, Math.ceil(recAll.length / 2))) far(x); learn(); }
    rec = null; forced = false; barge = false; bargeRec = false; hold = false; confirmed = false; recAll = []; above.length = 0; micLevel = 0; micBtn.classList.remove('listening');
    const parts = chunks; chunks = [];
    r.onstop = keep ? () => processSpeech(new Blob(parts, { type: r.mimeType || 'audio/webm' }), !meta.explicit, heard, meta) : null;
    try { r.stop(); } catch {}
    if (!keep) setStatus(idle());
  };
  const showListening = () => { micBtn.classList.add('listening'); setStatus(hold ? 'أسمعك… اترك الزر إذا خلصت' : 'أسمعك... تكلّم الآن', 'listening'); };
  /* كلام مؤكد (لا مجرد صوت عابر): عندها فقط يُعدّ تفاعلاً */
  const confirm = () => { if (confirmed) return; confirmed = true; if (recentVisitor()) ensureDidConnected('speech'); resetIdle(attractOn); showListening(); };
  const begin = (now, how = '') => {
    chunks = []; const mine = chunks;
    rec = new MediaRecorder(stream, mime ? { mimeType: mime, audioBitsPerSecond: 32000 } : { audioBitsPerSecond: 32000 });
    rec.ondataavailable = (e) => e.data.size && mine.push(e.data);
    rec.start(); startedAt = now; lastVoiced = now; voicedMs = 0; strongMs = 0; peak = 0; recAll = []; above.length = 0; confirmed = false;
    if (how === 'hold') { hold = true; holdStart = now; }
    if (barge) return;                                       // تسجيل صامت أثناء كلام نزيه (مقاطعة محتملة)
    if (forced || hold) { confirmed = true; ensureDidConnected('speech'); resetIdle(attractOn); showListening(); }   // ضغط الزر: تفاعل مؤكد
  };
  const talkingNow = () => speakingNow || didTalking;
  const timer = setInterval(() => {
    if (audioCtx.state === 'suspended') return;
    const now = performance.now(), dt = Math.min(200, now - last); last = now;
    an.getFloatTimeDomainData(tb); let s2 = 0; for (let i = 0; i < tb.length; i++) s2 += tb[i] * tb[i];
    const rms = Math.sqrt(s2 / tb.length);
    an.getFloatFrequencyData(fb); let sb = 0, all = 0;
    for (let i = 1; i < fb.length; i++) { const p = Math.pow(10, fb[i] / 10); all += p; if (i >= b0 && i <= b1) sb += p; }
    const lvl = all > 0 ? rms * Math.sqrt(sb / all) : rms;                 // مستوى الكلام في نطاق الصوت البشري
    // الأرضية = الأعلى من: آخر 5 ثوانٍ وآخر ثانيتين. فتصعد بسرعة إن ارتفع ضجيج القاعة فجأة، وتنزل بهدوء
    if (now - lastSort > 500) { lastSort = now; learn(); echoLvl = pct(echo, 0.7); if (DEBUG) T.mic = `floor ${floor.toFixed(3)} amb ${amb.toFixed(3)} bg ${bg.toFixed(3)} echo ${echoLvl.toFixed(3)} now ${lvl.toFixed(3)}`; }
    // ---- اضغط وتكلّم: التسجيل بيد الزائر فقط ----
    if (HOLD) {
      if (!rec) { if (!talkingNow() && !busy) room(lvl); return; }
      micLevel += (Math.min(1, rms * 8) - micLevel) * 0.4;
      if (lvl > Math.max(0.02, floor * 2)) { voicedMs += dt; lastVoiced = now; peak = Math.max(peak, lvl); }
      if (now - startedAt > CONFIG.talkMaxSeconds * 1000) finish(true);
      return;
    }
    // ---- المقاطعة بالصوت أثناء كلام نزيه أو تفكيره ----
    if (CONFIG.bargeIn && !speechMode && (talkingNow() || (busy && !sttBusy)) && !recState && !document.hidden) {
      if (talkingNow() && !rec) { echo.push(lvl); if (echo.length > 60) echo.shift(); }        // صوت نزيه كما يصل للمايك بعد إلغاء الصدى (آخر 3 ثوانٍ)
      // المقاطعة تحتاج صوتاً قريباً واضحاً: أعلى من ضجيج القاعة ومن صوت نزيه الراجع بوضوح، لـ 0.7 ثانية متصلة تقريباً
      const onB = Math.max(0.14, floor * 5, amb * 2.5, bg * 3, echoLvl * 3), holdB = Math.max(0.09, floor * 3, amb * 1.6, bg * 2, echoLvl * 2.2);
      if (!rec) { if (busy && !talkingNow()) room(lvl); if (lvl > onB) { barge = true; begin(now); voicedMs = dt; peak = lvl; lastVoiced = now; } return; }   // وقت التفكير: المايك يسمع القاعة فقط فيُقاس ضجيجها
      if (barge) {
        if (lvl > holdB) { voicedMs += dt; lastVoiced = now; peak = Math.max(peak, lvl); }
        if (voicedMs >= 700) { barge = false; bargeRec = true; confirmed = true; interrupt(); resetIdle(attractOn); showListening(); }
        else if (now - lastVoiced > 350 || now - startedAt > 1600) finish(false);
        return;
      }
    }
    if (busy || talkingNow() || recState || document.hidden) { if (rec) finish(false); return; }
    const on = Math.max(CONFIG.autoMinLevel, floor * 2.5, amb * 1.6, bg * 1.8);
    const holdT = Math.max(CONFIG.autoMinLevel * 0.6, floor * 1.6, amb * 1.4, bg * 1.6);
    const strongT = Math.max(CONFIG.autoMinLevel * 1.3, floor * 3.5, amb * 2, bg * 2.5);
    if (!rec) {
      if (now - Math.max(lastSpokeAt, lastTalkEnd) < 800) return;           // لا يسمع صدى آخر كلمة لنزيه (ولا يُحسب من ضجيج المكان)
      room(lvl);                                                             // ضجيج المكان يُقاس والمايك لا يسجّل
      if (hist.length < 20 || lvl <= on) return;                             // أول ثانية بعد فتح المايك: يتعرّف على صوت المكان قبل أن يسمع
      begin(now);
    }
    micLevel += (Math.min(1, rms * 8) - micLevel) * 0.4;
    recAll.push(lvl);
    above.push(lvl > holdT ? 1 : 0); if (above.length > 3) above.shift();
    // «ما زال يتكلم»: إطاران من آخر ثلاثة أعلى من الحد (قمة ضجيج منفردة لا تمدّ التسجيل بعد أن يسكت الزائر)
    if (lvl > holdT * 0.7 && above.reduce((a, b) => a + b, 0) >= 2) { voicedMs += dt; lastVoiced = now; peak = Math.max(peak, lvl); }
    if (lvl >= strongT) strongMs += dt;
    const dur = now - startedAt, strong = strongMs >= 200;
    if (!forced && !bargeRec) {
      if (dur > 700 && voicedMs < 120) return finish(false, true);              // صوت عابر (طرقة، ضحكة، كحة): ليس كلاماً
      if (!confirmed && voicedMs >= 400 && voicedMs / Math.max(1, dur) >= 0.3 && strong) confirm();
      if (!confirmed && dur > 4000) { for (const x of recAll.slice(-40)) near(x); return finish(false, true); }   // 4 ثوانٍ بلا كلام واضح: صوت المكان لا زائر
    }
    if (now - lastVoiced > CONFIG.silenceMs) {
      const enough = voicedMs >= Math.min(400, CONFIG.autoMinSpeechMs) && voicedMs / Math.max(1, dur) >= 0.25;
      if (forced) finish(voicedMs >= 200);
      else if (bargeRec) finish(enough);
      else { const keep = strong && enough; finish(keep, !keep); }
    }
    else if (forced && !voicedMs && dur > 7000) finish(false);
    else if (dur > (forced || bargeRec ? CONFIG.maxRecordSeconds : CONFIG.maxAutoSeconds) * 1000) {
      if (forced || bargeRec) finish(true);
      else {                                                                  // 12 ثانية بلا سكتة: إما زائر يتكلم بصوت عالٍ أغلب الوقت، أو ضجيج متصل
        const keep = confirmed && strongMs >= dur * 0.3;
        if (!keep) for (const x of recAll.slice(-40)) near(x);
        finish(keep, !keep);
      }
    }
  }, 50);
  autoMic = {
    get recording() { return !!rec; },
    get active() { return !!rec && (confirmed || forced || hold || bargeRec); },     // تسجيل كلام مؤكد (لا مجرد صوت عابر)
    learnNoise() { if (!lastAll.length) return; for (const x of lastAll) far(x); for (const x of lastAll.slice(-40)) near(x); lastAll = []; learn(); },   // التحويل لنص قال إن آخر تسجيل ضجيج: يُحسب من صوت المكان
    toggle() { if (rec) return finish(voicedMs >= 200); forced = true; begin(performance.now()); },   // ضغطة الزر: ابدأ أو أنهِ يدوياً
    holdStart() { if (rec) finish(false); begin(performance.now(), 'hold'); },
    holdEnd() { if (!rec || !hold) return false; const held = performance.now() - holdStart; if (held < 350 || voicedMs < 120) { finish(false); return 'short'; } finish(true); return true; },
    stop() { clearInterval(timer); if (rec) finish(false); stream.getTracks().forEach((t) => t.stop()); try { src.disconnect(); } catch {} autoMic = null; },
  };
  setStatus(idle());
}
// المتصفحات تشترط لمسة واحدة من المستخدم قبل تشغيل الصوت والمايك
['pointerdown', 'keydown'].forEach((ev) => window.addEventListener(ev, () => { if (did && (CONFIG.handsFree || HOLD)) { ensureAudio(); Promise.resolve(audioCtx.resume?.()).then(() => startAutoListen()).then(() => { if (!busy && !speakingNow && !didTalking && !recState && !autoMic?.recording) setStatus(HOLD ? pttIdleLabel() : CONFIG.idleStatus); }).catch(() => {}); } }, { passive: true }));
/* «اضغط وتكلّم»: يسجّل ما دام الزر مضغوطاً، ويرسل عند تركه. الضغط أثناء كلام نزيه يقاطعه */
let holdDown = false;
micBtn.addEventListener('pointerdown', async (e) => {
  if (!HOLD || !(did && CONFIG.ownBrain)) return;
  e.preventDefault(); try { micBtn.setPointerCapture(e.pointerId); } catch {}
  buzz(15); ensureAudio(); holdDown = true;
  if (nazihActive()) interrupt();
  if (!autoMic) { await Promise.resolve(audioCtx.resume?.()).catch(() => {}); await startAutoListen(); }
  if (!holdDown || !autoMic) return;                   // ترك الزر قبل أن يجهز المايك
  autoMic.holdStart();
});
const holdUp = () => {
  if (!HOLD || !holdDown) return;
  holdDown = false;
  if (autoMic?.holdEnd() === 'short') setStatus('اضغط مع الاستمرار وأنت تتكلم، واترك الزر إذا خلصت');
};
['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => micBtn.addEventListener(ev, holdUp));
micBtn.addEventListener('contextmenu', (e) => { if (HOLD) e.preventDefault(); });
if (HOLD) { const how = document.querySelector('#attract .how'); if (how && how.lastChild && how.lastChild.nodeType === 3) how.lastChild.textContent = 'اضغط زر المايك مع الاستمرار وتكلّم'; }

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
      ${CONFIG.cert && pct >= CONFIG.certMin ? '<button class="btn gold" id="qCert">احصل على شهادة سفير النزاهة</button>' : ''}
      <div class="btn-row"><button class="btn" id="qAgain">اختبار جديد</button><button class="btn ghost" id="qShare">مشاركة النتيجة</button></div>
      <div class="review">${quiz.items.map((it, i) => `<div class="card"><b>${i + 1}. ${escapeHTML(it.q)}</b><br>
        <span class="${quiz.picks[i] === it.a ? 'ok' : 'no'}">${quiz.picks[i] === it.a ? 'إجابتك صحيحة' : 'إجابتك: ' + escapeHTML(it.o[quiz.picks[i]])}</span><br>
        الإجابة الصحيحة: ${escapeHTML(it.o[it.a])}<br><span class="meta">${escapeHTML(it.e)}</span></div>`).join('')}</div>`;
    $('#qAgain').onclick = () => { startQuiz(); $('#quiz').scrollTop = 0; };
    if ($('#qCert')) $('#qCert').onclick = () => openCert('quiz');
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
      ${CONFIG.cert && n && scn.best / n >= CONFIG.certMin ? '<button class="btn gold" id="scnCert">احصل على شهادة سفير النزاهة</button>' : ''}
      <div class="btn-row"><button class="btn" id="scnAgain">مواقف جديدة</button><button class="btn ghost" id="scnQuiz">اختبر نفسك</button></div>`;
    if ($('#scnCert')) $('#scnCert').onclick = () => openCert('scenario');
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


/* ---------------- شهادة «سفير النزاهة» ----------------
   تُرسم داخل المتصفح كصورة، والاسم لا يُرسل للخادم ولا يُحفظ (يُسجَّل فقط أن شهادة صدرت). النصوص في CONFIG أعلى الملف. */
const certImgs = {};
const loadImg = (src) => certImgs[src] || (certImgs[src] = new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; }));
async function drawCert(name) {
  const W = 1600, H = 1131, c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d'), F = '"IBM Plex Sans Arabic", "Segoe UI", Tahoma, sans-serif';
  try { await document.fonts.load(`700 60px ${F}`, 'شهادة'); } catch {}
  x.fillStyle = '#fbf8f1'; x.fillRect(0, 0, W, H);
  x.strokeStyle = '#1B5E20'; x.lineWidth = 14; x.strokeRect(34, 34, W - 68, H - 68);
  x.strokeStyle = '#C9A84C'; x.lineWidth = 4; x.strokeRect(58, 58, W - 116, H - 116);
  const [uoh, naz] = await Promise.all([loadImg('assets/uoh-logo.png'), loadImg('assets/nazaha-logo.jpg')]);
  const fit = (img, cx, top, h) => { if (!img) return; const w = img.width * (h / img.height); x.drawImage(img, cx - w / 2, top, w, h); };
  x.globalCompositeOperation = 'multiply'; fit(uoh, W - 230, 100, 170); fit(naz, 250, 105, 160); x.globalCompositeOperation = 'source-over';
  x.direction = 'rtl'; x.textAlign = 'center'; x.textBaseline = 'middle';
  const line = (t, y, font, color) => { x.font = font; x.fillStyle = color; x.fillText(t, W / 2, y); };
  line(CONFIG.certTitle, 330, `700 86px ${F}`, '#1B5E20');
  x.fillStyle = '#C9A84C'; x.fillRect(W / 2 - 150, 395, 300, 5);
  line('تُمنح هذه الشهادة إلى', 480, `500 40px ${F}`, '#52514e');
  let size = 84; x.font = `700 ${size}px ${F}`;
  while (x.measureText(name).width > W - 360 && size > 40) { size -= 4; x.font = `700 ${size}px ${F}`; }
  x.fillStyle = '#17261c'; x.fillText(name, W / 2, 600);
  x.strokeStyle = '#C9A84C'; x.lineWidth = 2; x.beginPath(); x.moveTo(W / 2 - 420, 668); x.lineTo(W / 2 + 420, 668); x.stroke();
  line(CONFIG.certLine, 750, `500 42px ${F}`, '#17261c');
  line(CONFIG.certEvent, 832, `500 32px ${F}`, '#52514e');
  const d = new Date(), g = d.toLocaleDateString('ar-SA-u-ca-gregory-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' });
  let h = ''; try { h = d.toLocaleDateString('ar-SA-u-ca-islamic-umalqura-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' }); } catch {}
  line(h ? `${h} — الموافق ${g}` : g, 930, `500 30px ${F}`, '#52514e');
  line('معاً .. لمجتمع نزيه وشفاف', 1010, `600 34px ${F}`, '#9a7b2a');
  return c;
}
let certFrom = '';
function openCert(from) {
  certFrom = from; stopSpeaking(); openSheet('cert');
  $('#certForm').hidden = false; $('#certOut').hidden = true; $('#certName').value = '';
  setTimeout(() => $('#certName').focus(), 100);
}
$('#certForm')?.addEventListener('submit', async (e) => {
  e.preventDefault(); resetIdle();
  const name = $('#certName').value.replace(/\s+/g, ' ').trim().slice(0, 60); if (name.length < 2) return;
  const c = await drawCert(name);
  $('#certImg').src = c.toDataURL('image/png');
  $('#certForm').hidden = true; $('#certOut').hidden = false; $('#sheet-cert .sheet-body').scrollTop = 0;
  track('cert', { from: certFrom });
  const blob = await new Promise((r) => c.toBlob(r, 'image/png')), file = new File([blob], 'nazaha-certificate.png', { type: 'image/png' });
  $('#certSave').onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = file.name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 5000); };
  const canShare = !!(navigator.canShare && navigator.canShare({ files: [file] }));
  $('#certShare').hidden = !canShare;
  $('#certShare').onclick = async () => { try { await navigator.share({ files: [file], text: 'حصلت على شهادة سفير النزاهة مع «نزيه» — اليوم العالمي لمكافحة الفساد، جامعة حائل.' }); } catch {} };
  const say = 'مبروك! هذي شهادتك، احفظها أو شاركها.'; showCaption('', say); speak(say);
});

/* ---------------- الإحصائيات (أعداد مجهولة تُرسل للخادم، بدون أسماء ولا تسجيل صوت) ---------------- */
const SCREEN = (() => {                              // هل هذا الجهاز هو الشاشة الرئيسية؟ (وجه Simli، أو ‎?screen=1‎ مرة واحدة)
  try { const q = params.get('screen'); if (q === '1' || q === '0') localStorage.setItem('nazih.screen', q); if (localStorage.getItem('nazih.screen') === '0') return false; return !!window.NAZIH_SCREEN || localStorage.getItem('nazih.screen') === '1'; } catch { return !!window.NAZIH_SCREEN; }
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
  if (busy || recState || speakingNow || didTalking || autoMic?.active || document.hidden) return;
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
$('#setAck')?.addEventListener('change', (e) => { settings.ack = e.target.value; saveSettings(); });
$('#setText').addEventListener('change', (e) => { settings.text = e.target.checked; saveSettings(); applySettings(); });
$('#setBig').addEventListener('change', (e) => { settings.big = e.target.checked; saveSettings(); applySettings(); });
$('#setNew').addEventListener('click', () => { newChat(); closeSheets(); dlg.close(); });
$('#setFull').addEventListener('click', () => { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen?.().catch(() => {}); });


/* ---------------- كلمة الافتتاح ----------------
   من الإعدادات على الشاشة الرئيسية: اكتب الكلمة (بأسماء الضيوف) ثم «ألقِ الكلمة». نزيه يلقيها بصوته ووجهه الحي،
   ولا يقطعها كلام القاعة. للإيقاف: زر الإيقاف في الإعدادات أو لمس زر المايك. */
let speechMode = false;
const speechText = () => { try { return localStorage.getItem('nazih.speech') || CONFIG.openingSpeech; } catch { return CONFIG.openingSpeech; } };
async function giveSpeech() {
  const text = speechText().replace(/\s+/g, ' ').trim(); if (!text) return;
  ensureAudio(); leaveAttract(); closeSheets(); if (nazihActive()) interrupt();
  const my = session; speechMode = true; ensureDidConnected();
  showCaption('', text); setStatus(CONFIG.idleStatus);
  try { if (did?.ensure) await Promise.race([did.ensure(), sleep(CONFIG.simliConnectWait * 1000)]); } catch {}     // الوجه الحي يتصل قبل أول كلمة
  if (my !== session) { speechMode = false; return; }
  await speak(text);
  // v35: مع الوجه الحي يُسلَّم الصوت كله قبل أن يُنطق بكثير، فتبقى «كلمة الافتتاح» (لا تقطعها أصوات القاعة) حتى يسكت الوجه فعلاً
  while (my === session && (speakingNow || didTalking)) await sleep(250);
  if (my === session) speechMode = false;
  resetIdle();
}
$('#setSpeech').value = speechText();
$('#setSpeech').addEventListener('input', (e) => { try { localStorage.setItem('nazih.speech', e.target.value); } catch {} });
$('#speechReset').addEventListener('click', () => { try { localStorage.removeItem('nazih.speech'); } catch {} $('#setSpeech').value = CONFIG.openingSpeech; });
$('#speechGo').addEventListener('click', () => { dlg.close(); giveSpeech(); });
$('#speechStop').addEventListener('click', () => { speechMode = false; interrupt(); dlg.close(); });

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
    if (talking || busy || recState || speakingNow || didTalking || autoMic?.active) return resetIdle(true);
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
if (!TEST && SCREEN && window.NAZIH_SIMLI) setTimeout(() => warmAnswers(), 6000);   // v35: صوت الأجوبة الجاهزة يجهز من فتح الصفحة (في الخادم)، فتُنطق فوراً
