/* =========================================================
 *  نزيه — المساعد الصوتي لليوم العالمي لمكافحة الفساد
 *  (دمج: تحريك الوجه من avatar-kiosk + المحتوى والمحادثة من nazaha-kiosk)
 * ========================================================= */
const CONFIG = {
  apiBase: '',                 // اتركه فارغاً إذا كان الموقع والخادم على نفس الدومين
  avatarImage: 'assets/avatar.png',
  idleResetSeconds: 120,       // يرجع للشاشة الرئيسية بعد دقيقتين بدون تفاعل
  maxRecordSeconds: 15,
  silenceMs: 1400,             // يوقف التسجيل تلقائياً بعد هذا الصمت
  eventDate: '2026-12-09T00:00:00+03:00',
  idleStatus: 'اضغط للتحدث',
  greeting: 'هلا والله وحياك الله! أنا نزيه. اضغط المايك واسألني عن النزاهة ومكافحة الفساد، أو اختر من الأسئلة السريعة.',
};

/* إحداثيات الوجه بمقاس الصورة الأصلية (1402×1122).
   لو غيّرت الصورة عدّل هذه الأرقام فقط */
const FACE = {
  mouthY: 355,          // خط التقاء الشفتين
  mouthX: 735,          // منتصف الفم
  mouthHalfW: 30,       // نصف عرض فتحة الفم
  jaw: { x0: 650, x1: 830, yBottom: 470 },   // منطقة الفك والذقن التي تتحرك
  maxOpen: 9,           // أقصى فتحة للفم بالبكسل
  eyes: [{ x: 704, y: 254, rx: 27, ry: 10 }, { x: 791, y: 265, rx: 25, ry: 11 }],
  pivot: { x: 740, y: 760 },  // نقطة ميلان الرأس/الجسم
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const params = new URLSearchParams(location.search);
const app = $('#app');

/* ---------------- الإعدادات (تُحفظ في المتصفح) ---------------- */
const settings = { volume: 1, voice: true, text: !params.get('kiosk') };
try { Object.assign(settings, JSON.parse(localStorage.getItem('nazih-settings') || '{}')); } catch {}
if (params.get('kiosk')) settings.text = false;
function saveSettings() { try { localStorage.setItem('nazih-settings', JSON.stringify(settings)); } catch {} }
function applySettings() {
  document.body.classList.toggle('no-text', !settings.text);
  if (gainNode) gainNode.gain.value = settings.volume;
  $('#setVol').value = settings.volume; $('#setVoice').checked = settings.voice; $('#setText').checked = settings.text;
}

/* ---------------- التنقل ---------------- */
function showView(name) {
  app.dataset.view = name;
  $$('.view').forEach((v) => v.classList.toggle('active', v.id === `view-${name}`));
  $$('.bottom-nav button').forEach((b) => b.classList.toggle('active', b.dataset.view === name));
  const v = $(`#view-${name}`); if (v) v.scrollTop = 0;
}
$$('.bottom-nav button').forEach((b) => b.addEventListener('click', () => showView(b.dataset.view)));

/* ---------------- الصوت ---------------- */
let audioCtx = null, analyser = null, gainNode = null, dataArr = null, currentSrc = null;
let talking = false, fakeTalk = false, micLevel = 0;

function ensureAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser(); analyser.fftSize = 1024;
    dataArr = new Uint8Array(analyser.fftSize);
    gainNode = audioCtx.createGain(); gainNode.gain.value = settings.volume;
    analyser.connect(gainNode); gainNode.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
}

/* ---------------- رسم الشخصية: فم يتحرك مع الصوت + رمش + تنفس ---------------- */
const cv = $('#cv'), ctx = cv.getContext('2d');
const W = cv.width, H = cv.height;
const img = new Image();
let mouthOpen = 0, blinkT = -1, nextBlink = performance.now() + 2500, eyePatches = [], voiceLevel = 0;
const TEST = params.get('test'); // ?test=1 يحرك الفم بدون صوت (للتجربة)

