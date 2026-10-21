import { ArabicHomeContent } from "./home-content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/",
  locale: "ar",
  absoluteTitle: true,
  title: "كورلوجيك سيستمز | برمجيات مخصصة وأتمتة بالذكاء الاصطناعي",
  description:
    "نصمم ونبني أنظمة الأعمال وتطبيقات الويب والجوال وحلول الأتمتة بالذكاء الاصطناعي، من الفكرة حتى التشغيل والدعم للأعمال النامية.",
});

export default function ArabicHomePage() {
  return <ArabicHomeContent />;
}
