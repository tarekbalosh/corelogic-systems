import React from "react";
import { ParticleBackground } from "@/components/particle-background";

export default function TermsOfServiceArabic() {
  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-hidden font-arabic" dir="rtl">
      <ParticleBackground />
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24 text-right">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">شروط الخدمة</h1>
        <div className="space-y-6 text-foreground/80 leading-relaxed text-lg">
          <p>
            مرحباً بك في <strong>كورلوجيك سيستمز (CoreLogic Systems)</strong>. باستخدامك لموقعنا وخدماتنا، فإنك توافق على الالتزام بالشروط والأحكام التالية:
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">1. قبول الشروط</h2>
          <p>
            من خلال الوصول إلى هذا الموقع أو استخدام خدماتنا في مجال تطوير البرمجيات والذكاء الاصطناعي، فإنك تقر بقراءتك وفهمك وموافقتك على هذه الشروط بأكملها.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">2. الخدمات المقدمة</h2>
          <p>
            نحن نقدم خدمات تقنية تشمل تصميم المواقع، تطوير التطبيقات، حلول الأتمتة، والذكاء الاصطناعي. قد تخضع بعض المشاريع لاتفاقيات وعقود إضافية منفصلة تفصل نطاق العمل وتسليمه.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">3. الملكية الفكرية</h2>
          <p>
            جميع المحتويات المعروضة على هذا الموقع من نصوص وتصميمات وشعارات مملوكة لشركة كورلوجيك سيستمز ولا يجوز استخدامها أو نسخها دون إذن مسبق. حقوق الملكية الخاصة بالمشاريع المنفذة للعملاء يتم تحديدها وفقاً للعقود المبرمة.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">4. إخلاء المسؤولية</h2>
          <p>
            نسعى دائماً لتقديم خدمات عالية الجودة، إلا أننا لا نقدم ضمانات قاطعة بخلو الموقع أو الخدمات من الأخطاء التقنية العرضية، ولا نتحمل المسؤولية عن أي أضرار غير مباشرة قد تنشأ عن استخدام خدماتنا.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">5. التعديلات على الشروط</h2>
          <p>
            نحتفظ بالحق في تعديل شروط الخدمة هذه في أي وقت. يُعتبر استمرارك في استخدام الموقع بعد أي تعديل بمثابة موافقة منك على الشروط الجديدة.
          </p>
        </div>
      </div>
    </div>
  );
}