function drawFrame(t) {
  let targetOpen = 0, rms = 0;
  if (talking && analyser && !fakeTalk) {
    analyser.getByteTimeDomainData(dataArr);
    let s = 0; for (let i = 0; i < dataArr.length; i++) { const v = (dataArr[i] - 128) / 128; s += v * v; }
    rms = Math.sqrt(s / dataArr.length);
    targetOpen = Math.min(1, Math.max(0, (rms - 0.015) * 7));
  } else if (fakeTalk || TEST) {
    targetOpen = (Math.sin(t / 90) * 0.5 + 0.5) * (Math.sin(t / 700) > -0.3 ? 1 : 0);
    rms = targetOpen * 0.12;
  }
  voiceLevel += (Math.min(1, rms * 6) - voiceLevel) * 0.4;
  mouthOpen += (targetOpen - mouthOpen) * (targetOpen > mouthOpen ? 0.55 : 0.3);
  const d = mouthOpen * FACE.maxOpen;

  // حركة الرأس والتنفّس
  const speakAmt = talking ? 1 : 0.35;
  const rot = (Math.sin(t / 1900) * 0.006 + Math.sin(t / 830) * 0.003 * speakAmt) + mouthOpen * 0.002;
  const breathe = 1.035 + Math.sin(t / 1600) * 0.004;
  const dy = Math.sin(t / 1600) * 2 - mouthOpen * 2;

  ctx.save();
  ctx.clearRect(0, 0, W, H);
  ctx.translate(FACE.pivot.x, FACE.pivot.y + dy);
  ctx.rotate(rot); ctx.scale(breathe, breathe);
  ctx.translate(-FACE.pivot.x, -FACE.pivot.y);
  ctx.drawImage(img, 0, 0);

  if (d > 0.4) {
    const { x0, x1, yBottom } = FACE.jaw, top = FACE.mouthY, mx = FACE.mouthX, hw = FACE.mouthHalfW;
    const spread = (x1 - x0) / 2;
    const disp = (x) => { const u = Math.abs(x - mx) / spread; return u >= 1 ? 0 : d * Math.pow(Math.cos(u * Math.PI / 2), 1.6); };
    // داخل الفم
    ctx.beginPath();
    ctx.moveTo(mx - hw, top);
    for (let x = mx - hw; x <= mx + hw; x += 2) { const e = Math.cos(((x - mx) / hw) * Math.PI / 2); ctx.lineTo(x, top - 1 - e * 1.5); }
    for (let x = mx + hw; x >= mx - hw; x -= 2) { const e = Math.cos(((x - mx) / hw) * Math.PI / 2); ctx.lineTo(x, top + disp(x) * Math.pow(e, 0.6) + 1); }
    ctx.closePath();
    ctx.fillStyle = 'rgb(42,12,14)'; ctx.fill();
    // ظل الأسنان العلوية
    ctx.save(); ctx.clip();
    ctx.fillStyle = 'rgba(225,215,205,' + (0.7 * Math.min(1, d / 6)) + ')';
    ctx.beginPath(); ctx.ellipse(mx, top - 1, hw * 0.62, Math.min(3.5, d / 2.5), 0, 0, Math.PI); ctx.fill();
    ctx.restore();
    // نزول الفك: كل عمود بكسل ينزل بمقدار ناعم
    for (let x = x0; x < x1; x++) {
      const dx = disp(x); if (dx < 0.05) continue;
      ctx.drawImage(img, x, top, 1, yBottom - top, x, top + dx, 1.4, yBottom - top - dx * 0.2);
    }
  }

  // رمش العين
  if (t > nextBlink && blinkT < 0) blinkT = t;
  if (blinkT >= 0) {
    const p = (t - blinkT) / 170;
    const k = p < 0.5 ? p * 2 : 2 - p * 2;
    if (p >= 1) { blinkT = -1; nextBlink = t + 2200 + Math.random() * 3500; }
    else if (k > 0.02) {
      ctx.globalAlpha = Math.min(1, k * 1.25);
      for (const e of eyePatches) ctx.drawImage(e.cv, e.x, e.y);
      ctx.globalAlpha = 1;
    }
  }
  ctx.restore();
  drawWave(t);
  requestAnimationFrame(drawFrame);
}

