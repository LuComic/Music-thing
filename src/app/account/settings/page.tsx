import { DeleteAccountModal } from "@/components/DeleteAccountModal";
import { EditAccountModal } from "@/components/EditAccountModal";

export default function page() {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="md:text-2xl text-xl font-semibold mb-4">
        Account Information
        <button className="inline ml-4">
          <EditAccountModal />
        </button>
      </h1>
      <div className="md:text-lg text-base flex gap-2">
        <span className="font-medium">Username: </span>
        <span className="text-slate-400">John Doe</span>
      </div>
      <div className="md:text-lg text-base flex gap-2">
        <span className="font-medium">Email: </span>
        <span className="text-slate-400">johndoe@example.com</span>
      </div>
      <div className="md:text-lg text-base flex gap-2">
        <span className="font-medium">Password: </span>
        <button className="cursor-pointer underline underline-offset-4 hover:text-white/80 transition">
          Change password
        </button>
      </div>
      <DeleteAccountModal />
    </div>
  );
}
