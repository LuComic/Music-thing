import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { Spinner } from "./ui/spinner";

export function SignIn() {
  const { signIn } = useAuthActions();

  const [googleSpinner, setGoogleSpinner] = useState(false);
  const [gitHubSpinner, setGitHubSpinner] = useState(false);
  return (
    <>
      <span className="font-medium w-max">Continue with...</span>
      <button
        className="flex items-center justify-center gap-2 w-full px-2 py-1.5 rounded-md border font-medium cursor-pointer hover:text-white/80 hover:border-white/80 text-white border-white transition"
        onClick={() => {
          void signIn("google");
          setGoogleSpinner(true);
        }}
      >
        {googleSpinner ? <Spinner className="size-7" /> : "Google"}
      </button>
      <button
        className="flex items-center justify-center gap-2 w-full px-2 py-1.5 rounded-md border font-medium cursor-pointer hover:text-[#6E5494] hover:border-[#564274] text-[#6E5494] border-[#6E5494] transition"
        onClick={() => {
          void signIn("github");
          setGitHubSpinner(true);
        }}
      >
        {gitHubSpinner ? <Spinner className="size-7" /> : "GitHub"}
      </button>
    </>
  );
}
