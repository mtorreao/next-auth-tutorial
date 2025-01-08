"use client";
import { BeatLoader } from "react-spinners";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Header, BackButton } from "./components";
import { FormError, FormSuccess } from "../form-notification";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { verifyToken } from "@/actions/verify-token";

export default function VerifyToken() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [errorMessage, setErrorMessage] = useState<string | undefined>("");
  const [successMessage, setSuccessMessage] = useState<string | undefined>("");

  useEffect(() => {
    verifyToken({ token }).then((response) => {
      if (response.success) setSuccessMessage("Token verified");
      if (response.error) setErrorMessage(response.error);
    });
  }, [token]);

  return (
    <Card className="w-[300px]">
      <CardHeader>
        <Header label={"Verifying your token"} />
      </CardHeader>
      <CardContent>
        <div className="w-full flex items-center flex-col gap-y-4">
          {errorMessage && <FormError message={errorMessage} />}
          {successMessage && <FormSuccess message={successMessage} />}
          {!errorMessage && !successMessage && <BeatLoader />}
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full flex flex-col gap-y-4">
          <BackButton label={"Back to login"} href={"/auth/login"} />
        </div>
      </CardFooter>
    </Card>
  );
}