// صورة "العين المغمضة" من لون الجلد حول كل عين
function buildEyePatches() {
  const tmp = document.createElement('canvas'); tmp.width = W; tmp.height = H;
  const tc = tmp.getContext('2d'); tc.drawImage(img, 0, 0);
  eyePatches = FACE.eyes.map((e) => {
    const m = 6, mt = 2, x = Math.round(e.x - e.rx - m), y = Math.round(e.y - e.ry - mt),
      w = Math.round(e.rx * 2 + m * 2), h = Math.round(e.ry * 2 + mt + m);
    const src = tc.getImageData(x, y, w, h).data;
    const pc = document.createElement('canvas'); pc.width = w; pc.height = h;
    const p = pc.getContext('2d'), out = p.createImageData(w, h);
    const avg = (yy, xx) => {
      let r = 0, g = 0, b = 0, n = 0;
      for (let dx = -3; dx <= 3; dx++) { const X = Math.min(w - 1, Math.max(0, xx + dx)); const i = (yy * w + X) * 4; r += src[i]; g += src[i + 1]; b += src[i + 2]; n++; }
      return [r / n, g / n, b / n];
    };
    for (let xx = 0; xx < w; xx++) {
      const a = avg(1, xx), b = avg(h - 2, xx);
      for (let yy = 0; yy < h; yy++) {
        const f = Math.pow(yy / (h - 1), 1.3), i = (yy * w + xx) * 4;
        const shade = 0.93 + 0.07 * Math.sin(Math.PI * yy / h);
        out.data[i] = (a[0] * (1 - f) + b[0] * f) * shade; out.data[i + 1] = (a[1] * (1 - f) + b[1] * f) * shade;
        out.data[i + 2] = (a[2] * (1 - f) + b[2] * f) * shade; out.data[i + 3] = 255;
      }
    }
    p.putImageData(out, 0, 0);
    p.strokeStyle = 'rgba(40,25,20,0.6)'; p.lineWidth = 1.6; p.lineCap = 'round';
    p.beginPath(); p.ellipse(w / 2, mt + e.ry * 0.9, e.rx * 0.8, e.ry * 0.5, 0, 0.25, Math.PI - 0.25); p.stroke();
    p.globalCompositeOperation = 'destination-in';
    p.save(); p.translate(w / 2, h / 2); p.scale(1, h / w);
    const g = p.createRadialGradient(0, 0, w * 0.25, 0, 0, w / 2);
    g.addColorStop(0, '#000'); g.addColorStop(0.7, '#000'); g.addColorStop(1, 'rgba(0,0,0,0)');
    p.fillStyle = g; p.fillRect(-w / 2, -w / 2, w, w); p.restore();
    return { cv: pc, x, y };
  });
}
img.onload = () => { try { buildEyePatches(); } catch (e) { console.warn(e); } requestAnimationFrame(drawFrame); };
img.src = CONFIG.avatarImage;

