import { LoginButton } from "@/components/auth/components";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";

const poppinsFont = Poppins({
  weight: ["600"],
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div className="flex items-center justify-center h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
      <div className="space-y-6 text-center">
        <h1
          className={cn(
            "text-6xl font-semibold text-white drop-shadow-md",
            poppinsFont.className
          )}
        >
          Auth Page
        </h1>
        <p className="text-white text-lg">
          A simple example of authentication using Next.js
        </p>
        <LoginButton mode="redirect">
          <Button variant={"secondary"}>Sign in</Button>
        </LoginButton>
      </div>
    </div>
  );
}
