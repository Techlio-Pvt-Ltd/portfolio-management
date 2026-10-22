import type { Metadata } from "next";
import AuthGate from "@/components/dashboard/AuthGate";
import DashboardShell from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <AuthGate>
      <DashboardShell />
    </AuthGate>
  );
}