/* ---------------- موجة الصوت حول المايك ---------------- */
const BARS = 22;
const waveBars = ['#waveR', '#waveL'].map((id, side) => {
  const box = $(id);
  return Array.from({ length: BARS }, (_, i) => {
    const s = document.createElement('span'); box.appendChild(s);
    const near = side === 0 ? i / (BARS - 1) : 1 - i / (BARS - 1); // 1 = قريب من المايك
    return { s, near, ph: Math.random() * 6.28 };
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

/* ---------------- النطق ---------------- */
function stopSpeaking() {
  if (currentSrc) { try { currentSrc.stop(); } catch {} currentSrc = null; }
  if (window.speechSynthesis) speechSynthesis.cancel();
  talking = false; fakeTalk = false;
}

async function speak(text) {
  stopSpeaking();
  if (!settings.voice) return;
  try {
    const r = await fetch(`${CONFIG.apiBase}/api/tts`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }),
    });
    if (!r.ok) throw new Error('tts');
    ensureAudio();
    const buf = await audioCtx.decodeAudioData(await r.arrayBuffer());
    await new Promise((res) => {
      const src = audioCtx.createBufferSource(); src.buffer = buf; src.connect(analyser);
      currentSrc = src; talking = true;
      setStatus('نزيه يتكلم... (اضغط المايك للمقاطعة)');
      src.onended = () => { if (currentSrc === src) { currentSrc = null; talking = false; } res(); };
      src.start();
    });
  } catch {
    // بديل: صوت المتصفح مع حركة فم تقريبية
    if (!window.speechSynthesis) return;
    await new Promise((res) => {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ar-SA'; u.volume = settings.volume;
      const v = speechSynthesis.getVoices().find((x) => x.lang?.startsWith('ar'));
      if (v) u.voice = v;
      const done = () => { talking = false; fakeTalk = false; clearTimeout(guard); res(); };
      const guard = setTimeout(done, 4000 + text.length * 120); // لو المتصفح ما عنده صوت عربي
      u.onstart = () => { talking = true; fakeTalk = true; setStatus('نزيه يتكلم... (اضغط المايك للمقاطعة)'); };
      u.onend = u.onerror = done;
      speechSynthesis.speak(u);
    });
  }
}

/* ---------------- المحادثة ---------------- */
const capEl = $('#caption'), micBtn = $('#micBtn');
let history = [], busy = false, session = 0;

function setStatus(t, cls = '') { const s = $('#status'); s.textContent = t; s.className = `status ${cls}`; }
function escapeHTML(s) { return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function showCaption(q, a) {
  capEl.hidden = false;
  capEl.innerHTML = (q ? `<span class="q">${escapeHTML(q)}</span>` : '') + escapeHTML(a);
  capEl.scrollTop = 0;
}

async function ask(text) {
  text = (text || '').trim();
  if (!text || busy) return;
  const my = session;
  busy = true; micBtn.classList.add('busy');
  stopSpeaking();
  showView('assistant');
  showCaption(text, '...');
  history.push({ role: 'user', content: text });
  setStatus('نزيه يفكر...');
  let reply;
  try {
    const r = await fetch(`${CONFIG.apiBase}/api/chat`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history }),
    });
    const data = await r.json();
    if (!r.ok || !data.reply) throw new Error(data.error);
    reply = data.reply;
  } catch (e) {
    console.warn('chat fallback:', e?.message);
    reply = localAnswer(text);
  }
  busy = false; micBtn.classList.remove('busy');
  if (my !== session) return; // صار إعادة ضبط أثناء الانتظار
  history.push({ role: 'assistant', content: reply });
  history = history.slice(-10);
  showCaption(text, reply);
  setStatus(CONFIG.idleStatus);
  await speak(reply);
  if (my === session && !recState && !busy) setStatus(CONFIG.idleStatus);
}

function newChat() {
  session++;
  stopSpeaking();
  history = [];
  showCaption('', CONFIG.greeting);
  setStatus(CONFIG.idleStatus);
}

$('#textForm').addEventListener('submit', (e) => {
  e.preventDefault(); ensureAudio();
  const v = $('#textInput').value; $('#textInput').value = ''; $('#textInput').blur();
  ask(v);
});
$$('.chip').forEach((c) => c.addEventListener('click', () => { ensureAudio(); ask(c.dataset.q); }));

