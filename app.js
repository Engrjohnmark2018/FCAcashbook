/* ============================================================
   FCA Cash Book — app logic
   Developed by ENGR. JOHN MARK C. CONTILLO
   A simple cash book for Farmers' Cooperatives and Associations.
   Bilingual: English / Ilokano. Data saved in this browser only.
   ============================================================ */
'use strict';

/* ---------- Tiny helpers ---------- */
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

/* Safe storage: works even where localStorage is blocked (falls back to memory). */
const store = (() => {
  try {
    localStorage.setItem('__ccb_test', '1');
    localStorage.removeItem('__ccb_test');
    return localStorage;
  } catch (e) {
    const mem = {};
    return {
      getItem: (k) => (k in mem ? mem[k] : null),
      setItem: (k, v) => { mem[k] = String(v); },
      removeItem: (k) => { delete mem[k]; },
    };
  }
})();

const STORAGE_KEY = 'fca-cash-book-v1';
const LANG_KEY = 'fca-cash-book-lang';

/* ============================================================
   TRANSLATIONS — English (en) and Ilokano (ilo)
   ============================================================ */
const I18N = {
  en: {
    tagline: 'Simple money records for cooperatives & associations',

    /* tabs */
    tab_home: 'Home', tab_records: 'Records', tab_reports: 'Reports', tab_settings: 'Settings',

    /* welcome */
    welcome_h: 'Welcome to FCA Cash Book',
    welcome_p: 'A simple book to write down the money of your cooperative or association:',
    w_in_l: 'Money In', w_in_d: 'sales, membership fees, loans, donations',
    w_out_l: 'Money Out', w_out_d: 'seeds, fertilizer, wages, transport',
    w_cash_l: 'Cash on hand', w_cash_d: 'counted for you, always up to date',
    welcome_books: 'First, make one book for your group. You can add more books later for other groups you help.',
    btn_create_first: '📗 Create our first book',

    /* home */
    label_cash: '💵 Cash on hand', label_in: '💰 Money In', label_out: '🛒 Money Out',
    btn_in: '💰 Record Money In', btn_out: '🛒 Record Money Out',
    home_month: 'This month — Money In: {in} · Money Out: {out}',
    home_opening: 'Starting cash: {x}',
    empty_t: 'No records yet.',
    empty_p: 'Use the big buttons above to record your first one.',
    btn_sample: '✨ Load sample records to practice',

    /* records */
    h_records: '📒 Records',
    all_months_opt: '📅 All months',
    search_ph: '🔍 Search records…',
    records_count: '{n} records',
    rec_totals: 'In {in} · Out {out}',
    rec_empty: 'No records here yet.',
    rec_empty2: 'Use the big buttons on the Home screen to add one.',
    from_lbl: 'From: ', paidto_lbl: 'Paid to: ', ref_lbl: 'Ref: ',

    /* reports */
    h_reports: '📊 Reports',
    rep_all_opt: 'All time (since start)', rep_all_label: 'All time',
    btn_print: '🖨️ Print', btn_csv: '⬇️ Excel (CSV)',
    rep_in: 'Money In', rep_out: 'Money Out', rep_net: 'Net',
    rep_note_all: 'Cash on hand, incl. starting cash',
    rep_note_month: 'Change for this month',
    h_cat_in: '💰 Money In — where it came from',
    h_cat_out: '🛒 Money Out — what it was used for',
    rep_cat_empty: 'Nothing recorded.',

    /* settings */
    h_settings: '⚙️ Settings',
    s_book_h: '📗 This book',
    s_book_p: 'Change the book\u2019s name or its starting cash. You can also delete the book from that screen.',
    btn_book_settings: '✏️ Edit book name / starting cash',
    s_backup_h: '💾 Backup your records',
    s_backup_p: 'Records are saved only inside this browser on this device. Download a backup regularly so nothing is lost. Use “Restore” to open a backup on another phone or computer.',
    btn_export: '⬇️ Download backup', btn_restore: '⬆️ Restore backup',
    s_about_h: 'ℹ️ About',
    s_about_p: 'FCA Cash Book is a free, simple cash book for Farmers\u2019 Cooperatives and Associations. It works offline, needs no account, and keeps all records private on your own device.',
    s_dev: 'Developed by:', footer_dev: 'Developed by',

    /* entry form */
    back: '← Back',
    t_in: '💰 Record Money In', t_out: '🛒 Record Money Out', t_edit: '✏️ Edit record',
    date_l: 'Date', amount_l: 'Amount (₱)', amount_ph: 'Example: 1500.00',
    cat_lbl_in: 'Where did the money come from?', cat_lbl_out: 'What was the money used for?',
    person_lbl_in: 'From (who paid)', person_lbl_out: 'Paid to (who received)',
    person_ph: 'Example: Maria\u2019s farm',
    ref_l: 'Receipt / reference number (optional)', ref_ph: 'Example: OR #0012',
    note_l: 'Notes (optional)', note_ph: 'Example: cabbage, 250 kg',
    btn_save: '💾 Save', btn_save_changes: '💾 Save changes',
    type_btn_in: '💰 Money In', type_btn_out: '🛒 Money Out',

    /* book form */
    book_t_create: '📗 Create a new book', book_t_edit: '📗 Book settings',
    bName_l: 'Name of cooperative / association',
    bName_ph: 'Example: Samili Farmers Cooperative',
    book_hint_create: 'Example: “Samili Farmers Cooperative” or “Rice Farmers Association”.',
    book_hint_edit: 'Change the name of this book, or its starting cash.',
    bOpening_l: 'Cash on hand at start (₱)',
    bOpening_p: 'If the group already has cash today, write it here. If none, leave it as 0.',
    book_btn_create: '✅ Create book', book_btn_save: '💾 Save settings',
    bookDelete: '🗑️ Delete this book and all its records',
    add_new_book: '➕ Add a new book…',

    /* confirms */
    confirm_del_book: 'Delete the book "{name}" and ALL of its records?\n\nThis cannot be undone. If you still need the records, download a backup first (Settings screen).',
    confirm_del_entry: 'Delete this record?\n\n{detail}',
    confirm_restore: 'Replace everything saved in this browser with the backup?\n\nThe backup contains: {names}',

    /* toasts */
    toast_amount: '⚠️ Please write the amount of money.',
    toast_name: '⚠️ Please write the name of the group.',
    toast_in: '✅ Money In saved', toast_out: '✅ Money Out saved',
    toast_updated: '✅ Record updated', toast_deleted: '🗑️ Record deleted',
    toast_sample: '✨ Sample records loaded — practice freely!',
    toast_book_created: '✅ Book created. You can start recording!',
    toast_book_saved: '✅ Book settings saved',
    toast_backup_dl: '⬇️ Backup downloaded. Keep it somewhere safe!',
    toast_restored: '✅ Backup restored',
    toast_bad: '⚠️ Sorry, that file is not a valid backup.',
    toast_csv: '⬇️ CSV file downloaded (opens in Excel)',

    /* print report */
    pr_title: 'Cash Report', pr_printed: 'Printed:', pr_starting: 'Starting cash:',
    pr_tot_in: 'Total Money In', pr_tot_out: 'Total Money Out',
    pr_cash: 'Cash on hand (balance)', pr_net_month: 'Net change this month',
    pr_none: 'No records.',
    th_date: 'Date', th_cat: 'Category', th_fromto: 'From / To', th_ref: 'Ref.',
    th_in: 'In', th_out: 'Out', th_bal: 'Balance',
    pr_prepared: 'Prepared by', pr_checked: 'Checked by', pr_approved: 'Approved by',
  },

  ilo: {
    tagline: 'Nalaka a panagilista ti pirak dagiti kooperatiba ken asosasion',

    /* tabs */
    tab_home: 'Balay', tab_records: 'Listaan', tab_reports: 'Report', tab_settings: 'Urnos',

    /* welcome */
    welcome_h: 'Naragsak nga isasangbay iti FCA Cash Book',
    welcome_p: 'Nalaka a libro a pagsuratan ti pirak ti kooperatiba wenno asosasionyo:',
    w_in_l: 'Simrek a pirak', w_in_d: 'lako, bayad miyembro, utang a naawat, donasion',
    w_out_l: 'Rimmuar a pirak', w_out_d: 'bukbukel, abono, sapulan, lugan',
    w_cash_l: 'Pirak nga adda kadatayo', w_cash_d: 'naibilang para kadakayo, kanayon nga umno',
    welcome_books: 'Umuna, agaramid ti maysa a libro para iti grupoyo. Mabalin nga agnayon kadagiti libro para kadagiti sabali a grupo a tultulonganyo.',
    btn_create_first: '📗 Aramiden ti umuna a libro',

    /* home */
    label_cash: '💵 Pirak nga adda kadatayo', label_in: '💰 Simrek a pirak', label_out: '🛒 Rimmuar a pirak',
    btn_in: '💰 Ilista ti simrek a pirak', btn_out: '🛒 Ilista ti rimmuar a pirak',
    home_month: 'Ita a bulan — Simrek: {in} · Rimmuar: {out}',
    home_opening: 'Pangrugian a pirak: {x}',
    empty_t: 'Awan pay ti nailista.',
    empty_p: 'Pinduten dagiti dakkel a buton iti ngato tapno makapagilista kayo.',
    btn_sample: '✨ Ikabil dagiti pagarigan tapno agpraktis kayo',

    /* records */
    h_records: '📒 Listaan',
    all_months_opt: '📅 Amin a bulan',
    search_ph: '🔍 Agbirok iti listaan…',
    records_count: '{n} a listaan',
    rec_totals: 'Simrek {in} · Rimmuar {out}',
    rec_empty: 'Awan pay ti listaan ditoy.',
    rec_empty2: 'Usaren dagiti dakkel a buton iti Balay tapno makapagilista kayo.',
    from_lbl: 'Naggapu kenni: ', paidto_lbl: 'Naited kenni: ', ref_lbl: 'Resibo: ',

    /* reports */
    h_reports: '📊 Report',
    rep_all_opt: 'Manipud idi rugi (amin)', rep_all_label: 'Manipud idi rugi',
    btn_print: '🖨️ I-print', btn_csv: '⬇️ Excel (CSV)',
    rep_in: 'Simrek a pirak', rep_out: 'Rimmuar a pirak', rep_net: 'Nabatbati',
    rep_note_all: 'Pirak nga adda kadatayo, nairaman ti pangrugian',
    rep_note_month: 'Panagbaliw ita a bulan',
    h_cat_in: '💰 Simrek a pirak — naggapuanna',
    h_cat_out: '🛒 Rimmuar a pirak — nakaaramatan',
    rep_cat_empty: 'Awan pay ti nailista.',

    /* settings */
    h_settings: '⚙️ Urnos',
    s_book_h: '📗 Daytoy a libro',
    s_book_p: 'Baliwan ti nagan ti libro wenno ti pangrugian a pirak. Mabalin met a burasen ti libro iti dayta a screen.',
    btn_book_settings: '✏️ Baliwan ti nagan / pangrugian a pirak',
    s_backup_h: '💾 Backup dagiti listaan',
    s_backup_p: 'Dagiti listaan ket naidulin laeng iti daytoy a browser iti daytoy a device. Ag-download ti backup kanayon tapno saan a mapukaw. Usaren ti “Restore” tapno malukat ti backup iti sabali a selpon wenno kompiuter.',
    btn_export: '⬇️ I-download ti backup', btn_restore: '⬆️ Isubli ti backup',
    s_about_h: 'ℹ️ Maipapan',
    s_about_p: 'Ti FCA Cash Book ket libre ken nalaka a libro ti pirak para kadagiti Kooperatiba ken Asosasion dagiti Mannalon. Aganay daytoy uray awan internet, awan kasapulan a cuenta, ken maidulin laeng dagiti listaan iti bukod yo a device.',
    s_dev: 'Inaramid ni:', footer_dev: 'Inaramid ni',

    /* entry form */
    back: '← Agsubli',
    t_in: '💰 Ilista ti simrek a pirak', t_out: '🛒 Ilista ti rimmuar a pirak', t_edit: '✏️ Baliwan ti listaan',
    date_l: 'Petsa', amount_l: 'Gatad (₱)', amount_ph: 'Kas pagarigan: 1500.00',
    cat_lbl_in: 'Naggapu iti sadino ti pirak?', cat_lbl_out: 'Ania ti nakaaramatan ti pirak?',
    person_lbl_in: 'Naggapu kenni (siasino ti nagbayad)', person_lbl_out: 'Naited kenni (siasino ti nangawat)',
    person_ph: 'Kas pagarigan: talon ni Maria',
    ref_l: 'Numero ti resibo (no adda)', ref_ph: 'Kas pagarigan: OR #0012',
    note_l: 'Nota (no adda)', note_ph: 'Kas pagarigan: repolyo, 250 kg',
    btn_save: '💾 Idulin', btn_save_changes: '💾 Idulin dagiti binalbaliwan',
    type_btn_in: '💰 Simrek a pirak', type_btn_out: '🛒 Rimmuar a pirak',

    /* book form */
    book_t_create: '📗 Agaramid ti baro a libro', book_t_edit: '📗 Urnos ti libro',
    bName_l: 'Nagan ti kooperatiba / asosasion',
    bName_ph: 'Kas pagarigan: Samili Farmers Cooperative',
    book_hint_create: 'Kas pagarigan: “Samili Farmers Cooperative” wenno “Rice Farmers Association”.',
    book_hint_edit: 'Baliwan ti nagan daytoy a libro, wenno ti pangrugian a pirak.',
    bOpening_l: 'Pirak nga adda idi rugi (₱)',
    bOpening_p: 'No adda pirak ti grupo ita, isurat ditoy. No awan, ibati a 0.',
    book_btn_create: '✅ Aramiden ti libro', book_btn_save: '💾 Idulin dagiti urnos',
    bookDelete: '🗑️ Burasen daytoy a libro ken amin a listaanna',
    add_new_book: '➕ Agnayon ti baro a libro…',

    /* confirms */
    confirm_del_book: 'Burasen ti libro a "{name}" ken AMIN a listaanna?\n\nSaanen a mabalin a maisubli daytoy. No kasapulan yo pay dagiti listaan, ag-download nga umuna ti backup (iti Urnos).',
    confirm_del_entry: 'Burasen daytoy a listaan?\n\n{detail}',
    confirm_restore: 'Sukatan amin a naidulin iti daytoy a browser babaen ti backup?\n\nTi backup ket naglaon kadagiti: {names}',

    /* toasts */
    toast_amount: '⚠️ Pangngaasi nga isurat ti gatad ti pirak.',
    toast_name: '⚠️ Pangngaasi nga isurat ti nagan ti grupo.',
    toast_in: '✅ Naidulin ti simrek a pirak', toast_out: '✅ Naidulin ti rimmuar a pirak',
    toast_updated: '✅ Nabaliwan ti listaan', toast_deleted: '🗑️ Nabura ti listaan',
    toast_sample: '✨ Naikabil dagiti pagarigan — agpraktis kayo!',
    toast_book_created: '✅ Naaramid ti libro. Makapagilista kayon!',
    toast_book_saved: '✅ Naidulin dagiti urnos ti libro',
    toast_backup_dl: '⬇️ Nai-download ti backup. Idulin iti natalged a lugar!',
    toast_restored: '✅ Naisubli ti backup',
    toast_bad: '⚠️ Pasensia, saan dayta a file nga agpayso a backup.',
    toast_csv: '⬇️ Nai-download ti CSV (malukat iti Excel)',

    /* print report */
    pr_title: 'Report ti Pirak', pr_printed: 'Naiprinta:', pr_starting: 'Pangrugian a pirak:',
    pr_tot_in: 'Dagup a simrek a pirak', pr_tot_out: 'Dagup a rimmuar a pirak',
    pr_cash: 'Pirak nga adda kadatayo (balanse)', pr_net_month: 'Panagbaliw ita a bulan',
    pr_none: 'Awan ti listaan.',
    th_date: 'Petsa', th_cat: 'Kategoria', th_fromto: 'Naggapu / Naited', th_ref: 'Resibo',
    th_in: 'Simrek', th_out: 'Rimmuar', th_bal: 'Balanse',
    pr_prepared: 'Insagana ni', pr_checked: 'Sinukimat ni', pr_approved: 'Inanamongan ni',
  },
};

