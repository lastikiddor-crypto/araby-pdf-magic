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
    ar: "كل أدوات الـ PDF في مكان واحد، داخل متصفحك",
    en: "Every PDF tool you need, right in your browser",
  },
  nav_dashboard: { ar: "لوحة التحكم", en: "Dashboard" },
  nav_viewer: { ar: "العارض والتوقيع", en: "Viewer & Sign" },
  nav_merge: { ar: "دمج الملفات", en: "Merge PDFs" },
  nav_split: { ar: "تقسيم الملف", en: "Split PDF" },
  nav_image: { ar: "صور إلى PDF", en: "Image to PDF" },
  nav_text: { ar: "PDF إلى نص", en: "PDF to Text" },
  tools: { ar: "الأدوات", en: "Tools" },
  language: { ar: "اللغة", en: "Language" },
  theme_dark: { ar: "الوضع الليلي", en: "Dark mode" },
  theme_light: { ar: "الوضع النهاري", en: "Light mode" },
  open_menu: { ar: "فتح القائمة", en: "Open menu" },
  install_app: { ar: "تثبيت التطبيق", en: "Install App" },
  install_ios_hint: {
    ar: "لتثبيت التطبيق: اضغط على زر المشاركة في سفاري، ثم اختر «إضافة إلى الشاشة الرئيسية».",
    en: "To install: tap the Share button in Safari, then choose “Add to Home Screen”.",
  },
  close: { ar: "إغلاق", en: "Close" },

  hero_cta: { ar: "ابدأ الآن", en: "Get started" },
  hero_secondary: { ar: "استعرض الأدوات", en: "Browse tools" },
  privacy_note: {
    ar: "تتم معالجة جميع الملفات محليًا داخل متصفحك — لا يتم رفع أي شيء.",
    en: "All files are processed locally in your browser — nothing is uploaded.",
  },

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