/* ---------------- التسجيل الصوتي ---------------- */
let recState = null;

micBtn.addEventListener('click', () => {
  ensureAudio();
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
  catch { setStatus('ما قدرت أوصل للمايك — تأكد من السماح للمتصفح بالمايك'); return; }

  const mime = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'].find((m) => MediaRecorder.isTypeSupported(m)) || '';
  const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
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
    src.disconnect();
    recState = null; micLevel = 0;
    micBtn.classList.remove('listening');
    if (!heardSpeech) { setStatus('ما سمعتك، اضغط المايك وجرّب مرة ثانية'); return; }
    setStatus('جاري تحويل كلامك لنص...');
    const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
    try {
      const r = await fetch(`${CONFIG.apiBase}/api/stt`, { method: 'POST', headers: { 'Content-Type': blob.type }, body: blob });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      if (!data.text) { setStatus('ما وضح الكلام، جرّب مرة ثانية'); return; }
      ask(data.text);
    } catch (e) {
      console.warn('stt:', e?.message);
      setStatus('تعذّر تحويل الصوت الآن — اختر من الأسئلة السريعة أو اكتب سؤالك');
    }
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
  setStatus('أسمعك... تكلّم الحين', 'listening');
  monitor();
}

// بديل: التعرف على الكلام من المتصفح (Chrome)
function startBrowserRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { setStatus('المتصفح لا يدعم المايك — اكتب سؤالك بالأسفل'); return; }
  const rec = new SR();
  rec.lang = 'ar-SA'; rec.interimResults = false; rec.maxAlternatives = 1;
  recState = { stop: () => rec.stop() };
  micBtn.classList.add('listening');
  setStatus('أسمعك... تكلّم الحين', 'listening');
  rec.onresult = (e) => ask(e.results[0][0].transcript);
  rec.onend = () => { recState = null; micBtn.classList.remove('listening'); };
  rec.onerror = () => setStatus('ما سمعتك، جرّب مرة ثانية');
  rec.start();
}

