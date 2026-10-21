import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

// Shared by /services only; each sub-page layout overrides this metadata and adds its own JSON-LD.
const title = "خدمات البرمجة والويب والجوال والذكاء الاصطناعي";
const description = "برمجيات أعمال مخصصة، تطبيقات ويب وجوال، أتمتة بالذكاء الاصطناعي وتصميم UI/UX من كورلوجيك سيستمز. أخبرنا باحتياجك واطلب عرض سعر.";

export const metadata: Metadata = pageMetadata({ path: "/services", locale: "ar", title, description });

export default function ArabicServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>{children}</>
  );
}
