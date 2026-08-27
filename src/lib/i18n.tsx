import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "ar" | "en";

const dict = {
  brand: { ar: "سمارت PDF ستوديو", en: "SmartPDF Studio" },
  tagline: {
    ar: "كل أدوات الـ PDF الاحترافية في مكان واحد",
    en: "Every professional PDF tool in one place",
  },
  nav_dashboard: { ar: "لوحة التحكم", en: "Dashboard" },
  nav_viewer: { ar: "العارض والتوقيع", en: "Viewer & Sign" },
  nav_merge: { ar: "دمج الملفات", en: "Merge PDFs" },
  nav_split: { ar: "تقسيم الملف", en: "Split PDF" },
  nav_image: { ar: "صور إلى PDF", en: "Image to PDF" },
  nav_text: { ar: "PDF إلى نص", en: "PDF to Text" },
  nav_watermark: { ar: "علامة مائية", en: "Watermark" },
  nav_organize: { ar: "تنظيم الصفحات", en: "Organize pages" },
  nav_compress: { ar: "ضغط PDF", en: "Compress PDF" },
  nav_numbers: { ar: "ترقيم الصفحات", en: "Page numbers" },
  tools: { ar: "الأدوات", en: "Tools" },
  language: { ar: "اللغة", en: "Language" },
  theme_dark: { ar: "الوضع الليلي", en: "Dark mode" },
  theme_light: { ar: "الوضع النهاري", en: "Light mode" },
  open_menu: { ar: "فتح القائمة", en: "Open menu" },
  signature_credit: { ar: "by yahya elyamri", en: "by yahya elyamri" },
  install_app: { ar: "تثبيت التطبيق", en: "Install App" },
  install_ios_hint: {
    ar: "لتثبيت التطبيق: اضغط على زر المشاركة في سفاري، ثم اختر «إضافة إلى الشاشة الرئيسية».",
    en: "To install: tap the Share button in Safari, then choose “Add to Home Screen”.",
  },
  close: { ar: "إغلاق", en: "Close" },

  hero_cta: { ar: "ابدأ الآن", en: "Get started" },
  hero_secondary: { ar: "استعرض الأدوات", en: "Browse tools" },

  card_viewer_desc: {
    ar: "اعرض ملفاتك، تنقّل بين الصفحات، وكبّر أو صغّر بسهولة.",
    en: "View your documents, navigate pages, and zoom smoothly.",
  },
  card_merge_desc: {
    ar: "اسحب عدة ملفات PDF وادمجها في مستند واحد.",
    en: "Drag several PDF files and combine them into one document.",
  },
  card_split_desc: {
    ar: "استخرج صفحات محددة من ملف PDF إلى ملف جديد.",
    en: "Extract specific pages from a PDF into a new file.",
  },
  card_image_desc: {
    ar: "حوّل صور JPG أو PNG إلى مستند PDF واحد.",
    en: "Convert JPG or PNG images into a single PDF document.",
  },
  card_text_desc: {
    ar: "استخرج النص من ملف PDF وانسخه أو حمّله.",
    en: "Extract text from a PDF, then copy or download it.",
  },
  card_sign_desc: {
    ar: "ارسم أو اكتب توقيعك وضعه في أي صفحة.",
    en: "Draw or type your signature and place it on any page.",
  },
  sign_title: { ar: "التوقيع الإلكتروني", en: "Electronic signature" },

  drop_pdf: { ar: "اسحب ملف PDF هنا أو اضغط للاختيار", en: "Drop a PDF here or click to choose" },
  drop_pdfs: { ar: "اسحب ملفات PDF هنا أو اضغط للاختيار", en: "Drop PDF files here or click to choose" },
  drop_images: { ar: "اسحب الصور هنا أو اضغط للاختيار", en: "Drop images here or click to choose" },
  choose_file: { ar: "اختر ملفًا", en: "Choose file" },
  clear: { ar: "مسح", en: "Clear" },
  remove: { ar: "إزالة", en: "Remove" },
  download: { ar: "تحميل", en: "Download" },
  processing: { ar: "جارٍ المعالجة…", en: "Processing…" },
  files_selected: { ar: "ملفات محددة", en: "Selected files" },
  move_up: { ar: "تحريك لأعلى", en: "Move up" },
  move_down: { ar: "تحريك لأسفل", en: "Move down" },
  merge_action: { ar: "دمج وتحميل", en: "Merge & download" },
  merge_hint: { ar: "أضف ملفين على الأقل للدمج.", en: "Add at least two files to merge." },
  split_range: { ar: "نطاق الصفحات", en: "Page range" },
  split_placeholder: { ar: "مثال: 1-3, 5, 8-10", en: "e.g. 1-3, 5, 8-10" },
  split_action: { ar: "استخراج الصفحات", en: "Extract pages" },
  pages_count: { ar: "عدد الصفحات", en: "Pages" },
  image_action: { ar: "إنشاء PDF", en: "Create PDF" },
  text_action: { ar: "استخراج النص", en: "Extract text" },
  copy: { ar: "نسخ", en: "Copy" },
  copied: { ar: "تم النسخ", en: "Copied" },
  no_text: { ar: "لم يتم العثور على نص قابل للاستخراج.", en: "No extractable text found." },

  page: { ar: "صفحة", en: "Page" },
  of: { ar: "من", en: "of" },
  zoom_in: { ar: "تكبير", en: "Zoom in" },
  zoom_out: { ar: "تصغير", en: "Zoom out" },
  prev_page: { ar: "الصفحة السابقة", en: "Previous page" },
  next_page: { ar: "الصفحة التالية", en: "Next page" },
  loading: { ar: "جارٍ التحميل…", en: "Loading…" },

  tool_select: { ar: "تحديد", en: "Select" },
  tool_sign: { ar: "توقيع", en: "Signature" },
  tool_note: { ar: "ملاحظة نصية", en: "Text note" },
  tool_highlight: { ar: "تظليل", en: "Highlight" },
  draw: { ar: "رسم", en: "Draw" },
  type: { ar: "كتابة", en: "Type" },
  your_name: { ar: "اكتب اسمك", en: "Type your name" },
  save_signature: { ar: "حفظ التوقيع", en: "Save signature" },
  clear_canvas: { ar: "مسح الرسم", en: "Clear drawing" },
  place_hint: {
    ar: "اضغط على الصفحة لوضع العنصر.",
    en: "Click on the page to place the element.",
  },
  note_text: { ar: "نص الملاحظة", en: "Note text" },
  add: { ar: "إضافة", en: "Add" },
  annotations: { ar: "العناصر المضافة", en: "Added elements" },
  no_annotations: { ar: "لا توجد عناصر بعد.", en: "Nothing added yet." },
  export_pdf: { ar: "تصدير PDF", en: "Export PDF" },
  signature_needed: { ar: "احفظ توقيعك أولًا.", en: "Save your signature first." },
  invalid_pdf: { ar: "تعذّر قراءة الملف. تأكد من أنه PDF صالح.", en: "Could not read the file. Make sure it is a valid PDF." },
  done: { ar: "تم بنجاح", en: "Done" },

  card_watermark_desc: {
    ar: "أضف نص علامة مائية شفاف على كل صفحات الملف.",
    en: "Stamp a translucent text watermark on every page.",
  },
  card_organize_desc: {
    ar: "دوّر أو احذف صفحات محددة ثم احفظ نسخة جديدة.",
    en: "Rotate or delete specific pages, then save a new copy.",
  },
  card_compress_desc: {
    ar: "قلّل حجم ملف PDF مع الحفاظ على وضوح مقبول.",
    en: "Reduce PDF file size while keeping decent clarity.",
  },
  card_numbers_desc: {
    ar: "أضف أرقام الصفحات تلقائيًا أسفل كل صفحة.",
    en: "Add sequential page numbers to the bottom of each page.",
  },
  watermark_text: { ar: "نص العلامة المائية", en: "Watermark text" },
  watermark_placeholder: { ar: "مثال: نسخة سرية", en: "e.g. CONFIDENTIAL" },
  watermark_opacity: { ar: "الشفافية", en: "Opacity" },
  watermark_rotation: { ar: "زاوية الميل", en: "Rotation" },
  watermark_color: { ar: "اللون", en: "Color" },
  watermark_action: { ar: "إضافة العلامة المائية", en: "Add watermark" },
  organize_action: { ar: "حفظ الملف الجديد", en: "Save new file" },
  rotate_left: { ar: "تدوير لليسار", en: "Rotate left" },
  rotate_right: { ar: "تدوير لليمين", en: "Rotate right" },
  delete_page: { ar: "حذف الصفحة", en: "Delete page" },
  restore_page: { ar: "استعادة الصفحة", en: "Restore page" },
  organize_hint: { ar: "اختر الصفحات التي تريد حذفها أو تدويرها.", en: "Choose pages to delete or rotate." },
  no_pages_left: { ar: "لا يمكن حذف كل الصفحات.", en: "You cannot delete every page." },
  compress_quality: { ar: "جودة الضغط", en: "Compression quality" },
  compress_action: { ar: "ضغط وتحميل", en: "Compress & download" },
  size_before: { ar: "الحجم الأصلي", en: "Original size" },
  size_after: { ar: "الحجم بعد الضغط", en: "Compressed size" },
  compress_note: {
    ar: "يتم تحويل الصفحات إلى صور، لذا لن يبقى النص قابلًا للتحديد.",
    en: "Pages are converted to images, so text will no longer be selectable.",
  },
  numbers_position: { ar: "موضع الرقم", en: "Number position" },
  pos_center: { ar: "الوسط", en: "Center" },
  pos_start: { ar: "البداية", en: "Start" },
  pos_end: { ar: "النهاية", en: "End" },
  numbers_action: { ar: "إضافة الأرقام", en: "Add numbers" },
} as const;

export type TKey = keyof typeof dict;

type Ctx = { lang: Lang; dir: "rtl" | "ltr"; t: (k: TKey) => string; toggle: () => void };

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ar");

  useEffect(() => {
    const stored = localStorage.getItem("spdf-lang");
    if (stored === "en" || stored === "ar") setLang(stored);
  }, []);

  useEffect(() => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    localStorage.setItem("spdf-lang", lang);
  }, [lang]);

  const toggle = useCallback(() => setLang((l) => (l === "ar" ? "en" : "ar")), []);
  const t = useCallback((k: TKey) => dict[k][lang], [lang]);

  const value = useMemo<Ctx>(
    () => ({ lang, dir: lang === "ar" ? "rtl" : "ltr", t, toggle }),
    [lang, t, toggle],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
