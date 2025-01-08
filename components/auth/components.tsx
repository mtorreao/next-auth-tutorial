"use client";

import { loginWithSocial } from "@/actions/login";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LOGIN_ROUTE } from "@/routes";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

export const Social = () => {
  return (
    <div className="w-full flex items-center gap-x-2">
      <Button
        onClick={async () => {
          await loginWithSocial("google");
        }}
        className="w-full"
        variant={"outline"}
      >
        <FcGoogle className="h-5 w-5" />
      </Button>
      <Button
        onClick={async () => {
          await loginWithSocial("github");
        }}
        className="w-full"
        variant={"outline"}
      >
        <FaGithub className="h-5 w-5" />
      </Button>
    </div>
  );
};

export function LoginButton({
  children,
  mode = "redirect",
  asChild = false,
}: {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}) {
  const router = useRouter();
  const onClick = () => {
    router.push(LOGIN_ROUTE);
  };
  if (mode === "modal") {
    return <span>This is a modal</span>;
  }
  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
}

const font = Poppins({
  weight: ["600"],
  subsets: ["latin"],
});

interface HeaderProps {
  label: string;
}

export function Header({ label }: HeaderProps) {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <h1 className={cn("text-3xl font-semibold", font.className)}>Auth</h1>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
}

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}
export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
}: CardWrapperProps) => {
  return (
    <Card className="w-[400px]">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <div className="w-full flex flex-col gap-y-4">
          {showSocial && <Social />}
          <BackButton label={backButtonLabel} href={backButtonHref} />
        </div>
      </CardFooter>
    </Card>
  );
};

export const BackButton = ({
  href,
  label,
}: {
  href: string;
  label: string;
}) => {
  return (
    <Button asChild variant={"link"} className="font-normal w-full" size={"sm"}>
      <Link href={href}>{label}</Link>
    </Button>
  );
};