const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_ILO = ['Enero', 'Pebrero', 'Marso', 'Abril', 'Mayo', 'Hunio',
  'Hulio', 'Agosto', 'Septiembre', 'Oktubre', 'Nobiembre', 'Disiembre'];

/* Category names. The ENGLISH text is the stable stored value; Ilokano is display-only. */
const CATEGORIES = {
  in: [
    'Sales of crops / produce',
    'Sales of livestock / fish',
    'Sales of processed goods',
    'Membership fee',
    'Share capital',
    'Loan received',
    'Donation / aid',
    'Other income',
  ],
  out: [
    'Seeds & planting materials',
    'Fertilizer & pesticides',
    'Tools & equipment',
    'Labor (wages)',
    'Transport / delivery',
    'Fuel',
    'Rent',
    'Electricity & water',
    'Loan payment',
    'Meetings & training',
    'Other expense',
  ],
};
const CAT_ILO = {
  'Sales of crops / produce': 'Lako ti apit / nateng',
  'Sales of livestock / fish': 'Lako ti ayup / lames',
  'Sales of processed goods': 'Lako ti naaramid a produkto',
  'Membership fee': 'Bayad ti miyembro',
  'Share capital': 'Puonan ti binglay',
  'Loan received': 'Utang a naawat',
  'Donation / aid': 'Donasion / tulong',
  'Other income': 'Sabali pay a sapul',
  'Seeds & planting materials': 'Bukbukel / banag a pagmula',
  'Fertilizer & pesticides': 'Abono / agas ti mula',
  'Tools & equipment': 'Ramit / alikamen',
  'Labor (wages)': 'Sapulan (bayad iti obra)',
  'Transport / delivery': 'Lugan / panangitulod',
  'Fuel': 'Gasolina',
  'Rent': 'Abang',
  'Electricity & water': 'Kuryente ken danum',
  'Loan payment': 'Bayad ti utang',
  'Meetings & training': 'Miting ken panagsanay',
  'Other expense': 'Sabali pay a gastos',
};