/* ---------------- إجابات محلية (عند عدم توفر الاتصال بالذكاء الاصطناعي) ---------------- */
function localAnswer(q) {
  const has = (...w) => w.some((x) => q.includes(x));
  if (has('أبلغ', 'ابلغ', 'أبلّغ', 'بلاغ', 'بلغ'))
    return 'أبشر، تقدر تبلّغ عن أي شبهة فساد على الرقم المجاني تسعمية وثمانين، أو بالإيميل 980@nazaha.gov.sa، أو من موقع نزاهة وتطبيقها. وتقدر تبلّغ بدون ما تذكر اسمك إذا كانت معلوماتك قابلة للتحقق.';
  if (has('جامعة', 'حائل'))
    return 'جامعة حائل جامعة حكومية سعودية في مدينة حائل، تأسست عام ألف وأربعمية وستة وعشرين هجري الموافق ألفين وخمسة ميلادي، وهي اللي تنظّم هذي الفعالية بمناسبة اليوم العالمي لمكافحة الفساد. وللتفاصيل تقدر تزور موقع الجامعة.';
  if (has('أهمية', 'اهمية', 'ليش نكافح', 'خطر', 'أضرار', 'اضرار'))
    return 'مكافحة الفساد تحفظ المال العام، وتضمن إن الفرص والخدمات توصل لمستحقيها بعدل، وتقوّي ثقة الناس بالجهات العامة وتدعم التنمية. وكل واحد منا له دور: نلتزم بالأمانة في دراستنا وشغلنا، ونبلّغ إذا شفنا شبهة فساد.';
  if (has('جرائم', 'جريمة', 'أنواع'))
    return 'حسب المادة الثانية من نظام هيئة الرقابة ومكافحة الفساد، جرائم الفساد هي: الرشوة، والاعتداء على المال العام، وإساءة استعمال السلطة، وأي جريمة ثانية ينص نظام على إنها جريمة فساد.';
  if (has('9 ديسمبر', '٩ ديسمبر', 'ديسمبر', 'اليوم العالمي'))
    return 'لأن في تسعة ديسمبر ألفين وثلاثة فُتح باب التوقيع على اتفاقية الأمم المتحدة لمكافحة الفساد، ومن وقتها صار هذا اليوم يوم عالمي للتوعية بخطر الفساد.';
  if (has('ثروة', 'زادت', 'أموال'))
    return 'حسب المادة التاسعة عشرة، إذا زادت ثروة الموظف العام زيادة ما تتناسب مع دخله، يكون عبء الإثبات عليه هو إنه كسبها بطريقة مشروعة، ويشمل ذلك زوجه وأولاده وأقاربه من الدرجة الأولى.';
  if (has('محمي', 'حماية', 'سرية'))
    return 'أكيد، من اختصاصات الهيئة حسب المادة الرابعة توفير الحماية اللازمة لمن يبلّغ أو يدلي بمعلومات عن الفساد، وفيه كذلك نظام خاص لحماية المبلغين والشهود والخبراء والضحايا.';
  if (has('اختصاص', 'مهام', 'دور', 'وش تسوي', 'نزاهة'))
    return 'هيئة الرقابة ومكافحة الفساد تعنى بالرقابة الإدارية على الجهات العامة، وحماية النزاهة وتعزيز الشفافية ومكافحة الفساد، ومن اختصاصاتها تلقي البلاغات، والتحقيق في جرائم الفساد، ومتابعة استرداد الأموال، ونشر الوعي.';
  if (has('محكمة'))
    return 'حسب المرسوم الملكي، تختص المحكمة الجزائية في مدينة الرياض بالنظر في جميع جرائم الفساد.';
  return 'سؤال حلو! الحين أنا شغال بالوضع المحدود، لكن تقدر تتصفح مواد النظام كاملة من قسم الأنظمة تحت، أو تجرب المسابقة.';
}

