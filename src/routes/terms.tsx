import { createFileRoute } from "@tanstack/react-router";
import { FileWarning } from "lucide-react";

import { AppLayout } from "@/components/AppLayout";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: "إخلاء المسؤولية وشروط الاستخدام — SmartPDF Studio" },
      {
        name: "description",
        content:
          "إخلاء المسؤولية وشروط استخدام تطبيق SmartPDF Studio لمعالجة ملفات PDF.",
      },
      { property: "og:title", content: "إخلاء المسؤولية وشروط الاستخدام — SmartPDF Studio" },
      {
        property: "og:description",
        content: "تعرّف على شروط استخدام SmartPDF Studio وحدود مسؤوليته.",
      },
      { property: "og:type", content: "article" },
      {
        property: "og:url",
        content: "https://araby-pdf-magic.lovable.app/terms",
      },
    ],
    links: [
      { rel: "canonical", href: "https://araby-pdf-magic.lovable.app/terms" },
    ],
  }),
});

function Section({
  titleAr,
  childrenAr,
  titleEn,
  childrenEn,
}: {
  titleAr: string;
  childrenAr: React.ReactNode;
  titleEn: string;
  childrenEn: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <h2 className="text-lg font-bold text-foreground">{titleAr}</h2>
      <div className="mt-2 space-y-2 text-sm leading-7 text-muted-foreground">{childrenAr}</div>
      <div dir="ltr" className="mt-5 border-t border-border pt-4 text-left">
        <h3 className="text-base font-semibold text-foreground">{titleEn}</h3>
        <div className="mt-2 space-y-2 text-sm leading-6 text-muted-foreground">{childrenEn}</div>
      </div>
    </section>
  );
}

function TermsPage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-start gap-4">
          <span className="brand-gradient flex size-12 shrink-0 items-center justify-center rounded-2xl text-primary-foreground">
            <FileWarning className="size-6" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              إخلاء المسؤولية وشروط الاستخدام
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Disclaimer & Terms of Use — SmartPDF Studio
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              آخر تحديث: 27 أغسطس 2026 · Last updated: August 27, 2026
            </p>
          </div>
        </div>

        <Section titleAr="١. طبيعة الخدمة" titleEn="1. Nature of the service">
          <p>
            SmartPDF Studio هو تطبيق مجاني لمعالجة ملفات PDF (عرض، دمج، تقسيم، توقيع، علامة
            مائية، ضغط، وتحويل). يتم توفير التطبيق «كما هو» و«حسب توفره» دون أي ضمانات من أي
            نوع، صريحة أو ضمنية.
          </p>
          <p>
            SmartPDF Studio is a free PDF processing app (viewing, merging, splitting, signing,
            watermarking, compressing, and converting). The app is provided "as is" and "as
            available" without warranties of any kind, express or implied.
          </p>
        </Section>

        <Section titleAr="٢. مسؤوليتك عن ملفاتك" titleEn="2. Your responsibility for your files">
          <p>
            أنت وحدك المسؤول عن الملفات التي تعالجها عبر التطبيق وعن الاحتفاظ بنسخ احتياطية منها.
            ننصحك دائمًا بالاحتفاظ بنسخة من الملف الأصلي قبل أي عملية دمج أو تقسيم أو ضغط أو
            تعديل، فقد تؤدي بعض العمليات (مثل الضغط) إلى تغيير دائم في خصائص الملف.
          </p>
          <p>
            You are solely responsible for the files you process with the app and for keeping
            backups of them. Always keep a copy of the original file before merging, splitting,
            compressing, or editing — some operations (such as compression) may permanently change
            the file's properties.
          </p>
        </Section>

        <Section titleAr="٣. حدود المسؤولية" titleEn="3. Limitation of liability">
          <p>
            لا يتحمل مطوّر التطبيق أي مسؤولية عن أي أضرار مباشرة أو غير مباشرة، بما في ذلك فقدان
            البيانات أو تلف الملفات أو أي خسائر ناتجة عن استخدام التطبيق أو عدم القدرة على
            استخدامه.
          </p>
          <p>
            The app developer shall not be liable for any direct or indirect damages, including
            data loss, file corruption, or any losses arising from the use of, or inability to
            use, the app.
          </p>
        </Section>

        <Section titleAr="٤. التوقيع الإلكتروني" titleEn="4. Electronic signature">
          <p>
            ميزة التوقيع الإلكتروني في التطبيق مخصصة للاستخدام الشخصي والبسيط، وقد لا تُعتبر
            توقيعًا إلكترونيًا معتمدًا قانونيًا في جميع الدول أو لجميع أنواع المستندات. تحقّق من
            المتطلبات القانونية في بلدك قبل الاعتماد عليها في مستندات رسمية.
          </p>
          <p>
            The electronic signature feature is intended for simple, personal use and may not
            qualify as a legally certified electronic signature in all jurisdictions or for all
            document types. Check the legal requirements in your country before relying on it for
            official documents.
          </p>
        </Section>

        <Section titleAr="٥. الاستخدام المقبول" titleEn="5. Acceptable use">
          <p>
            توافق على عدم استخدام التطبيق في أي غرض غير قانوني، أو لمعالجة ملفات تنتهك حقوق
            الملكية الفكرية أو خصوصية الآخرين.
          </p>
          <p>
            You agree not to use the app for any unlawful purpose, or to process files that
            infringe the intellectual property rights or privacy of others.
          </p>
        </Section>

        <Section titleAr="٦. الإعلانات وروابط الأطراف الثالثة" titleEn="6. Ads and third parties">
          <p>
            قد يتضمن التطبيق إعلانات أو محتوى من أطراف ثالثة. لا نتحكم في محتوى أو ممارسات هذه
            الأطراف ولا نتحمل مسؤوليتها.
          </p>
          <p>
            The app may include ads or content from third parties. We do not control, and are not
            responsible for, the content or practices of those third parties.
          </p>
        </Section>

        <Section titleAr="٧. التعديلات على الشروط" titleEn="7. Changes to these terms">
          <p>
            قد نقوم بتعديل هذه الشروط من وقت لآخر، ويُعد استمرارك في استخدام التطبيق بعد نشر
            التعديلات موافقةً عليها.
          </p>
          <p>
            We may modify these terms from time to time. Your continued use of the app after
            changes are posted constitutes acceptance of those changes.
          </p>
        </Section>
      </div>
    </AppLayout>
  );
}
