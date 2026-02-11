"use client";

import Link from "next/link";
import { UserPlus, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const OPTIONS = [
  {
    href: "/registro/alta",
    icon: UserPlus,
    title: "Alta nueva",
    description: "Quiero darme de alta como nuevo socio",
  },
  {
    href: "/registro/renovacion",
    icon: RefreshCw,
    title: "Renovación",
    description: "Ya soy socio y quiero renovar mi registro",
  },
] as const;

export function RegistrationEntry() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {OPTIONS.map(({ href, icon: Icon, title, description }) => (
        <Link key={href} href={href}>
          <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
            <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
              <Icon className="size-10 text-primary" />
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="text-sm text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
