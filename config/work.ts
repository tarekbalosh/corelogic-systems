export type LocalizedText = {
  en: string;
  de: string;
  ar: string;
};

export type LocalizedList = {
  en: string[];
  de: string[];
  ar: string[];
};

export type Project = {
  slug: string;
  title: LocalizedText;
  category: LocalizedText;
  metaDescription: LocalizedText;
  image: string;
  secondaryImages?: { src: string; alt: LocalizedText }[];
  tags: LocalizedList;
  problem: LocalizedText;
  solution: LocalizedText;
  features: LocalizedList;
  technologies: string[];
  result: LocalizedText;
  demoLink?: string;
  demoNote?: LocalizedText;
};

export const projectsData: Project[] = [
  {
    slug: "accounting-pro",
    title: {
      en: "Accounting Pro",
      de: "Accounting Pro",
      ar: "نظام المحاسبة الاحترافي",
    },
    category: {
      en: "Financial System",
      de: "Finanzsystem",
      ar: "نظام مالي",
    },
    metaDescription: {
      en: "Case study: Accounting Pro — a centralized financial dashboard uniting restaurant POS transactions, inventory tracking, and automated tax reporting.",
      de: "Fallstudie Accounting Pro: Zentrales Finanz-Dashboard zur Verbindung von POS-Transaktionen, Warenwirtschaft und automatisiertem Steuer-Reporting.",
      ar: "دراسة حالة نظام المحاسبة الاحترافي: لوحة مالية مركزية تدمج معاملات نقاط البيع وتتبع المخزون والتقارير الضريبية الآلية للمطاعم.",
    },
    image: "/accounting_pro_dashboard.png",
    tags: {
      en: ["Accounting", "Restaurant", "Financial"],
      de: ["Buchhaltung", "Gastronomie", "Finanzen"],
      ar: ["محاسبة", "مطاعم", "مالي"],
    },
    problem: {
      en: "Restaurants struggled with manual accounting and inventory tracking, leading to errors and delays.",
      de: "Gastronomiebetriebe hatten mit manueller Buchhaltung und Bestandsführung zu kämpfen, was zu Fehlern und Verzögerungen führte.",
      ar: "عانت المطاعم من تتبع المحاسبة والمخزون يدويًا، مما أدى إلى أخطاء وتأخيرات.",
    },
    solution: {
      en: "We developed a centralized financial dashboard integrating POS transactions and inventory management.",
      de: "Wir haben ein zentrales Finanz-Dashboard entwickelt, das POS-Transaktionen und Warenwirtschaft zusammenführt (auf Wunsch für mehrere Währungen inkl. EUR konfigurierbar).",
      ar: "قمنا بتطوير لوحة تحكم مالية مركزية تدمج معاملات نقاط البيع وإدارة المخزون.",
    },
    features: {
      en: [
        "Real-time synchronization",
        "Automated tax calculation",
        "Detailed financial reporting",
      ],
      de: [
        "Echtzeit-Synchronisation",
        "Automatisierte Steuerberechnung",
        "Detailliertes Finanz-Reporting",
      ],
      ar: ["مزامنة في الوقت الفعلي", "حساب ضريبي آلي", "تقارير مالية مفصلة"],
    },
    technologies: ["React", "Node.js", "PostgreSQL", "Tailwind CSS"],
    result: {
      en: "Delivered by CoreLogic Systems as a unified financial administration suite connecting POS sales, inventory movements, automated tax calculations, and structured financial reports in one web application.",
      de: "Entwickelt von CoreLogic Systems als einheitliche Finanzanwendung, die POS-Umsätze, Bestandsbewegungen, automatisierte Steuerberechnungen und strukturierte Finanzberichte zentral bündelt.",
      ar: "طُوّر بواسطة CoreLogic Systems كمنظومة مالية موحدة تربط مبيعات نقاط البيع وحركة المخزون والحسابات الضريبية الآلية والتقارير المالية المفصلة في تطبيق ويب واحد.",
    },
    demoLink: "https://account-systems.vercel.app/",
  },
  {
    slug: "pos-system",
    title: {
      en: "POS System project",
      de: "POS-Kassensystem",
      ar: "نظام نقاط البيع",
    },
    category: {
      en: "Restaurant POS",
      de: "Gastronomie-POS",
      ar: "نقاط بيع المطاعم",
    },
    metaDescription: {
      en: "Case study: Tablet-optimized restaurant POS system with kitchen display integration, table management, and offline-capable order processing.",
      de: "Fallstudie POS-Kassensystem: Tablet-optimierte Gastronomie-Software mit Küchendisplay, Tischverwaltung und zuverlässigem Offline-Modus.",
      ar: "دراسة حالة نظام نقاط البيع للمطاعم: تطبيق محسن للأجهزة اللوحية مع شاشة المطبخ وإدارة الطاولات والعمل دون اتصال.",
    },
    image: "/pos_system_dashboard.png",
    tags: {
      en: ["POS", "Restaurant"],
      de: ["POS", "Gastronomie"],
      ar: ["نقاط البيع", "مطاعم"],
    },
    problem: {
      en: "Slow order processing and miscommunication between front-of-house and kitchen.",
      de: "Langsame Bestellabwicklung und Missverständnisse zwischen Service und Küche.",
      ar: "بطء معالجة الطلبات وسوء التواصل بين الواجهة الأمامية والمطبخ.",
    },
    solution: {
      en: "A tablet-optimized POS system with kitchen display integration and offline capabilities.",
      de: "Ein für Tablets optimiertes POS-System mit Küchendisplay-Anbindung und Offline-Fähigkeit.",
      ar: "نظام نقاط بيع محسن للأجهزة اللوحية مع دمج شاشة المطبخ وإمكانيات العمل دون اتصال.",
    },
    features: {
      en: ["Offline mode", "Kitchen display system", "Table management"],
      de: ["Offline-Modus", "Küchendisplay-System", "Tischverwaltung"],
      ar: ["وضع عدم الاتصال", "نظام عرض المطبخ", "إدارة الطاولات"],
    },
    technologies: ["Next.js", "Supabase", "Prisma"],
    result: {
      en: "Delivered by CoreLogic Systems as a tablet-first restaurant POS covering order entry, live kitchen display synchronization, table status tracking, and offline resilience.",
      de: "Entwickelt von CoreLogic Systems als Tablet-orientiertes Gastronomie-POS für Bestellaufnahme, direkte Küchendisplay-Anbindung, Tischverwaltung und stabilen Offline-Betrieb.",
      ar: "طُوّر بواسطة CoreLogic Systems كنظام نقاط بيع مخصص للأجهزة اللوحية يغطي إدخال الطلبات ومزامنة شاشة المطبخ وإدارة الطاولات والعمل المستمر دون اتصال.",
    },
    demoLink: "https://system-pos-resturant.vercel.app/pos",
  },
  {
    slug: "student-management",
    title: {
      en: "Student Visa Management",
      de: "Studierenden- & Visaverwaltung",
      ar: "نظام إدارة الطلاب والتأشيرات",
    },
    category: {
      en: "Travel & Education Agencies",
      de: "Reise- & Bildungsagenturen",
      ar: "مكاتب سياحية وخدمات طلابية",
    },
    metaDescription: {
      en: "Case study: Student Visa Management platform for education agencies to track study visa statuses, manage applications, and archive documents.",
      de: "Fallstudie Studierenden- & Visaverwaltung: Individuelle Software für Agenturen zur Antragsverfolgung, Statusübersicht und Dokumentenarchivierung.",
      ar: "دراسة حالة نظام إدارة الطلاب والتأشيرات: منصة متكاملة للمكاتب السياحية والطلابية لتتبع طلبات الفيزا وأرشفة المستندات.",
    },
    image: "/student_management_dashboard.png",
    tags: {
      en: ["Visas", "Students", "Agencies"],
      de: ["Visa", "Studierende", "Agenturen"],
      ar: ["تأشيرات", "طلاب", "مكاتب سياحية"],
    },
    problem: {
      en: "Agencies struggled with tracking student visa applications, managing paperwork, and communicating with embassies and universities abroad.",
      de: "Agenturen hatten Schwierigkeiten, Studienvisa-Anträge nachzuverfolgen, Unterlagen zu verwalten und die Abstimmung mit Botschaften sowie Hochschulen im Ausland zu koordinieren.",
      ar: "صعوبة تتبع طلبات التأشيرات للطلاب وإدارة أوراقهم وتواصل المكاتب السياحية مع السفارات والجامعات في الخارج.",
    },
    solution: {
      en: "An integrated system for agencies to manage student visa applications, track study visa statuses, and streamline travel and study abroad procedures.",
      de: "Ein integriertes System für Agenturen zur Verwaltung von Studienvisa-Anträgen, Statusverfolgung und digitalen Dokumentenarchivierung.",
      ar: "نظام متكامل للمكاتب السياحية لإدارة طلبات تأشيرات الطلاب وتتبع حالة الفيز الدراسية وتسهيل إجراءات السفر والدراسة بالخارج.",
    },
    features: {
      en: [
        "Visa application management",
        "Study visa status tracking",
        "Student documents archiving",
      ],
      de: [
        "Verwaltung von Visumanträgen",
        "Statusverfolgung für Studienvisa",
        "Strukturierte Archivierung von Studierendenunterlagen",
      ],
      ar: [
        "إدارة طلبات التأشيرات",
        "تتبع حالة الفيز الدراسية",
        "أرشفة أوراق ومستندات الطلاب",
      ],
    },
    technologies: ["Vue.js", "Express", "MongoDB"],
    result: {
      en: "Built by CoreLogic Systems as an agency operations workspace covering student intake, visa stage tracking, embassy coordination notes, and structured document archiving.",
      de: "Entwickelt von CoreLogic Systems als zentrales Verwaltungssystem für Agenturen mit Studierendenaufnahme, Visastatus-Verfolgung, Kommunikationsnotizen und digitalem Dokumentenarchiv.",
      ar: "طُوّر بواسطة CoreLogic Systems كمنصة تشغيل مركزية للمكاتب تغطي تسجيل الطلاب وتتبع مراحل التأشيرات وتنسيق المراسلات وأرشفة المستندات الرقمية.",
    },
    demoLink: "https://management-students.vercel.app/dashboard",
  },
  {
    slug: "book-ease",
    title: {
      en: "BookEase",
      de: "BookEase",
      ar: "نظام حجوزات بوك إيز",
    },
    category: {
      en: "Scheduling Platform",
      de: "Terminplattform",
      ar: "منصة حجوزات",
    },
    metaDescription: {
      en: "Case study: BookEase SaaS scheduling platform for service businesses to automate online bookings, manage staff rosters, and view analytics.",
      de: "Fallstudie BookEase: Zentrale SaaS-Terminplattform für Dienstleister zur Automatisierung von Buchungen, Mitarbeiterplanung und Auswertungen.",
      ar: "دراسة حالة منصة حجوزات بوك إيز: منصة سحابية للشركات الخدمية لأتمتة المواعيد وإدارة جداول الموظفين ولوحة التحليلات.",
    },
    image: "/bookease_dashboard.png",
    tags: {
      en: ["Scheduling", "Appointments", "SaaS"],
      de: ["Terminplanung", "Buchungen", "SaaS"],
      ar: ["حجوزات", "مواعيد", "نظام سحابي"],
    },
    problem: {
      en: "Service-based businesses struggled with chaotic booking processes and managing staff schedules.",
      de: "Dienstleistungsunternehmen hatten mit unübersichtlichen Buchungsprozessen und der Koordination von Mitarbeiterplänen zu kämpfen.",
      ar: "عانت الشركات الخدمية من عمليات الحجز الفوضوية وإدارة جداول الموظفين.",
    },
    solution: {
      en: "An all-in-one platform to automate bookings, manage staff, and streamline scheduling with a clear user experience.",
      de: "Eine zentrale Plattform zur Automatisierung von Terminbuchungen, Mitarbeiterplanung und Auswertung über eine übersichtliche Oberfläche.",
      ar: "منصة شاملة لأتمتة الحجوزات، إدارة الموظفين، وتنظيم المواعيد بتجربة سلسة.",
    },
    features: {
      en: ["Automated scheduling", "Staff management", "Analytics dashboard"],
      de: [
        "Automatisierte Terminplanung",
        "Mitarbeiterverwaltung",
        "Analyse-Dashboard",
      ],
      ar: ["جدولة آلية", "إدارة الموظفين", "لوحة تحكم تحليلية"],
    },
    technologies: ["React", "Next.js", "Tailwind CSS"],
    result: {
      en: "Delivered by CoreLogic Systems as a modular SaaS scheduling application combining online booking flows, staff availability management, and an operational analytics dashboard.",
      de: "Entwickelt von CoreLogic Systems als modulare SaaS-Terminplattform mit Online-Buchungsstrecke, Mitarbeiter-Einsatzplanung und übersichtlichem Analyse-Dashboard.",
      ar: "طُوّر بواسطة CoreLogic Systems كتطبيق حجز سحابي معياري يجمع بين مسارات الحجز الإلكتروني وإدارة توفر الموظفين ولوحة التحليلات التشغيلية.",
    },
    demoLink: "https://book-ease-red.vercel.app/",
  },
  {
    slug: "hospital-management",
    title: {
      en: "Hospital Management System",
      de: "Krankenhaus- & Klinikverwaltungssystem",
      ar: "نظام إدارة المستشفيات والعيادات",
    },
    category: {
      en: "Healthcare",
      de: "Gesundheitswesen",
      ar: "الرعاية الصحية",
    },
    metaDescription: {
      en: "Case study: Full-stack Hospital Management System with patient & doctor records, shift scheduling, pharmacy stock alerts, and billing.",
      de: "Fallstudie Klinikverwaltungssystem: Full-Stack-Software für Patientenakten, Arzt-Dienstpläne, Apothekenbestand und Abrechnung mit Rollenrechten.",
      ar: "دراسة حالة نظام إدارة المستشفيات والعيادات: منصة متكاملة لسجلات المرضى والأطباء والوصفات الطبية ومخزون الصيدلية والفوترة.",
    },
    image: "/projects/hospital-management.jpg",
    tags: {
      en: ["Healthcare", "Management", "SaaS", "Full-Stack"],
      de: ["Gesundheitswesen", "Verwaltung", "SaaS", "Full-Stack"],
      ar: ["الرعاية الصحية", "إدارة المستشفيات", "نظام سحابي", "فول ستاك"],
    },
    problem: {
      en: "Healthcare facilities faced challenges with fragmented patient records, inefficient appointment scheduling, manual pharmacy stock tracking, and disconnected hospital departments.",
      de: "Gesundheitseinrichtungen standen vor der Herausforderung verteilter Patientenakten, ineffizienter Terminplanung, manueller Apotheken-Bestandsführung und isolierter Abteilungen.",
      ar: "واجهت المنشآت الطبية تحديات تشتت سجلات المرضى وعدم كفاءة جدولة المواعيد وتتبع مخزون الصيدلية يدويًا وغياب الترابط بين أقسام المستشفى.",
    },
    solution: {
      en: "A comprehensive full-stack healthcare management platform featuring real-time operational analytics, patient & doctor records, pharmacy inventory alerts, and billing.",
      de: "Eine umfassende Full-Stack-Verwaltungsplattform für Kliniken mit Echtzeit-Betriebsauswertungen, Patienten- und Arztverwaltung, Apotheken-Bestandswarnungen und Abrechnung – datenschutzfreundlich konzipiert mit rollenbasierten Zugriffsrechten (für neue Projekte auf Wunsch DSGVO-konform umsetzbar).",
      ar: "منصة سحابية متكاملة لإدارة المستشفيات والمراكز الطبية، تضم لوحة تحكم تحليلية فورية، إدارة المرضى والأطباء، الوصفات الطبية، الصيدلية، والفواتير.",
    },
    features: {
      en: [
        "Dynamic analytics, monthly revenue & appointment status dashboards",
        "Patient records, medical prescriptions, doctor shifts & scheduling",
        "Pharmacy medication inventory tracking with low-stock alerts & billing",
        "Executive Dashboard, Patients & Doctors Management, Staff Shifts, Appointments & Prescriptions, Pharmacy & Warehouse Inventory Alerts, and Billing & Notifications",
      ],
      de: [
        "Dynamische Auswertungen zu Monatsumsätzen und Terminstatus",
        "Patientenakten, Verordnungen, Arzt-Schichtpläne und Terminplanung",
        "Medikamentenbestand der Apotheke mit Mindestbestandswarnungen und Abrechnung",
        "Module: Management-Dashboard, Patienten- & Arztverwaltung, Dienstpläne, Termine & Rezepte, Apotheken- & Lagerwarnungen sowie Abrechnung & Benachrichtigungen",
      ],
      ar: [
        "لوحة تحكم تفاعلية للإحصائيات، الإيرادات الشهرية، وحالات المواعيد",
        "إدارة شاملة لسجلات المرضى، الوصفات الطبية، ومناوبات الأطباء",
        "تتبع مخزون الأدوية والصيدلية مع تنبيهات نقص المخزون والفوترة",
        "لوحة التحكم التنفيذية، إدارة المرضى والأطباء، مناوبات الموظفين، المواعيد والوصفات الطبية، تنبيهات الصيدلية والمستودع، والفواتير والإشعارات",
      ],
    },
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Prisma",
    ],
    result: {
      en: "Built by CoreLogic Systems as an end-to-end digital hospital administration suite covering clinical workflows, staff shifts, pharmacy stock, and financial invoicing with role-based access control across key modules: Executive Dashboard, Patients & Doctors Management, Staff Shifts, Appointments & Prescriptions, Pharmacy & Warehouse Inventory Alerts, and Billing & Notifications.",
      de: "Entwickelt von CoreLogic Systems als durchgängige digitale Klinikverwaltungs-Suite für klinische Abläufe, Dienstpläne, Apothekenbestand und Abrechnung mit rollenbasierter Zugriffskontrolle über zentrale Module: Management-Dashboard, Patienten- & Arztverwaltung, Schichtpläne, Termine & Rezepte, Apotheken- & Lagerwarnungen sowie Abrechnung & Benachrichtigungen.",
      ar: "تم تطويره بواسطة CoreLogic Systems كمنظومة رقمية متكاملة لإدارة المستشفيات (مستشفى الرعاية) تغطي المسارات السريرية، ومناوبات الموظفين، ومخزون الصيدلية، والفوترة المالية مع نظام صلاحيات متعدد الأدوار عبر وحدات رئيسية تشمل: لوحة التحكم التنفيذية، إدارة المرضى والأطباء، مناوبات الموظفين، المواعيد والوصفات الطبية، تنبيهات مخزون الصيدلية والمستودع، والفواتير والإشعارات.",
    },
    demoLink: "https://hospital-management-nine-delta.vercel.app/login",
    demoNote: {
      en: "Live interactive healthcare administration suite with role-based access and real-time hospital analytics",
      de: "Interaktive Live-Vorschau der Klinikverwaltung mit rollenbasiertem Zugriff und Echtzeit-Auswertungen",
      ar: "معاينة حية لمنظومة إدارة المستشفيات (مستشفى الرعاية) مع صلاحيات متعددة الأدوار وتحليلات فورية",
    },
  },
  {
    slug: "car-rental-platform",
    title: {
      en: "Car Rental Platform",
      de: "Mietwagen-Plattform",
      ar: "منصة تأجير السيارات",
    },
    category: {
      en: "Automotive",
      de: "Mobilität & Fahrzeuge",
      ar: "تأجير السيارات",
    },
    metaDescription: {
      en: "Case study: Responsive Car Rental Platform featuring fast vehicle category filtering, transparent daily pricing, and multi-language booking.",
      de: "Fallstudie Mietwagen-Plattform: Responsives Webdesign mit schneller Fahrzeugfilterung, transparenter Preisübersicht und mehrsprachiger Buchung.",
      ar: "دراسة حالة منصة تأجير السيارات: واجهة رقمية متجاوبة بفلترة سريعة للمركبات وعرض شفاف للأسعار اليومية وتجربة حجز متعددة اللغات.",
    },
    image: "/car-rental-platform.jpg",
    tags: {
      en: ["Automotive", "E-commerce", "UI/UX", "Full-Stack"],
      de: ["Automobil", "E-Commerce", "UI/UX", "Full-Stack"],
      ar: ["سيارات", "تجارة إلكترونية", "واجهة المستخدم", "فول ستاك"],
    },
    problem: {
      en: "Car rental businesses in Malaysia needed a modern, high-converting digital storefront with fast vehicle filtering and frictionless online booking.",
      de: "Autovermietungen in Malaysia benötigten eine moderne digitale Plattform mit schneller Fahrzeugfilterung und reibungsloser Online-Buchung.",
      ar: "احتاجت شركات تأجير السيارات في ماليزيا إلى واجهة رقمية حديثة وعالية التحويل مع فلترة سريعة للمركبات وحجز إلكتروني سلس.",
    },
    solution: {
      en: "A modern, high-performance car rental platform built for the Malaysian market, featuring an elegant UI/UX, advanced filtering, and seamless booking capabilities.",
      de: "Eine performante Mietwagen-Plattform für den malaysischen Markt mit klarem UI/UX, detaillierter Fahrzeugfilterung und übersichtlichem Buchungsablauf (Architektur für weitere Märkte und mehrere Währungen inkl. EUR erweiterbar).",
      ar: "منصة حديثة وعالية الأداء لتأجير السيارات مصممة للسوق الماليزي، تتميز بواجهة مستخدم أنيقة وفلاتر بحث متقدمة ونظام حجز سلس.",
    },
    features: {
      en: [
        "Advanced vehicle search and category filtering",
        "Transparent MYR daily pricing and specifications",
        "Seamless multi-language booking experience",
        "Responsive luxury automotive UI/UX design",
      ],
      de: [
        "Erweiterte Fahrzeugsuche und Kategoriefilter",
        "Transparente Tagespreise (im Originalprojekt in MYR; mehrere Währungen inkl. EUR umsetzbar) und Fahrzeugdaten",
        "Mehrsprachiger Buchungsablauf",
        "Responsives, modernes UI/UX-Design",
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
      en: "Designed and built by CoreLogic Systems as a responsive digital rental storefront combining fleet browsing, category and specification filtering, transparent daily rates, and multi-language booking.",
      de: "Konzipiert und entwickelt von CoreLogic Systems als responsive Mietwagen-Plattform mit Flottenübersicht, Kategorie- und Ausstattungsfiltern, transparenter Tagespreisdarstellung und mehrsprachigem Buchungsablauf.",
      ar: "صُممت وطُوّرت بواسطة CoreLogic Systems كمنصة تأجير سيارات متجاوبة تجمع بين استعراض الأسطول والفلترة حسب الفئة والمواصفات والأسعار الشفافة وتجربة الحجز متعددة اللغات.",
    },
    demoLink: "https://cars-alrayees.vercel.app/en",
    demoNote: {
      en: "Live interactive car rental platform with fleet browsing and filtering",
      de: "Interaktive Live-Demo der Mietwagen-Plattform mit Flottenübersicht und Filterfunktion",
      ar: "منصة تأجير سيارات تفاعلية مباشرة مع استعراض الأسطول والفلترة الفورية",
    },
  },
  {
    slug: "corelogic-crm",
    title: {
      en: "Corelogic CRM",
      de: "Corelogic CRM",
      ar: "نظام Corelogic لإدارة علاقات العملاء (CRM)",
    },
    category: {
      en: "Enterprise SaaS",
      de: "Unternehmens-SaaS",
      ar: "برمجيات الأعمال",
    },
    metaDescription: {
      en: "Case study: Corelogic CRM — an enterprise SaaS platform for visual sales pipelines, lead directories, task reminders, and revenue analytics.",
      de: "Fallstudie Corelogic CRM: Individuelle SaaS-Lösung für visuelle Vertriebspipelines, Kontaktverwaltung, Aufgabenplanung und Umsatzanalysen.",
      ar: "دراسة حالة نظام Corelogic CRM: منصة سحابية لتنظيم مسار المبيعات المرئي وإدارة العملاء المحتملين والتذكيرات وتقارير الإيرادات.",
    },
    image: "/projects/corelogic-crm.png",
    tags: {
      en: ["Enterprise SaaS", "CRM", "Sales Pipeline", "Analytics"],
      de: ["Unternehmens-SaaS", "CRM", "Vertriebspipeline", "Analytik"],
      ar: ["برمجيات الأعمال", "إدارة علاقات العملاء", "مسار المبيعات", "تحليلات"],
    },
    problem: {
      en: "Growing businesses struggled to centralize customer data, monitor conversion rates, and manage deals across scattered spreadsheets and disconnected tools.",
      de: "Wachsende Unternehmen hatten Schwierigkeiten, Kundendaten zentral zu pflegen, Abschlussquoten im Blick zu behalten und Verkaufschancen statt in verstreuten Tabellen strukturiert zu steuern.",
      ar: "عانت الشركات النامية من صعوبة توحيد بيانات العملاء ومراقبة معدلات التحويل وإدارة الصفقات عبر جداول البيانات المبعثرة والأدوات غير المترابطة.",
    },
    solution: {
      en: "An all-in-one Customer Relationship Management platform designed to streamline sales pipelines, track leads, and automate daily team tasks.",
      de: "Eine zentrale CRM-Plattform zur Strukturierung von Vertriebspipelines, Lead-Verfolgung und täglichen Teamaufgaben.",
      ar: "منصة متكاملة لإدارة علاقات العملاء مصممة لتنظيم مراحل المبيعات، تتبع العملاء المحتملين، وأتمتة مهام الفريق اليومية.",
    },
    features: {
      en: [
        "Interactive sales pipeline & deal stage tracking",
        "Real-time revenue analytics & lead source reports",
        "Automated task reminders & contact management",
        "Dashboard KPIs, leads & contacts directory, and conversion rate monitoring",
      ],
      de: [
        "Interaktive Vertriebspipeline und Nachverfolgung einzelner Deal-Phasen",
        "Echtzeit-Umsatzauswertungen und Berichte zu Lead-Quellen",
        "Aufgabenerinnerungen und strukturierte Kontaktverwaltung",
        "KPI-Dashboard, Lead- & Kontaktverzeichnis sowie Auswertung der Abschlussquoten",
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
      de: "Entwickelt von CoreLogic Systems, damit wachsende Unternehmen Kundendaten bündeln, Abschlussquoten nachvollziehen und verstreute Tabellen durch zentrale Module ablösen können: KPI-Dashboard, Lead- & Kontaktverzeichnis, Deals & visuelle Vertriebspipeline, Aufgabenverwaltung mit Fälligkeitserinnerungen sowie Auswertungen.",
      ar: "تم تطويره بواسطة CoreLogic Systems لمساعدة الشركات النامية على توحيد بيانات العملاء، ومراقبة معدلات التحويل، والتخلص من جداول البيانات المبعثرة عبر وحدات متكاملة تشمل: لوحة مؤشرات الأداء، دليل العملاء وجهات الاتصال، إدارة الصفقات ومسار المبيعات المرئي، إدارة المهام مع التذكيرات، والتقارير التحليلية.",
    },
    demoLink: "https://corelogic-crm.vercel.app/",
    demoNote: {
      en: "Live interactive CRM dashboard with sample leads, visual deal pipeline, and revenue analytics",
      de: "Interaktive Live-Demo des Corelogic CRM-Dashboards mit Beispieldaten, visueller Pipeline und Auswertungen",
      ar: "معاينة حية تفاعلية للوحة تحكم CRM مع بيانات تجريبية للعملاء ومسار الصفقات وتحليلات الإيرادات",
    },
  },
  {
    slug: "alrayees-trading",
    title: {
      en: "Al Rayees Trading Platform",
      de: "Al Rayees Trading Platform",
      ar: "منصة الريس للتجارة الدولية",
    },
    category: {
      en: "Global Trading",
      de: "Internationaler Handel",
      ar: "التجارة الدولية",
    },
    metaDescription: {
      en: "Case study: Al Rayees Trading Platform — B2B commodity catalog and Request-a-Quote (RFQ) PWA built for international agricultural trade.",
      de: "Fallstudie Al Rayees Trading Platform: B2B-Handelsplattform mit Rohstoffkatalog, strukturierter RFQ-Angebotsanfrage und PWA-Architektur.",
      ar: "دراسة حالة منصة الريس للتجارة الدولية: كتالوج سلع أساسية للشركات ونظام طلب عروض أسعار B2B وتطبيق ويب تقدمي PWA.",
    },
    image: "/projects/alrayees-trading.jpg",
    tags: {
      en: ["Global Trading", "B2B", "Commodities", "PWA"],
      de: ["Internationaler Handel", "B2B", "Rohstoffe", "PWA"],
      ar: ["التجارة الدولية", "أعمال لأعمال", "سلع أساسية", "تطبيق ويب تقدمي"],
    },
    problem: {
      en: "Al Rayees SDN BHD needed a corporate digital presence to showcase 200+ commodity product lines across 50+ international markets and streamline B2B quote inquiries.",
      de: "Al Rayees SDN BHD benötigte einen professionellen digitalen Unternehmensauftritt zur Präsentation von über 200 Rohstoff-Produktlinien für internationale Märkte sowie einen strukturierten B2B-Anfrageprozess.",
      ar: "احتاجت شركة Al Rayees SDN BHD إلى حضور رقمي مؤسسي عالمي المستوى لاستعراض أكثر من 200 خط إنتاج من السلع الأساسية عبر أكثر من 50 سوقًا دوليًا وتسهيل طلبات عروض الأسعار للشركات.",
    },
    solution: {
      en: "A corporate global commodity trading platform for Al Rayees SDN BHD, showcasing agricultural products, vegetable oils, and international quote workflows.",
      de: "Eine B2B-Handelsplattform für Al Rayees SDN BHD zur Darstellung von Agrarprodukten, pflanzlichen Ölen und strukturierten internationalen Angebotsanfragen (RFQ).",
      ar: "منصة رقمية متكاملة لشركة Al Rayees SDN BHD للتجارة العالمية، تستعرض السلع الزراعية والزيوت النباتية ونظام طلب عروض الأسعار للشركات.",
    },
    features: {
      en: [
        "Interactive global commodity & product catalog",
        "Streamlined B2B Request-a-Quote (RFQ) workflow",
        "High-performance responsive design & PWA capabilities",
        "Product lines showcase (Cotton, Rice, Palm Oil, Raw Sugar), corporate trust metrics & instant WhatsApp integration",
      ],
      de: [
        "Interaktiver Produkt- und Rohstoffkatalog",
        "Strukturierter B2B-Angebotsanfrage-Workflow (RFQ)",
        "Performantes responsives Design mit PWA-Funktionen",
        "Übersicht der Produktlinien (Baumwolle, Reis, Palmöl, Rohzucker) sowie direkte WhatsApp- und Kontaktanbindung",
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
      en: "Designed and developed by CoreLogic Systems for Malaysia-based global trading corporation Al Rayees SDN BHD to establish a digital presence across 50+ international markets, featuring a Product Lines Showcase (Cotton, Rice, Palm Oil, Raw Sugar), B2B Quote Request System, and Instant WhatsApp/Contact Integration.",
      de: "Konzipiert und entwickelt von CoreLogic Systems für das in Malaysia ansässige Handelsunternehmen Al Rayees SDN BHD zur digitalen Präsentation in internationalen Märkten – inklusive Produktlinien-Katalog (Baumwolle, Reis, Palmöl, Rohzucker), B2B-Angebotsanfrage-System und direkter WhatsApp-/Kontaktanbindung.",
      ar: "تم تصميمها وتطويرها بواسطة CoreLogic Systems لشركة التجارة العالمية الماليزية Al Rayees SDN BHD لتأسيس حضور رقمي عالمي المستوى يخدم أكثر من 50 سوقًا دوليًا، مع استعراض شامل لخطوط المنتجات (القطن، الأرز، زيت النخيل، السكر الخام)، ونظام طلب عروض الأسعار للشركات (B2B)، ومؤشرات الثقة المؤسسية، والتكامل الفوري مع واتساب.",
    },
    demoLink: "https://alrayees.vercel.app/",
    demoNote: {
      en: "Explore the live Al Rayees SDN BHD global commodity trading platform, interactive product catalog, and B2B RFQ system",
      de: "Live-Vorschau der Handelsplattform von Al Rayees SDN BHD mit Produktkatalog und B2B-RFQ-Anfrage",
      ar: "معاينة حية لمنصة الريس للتجارة الدولية واستعراض كتالوج السلع الأساسية ونظام طلب عروض الأسعار للشركات",
    },
  },
  {
    slug: "consultation-booking",
    title: {
      en: "Consultation Booking Platform",
      de: "Plattform für Beratungsbuchungen",
      ar: "منصة حجز الاستشارات وإدارة المواعيد",
    },
    category: {
      en: "Booking & Scheduling",
      de: "Buchung & Terminplanung",
      ar: "أنظمة الحجز والمواعيد",
    },
    metaDescription: {
      en: "Case study: Consultation Booking Platform with 3-step client booking, temporary slot holds, admin approval controls, and WhatsApp alerts.",
      de: "Fallstudie Beratungsbuchungen: Mehrsprachige Buchungsplattform mit 3-Schritte-Assistent, Admin-Freigabe sowie WhatsApp- und E-Mail-Alerts.",
      ar: "دراسة حالة منصة حجز الاستشارات: نظام حجز من 3 خطوات مع حجز مؤقت للمواعيد واعتماد إداري وإشعارات واتساب والبريد.",
    },
    image: "/projects/consultation-booking.jpg",
    secondaryImages: [
      {
        src: "/projects/consultation-booking-admin.png",
        alt: {
          en: "Admin Overview & Analytics Dashboard",
          de: "Admin-Übersicht & Analyse-Dashboard",
          ar: "لوحة تحكم الإدارة والتحليلات الشاملة",
        },
      },
    ],
    tags: {
      en: ["Booking & Scheduling", "Consultations", "Bilingual", "Full-Stack"],
      de: ["Terminbuchung", "Beratung", "Mehrsprachig", "Full-Stack"],
      ar: ["أنظمة الحجز والمواعيد", "استشارات", "ثنائي اللغة", "فول ستاك"],
    },
    problem: {
      en: "Consultancies and advisory firms needed a bilingual booking system with temporary slot holds, manual admin approval gates, and multi-channel session delivery without double-bookings.",
      de: "Beratungsunternehmen benötigten ein mehrsprachiges Buchungssystem mit temporärer Terminreservierung, manueller Freigabe durch das Team und verschiedenen Gesprächskanälen ohne Doppelbuchungen.",
      ar: "احتاجت مكاتب الاستشارات إلى نظام حجز ثنائي اللغة يدعم حجز المواعيد المؤقت، واعتماد الإدارة اليدوي للطلبات، وتعدد قنوات التواصل دون تضارب في المواعيد.",
    },
    solution: {
      en: "A bilingual consultation booking and scheduling system featuring a 3-step client booking flow, admin approval workflows, and WhatsApp/Google Meet integration.",
      de: "Ein mehrsprachiges Buchungs- und Terminverwaltungssystem mit dreistufigem Kunden-Buchungsprozess, Admin-Freigabe-Workflow und Anbindung an WhatsApp und Google Meet.",
      ar: "نظام ثنائي اللغة لحجز وإدارة الاستشارات، يتميز بخطوات حجز سلسة للعملاء، لوحة تحكم إدارية لاعتماد المواعيد، وتكامل مع واتساب و Google Meet.",
    },
    features: {
      en: [
        "3-step consultation booking with dynamic pricing (MYR)",
        "Admin dashboard with calendar, availability & approval controls",
        "Instant WhatsApp & Email notifications with booking status tracking",
        "3-Step Client Booking Wizard, Order Summary & Live Booking Status Tracker, Admin Overview Analytics, Availability & Service Manager, and Audit/Booking Logs",
      ],
      de: [
        "Dreistufiger Buchungsablauf (im Originalprojekt in MYR; für neue Projekte mehrwährungsfähig inkl. EUR umsetzbar)",
        "Admin-Dashboard mit Kalender-, Verfügbarkeits- und Freigabesteuerung",
        "Automatische WhatsApp- und E-Mail-Benachrichtigungen mit Live-Statusverfolgung",
        "Module: 3-Schritte-Buchungsassistent, Übersicht & Status-Tracker, Admin-Auswertungen, Verfügbarkeits- & Leistungsverwaltung sowie Buchungsprotokolle",
      ],
      ar: [
        "مسار حجز من 3 خطوات مع تسعير مرن ومواعيد بتوقيت كوالالمبور",
        "لوحة تحكم إدارية شاملة لإدارة التوفر، التقويم، واعتماد الطلبات",
        "إشعارات فورية عبر واتساب والبريد الإلكتروني مع تتبع حالة الطلب",
        "معالج حجز للعملاء من 3 خطوات، ملخص الطلب وتتبع الحالة الفوري، تحليلات الإدارة الشاملة، إدارة الخدمات والتوفر، وسجلات التدقيق والحجوزات",
      ],
    },
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "PostgreSQL",
      "Prisma",
    ],
    result: {
      en: "Engineered by CoreLogic Systems as a complete end-to-end appointment and consultation management solution supporting multiple consultation modes (Google Meet, WhatsApp Audio, Direct Call) and manual admin verification workflows across key modules: 3-Step Client Booking Wizard, Order Summary & Live Booking Status Tracker, Admin Overview Analytics, Availability & Service Manager, and Audit/Booking Logs.",
      de: "Entwickelt von CoreLogic Systems als durchgängige Lösung für Termin- und Beratungsmanagement mit mehreren Gesprächskanälen (Google Meet, WhatsApp-Audio, Direktanruf) und manueller Freigabe über zentrale Module: 3-Schritte-Buchungsassistent, Übersicht & Live-Status-Tracker, Admin-Auswertungen, Verfügbarkeits- & Leistungsverwaltung sowie Buchungsprotokolle.",
      ar: "تم تطويره بواسطة CoreLogic Systems كحل متكامل لإدارة المواعيد والاستشارات يدعم قنوات استشارة متعددة (Google Meet، مكالمة واتساب الصوتية، اتصال مباشر) ومسارات التحقق والاعتماد اليدوي من الإدارة عبر وحدات رئيسية تشمل: معالج حجز العملاء من 3 خطوات، ملخص الطلب وتتبع الحالة الفوري، تحليلات الإدارة الشاملة، إدارة التوفر والخدمات، وسجلات التدقيق والحجوزات.",
    },
    demoLink: "https://booking-systembro.vercel.app/en",
    demoNote: {
      en: "Explore the live bilingual consultation booking wizard, status tracker, and scheduling flow",
      de: "Live-Vorschau des mehrsprachigen Beratungsbuchungs-Assistenten mit Statusverfolgung und Terminplanung",
      ar: "معاينة حية لمعالج حجز الاستشارات ثنائي اللغة وتتبع حالة الحجز وجدولة المواعيد",
    },
  },
  {
    slug: "shoplink-storefront",
    title: {
      en: "ShopLink WhatsApp Storefront",
      de: "ShopLink WhatsApp-Storefront",
      ar: "منصة ShopLink للمتاجر والطلب عبر واتساب",
    },
    category: {
      en: "E-Commerce",
      de: "E-Commerce",
      ar: "التجارة الإلكترونية",
    },
    metaDescription: {
      en: "Case study: ShopLink WhatsApp Storefront — digital product catalog with interactive cart drawer and one-click structured WhatsApp orders.",
      de: "Fallstudie ShopLink Storefront: Digitaler Produktkatalog mit interaktivem Warenkorb-Drawer und strukturierter Direktbestellung per WhatsApp.",
      ar: "دراسة حالة منصة ShopLink: كتالوج منتجات رقمي مع سلة تسوق جانبية تفاعلية وإرسال طلبات منظمة مباشرة عبر واتساب.",
    },
    image: "/projects/shoplink-storefront.jpg",
    tags: {
      en: ["E-Commerce", "WhatsApp Ordering", "Digital Catalog", "Retail"],
      de: ["E-Commerce", "WhatsApp-Bestellung", "Digitaler Katalog", "Einzelhandel"],
      ar: ["التجارة الإلكترونية", "الطلب عبر واتساب", "كتالوج رقمي", "تجزئة"],
    },
    problem: {
      en: "Local shops, cafes, and bakeries struggled with manual order taking over chat and costly third-party delivery commissions, needing a fast digital storefront that sends structured orders straight to WhatsApp.",
      de: "Lokale Geschäfte, Cafés und Bäckereien hatten mit manueller Bestellaufnahme im Chat und hohen Plattformgebühren zu kämpfen und suchten einen schnellen digitalen Katalog mit strukturierter Bestellung über WhatsApp.",
      ar: "عانت المتاجر المحلية والمقاهي والمخابز من استقبال الطلبات يدويًا عبر المحادثات وارتفاع عمولات تطبيقات التوصيل، مما استدعى واجهة متجر رقمية سريعة ترسل طلبات منظمة مباشرة إلى واتساب.",
    },
    solution: {
      en: "A modern digital product catalog and ordering storefront that lets local shops and bakeries showcase menus, manage carts, and receive instant orders directly via WhatsApp.",
      de: "Ein digitaler Produktkatalog mit Bestelloberfläche, über den Geschäfte und Bäckereien ihr Sortiment präsentieren, Warenkörbe berechnen und strukturierte Bestellungen direkt per WhatsApp erhalten.",
      ar: "متجر إلكتروني وكتالوج منتجات رقمي عصري يتيح للمتاجر والمخابز عرض قوائمها وإدارة سلة المشتريات واستقبال الطلبات مباشرة عبر واتساب.",
    },
    features: {
      en: [
        "Interactive category filtering & real-time product search",
        "Slide-over shopping cart with automatic MYR subtotal calculation",
        "One-click WhatsApp order checkout without payment gateway friction",
        "Category Tabs (Breads, Pastries, Cakes, Drinks), Live Availability Indicators, Interactive Slide-Over Cart Drawer, and Direct WhatsApp Order Formatting",
      ],
      de: [
        "Interaktive Kategoriefilter und Echtzeit-Produktsuche",
        "Seitlicher Warenkorb mit automatischer Zwischensumme (im Demo-System in MYR; mehrere Währungen inkl. EUR umsetzbar)",
        "Bestellabschluss mit einem Klick direkt an WhatsApp",
        "Kategorie-Tabs, Live-Verfügbarkeitsanzeige, interaktiver Warenkorb-Drawer und strukturierte WhatsApp-Bestellnachricht",
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
      de: "Entwickelt von CoreLogic Systems für Geschäfte, Cafés und Bäckereien als schneller Online-Katalog, in dem Kundinnen und Kunden Artikel auswählen, Mengen anpassen und strukturierte Bestellübersichten direkt an das WhatsApp-Konto des Anbieters senden – mit Kategorie-Tabs, Live-Verfügbarkeit, interaktivem Warenkorb-Drawer und automatischer Bestellformatierung.",
      ar: "تم تطويرها بواسطة CoreLogic Systems لتمكين المتاجر والمقاهي والمخابز من امتلاك كتالوج رقمي سريع وسلس يتيح للعملاء تصفح المنتجات وتعديل الكميات وإرسال ملخصات طلبات منظمة مباشرة إلى واتساب التاجر، مع تبويبات الفئات، ومؤشرات التوفر الفوري، وسلة التسوق الجانبية التفاعلية، وتنسيق الطلب المباشر.",
    },
    demoLink: "https://shope-link.vercel.app/",
    demoNote: {
      en: "Explore the live ShopLink Bakery storefront, interactive slide-over cart drawer, and one-click WhatsApp checkout",
      de: "Live-Vorschau der ShopLink Bakery Storefront mit interaktivem Warenkorb-Drawer und direktem WhatsApp-Bestellabschluss",
      ar: "معاينة حية لواجهة متجر ShopLink Bakery وسلة التسوق الجانبية التفاعلية وإرسال الطلب عبر واتساب",
    },
  },
];