/* ---------- Language ---------- */
let lang = store.getItem(LANG_KEY) === 'ilo' ? 'ilo' : 'en';

function t(key) {
  const d = I18N[lang] || I18N.en;
  if (key in d) return d[key];
  if (key in I18N.en) return I18N.en[key];
  return key;
}
function fmt(key, map) {
  let s = t(key);
  for (const k of Object.keys(map)) s = s.split('{' + k + '}').join(map[k]);
  return s;
}
function monthNames() { return lang === 'ilo' ? MONTHS_ILO : MONTHS_EN; }
function catName(id) { return (lang === 'ilo' && CAT_ILO[id]) ? CAT_ILO[id] : id; }

function applyStaticI18n() {
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-ph]').forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
}
function syncLangButtons() {
  $('#langEn').classList.toggle('active', lang === 'en');
  $('#langIlo').classList.toggle('active', lang === 'ilo');
}
function setLang(l) {
  lang = (l === 'ilo') ? 'ilo' : 'en';
  store.setItem(LANG_KEY, lang);
  document.documentElement.lang = lang === 'ilo' ? 'ilo' : 'en';
  applyStaticI18n();
  syncLangButtons();
  /* refresh any open panel so its labels translate too */
  if (!$('#entryPanel').classList.contains('hidden')) syncTypeUI();
  if (!$('#bookPanel').classList.contains('hidden')) refreshBookPanelText();
  renderAll();
}