/* ---------------- الأنظمة ---------------- */
function renderLaw(filter = '') {
  const box = $('#lawArticles');
  const law = window.NAZAHA_LAW;
  let f = filter.trim();
  const match = (a, t) => a.title.includes(t) || a.body.includes(t);
  const items = [{ title: 'المرسوم الملكي وقرار مجلس الوزراء', chapter: '', body: law.preamble }, ...law.articles];
  if (f.startsWith('ال') && f.length > 3 && !items.some((a) => match(a, f))) f = f.slice(2); // "الثروة" ← "ثروة"
  const hl = (t) => {
    const safe = escapeHTML(t);
    if (!f) return safe;
    const re = new RegExp(escapeHTML(f).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    return safe.replace(re, (m) => `<mark>${m}</mark>`);
  };
  const shown = items.filter((a) => !f || match(a, f));
  box.innerHTML = shown.length
    ? shown.map((a) => `<details ${f ? 'open' : ''}><summary><span>${hl(a.title)}<span class="chapter">${escapeHTML(a.chapter || '')}</span></span></summary><div class="body">${hl(a.body)}</div></details>`).join('')
    : '<p>لا توجد نتائج مطابقة.</p>';
}
renderLaw();
$('#lawSearch').addEventListener('input', (e) => renderLaw(e.target.value));

/* ---------------- المسابقة ---------------- */
let qi = 0, score = 0;
function renderQuiz() {
  const box = $('#quiz');
  const Q = window.QUIZ;
  if (qi >= Q.length) {
    const pct = Math.round((score / Q.length) * 100);
    const msg = pct >= 80 ? 'ممتاز! أنت سفير للنزاهة' : pct >= 50 ? 'زين! وتقدر توصل للعلامة الكاملة' : 'ولا يهمك، تصفّح الأنظمة وجرّب مرة ثانية';
    box.innerHTML = `<div class="q-card q-result"><div class="score">${score} / ${Q.length}</div><p>${msg}</p>
      <button class="q-next" id="qRestart">أعد المسابقة</button></div>`;
    $('#qRestart').onclick = () => { qi = 0; score = 0; renderQuiz(); };
    return;
  }
  const item = Q[qi];
  box.innerHTML = `<div class="q-progress"><div style="width:${(qi / Q.length) * 100}%"></div></div>
    <div class="q-card"><div class="q-num">السؤال ${qi + 1} من ${Q.length}</div>
    <div class="q-text">${item.q}</div>
    ${item.o.map((o, i) => `<button class="q-opt" data-i="${i}">${o}</button>`).join('')}
    <div id="qAfter"></div></div>`;
  $$('.q-opt', box).forEach((b) => b.addEventListener('click', () => {
    const i = Number(b.dataset.i);
    $$('.q-opt', box).forEach((x) => { x.disabled = true; if (Number(x.dataset.i) === item.a) x.classList.add('correct'); });
    if (i === item.a) score++; else b.classList.add('wrong');
    $('#qAfter').innerHTML = `<div class="q-exp"><b>${i === item.a ? 'إجابة صحيحة!' : 'الإجابة الصحيحة موضحة بالأخضر.'}</b>${item.e}</div>
      <button class="q-next" id="qNext">${qi + 1 < Q.length ? 'السؤال التالي' : 'النتيجة'}</button>`;
    $('#qNext').onclick = () => { qi++; renderQuiz(); $('#view-quiz').scrollTop = 0; };
    $('#qNext').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }));
}
renderQuiz();

/* ---------------- العد التنازلي ---------------- */
function tickCountdown() {
  const diff = new Date(CONFIG.eventDate) - new Date();
  const box = $('#countdown');
  if (diff <= -864e5) { box.parentElement.hidden = true; return; }
  if (diff <= 0) { box.innerHTML = '<div><b>اليوم!</b>اليوم العالمي لمكافحة الفساد</div>'; return; }
  const d = Math.floor(diff / 864e5), h = Math.floor((diff % 864e5) / 36e5), m = Math.floor((diff % 36e5) / 6e4);
  box.innerHTML = `<div><b>${d}</b>يوم</div><div><b>${h}</b>ساعة</div><div><b>${m}</b>دقيقة</div>`;
}
tickCountdown(); setInterval(tickCountdown, 30_000);

/* ---------------- نافذة الإعدادات ---------------- */
const dlg = $('#settings');
$('#settingsBtn').addEventListener('click', () => { applySettings(); dlg.showModal(); });
$('#setClose').addEventListener('click', () => dlg.close());
dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
$('#setVol').addEventListener('input', (e) => { settings.volume = Number(e.target.value); saveSettings(); applySettings(); });
$('#setVoice').addEventListener('change', (e) => { settings.voice = e.target.checked; if (!settings.voice) stopSpeaking(); saveSettings(); });
$('#setText').addEventListener('change', (e) => { settings.text = e.target.checked; saveSettings(); applySettings(); });
$('#setNew').addEventListener('click', () => { newChat(); dlg.close(); });
$('#setFull').addEventListener('click', () => {
  if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen?.().catch(() => {});
});

/* ---------------- إعادة الضبط عند الخمول (للشاشة التفاعلية) ---------------- */
let idleTimer;
function resetIdle() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    if (talking || busy || recState) return resetIdle();
    if (dlg.open) dlg.close();
    newChat();
    qi = 0; score = 0; renderQuiz();
    $('#lawSearch').value = ''; renderLaw();
    showView('assistant');
  }, CONFIG.idleResetSeconds * 1000);
}
['pointerdown', 'keydown'].forEach((ev) => document.addEventListener(ev, resetIdle));

/* ---------------- البداية ---------------- */
applySettings();
showCaption('', CONFIG.greeting);
resetIdle();
