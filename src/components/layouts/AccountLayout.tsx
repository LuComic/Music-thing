import { AccountInformation } from "../AccountInformation";
import { ProfileView } from "../ProfileView";
import { api } from "../../../convex/_generated/api";
import { preloadQuery } from "convex/nextjs";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await preloadQuery(api.userFunctions.currentUser);
  return (
    <div className="bg-black min-h-screen max-w-screen w-screen flex items-start justify-center text-white">
      <div className="flex flex-col items-start justify-start gap-8 w-full md:w-[80%] p-6 md:p-10 md:pt-20 min-h-screen">
        <div className="flex flex-col gap-4 items-start justify-start w-full">
          <h3 className="text-white md:text-2xl text-xl font-semibold capitalize">
            Account
          </h3>
          <ProfileView user={user} />
          <div className="md:grid flex flex-col grid-cols-5 w-full h-full">
            <div className="w-full h-max md:gap-2 gap-1 flex flex-row md:flex-col items-start justify-between p-1 md:p-2 md:bg-transparent bg-slate-400/20 md:rounded-none rounded-lg">
              <AccountInformation />
            </div>
            <div className="col-span-4 w-full px-4 md:pt-0 pt-6 border-l-slate-400 md:border-l">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
