import { Settings, ChartColumn, HeartHandshake, LogOut } from "lucide-react";

export default function page() {
  return (
    <div className="bg-black min-h-screen max-w-screen w-screen flex items-start justify-center p-4 text-white">
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
        <div className="grid grid-cols-5 w-full h-full">
          <div className="w-full h-full border-r-slate-400 gap-2 border-r flex flex-col items-start justify-between p-2">
            <button className="flex items-center justify-start cursor-pointer transition gap-2 w-full hover:bg-white/10 rounded-md px-3 py-2 text-white">
              <ChartColumn color="currentColor" />
              Overall
            </button>
            <button className="flex items-center justify-start cursor-pointer transition gap-2 w-full hover:bg-white/10 rounded-md px-3 py-2 text-white">
              <Settings color="currentColor" />
              Settings
            </button>
            <button className="flex items-center justify-start cursor-pointer transition gap-2 w-full hover:bg-white/10 rounded-md px-3 py-2 text-white">
              <HeartHandshake color="currentColor" />
              Terms
            </button>
            <button className="flex items-center justify-start cursor-pointer transition gap-2 w-full hover:bg-white/10 rounded-md px-3 py-2 text-rose-400">
              <LogOut color="currentColor" />
              Log out
            </button>
          </div>
          <div className="col-span-4 w-full"></div>
        </div>
      </div>
    </div>
  );
}
