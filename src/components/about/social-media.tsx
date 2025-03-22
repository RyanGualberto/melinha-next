"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ExternalLink, Instagram, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { getSettings } from "@/requests/settings";
import { useQuery } from "@tanstack/react-query";

export default function SocialMedia() {
  const { data: storeConfig } = useQuery({
    queryKey: ["store-config"],
    queryFn: async () => await getSettings(),
  });

  if (!storeConfig) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-xl">
          <ExternalLink className="mr-2 h-5 w-5 text-[#73067D]" />
          Redes Sociais
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Link
            href={`https://instagram.com/${storeConfig.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-3 rounded-md border hover:bg-muted transition-colors"
          >
            <Instagram className="mr-3 h-5 w-5 text-pink-600" />
            <div>
              <p className="font-medium">Instagram</p>
              <p className="text-sm text-muted-foreground">
                @{storeConfig.instagram}
              </p>
            </div>
          </Link>
          <Link
            href={"https://wa.me/55" + storeConfig.whatsapp.replace(/\D/g, "")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-3 rounded-md border hover:bg-muted transition-colors"
          >
            <Phone className="mr-3 h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium">WhatsApp</p>
              <p className="text-sm text-muted-foreground">
                +55 {storeConfig.whatsapp}
              </p>
            </div>
          </Link>
          <Link
            href={`mailto:${storeConfig.email}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-3 rounded-md border hover:bg-muted transition-colors"
          >
            <Mail className="mr-3 h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium">Email</p>
              <p className="text-sm text-muted-foreground">
                {storeConfig.email}
              </p>
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
