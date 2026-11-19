import { LoginForm } from "@/components/auth/LoginForm";

export default function AdminLoginPage() {
  return <LoginForm role="admin_patisserie" title="Administration pâtisserie" homePath="/admin" />;
}
