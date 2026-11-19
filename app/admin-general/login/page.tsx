import { LoginForm } from "@/components/auth/LoginForm";

export default function AdminGeneralLoginPage() {
  return <LoginForm role="admin_general" title="Administration générale" homePath="/admin-general" />;
}
