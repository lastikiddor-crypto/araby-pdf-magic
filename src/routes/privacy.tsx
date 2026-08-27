import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

import { AppLayout } from "@/components/AppLayout";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "سياسة الخصوصية — SmartPDF Studio" },
      {
        name: "description",
        content:
          "سياسة الخصوصية لتطبيق SmartPDF Studio: كيفية التعامل مع ملفاتك وبياناتك.",
      },
      { property: "og:title", content: "سياسة الخصوصية — SmartPDF Studio" },
      {
        property: "og:description",
        content: "تعرّف على كيفية تعامل SmartPDF Studio مع ملفاتك وبياناتك.",
      },
      { property: "og:type", content: "article" },
      {
        property: "og:url",
        content: "https://araby-pdf-magic.lovable.app/privacy",
      },
    ],
    links: [
      { rel: "canonical", href: "https://araby-pdf-magic.lovable.app/privacy" },
    ],
  }),
});

function Section({
  titleAr,
  titleEn,
  children,
}: {
  titleAr: string;
  titleEn: string;
  children: React.ReactNode;
}) {
  const [ar, en] = Array.isArray(children) ? children : [children, null];
  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <h2 className="text-lg font-bold text-foreground">{titleAr}</h2>
      <div className="mt-2 space-y-2 text-sm leading-7 text-muted-foreground">{ar}</div>
      <div dir="ltr" className="mt-5 border-t border-border pt-4 text-left">
        <h3 className="text-base font-semibold text-foreground">{titleEn}</h3>
        <div className="mt-2 space-y-2 text-sm leading-6 text-muted-foreground">{en}</div>
      </div>
    </section>
  );
}

function PrivacyPage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-start gap-4">
          <span className="brand-gradient flex size-12 shrink-0 items-center justify-center rounded-2xl text-primary-foreground">
            <ShieldCheck className="size-6" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-foreground">سياسة الخصوصية</h1>
            <p className="mt-1 text-sm text-muted-foreground">Privacy Policy — SmartPDF Studio</p>
            <p className="mt-1 text-xs text-muted-foreground">
              آخر تحديث: 27 أغسطس 2026 · Last updated: August 27, 2026
            </p>
          </div>
        </div>

        <Section
          titleAr="١. الملفات التي تعالجها"
          titleEn="1. Files you process"
        >
          <p>
            تتم معالجة جميع ملفات PDF والصور التي تختارها داخل جهازك. لا يتم رفع ملفاتك إلى أي
            خادم خارجي، ولا نقوم بتخزينها أو مشاركتها مع أي طرف ثالث. بمجرد إغلاق الصفحة أو
            تحديثها يتم حذف الملفات من ذاكرة المتصفح تلقائيًا.
          </p>
          <p>
            All PDF files and images you select are processed on your own device. Your files are
            not uploaded to any external server, and we do not store or share them with third
            parties. Files are removed from browser memory when you close or refresh the page.
          </p>
        </Section>

        <Section
          titleAr="٢. البيانات التي نجمعها"
          titleEn="2. Data we collect"
        >
          <p>
            لا نجمع أي معلومات شخصية مثل الاسم أو البريد الإلكتروني أو الموقع الجغرافي. التطبيق
            لا يتطلب إنشاء حساب أو تسجيل دخول. يتم حفظ تفضيلاتك (اللغة والوضع الليلي) محليًا على
            جهازك فقط باستخدام التخزين المحلي للمتصفح.
          </p>
          <p>
            We do not collect any personal information such as your name, email, or location. The
            app does not require an account or sign-in. Your preferences (language and dark mode)
            are stored locally on your device only, using the browser's local storage.
          </p>
        </Section>

        <Section
          titleAr="٣. الإعلانات"
          titleEn="3. Advertising"
        >
          <p>
            قد يعرض التطبيق إعلانات مقدمة من خدمات خارجية مثل Google AdMob. قد تستخدم هذه الخدمات
            ملفات تعريف الارتباط ومعرّفات الجهاز لعرض إعلانات مناسبة وقياس أدائها، وذلك وفق
            سياسات الخصوصية الخاصة بها. يمكنك التحكم في تخصيص الإعلانات من إعدادات جهازك.
          </p>
          <p>
            The app may display ads provided by third-party services such as Google AdMob. These
            services may use cookies and device identifiers to serve and measure ads, in
            accordance with their own privacy policies. You can control ad personalization from
            your device settings.
          </p>
        </Section>

        <Section
          titleAr="٤. أذونات الجهاز"
          titleEn="4. Device permissions"
        >
          <p>
            يطلب التطبيق فقط إذن الوصول إلى الملفات التي تختارها بنفسك من أجل معالجتها. لا نصل
            إلى جهات الاتصال أو الكاميرا أو الموقع أو أي بيانات أخرى على جهازك.
          </p>
          <p>
            The app only requests access to the files you explicitly choose in order to process
            them. We do not access your contacts, camera, location, or any other data on your
            device.
          </p>
        </Section>

        <Section
          titleAr="٥. خصوصية الأطفال"
          titleEn="5. Children's privacy"
        >
          <p>
            التطبيق غير موجه للأطفال دون سن 13 عامًا، ولا نجمع عن علم أي بيانات شخصية من الأطفال.
          </p>
          <p>
            The app is not directed at children under 13, and we do not knowingly collect any
            personal data from children.
          </p>
        </Section>

        <Section
          titleAr="٦. التغييرات على هذه السياسة"
          titleEn="6. Changes to this policy"
        >
          <p>
            قد نقوم بتحديث سياسة الخصوصية من وقت لآخر، وسيتم نشر أي تغييرات على هذه الصفحة مع
            تحديث تاريخ «آخر تحديث» أعلاه.
          </p>
          <p>
            We may update this privacy policy from time to time. Any changes will be posted on
            this page with the "Last updated" date revised above.
          </p>
        </Section>

        <Section
          titleAr="٧. تواصل معنا"
          titleEn="7. Contact us"
        >
          <p>
            إذا كانت لديك أي أسئلة حول سياسة الخصوصية، يمكنك التواصل مع مطوّر التطبيق عبر صفحة
            المشروع.
          </p>
          <p>
            If you have any questions about this privacy policy, you can contact the app developer
            through the project page.
          </p>
        </Section>
      </div>
    </AppLayout>
  );
}
