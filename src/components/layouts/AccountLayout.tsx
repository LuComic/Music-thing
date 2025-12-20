import { AccountInformation } from "../AccountInformation";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-black min-h-screen max-w-screen w-screen flex items-start justify-center px-4 text-white">
      <div className="flex flex-col items-start justify-start gap-8 w-full md:w-[80%] p-6 md:p-10 md:pt-20 min-h-screen">
        <h3 className="md:text-2xl text-xl font-semibold capitalize">
          Account
        </h3>
        <div className="flex flex-col items-start justify-start gap-8 w-full h-full">
          <div className="relative w-full h-[200px] bg-slate-400/20 rounded-lg">
            <div className="bg-white rounded-full w-[150px] h-[150px] border-4 border-black absolute bottom-0 translate-y-1/2 left-10"></div>
          </div>
          <p className="md:text-3xl text-2xl font-semibold capitalize mt-16">
            John Doe
          </p>
        </div>
        <div className="md:grid flex flex-col grid-cols-5 w-full h-full">
          <div className="w-full h-max md:h-full border-r-none border-r-slate-400 md:gap-2 gap-1 border-r-none md:border-r flex flex-row md:flex-col items-start justify-between p-1 md:p-2 md:bg-transparent bg-slate-400/20 md:rounded-none rounded-lg">
            <AccountInformation />
          </div>
          <div className="col-span-4 w-full px-4 md:pt-0 pt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
