import { ArrowRight, Monitor, Smartphone, Globe, Code, ArrowLeft } from "lucide-react";

export type Project = {
  slug: string;
  title: { en: string; ar: string };
  category: { en: string; ar: string };
  image: string;
  tags: { en: string[]; ar: string[] };
  problem: { en: string; ar: string };
  solution: { en: string; ar: string };
  features: { en: string[]; ar: string[] };
  technologies: string[];
  result: { en: string; ar: string };
  demoLink?: string;
  demoNote?: { en: string; ar: string };
};

export const projectsData: Project[] = [
  {
    slug: "accounting-pro",
    title: { en: "Accounting Pro", ar: "نظام المحاسبة الاحترافي" },
    category: { en: "Financial System", ar: "نظام مالي" },
    image: "/accounting_pro_dashboard.png",
    tags: {
      en: ["Accounting", "Restaurant", "Financial"],
      ar: ["محاسبة", "مطاعم", "مالي"],
    },
    problem: {
      en: "Restaurants struggled with manual accounting and inventory tracking, leading to errors and delays.",
      ar: "عانت المطاعم من تتبع المحاسبة والمخزون يدويًا، مما أدى إلى أخطاء وتأخيرات.",
    },
    solution: {
      en: "We developed a centralized financial dashboard integrating POS transactions and inventory management.",
      ar: "قمنا بتطوير لوحة تحكم مالية مركزية تدمج معاملات نقاط البيع وإدارة المخزون.",
    },
    features: {
      en: ["Real-time synchronization", "Automated tax calculation", "Detailed financial reporting"],
      ar: ["مزامنة في الوقت الفعلي", "حساب ضريبي آلي", "تقارير مالية مفصلة"],
    },
    technologies: ["React", "Node.js", "PostgreSQL", "Tailwind CSS"],
    result: {
      en: "TODO: metrics such as time saved or error reduction",
      ar: "TODO: مقاييس مثل الوقت الموفر أو تقليل الأخطاء",
    },
    demoLink: "https://account-systems.vercel.app/login",
    demoNote: {
      en: "TODO: Provide demo credentials to access",
      ar: "TODO: توفير بيانات الاعتماد للوصول التجريبي",
    },
  },
  {
    slug: "pos-system",
    title: { en: "POS System project", ar: "نظام نقاط البيع" },
    category: { en: "Restaurant POS", ar: "نقاط بيع المطاعم" },
    image: "/pos_system_dashboard.png",
    tags: {
      en: ["POS", "Restaurant"],
      ar: ["نقاط البيع", "مطاعم"],
    },
    problem: {
      en: "Slow order processing and miscommunication between front-of-house and kitchen.",
      ar: "بطء معالجة الطلبات وسوء التواصل بين الواجهة الأمامية والمطبخ.",
    },
    solution: {
      en: "A tablet-optimized POS system with kitchen display integration and offline capabilities.",
      ar: "نظام نقاط بيع محسن للأجهزة اللوحية مع دمج شاشة المطبخ وإمكانيات العمل دون اتصال.",
    },
    features: {
      en: ["Offline mode", "Kitchen display system", "Table management"],
      ar: ["وضع عدم الاتصال", "نظام عرض المطبخ", "إدارة الطاولات"],
    },
    technologies: ["Next.js", "Supabase", "Prisma"],
    result: {
      en: "TODO: metrics such as order speed improvement",
      ar: "TODO: مقاييس مثل تحسن سرعة الطلب",
    },
    demoLink: "https://system-pos-resturant.vercel.app/pos",
    demoNote: {
      en: "TODO: Provide demo credentials to access",
      ar: "TODO: توفير بيانات الاعتماد للوصول التجريبي",
    },
  },
  {
    slug: "student-management",
    title: { en: "Management Student Systems", ar: "نظام إدارة الطلاب" },
    category: { en: "Education", ar: "تعليم" },
    image: "/student_management_dashboard.png",
    tags: {
      en: ["Students", "Management"],
      ar: ["طلاب", "إدارة"],
    },
    problem: {
      en: "Educational institutions relied on fragmented systems for attendance, grades, and communication.",
      ar: "اعتمدت المؤسسات التعليمية على أنظمة مجزأة للحضور والدرجات والتواصل.",
    },
    solution: {
      en: "A unified portal for students, teachers, and parents to access educational records and communicate seamlessly.",
      ar: "بوابة موحدة للطلاب والمعلمين وأولياء الأمور للوصول إلى السجلات التعليمية والتواصل بسلاسة.",
    },
    features: {
      en: ["Gradebook", "Attendance tracking", "Parent portal"],
      ar: ["سجل الدرجات", "تتبع الحضور", "بوابة أولياء الأمور"],
    },
    technologies: ["Vue.js", "Express", "MongoDB"],
    result: {
      en: "TODO: metrics such as administrative time saved",
      ar: "TODO: مقاييس مثل الوقت الإداري الموفر",
    },
    demoLink: "https://management-students.vercel.app/dashboard",
    demoNote: {
      en: "TODO: Provide demo credentials to access",
      ar: "TODO: توفير بيانات الاعتماد للوصول التجريبي",
    },
  },
];
