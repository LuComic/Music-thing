import { AccountInformation } from "../AccountInformation";
import { ProfileView } from "../ProfileView";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-black min-h-screen max-w-screen w-screen flex items-start justify-center px-4 text-white">
      <div className="flex flex-col items-start justify-start gap-8 w-full md:w-[80%] md:pb-0 pb-10 md:p-10 md:pt-20 min-h-screen">
        <h3 className="md:text-2xl text-xl font-semibold capitalize">
          Account
        </h3>
        <ProfileView />
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
  );
}
