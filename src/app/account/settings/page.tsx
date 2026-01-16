import { DeleteAccountModal } from "@/components/DeleteAccountModal";
import { EditAccountModal } from "@/components/EditAccountModal";
import { UserInfoAcc } from "@/components/UserInfoAcc";
import { api } from "../../../../convex/_generated/api";
import { preloadQuery } from "convex/nextjs";

export default async function page() {
  const user = await preloadQuery(api.userFunctions.currentUser);
  return (
    <div className="flex flex-col gap-1">
      <h1 className="md:text-2xl text-xl font-semibold mb-4">
        Account Information
        <EditAccountModal user={user} />
      </h1>
      <UserInfoAcc user={user} />
      <DeleteAccountModal user={user} />
    </div>
  );
}