/* ---------- State ---------- */
let state = loadState();
let currentView = 'home';
let currentType = 'in';     // 'in' or 'out' in the entry form
let editingId = null;       // entry being edited
let editingBook = false;    // book panel is in edit mode

function loadState() {
  try {
    const raw = store.getItem(STORAGE_KEY);
    if (!raw) return { books: {}, activeId: null };
    const data = JSON.parse(raw);
    if (!data || typeof data.books !== 'object' || data.books === null) {
      return { books: {}, activeId: null };
    }
    return data;
  } catch (e) {
    return { books: {}, activeId: null };
  }
}
function saveState() { store.setItem(STORAGE_KEY, JSON.stringify(state)); }
function book() { return state.books[state.activeId] || null; }

function uid() { return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8); }
function pad(n) { return String(n).padStart(2, '0'); }
function localISO(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
function todayStr() { return localISO(new Date()); }
function isoDaysAgo(n) { const d = new Date(); d.setDate(d.getDate() - n); return localISO(d); }
function monthKey(dateStr) { return String(dateStr).slice(0, 7); }
function monthLabel(key) { const [y, m] = key.split('-').map(Number); return `${monthNames()[m - 1]} ${y}`; }
function niceDate(dateStr) {
  const [y, m, d] = String(dateStr).split('-').map(Number);
  return `${monthNames()[m - 1]} ${d}, ${y}`;
}
function round2(n) { return Math.round((n || 0) * 100) / 100; }

const pesoFmt = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });
function peso(n) { return pesoFmt.format(round2(n)); }

function escapeHTML(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* ---------- Math ---------- */
function totals(entries) {
  let tin = 0, tout = 0;
  for (const e of entries) {
    if (e.type === 'in') tin += e.amount; else tout += e.amount;
  }
  return { tin: round2(tin), tout: round2(tout) };
}
function balance(b) {
  const t2 = totals(b.entries);
  return round2((b.openingBalance || 0) + t2.tin - t2.tout);
}
function monthsOf(b) {
  const s = new Set(b.entries.map((e) => monthKey(e.date)));
  return Array.from(s).sort().reverse();
}
/* Entries of a period, chronological, with the true running cash balance. */
function runningReport(b, period) {
  const sorted = [...b.entries].sort((a, c) => a.date.localeCompare(c.date) || a.createdAt - c.createdAt);
  let bal = b.openingBalance || 0;
  const rows = [];
  for (const e of sorted) {
    bal = round2(bal + (e.type === 'in' ? e.amount : -e.amount));
    if (period === 'all' || monthKey(e.date) === period) rows.push({ e, bal });
  }
  return rows;
}

/* ---------- Toast ---------- */
let toastTimer;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
}

