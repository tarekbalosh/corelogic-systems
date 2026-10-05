import React from "react";
import { ParticleBackground } from "@/components/particle-background";

export default function PrivacyPolicyArabic() {
  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-hidden font-arabic" dir="rtl">
      <ParticleBackground />
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24 text-right">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">سياسة الخصوصية</h1>
        <div className="space-y-6 text-foreground/80 leading-relaxed text-lg">
          <p>
            في <strong>كورلوجيك سيستمز (CoreLogic Systems)</strong>، نلتزم بحماية خصوصية عملائنا ومستخدمي موقعنا. توضح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك الشخصية.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">1. المعلومات التي نجمعها</h2>
          <p>
            قد نقوم بجمع بعض المعلومات الأساسية عند زيارتك لموقعنا أو التواصل معنا، مثل الاسم، البريد الإلكتروني، ورقم الهاتف، وذلك لتقديم خدماتنا بشكل أفضل والرد على استفساراتك.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">2. كيف نستخدم معلوماتك</h2>
          <p>
            تُستخدم المعلومات التي نجمعها للتواصل معك بخصوص مشاريعك، تحسين تجربة المستخدم على موقعنا، وتقديم دعم فني أو استشارات مخصصة بناءً على طلبك. لا نقوم ببيع أو تأجير معلوماتك لأي طرف ثالث.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">3. أمان البيانات</h2>
          <p>
            نحن نتخذ كافة التدابير الأمنية المعقولة والمناسبة لحماية بياناتك من الوصول غير المصرح به أو التعديل أو الإفصاح. خوادمنا وأنظمتنا محمية بتقنيات أمان حديثة.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">4. التغييرات على هذه السياسة</h2>
          <p>
            نحتفظ بالحق في تحديث أو تعديل سياسة الخصوصية هذه في أي وقت. أي تغييرات سيتم نشرها على هذه الصفحة، وننصحك بمراجعتها بشكل دوري.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">5. تواصل معنا</h2>
          <p>
            إذا كان لديك أي أسئلة أو استفسارات حول سياسة الخصوصية الخاصة بنا، لا تتردد في التواصل معنا عبر صفحة "اتصل بنا" أو البريد الإلكتروني.
          </p>
        </div>
      </div>
    </div>
  );
}
