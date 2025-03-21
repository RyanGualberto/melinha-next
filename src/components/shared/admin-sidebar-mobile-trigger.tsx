"use client";
import React from "react";
import { useSidebar } from "../ui/sidebar";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";

export default function AdminSidebarMobileTrigger() {
  const { setOpenMobile } = useSidebar();
  return (
    <Button  onClick={() => setOpenMobile(true)} variant="outline" size="icon" className="fixed top-4 right-4">
      <Menu />
    </Button>
  );
}
