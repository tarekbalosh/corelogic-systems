"use client";

import React from "react";
import Link from "next/link";
import { NeonButton } from "@/components/neon-button";

export default function ArabicMobileDevPage() {
    return (
        <div className="bg-background min-h-screen text-foreground overflow-hidden py-40 px-6 text-center">
            <h1 className="text-4xl font-bold mb-6">تطوير تطبيقات الجوال الاحترافية</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-foreground/70">
                نقدم خدمات تصميم وتطوير تطبيقات الموبايل بأنظمة iOS و Android. نوفر حلولاً مبتكرة لتطبيقات التوصيل والمتاجر الإلكترونية لعملائنا في السعودية والخليج.
            </p>
            <Link href="/ar/contact">
                <NeonButton size="lg" variant="primary">تواصل معنا لمشروعك القادم</NeonButton>
            </Link>
        </div>
    );
}
