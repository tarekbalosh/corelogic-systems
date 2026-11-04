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
    demoLink: "https://account-systems.vercel.app/",
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
    title: { en: "Student Visa Management", ar: "نظام إدارة الطلاب والتأشيرات" },
    category: { en: "Travel & Education Agencies", ar: "مكاتب سياحية وخدمات طلابية" },
    image: "/student_management_dashboard.png",
    tags: {
      en: ["Visas", "Students", "Agencies"],
      ar: ["تأشيرات", "طلاب", "مكاتب سياحية"],
    },
    problem: {
      en: "Agencies struggled with tracking student visa applications, managing paperwork, and communicating with embassies and universities abroad.",
      ar: "صعوبة تتبع طلبات التأشيرات للطلاب وإدارة أوراقهم وتواصل المكاتب السياحية مع السفارات والجامعات في الخارج.",
    },
    solution: {
      en: "An integrated system for agencies to manage student visa applications, track study visa statuses, and streamline travel and study abroad procedures.",
      ar: "نظام متكامل للمكاتب السياحية لإدارة طلبات تأشيرات الطلاب وتتبع حالة الفيز الدراسية وتسهيل إجراءات السفر والدراسة بالخارج.",
    },
    features: {
      en: ["Visa application management", "Study visa status tracking", "Student documents archiving"],
      ar: ["إدارة طلبات التأشيرات", "تتبع حالة الفيز الدراسية", "أرشفة أوراق ومستندات الطلاب"],
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
  {
    slug: "book-ease",
    title: { en: "BookEase", ar: "نظام حجوزات بوك إيز" },
    category: { en: "Scheduling Platform", ar: "منصة حجوزات" },
    image: "/bookease_dashboard.png",
    tags: {
      en: ["Scheduling", "Appointments", "SaaS"],
      ar: ["حجوزات", "مواعيد", "نظام سحابي"],
    },
    problem: {
      en: "Service-based businesses struggled with chaotic booking processes and managing staff schedules.",
      ar: "عانت الشركات الخدمية من عمليات الحجز الفوضوية وإدارة جداول الموظفين.",
    },
    solution: {
      en: "An all-in-one platform to automate bookings, manage staff, and grow revenue with a seamless experience.",
      ar: "منصة شاملة لأتمتة الحجوزات، إدارة الموظفين، وزيادة الإيرادات بتجربة سلسة.",
    },
    features: {
      en: ["Automated scheduling", "Staff management", "Analytics dashboard"],
      ar: ["جدولة آلية", "إدارة الموظفين", "لوحة تحكم تحليلية"],
    },
    technologies: ["React", "Next.js", "Tailwind CSS"],
    result: {
      en: "TODO: verified results (metrics to be provided)",
      ar: "TODO: نتائج موثقة (المقاييس قيد التوفير)",
    },
    demoLink: "https://book-ease-red.vercel.app/",
  },
  {
    slug: "hospital-management",
    title: { en: "Hospital Management System", ar: "نظام إدارة المستشفيات" },
    category: { en: "Healthcare", ar: "رعاية صحية" },
    image: "/hospital-management.jpg",
    tags: {
      en: ["Healthcare", "Management", "SaaS", "Full-Stack"],
      ar: ["رعاية صحية", "إدارة", "نظام سحابي", "فول ستاك"],
    },
    problem: {
      en: "Healthcare facilities faced challenges with fragmented patient records, inefficient appointment scheduling, and disconnected hospital departments.",
      ar: "واجهت المنشآت الطبية تحديات تشتت سجلات المرضى وعدم كفاءة جدولة المواعيد وغياب الترابط بين أقسام المستشفى.",
    },
    solution: {
      en: "A comprehensive full-stack healthcare management platform with dynamic dashboards, appointment scheduling, and patient records.",
      ar: "منصة شاملة لإدارة الرعاية الصحية متكاملة مع لوحات تحكم تفاعلية، جدولة المواعيد، وسجلات المرضى.",
    },
    features: {
      en: [
        "Dynamic analytics and operational dashboards",
        "Patient records & electronic health data",
        "Appointment scheduling & doctor calendars",
        "Billing, pharmacy, and inventory tracking",
      ],
      ar: [
        "لوحات تحكم تحليلية وعملياتية تفاعلية",
        "سجلات المرضى والبيانات الصحية الإلكترونية",
        "جدولة المواعيد وتقويم الأطباء",
        "تتبع الفواتير والصيدلية والمخزون الطبي",
      ],
    },
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL"],
    result: {
      en: "TODO: metrics such as reduction in patient wait time or scheduling efficiency",
      ar: "TODO: مقاييس مثل تقليل وقت انتظار المرضى أو كفاءة الجدولة",
    },
    demoLink: "https://hospital-management-nine-delta.vercel.app/",
    demoNote: {
      en: "Live interactive healthcare portal with real-time metrics and multilingual support",
      ar: "بوابة رعاية صحية تفاعلية مباشرة مع مؤشرات فورية ودعم متعدد اللغات",
    },
  },
];
