"use client";

import React from "react";
import Link from "next/link";
import { NeonButton } from "@/components/neon-button";

export default function ArabicWebDevPage() {
    return (
        <div className="bg-background min-h-screen text-foreground overflow-hidden py-40 px-6 text-center">
            <h1 className="text-4xl font-bold mb-6">تطوير مواقع الويب المخصصة</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-foreground/70">
                نحن متخصصون في بناء مواقع ويب تفاعلية وقابلة للتوسع للشركات الناشئة والمؤسسات الكبيرة في السعودية، الإمارات، وماليزيا.
            </p>
            <Link href="/ar/contact">
                <NeonButton size="lg" variant="primary">اطلب استشارة مجانية</NeonButton>
            </Link>
        </div>
    );
}
