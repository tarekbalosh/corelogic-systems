import { ArrowRight, Monitor, Smartphone, Globe, Code, ArrowLeft } from "lucide-react";

export type Project = {
  slug: string;
  title: { en: string; ar: string };
  category: { en: string; ar: string };
  image: string;
  secondaryImages?: { src: string; alt: { en: string; ar: string } }[];
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
    title: {
      en: "Hospital Management System",
      ar: "نظام إدارة المستشفيات والعيادات",
    },
    category: { en: "Healthcare", ar: "الرعاية الصحية" },
    image: "/projects/hospital-management.jpg",
    tags: {
      en: ["Healthcare", "Management", "SaaS", "Full-Stack"],
      ar: ["الرعاية الصحية", "إدارة المستشفيات", "نظام سحابي", "فول ستاك"],
    },
    problem: {
      en: "Healthcare facilities faced challenges with fragmented patient records, inefficient appointment scheduling, manual pharmacy stock tracking, and disconnected hospital departments.",
      ar: "واجهت المنشآت الطبية تحديات تشتت سجلات المرضى وعدم كفاءة جدولة المواعيد وتتبع مخزون الصيدلية يدويًا وغياب الترابط بين أقسام المستشفى.",
    },
    solution: {
      en: "A comprehensive full-stack healthcare management platform featuring real-time operational analytics, patient & doctor records, pharmacy inventory alerts, and billing.",
      ar: "منصة سحابية متكاملة لإدارة المستشفيات والمراكز الطبية، تضم لوحة تحكم تحليلية فورية، إدارة المرضى والأطباء، الوصفات الطبية، الصيدلية، والفواتير.",
    },
    features: {
      en: [
        "Dynamic analytics, monthly revenue & appointment status dashboards",
        "Patient records, medical prescriptions, doctor shifts & scheduling",
        "Pharmacy medication inventory tracking with low-stock alerts & billing",
        "Executive Dashboard, Patients & Doctors Management, Staff Shifts, Appointments & Prescriptions, Pharmacy & Warehouse Inventory Alerts, and Billing & Notifications",
      ],
      ar: [
        "لوحة تحكم تفاعلية للإحصائيات، الإيرادات الشهرية، وحالات المواعيد",
        "إدارة شاملة لسجلات المرضى، الوصفات الطبية، ومناوبات الأطباء",
        "تتبع مخزون الأدوية والصيدلية مع تنبيهات نقص المخزون والفوترة",
        "لوحة التحكم التنفيذية، إدارة المرضى والأطباء، مناوبات الموظفين، المواعيد والوصفات الطبية، تنبيهات الصيدلية والمستودع، والفواتير والإشعارات",
      ],
    },
    technologies: ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Prisma"],
    result: {
      en: "Built by CoreLogic Systems as an end-to-end digital hospital administration suite (مستشفى الرعاية) covering clinical workflows, staff shifts, pharmacy stock, and financial invoicing with role-based access control across key modules: Executive Dashboard, Patients & Doctors Management, Staff Shifts, Appointments & Prescriptions, Pharmacy & Warehouse Inventory Alerts, and Billing & Notifications.",
      ar: "تم تطويره بواسطة CoreLogic Systems كمنظومة رقمية متكاملة لإدارة المستشفيات (مستشفى الرعاية) تغطي المسارات السريرية، ومناوبات الموظفين، ومخزون الصيدلية، والفوترة المالية مع نظام صلاحيات متعدد الأدوار عبر وحدات رئيسية تشمل: لوحة التحكم التنفيذية، إدارة المرضى والأطباء، مناوبات الموظفين، المواعيد والوصفات الطبية، تنبيهات مخزون الصيدلية والمستودع، والفواتير والإشعارات.",
    },
    demoLink: "https://hospital-management-nine-delta.vercel.app/login",
    demoNote: {
      en: "Live interactive healthcare administration suite with role-based access and real-time hospital analytics",
      ar: "معاينة حية لمنظومة إدارة المستشفيات (مستشفى الرعاية) مع صلاحيات متعددة الأدوار وتحليلات فورية",
    },
  },
  {
    slug: "car-rental-platform",
    title: { en: "Car Rental Platform", ar: "منصة تأجير السيارات" },
    category: { en: "Automotive", ar: "تأجير السيارات" },
    image: "/car-rental-platform.jpg",
    tags: {
      en: ["Automotive", "E-commerce", "UI/UX", "Full-Stack"],
      ar: ["سيارات", "تجارة إلكترونية", "واجهة المستخدم", "فول ستاك"],
    },
    problem: {
      en: "Car rental businesses in Malaysia needed a modern, high-converting digital storefront with fast vehicle filtering and frictionless online booking.",
      ar: "احتاجت شركات تأجير السيارات في ماليزيا إلى واجهة رقمية حديثة وعالية التحويل مع فلترة سريعة للمركبات وحجز إلكتروني سلس.",
    },
    solution: {
      en: "A modern, high-performance car rental platform built for the Malaysian market, featuring an elegant UI/UX, advanced filtering, and seamless booking capabilities.",
      ar: "منصة حديثة وعالية الأداء لتأجير السيارات مصممة للسوق الماليزي، تتميز بواجهة مستخدم أنيقة وفلاتر بحث متقدمة ونظام حجز سلس.",
    },
    features: {
      en: [
        "Advanced vehicle search and category filtering",
        "Transparent MYR daily pricing and specifications",
        "Seamless multi-language booking experience",
        "Responsive luxury automotive UI/UX design",
      ],
      ar: [
        "بحث متقدم عن المركبات وفلترة حسب الفئة والمواصفات",
        "عرض شفاف للأسعار اليومية والمواصفات الفنية",
        "تجربة حجز سلسة تدعم تعدد اللغات",
        "تصميم واجهة مستخدم عصري ومتجاوب",
      ],
    },
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    result: {
      en: "TODO: metrics such as booking conversion rate or page load speed",
      ar: "TODO: مقاييس مثل معدل تحويل الحجوزات أو سرعة تحميل الصفحة",
    },
    demoLink: "https://cars-alrayees.vercel.app/en",
    demoNote: {
      en: "Live interactive car rental platform with fleet browsing and filtering",
      ar: "منصة تأجير سيارات تفاعلية مباشرة مع استعراض الأسطول والفلترة الفورية",
    },
  },
  {
    slug: "corelogic-crm",
    title: {
      en: "Corelogic CRM",
      ar: "نظام Corelogic لإدارة علاقات العملاء (CRM)",
    },
    category: { en: "Enterprise SaaS", ar: "برمجيات الأعمال" },
    image: "/projects/corelogic-crm.png",
    tags: {
      en: ["Enterprise SaaS", "CRM", "Sales Pipeline", "Analytics"],
      ar: ["برمجيات الأعمال", "إدارة علاقات العملاء", "مسار المبيعات", "تحليلات"],
    },
    problem: {
      en: "Growing businesses struggled to centralize customer data, monitor conversion rates, and manage deals across scattered spreadsheets and disconnected tools.",
      ar: "عانت الشركات النامية من صعوبة توحيد بيانات العملاء ومراقبة معدلات التحويل وإدارة الصفقات عبر جداول البيانات المبعثرة والأدوات غير المترابطة.",
    },
    solution: {
      en: "An all-in-one Customer Relationship Management platform designed to streamline sales pipelines, track leads, and automate daily team tasks.",
      ar: "منصة متكاملة لإدارة علاقات العملاء مصممة لتنظيم مراحل المبيعات، تتبع العملاء المحتملين، وأتمتة مهام الفريق اليومية.",
    },
    features: {
      en: [
        "Interactive sales pipeline & deal stage tracking",
        "Real-time revenue analytics & lead source reports",
        "Automated task reminders & contact management",
        "Dashboard KPIs, leads & contacts directory, and conversion rate monitoring",
      ],
      ar: [
        "تتبع تفاعلي لمراحل الصفقات ومسار المبيعات (Pipeline)",
        "تقارير فورية لتحليل الإيرادات ومصادر العملاء",
        "إدارة جهات الاتصال والتذكير الذكي بالمهام اليومية",
        "لوحة مؤشرات الأداء الرئيسية ودليل العملاء ومراقبة معدلات التحويل",
      ],
    },
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    result: {
      en: "Built by CoreLogic Systems to help growing businesses centralize customer data, monitor conversion rates, and eliminate scattered spreadsheets across key modules: Dashboard KPIs, Leads & Contacts Directory, Deals & Visual Sales Pipeline, Task Management with Due-Date Reminders, and Analytical Reports.",
      ar: "تم تطويره بواسطة CoreLogic Systems لمساعدة الشركات النامية على توحيد بيانات العملاء، ومراقبة معدلات التحويل، والتخلص من جداول البيانات المبعثرة عبر وحدات متكاملة تشمل: لوحة مؤشرات الأداء، دليل العملاء وجهات الاتصال، إدارة الصفقات ومسار المبيعات المرئي، إدارة المهام مع التذكيرات، والتقارير التحليلية.",
    },
    demoLink: "https://corelogic-crm.vercel.app/",
    demoNote: {
      en: "Live interactive CRM dashboard with sample leads, visual deal pipeline, and revenue analytics",
      ar: "معاينة حية تفاعلية للوحة تحكم CRM مع بيانات تجريبية للعملاء ومسار الصفقات وتحليلات الإيرادات",
    },
  },
  {
    slug: "alrayees-trading",
    title: {
      en: "Al Rayees Trading Platform",
      ar: "منصة الريس للتجارة الدولية",
    },
    category: { en: "Global Trading", ar: "التجارة الدولية" },
    image: "/projects/alrayees-trading.jpg",
    tags: {
      en: ["Global Trading", "B2B", "Commodities", "PWA"],
      ar: ["التجارة الدولية", "أعمال لأعمال", "سلع أساسية", "تطبيق ويب تقدمي"],
    },
    problem: {
      en: "Al Rayees SDN BHD needed a world-class corporate digital presence to showcase 200+ commodity product lines across 50+ international markets and streamline B2B quote inquiries.",
      ar: "احتاجت شركة Al Rayees SDN BHD إلى حضور رقمي مؤسسي عالمي المستوى لاستعراض أكثر من 200 خط إنتاج من السلع الأساسية عبر أكثر من 50 سوقًا دوليًا وتسهيل طلبات عروض الأسعار للشركات.",
    },
    solution: {
      en: "A corporate global commodity trading platform for Al Rayees SDN BHD, showcasing agricultural products, vegetable oils, and international quote workflows.",
      ar: "منصة رقمية متكاملة لشركة Al Rayees SDN BHD للتجارة العالمية، تستعرض السلع الزراعية والزيوت النباتية ونظام طلب عروض الأسعار للشركات.",
    },
    features: {
      en: [
        "Interactive global commodity & product catalog",
        "Streamlined B2B Request-a-Quote (RFQ) workflow",
        "High-performance responsive design & PWA capabilities",
        "Product lines showcase (Cotton, Rice, Palm Oil, Raw Sugar), corporate trust metrics & instant WhatsApp integration",
      ],
      ar: [
        "كتالوج تفاعلي متكامل للمنتجات والسلع الدولية",
        "نظام مبسط وسريع لطلب عروض الأسعار (RFQ) للشركات",
        "تصميم متجاوب عالي الأداء يدعم تقنيات تطبيقات الويب التقدمية (PWA)",
        "عرض خطوط المنتجات (القطن، الأرز، زيت النخيل، السكر الخام) ومؤشرات الموثوقية والتواصل الفوري عبر واتساب",
      ],
    },
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "PWA"],
    result: {
      en: "Designed and developed by CoreLogic Systems for Malaysia-based global trading corporation Al Rayees SDN BHD to establish a world-class digital presence across 50+ international markets, featuring a Product Lines Showcase (Cotton, Rice, Palm Oil, Raw Sugar), B2B Quote Request System, Corporate Trust Metrics, and Instant WhatsApp/Contact Integration.",
      ar: "تم تصميمها وتطويرها بواسطة CoreLogic Systems لشركة التجارة العالمية الماليزية Al Rayees SDN BHD لتأسيس حضور رقمي عالمي المستوى يخدم أكثر من 50 سوقًا دوليًا، مع استعراض شامل لخطوط المنتجات (القطن، الأرز، زيت النخيل، السكر الخام)، ونظام طلب عروض الأسعار للشركات (B2B)، ومؤشرات الثقة المؤسسية، والتكامل الفوري مع واتساب.",
    },
    demoLink: "https://alrayees.vercel.app/",
    demoNote: {
      en: "Explore the live Al Rayees SDN BHD global commodity trading platform, interactive product catalog, and B2B RFQ system",
      ar: "معاينة حية لمنصة الريس للتجارة الدولية واستعراض كتالوج السلع الأساسية ونظام طلب عروض الأسعار للشركات",
    },
  },
  {
    slug: "consultation-booking",
    title: {
      en: "Consultation Booking Platform",
      ar: "منصة حجز الاستشارات وإدارة المواعيد",
    },
    category: { en: "Booking & Scheduling", ar: "أنظمة الحجز والمواعيد" },
    image: "/projects/consultation-booking.jpg",
    secondaryImages: [
      {
        src: "/projects/consultation-booking-admin.png",
        alt: {
          en: "Admin Overview & Analytics Dashboard",
          ar: "لوحة تحكم الإدارة والتحليلات الشاملة",
        },
      },
    ],
    tags: {
      en: ["Booking & Scheduling", "Consultations", "Bilingual", "Full-Stack"],
      ar: ["أنظمة الحجز والمواعيد", "استشارات", "ثنائي اللغة", "فول ستاك"],
    },
    problem: {
      en: "Consultancies and advisory firms needed a bilingual booking system with temporary slot holds, manual admin approval gates, and multi-channel session delivery without double-bookings.",
      ar: "احتاجت مكاتب الاستشارات إلى نظام حجز ثنائي اللغة يدعم حجز المواعيد المؤقت، واعتماد الإدارة اليدوي للطلبات، وتعدد قنوات التواصل دون تضارب في المواعيد.",
    },
    solution: {
      en: "A bilingual consultation booking and scheduling system featuring a 3-step client booking flow, admin approval workflows, and WhatsApp/Google Meet integration.",
      ar: "نظام ثنائي اللغة لحجز وإدارة الاستشارات، يتميز بخطوات حجز سلسة للعملاء، لوحة تحكم إدارية لاعتماد المواعيد، وتكامل مع واتساب و Google Meet.",
    },
    features: {
      en: [
        "3-step consultation booking with dynamic pricing (MYR)",
        "Admin dashboard with calendar, availability & approval controls",
        "Instant WhatsApp & Email notifications with booking status tracking",
        "3-Step Client Booking Wizard, Order Summary & Live Booking Status Tracker, Admin Overview Analytics, Availability & Service Manager, and Audit/Booking Logs",
      ],
      ar: [
        "مسار حجز من 3 خطوات مع تسعير مرن ومواعيد بتوقيت كوالالمبور",
        "لوحة تحكم إدارية شاملة لإدارة التوفر، التقويم، واعتماد الطلبات",
        "إشعارات فورية عبر واتساب والبريد الإلكتروني مع تتبع حالة الطلب",
        "معالج حجز للعملاء من 3 خطوات، ملخص الطلب وتتبع الحالة الفوري، تحليلات الإدارة الشاملة، إدارة الخدمات والتوفر، وسجلات التدقيق والحجوزات",
      ],
    },
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "PostgreSQL", "Prisma"],
    result: {
      en: "Engineered by CoreLogic Systems as a complete end-to-end appointment and consultation management solution supporting multiple consultation modes (Google Meet, WhatsApp Audio, Direct Call) and manual admin verification workflows across key modules: 3-Step Client Booking Wizard, Order Summary & Live Booking Status Tracker, Admin Overview Analytics, Availability & Service Manager, and Audit/Booking Logs.",
      ar: "تم تطويره بواسطة CoreLogic Systems كحل متكامل لإدارة المواعيد والاستشارات يدعم قنوات استشارة متعددة (Google Meet، مكالمة واتساب الصوتية، اتصال مباشر) ومسارات التحقق والاعتماد اليدوي من الإدارة عبر وحدات رئيسية تشمل: معالج حجز العملاء من 3 خطوات، ملخص الطلب وتتبع الحالة الفوري، تحليلات الإدارة الشاملة، إدارة التوفر والخدمات، وسجلات التدقيق والحجوزات.",
    },
    demoLink: "https://booking-systembro.vercel.app/en",
    demoNote: {
      en: "Explore the live bilingual consultation booking wizard, status tracker, and scheduling flow",
      ar: "معاينة حية لمعالج حجز الاستشارات ثنائي اللغة وتتبع حالة الحجز وجدولة المواعيد",
    },
  },
  {
    slug: "shoplink-storefront",
    title: {
      en: "ShopLink WhatsApp Storefront",
      ar: "منصة ShopLink للمتاجر والطلب عبر واتساب",
    },
    category: { en: "E-Commerce", ar: "التجارة الإلكترونية" },
    image: "/projects/shoplink-storefront.jpg",
    tags: {
      en: ["E-Commerce", "WhatsApp Ordering", "Digital Catalog", "Retail"],
      ar: ["التجارة الإلكترونية", "الطلب عبر واتساب", "كتالوج رقمي", "تجزئة"],
    },
    problem: {
      en: "Local shops, cafes, and bakeries struggled with manual order taking over chat and costly third-party delivery commissions, needing a fast digital storefront that sends structured orders straight to WhatsApp.",
      ar: "عانت المتاجر المحلية والمقاهي والمخابز من استقبال الطلبات يدويًا عبر المحادثات وارتفاع عمولات تطبيقات التوصيل، مما استدعى واجهة متجر رقمية سريعة ترسل طلبات منظمة مباشرة إلى واتساب.",
    },
    solution: {
      en: "A modern digital product catalog and ordering storefront that lets local shops and bakeries showcase menus, manage carts, and receive instant orders directly via WhatsApp.",
      ar: "متجر إلكتروني وكتالوج منتجات رقمي عصري يتيح للمتاجر والمخابز عرض قوائمها وإدارة سلة المشتريات واستقبال الطلبات مباشرة عبر واتساب.",
    },
    features: {
      en: [
        "Interactive category filtering & real-time product search",
        "Slide-over shopping cart with automatic MYR subtotal calculation",
        "One-click WhatsApp order checkout without payment gateway friction",
        "Category Tabs (Breads, Pastries, Cakes, Drinks), Live Availability Indicators, Interactive Slide-Over Cart Drawer, and Direct WhatsApp Order Formatting",
      ],
      ar: [
        "تصفية تفاعلية حسب الفئات وبحث فوري عن المنتجات",
        "سلة تسوق جانبية ذكية مع حساب تلقائي للمجموع بالرينغيت الماليزي (MYR)",
        "إتمام وإرسال الطلب بضغطة زر عبر واتساب دون تعقيدات الدفع",
        "تبويبات الفئات (المخبوزات، المعجنات، الكيك، المشروبات)، مؤشرات التوفر الفوري، سلة التسوق الجانبية التفاعلية، وتنسيق الطلب المباشر عبر واتساب",
      ],
    },
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    result: {
      en: "Built by CoreLogic Systems to empower retail shops, cafes, and bakeries with a fast, frictionless online catalog where customers browse items, adjust quantities, and send structured order summaries straight to the merchant's WhatsApp — featuring Category Tabs (Breads, Pastries, Cakes, Drinks), Live Availability Indicators, Interactive Slide-Over Cart Drawer, and Direct WhatsApp Order Formatting.",
      ar: "تم تطويرها بواسطة CoreLogic Systems لتمكين المتاجر والمقاهي والمخابز من امتلاك كتالوج رقمي سريع وسلس يتيح للعملاء تصفح المنتجات وتعديل الكميات وإرسال ملخصات طلبات منظمة مباشرة إلى واتساب التاجر، مع تبويبات الفئات، ومؤشرات التوفر الفوري، وسلة التسوق الجانبية التفاعلية، وتنسيق الطلب المباشر.",
    },
    demoLink: "https://shope-link.vercel.app/",
    demoNote: {
      en: "Explore the live ShopLink Bakery storefront, interactive slide-over cart drawer, and one-click WhatsApp checkout",
      ar: "معاينة حية لواجهة متجر ShopLink Bakery وسلة التسوق الجانبية التفاعلية وإرسال الطلب عبر واتساب",
    },
  },
];