/* ---------- Views ---------- */
function showView(name) {
  currentView = name;
  $$('.view').forEach((v) => v.classList.add('hidden'));
  const el = $('#view-' + name);
  if (el) el.classList.remove('hidden');
  $$('.tabbar button').forEach((b) => b.classList.toggle('active', b.dataset.view === name));
  window.scrollTo(0, 0);
}
function showWelcome() {
  currentView = 'welcome';
  $$('.view').forEach((v) => v.classList.add('hidden'));
  $('#view-welcome').classList.remove('hidden');
  $$('.tabbar button').forEach((b) => b.classList.remove('active'));
}

function renderAll() {
  const b = book();
  $('.tabbar').classList.toggle('hidden', !b);
  if (!b) {
    renderBookPicker();
    showWelcome();
    return;
  }
  renderBookPicker();
  renderHome();
  renderRecords();
  renderReports();
  showView(currentView === 'welcome' ? 'home' : currentView);
}

function renderBookPicker() {
  const wrap = $('#bookPickerWrap');
  const sel = $('#bookPicker');
  const ids = Object.keys(state.books);
  if (!ids.length) { wrap.classList.add('hidden'); return; }
  wrap.classList.remove('hidden');
  sel.innerHTML = '';
  ids.forEach((id) => {
    const o = document.createElement('option');
    o.value = id;
    o.textContent = state.books[id].name;
    if (id === state.activeId) o.selected = true;
    sel.appendChild(o);
  });
  const add = document.createElement('option');
  add.value = '__new__';
  add.textContent = t('add_new_book');
  sel.appendChild(add);
}

function renderHome() {
  const b = book(); if (!b) return;
  $('#homeBookName').textContent = b.name;
  const bal = balance(b);
  $('#homeCash').textContent = peso(bal);
  $('#homeCash').classList.toggle('negative', bal < 0);
  const t2 = totals(b.entries);
  $('#homeIn').textContent = peso(t2.tin);
  $('#homeOut').textContent = peso(t2.tout);
  const tm = totals(b.entries.filter((e) => monthKey(e.date) === monthKey(todayStr())));
  $('#homeMonthLine').textContent = fmt('home_month', { in: peso(tm.tin), out: peso(tm.tout) });
  $('#homeOpeningNote').textContent = b.openingBalance ? fmt('home_opening', { x: peso(b.openingBalance) }) : '';
  $('#homeEmpty').classList.toggle('hidden', b.entries.length > 0);
}

/* ---------- Records view ---------- */
function renderRecords() {
  const b = book(); if (!b) return;
  const monthSel = $('#recMonth');
  const months = monthsOf(b);
  const prev = monthSel.value || 'all';
  monthSel.innerHTML = `<option value="all">${t('all_months_opt')}</option>` +
    months.map((m) => `<option value="${m}">${monthLabel(m)}</option>`).join('');
  monthSel.value = (months.includes(prev) || prev === 'all') ? prev : 'all';
  renderRecordsList();
}

function renderRecordsList() {
  const b = book(); if (!b) return;
  const m = $('#recMonth').value;
  const q = $('#recSearch').value.trim().toLowerCase();
  let list = [...b.entries].sort((a, c) => c.date.localeCompare(a.date) || c.createdAt - a.createdAt);
  if (m !== 'all') list = list.filter((e) => monthKey(e.date) === m);
  if (q) list = list.filter((e) =>
    [e.category, e.person, e.note, e.ref].join(' ').toLowerCase().includes(q));

  const t2 = totals(list);
  $('#recCount').textContent = fmt('records_count', { n: list.length });
  $('#recTotals').innerHTML = fmt('rec_totals',
    { in: `<span class="tin">${peso(t2.tin)}</span>`, out: `<span class="tout">${peso(t2.tout)}</span>` });

  const ul = $('#recordsList');
  if (!list.length) {
    ul.innerHTML = `<li class="empty-small">${t('rec_empty')}<br>${t('rec_empty2')}</li>`;
    return;
  }
  ul.innerHTML = list.map(entryHTML).join('');
}

function entryHTML(e) {
  const sign = e.type === 'in' ? '+' : '−';
  const parts = [];
  if (e.person) parts.push(t(e.type === 'in' ? 'from_lbl' : 'paidto_lbl') + escapeHTML(e.person));
  if (e.ref) parts.push(t('ref_lbl') + escapeHTML(e.ref));
  if (e.note) parts.push(escapeHTML(e.note));
  return `<li class="entry">
    <div class="entry-main">
      <div class="entry-top"><strong>${escapeHTML(catName(e.category))}</strong><span class="entry-date">${niceDate(e.date)}</span></div>
      ${parts.length ? `<div class="entry-sub">${parts.join(' · ')}</div>` : ''}
    </div>
    <div class="entry-side">
      <span class="amount ${e.type}">${sign} ${peso(e.amount)}</span>
      <span class="entry-actions">
        <button class="icon-btn" data-act="edit" data-id="${e.id}" title="Edit">✏️</button>
        <button class="icon-btn" data-act="del" data-id="${e.id}" title="Delete">🗑️</button>
      </span>
    </div>
  </li>`;
}

