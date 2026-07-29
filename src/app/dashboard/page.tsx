import AuthGate from "@/components/dashboard/AuthGate";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default function DashboardPage() {
  return (
    <AuthGate>
      <DashboardShell />
    </AuthGate>
  );
}
