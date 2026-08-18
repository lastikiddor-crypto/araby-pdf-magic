import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/FileDrop";
import { useI18n } from "@/lib/i18n";

const PdfWorkspace = lazy(() => import("@/components/PdfWorkspace"));

export const Route = createFileRoute("/viewer")({
  head: () => ({
    meta: [
      { title: "عارض PDF والتوقيع الإلكتروني — SmartPDF Studio" },
      {
        name: "description",
        content: "اعرض ملفات PDF، كبّر وتنقّل بين الصفحات، وأضف توقيعك الإلكتروني والملاحظات والتظليل.",
      },
      { property: "og:title", content: "PDF Viewer & E-Signature — SmartPDF Studio" },
      {
        property: "og:description",
        content: "View, zoom, annotate and electronically sign PDF documents in your browser.",
      },
    ],
  }),
  component: ViewerPage,
});

function ViewerPage() {
  const { t } = useI18n();
  return (
    <AppLayout>
      <PageHeader title={t("nav_viewer")} description={t("card_sign_desc")} />
      <ClientOnly fallback={<p className="text-sm text-muted-foreground">{t("loading")}</p>}>
        <Suspense fallback={<p className="text-sm text-muted-foreground">{t("loading")}</p>}>
          <PdfWorkspace />
        </Suspense>
      </ClientOnly>
    </AppLayout>
  );
}