/* ---------- Reports view ---------- */
function renderReports() {
  const b = book(); if (!b) return;
  const sel = $('#repPeriod');
  const months = monthsOf(b);
  const prev = sel.value || 'all';
  sel.innerHTML = `<option value="all">${t('rep_all_opt')}</option>` +
    months.map((m) => `<option value="${m}">${monthLabel(m)}</option>`).join('');
  sel.value = (months.includes(prev) || prev === 'all') ? prev : 'all';
  renderReportBody();
}

function reportEntries() {
  const b = book();
  const p = $('#repPeriod').value || 'all';
  const sorted = [...b.entries].sort((a, c) => a.date.localeCompare(c.date) || a.createdAt - c.createdAt);
  const list = p === 'all' ? sorted : sorted.filter((e) => monthKey(e.date) === p);
  return { list, p };
}

function renderReportBody() {
  const b = book(); if (!b) return;
  const { list, p } = reportEntries();
  const t2 = totals(list);
  const net = p === 'all'
    ? round2((b.openingBalance || 0) + t2.tin - t2.tout)
    : round2(t2.tin - t2.tout);
  $('#repPeriodLabel').textContent = p === 'all' ? t('rep_all_label') : monthLabel(p);
  $('#repIn').textContent = peso(t2.tin);
  $('#repOut').textContent = peso(t2.tout);
  $('#repNet').textContent = peso(net);
  $('#repNet').classList.toggle('negative', net < 0);
  $('#repNetNote').textContent = t(p === 'all' ? 'rep_note_all' : 'rep_note_month');
  $('#repCatIn').innerHTML = catBars(list, 'in');
  $('#repCatOut').innerHTML = catBars(list, 'out');
}

function catBars(list, type) {
  const items = list.filter((e) => e.type === type);
  if (!items.length) return `<p class="empty-small">${t('rep_cat_empty')}</p>`;
  const sums = {};
  items.forEach((e) => { sums[e.category] = (sums[e.category] || 0) + e.amount; });
  const rows = Object.entries(sums).sort((a, b) => b[1] - a[1]);
  const max = rows[0][1];
  return rows.map(([cat, amt]) => {
    const pct = Math.max(4, Math.round((amt / max) * 100));
    return `<div class="cat-row">
      <div class="cat-info"><span>${escapeHTML(catName(cat))}</span><strong>${peso(amt)}</strong></div>
      <div class="bar"><span class="fill ${type}" style="width:${pct}%"></span></div>
    </div>`;
  }).join('');
}

/* ---------- Panels ---------- */
function openPanel(id) {
  $('#' + id).classList.remove('hidden');
  document.body.classList.add('locked');
}
function closePanels() {
  $$('.panel').forEach((p) => p.classList.add('hidden'));
  document.body.classList.remove('locked');
}

/* ----- Entry form ----- */
function openEntryForm(type, id) {
  const b = book(); if (!b) return;
  editingId = id || null;
  const e = id ? b.entries.find((x) => x.id === id) : null;
  currentType = e ? e.type : type;
  syncTypeUI();
  $('#fDate').value = e ? e.date : todayStr();
  $('#fAmount').value = e ? e.amount : '';
  if (e && CATEGORIES[currentType].includes(e.category)) $('#fCategory').value = e.category;
  $('#fPerson').value = e ? e.person : '';
  $('#fRef').value = e ? e.ref : '';
  $('#fNote').value = e ? e.note : '';
  openPanel('entryPanel');
  setTimeout(() => $('#fAmount').focus(), 250);
}

function syncTypeUI() {
  $('#typeIn').classList.toggle('active', currentType === 'in');
  $('#typeOut').classList.toggle('active', currentType === 'out');
  $('#typeIn').textContent = t('type_btn_in');
  $('#typeOut').textContent = t('type_btn_out');
  const sel = $('#fCategory');
  const keep = sel.value;
  sel.innerHTML = CATEGORIES[currentType]
    .map((c) => `<option value="${escapeHTML(c)}">${escapeHTML(catName(c))}</option>`).join('');
  if (CATEGORIES[currentType].includes(keep)) sel.value = keep;
  $('#catLabelText').textContent = t(currentType === 'in' ? 'cat_lbl_in' : 'cat_lbl_out');
  $('#personLabelText').textContent = t(currentType === 'in' ? 'person_lbl_in' : 'person_lbl_out');
  const saveBtn = $('#entrySave');
  saveBtn.className = 'btn big ' + (currentType === 'in' ? 'btn-in' : 'btn-out');
  saveBtn.textContent = t(editingId ? 'btn_save_changes' : 'btn_save');
  $('#entryTitle').textContent = t(editingId ? 't_edit' : (currentType === 'in' ? 't_in' : 't_out'));
}

$('#entryForm').addEventListener('submit', (ev) => {
  ev.preventDefault();
  const b = book(); if (!b) return;
  const amount = round2(parseFloat($('#fAmount').value));
  if (!(amount > 0)) { toast(t('toast_amount')); $('#fAmount').focus(); return; }
  const data = {
    date: $('#fDate').value || todayStr(),
    type: currentType,
    amount,
    category: $('#fCategory').value,
    person: $('#fPerson').value.trim(),
    ref: $('#fRef').value.trim(),
    note: $('#fNote').value.trim(),
  };
  if (editingId) {
    const i = b.entries.findIndex((x) => x.id === editingId);
    if (i > -1) b.entries[i] = Object.assign({}, b.entries[i], data);
    toast(t('toast_updated'));
  } else {
    b.entries.push(Object.assign({ id: uid(), createdAt: Date.now() }, data));
    toast(t(data.type === 'in' ? 'toast_in' : 'toast_out'));
  }
  saveState();
  closePanels();
  renderAll();
});

