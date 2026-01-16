import { LoginPageTitle } from "@/components/LoginPageTitle";
import { LoginPageForm } from "@/components/LoginPageForm";

export default function page() {
  return (
    <div className="bg-black px-4 flex-col md:grid grid-cols-2 h-auto min-h-screen w-screen flex items-center justify-center text-white">
      <LoginPageTitle />
      <LoginPageForm />
    </div>
  );
}