$('#typeIn').addEventListener('click', () => { currentType = 'in'; syncTypeUI(); });
$('#typeOut').addEventListener('click', () => { currentType = 'out'; syncTypeUI(); });
$('#entryCancel').addEventListener('click', () => { closePanels(); renderAll(); });

/* ----- Book form (create / edit) ----- */
function refreshBookPanelText() {
  $('#bookPanelTitle').textContent = t(editingBook ? 'book_t_edit' : 'book_t_create');
  $('#bNameHint').textContent = t(editingBook ? 'book_hint_edit' : 'book_hint_create');
  $('#bookSave').textContent = t(editingBook ? 'book_btn_save' : 'book_btn_create');
}
function openBookForm(editMode) {
  editingBook = !!editMode && !!book();
  $('#bName').value = editingBook ? book().name : '';
  $('#bOpening').value = editingBook ? book().openingBalance : 0;
  refreshBookPanelText();
  openPanel('bookPanel');
  setTimeout(() => $('#bName').focus(), 250);
}

$('#bookForm').addEventListener('submit', (ev) => {
  ev.preventDefault();
  const name = $('#bName').value.trim();
  if (!name) { toast(t('toast_name')); $('#bName').focus(); return; }
  const opening = round2(parseFloat($('#bOpening').value) || 0);
  if (editingBook) {
    const b = book();
    b.name = name;
    b.openingBalance = opening;
    toast(t('toast_book_saved'));
  } else {
    const id = uid();
    state.books[id] = { id, name, openingBalance: opening, entries: [], createdAt: Date.now() };
    state.activeId = id;
    currentView = 'home';
    toast(t('toast_book_created'));
  }
  saveState();
  closePanels();
  renderAll();
});

$('#bookDelete').addEventListener('click', () => {
  const b = book(); if (!b) return;
  const ok = confirm(fmt('confirm_del_book', { name: b.name }));
  if (!ok) return;
  delete state.books[b.id];
  const rest = Object.keys(state.books);
  state.activeId = rest.length ? rest[0] : null;
  currentView = 'home';
  saveState();
  closePanels();
  renderAll();
});

$('#bookCancel').addEventListener('click', () => { closePanels(); renderAll(); });

/* ---------- Sample data (for practice) ---------- */
function loadSample() {
  const b = book(); if (!b) return;
  const rows = [
    [2, 'in', 'Sales of crops / produce', 12500, 'Baguio public market', 'OR #0012', 'Cabbage – 250 kg'],
    [5, 'out', 'Fertilizer & pesticides', 3200, 'Agri-supply store', 'OR #2245', 'Urea, 5 sacks'],
    [8, 'in', 'Membership fee', 500, 'Juan Dela Cruz', 'OR #0013', 'New member'],
    [12, 'out', 'Transport / delivery', 1800, 'Trucking service', '', 'Delivery to market'],
    [15, 'in', 'Sales of crops / produce', 8400, 'Wholesaler', 'OR #0014', 'Carrots – 200 kg'],
    [34, 'out', 'Labor (wages)', 4000, 'Field workers', '', 'Weeding, 5 days'],
    [37, 'in', 'Donation / aid', 10000, 'LGU program', 'OR #0011', 'Seedling support'],
    [40, 'out', 'Seeds & planting materials', 2600, 'Seed supplier', 'OR #2210', 'Carrot & cabbage seeds'],
    [45, 'in', 'Share capital', 1000, 'Maria Santos', 'OR #0010', 'Additional share'],
    [50, 'out', 'Meetings & training', 1500, '', '', 'Snacks for general assembly'],
  ];
  rows.forEach(([daysAgo, type, category, amount, person, ref, note]) => {
    b.entries.push({
      id: uid(), createdAt: Date.now(), date: isoDaysAgo(daysAgo),
      type, category, amount, person, ref, note,
    });
  });
  saveState();
  renderAll();
  toast(t('toast_sample'));
}

/* ---------- Export: CSV ---------- */
function csvEscape(v) {
  v = String(v == null ? '' : v);
  return /[",\n\r]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
}
function slug(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'book';
}
function downloadBlob(name, type, content) {
  const blob = new Blob([content], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}

function exportCSV() {
  const b = book(); if (!b) return;
  const p = $('#repPeriod').value || 'all';
  const rows = runningReport(b, p);
  const lines = [['Date', 'Type', 'Category', 'From/To', 'Reference', 'Notes', 'Money In', 'Money Out', 'Cash Balance']];
  rows.forEach(({ e, bal }) => {
    lines.push([
      e.date, e.type === 'in' ? 'Money In' : 'Money Out', e.category,
      e.person, e.ref, e.note,
      e.type === 'in' ? e.amount : '', e.type === 'out' ? e.amount : '', bal,
    ]);
  });
  const t2 = totals(rows.map((r) => r.e));
  lines.push([]);
  lines.push(['TOTALS', '', '', '', '', '', t2.tin, t2.tout, '']);
  const csv = '\uFEFF' + lines.map((r) => r.map(csvEscape).join(',')).join('\r\n');
  const label = p === 'all' ? 'all' : p;
  downloadBlob(`${slug(b.name)}-records-${label}.csv`, 'text/csv;charset=utf-8', csv);
  toast(t('toast_csv'));
}

/* ---------- Print report ---------- */
function printReport() {
  const b = book(); if (!b) return;
  const p = $('#repPeriod').value || 'all';
  const rows = runningReport(b, p);
  const t2 = totals(rows.map((r) => r.e));
  const periodLabel = p === 'all' ? t('rep_all_label') : monthLabel(p);
  $('#printArea').innerHTML = `
    <h1>${escapeHTML(b.name)}</h1>
    <h2>${t('pr_title')} — ${periodLabel}</h2>
    <p class="meta">${t('pr_printed')} ${niceDate(todayStr())}${(p === 'all' && b.openingBalance) ? ` &nbsp;·&nbsp; ${t('pr_starting')} ${peso(b.openingBalance)}` : ''}</p>
    <table class="sum">
      <tr><td>${t('pr_tot_in')}</td><td class="r">${peso(t2.tin)}</td></tr>
      <tr><td>${t('pr_tot_out')}</td><td class="r">${peso(t2.tout)}</td></tr>
      <tr class="net"><td>${t(p === 'all' ? 'pr_cash' : 'pr_net_month')}</td><td class="r">${peso(p === 'all' ? balance(b) : round2(t2.tin - t2.tout))}</td></tr>
    </table>
    <table class="list">
      <thead><tr><th>${t('th_date')}</th><th>${t('th_cat')}</th><th>${t('th_fromto')}</th><th>${t('th_ref')}</th><th class="r">${t('th_in')}</th><th class="r">${t('th_out')}</th><th class="r">${t('th_bal')}</th></tr></thead>
      <tbody>
        ${rows.map(({ e, bal }) => `<tr>
          <td>${niceDate(e.date)}</td>
          <td>${escapeHTML(catName(e.category))}${e.note ? `<div class="nt">${escapeHTML(e.note)}</div>` : ''}</td>
          <td>${escapeHTML(e.person)}</td>
          <td>${escapeHTML(e.ref)}</td>
          <td class="r">${e.type === 'in' ? peso(e.amount) : ''}</td>
          <td class="r">${e.type === 'out' ? peso(e.amount) : ''}</td>
          <td class="r">${peso(bal)}</td>
        </tr>`).join('') || `<tr><td colspan="7">${t('pr_none')}</td></tr>`}
      </tbody>
    </table>
    <div class="sig">
      <div><span class="line"></span>${t('pr_prepared')}</div>
      <div><span class="line"></span>${t('pr_checked')}</div>
      <div><span class="line"></span>${t('pr_approved')}</div>
    </div>`;
  window.print();
}

/* ---------- Backup (export / restore JSON) ---------- */
function exportBackup() {
  const data = {
    app: 'fca-cash-book',
    version: 1,
    exportedAt: new Date().toISOString(),
    books: state.books,
  };
  downloadBlob(`fca-cash-book-backup-${todayStr()}.json`, 'application/json', JSON.stringify(data, null, 2));
  toast(t('toast_backup_dl'));
}

function restoreBackup(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!data || typeof data.books !== 'object' || data.books === null) throw new Error('bad file');
      const names = Object.values(data.books).map((b) => b.name).join(', ') || '—';
      const ok = confirm(fmt('confirm_restore', { names }));
      if (!ok) return;
      state = { books: data.books, activeId: Object.keys(data.books)[0] || null };
      currentView = 'home';
      saveState();
      renderAll();
      toast(t('toast_restored'));
    } catch (err) {
      toast(t('toast_bad'));
    }
  };
  reader.readAsText(file);
}

/* ---------- Wire up the UI ---------- */
function init() {
  /* Language toggle */
  $('#langEn').addEventListener('click', () => setLang('en'));
  $('#langIlo').addEventListener('click', () => setLang('ilo'));

  /* Tab bar */
  $$('.tabbar button').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!book()) return;
      currentView = btn.dataset.view;
      renderAll();
    });
  });

  /* Book picker in the header */
  $('#bookPicker').addEventListener('change', (e) => {
    const v = e.target.value;
    if (v === '__new__') {
      e.target.value = state.activeId;
      openBookForm(false);
      return;
    }
    state.activeId = v;
    saveState();
    renderAll();
  });

  /* Welcome */
  $('#btnCreateFirst').addEventListener('click', () => openBookForm(false));

  /* Home */
  $('#btnIn').addEventListener('click', () => openEntryForm('in'));
  $('#btnOut').addEventListener('click', () => openEntryForm('out'));
  $('#btnSample').addEventListener('click', loadSample);

  /* Records */
  $('#recMonth').addEventListener('change', renderRecordsList);
  $('#recSearch').addEventListener('input', renderRecordsList);
  $('#recordsList').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const b = book(); if (!b) return;
    const entry = b.entries.find((x) => x.id === btn.dataset.id);
    if (!entry) return;
    if (btn.dataset.act === 'edit') {
      openEntryForm(entry.type, entry.id);
    } else if (btn.dataset.act === 'del') {
      const detail = `${niceDate(entry.date)} · ${catName(entry.category)} · ${peso(entry.amount)}`;
      const ok = confirm(fmt('confirm_del_entry', { detail }));
      if (!ok) return;
      b.entries = b.entries.filter((x) => x.id !== entry.id);
      saveState();
      renderAll();
      toast(t('toast_deleted'));
    }
  });

  /* Reports */
  $('#repPeriod').addEventListener('change', renderReportBody);
  $('#btnPrint').addEventListener('click', printReport);
  $('#btnCSV').addEventListener('click', exportCSV);

  /* Settings */
  $('#btnBookSettings').addEventListener('click', () => openBookForm(true));
  $('#btnExportBackup').addEventListener('click', exportBackup);
  $('#importFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (file) restoreBackup(file);
  });

  /* Make sure the active book is valid, then draw */
  if (state.activeId && !state.books[state.activeId]) {
    state.activeId = Object.keys(state.books)[0] || null;
  }
  document.documentElement.lang = lang === 'ilo' ? 'ilo' : 'en';
  applyStaticI18n();
  syncLangButtons();
  renderAll();
}

init();
