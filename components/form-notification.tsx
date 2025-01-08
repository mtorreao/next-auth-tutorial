"use client";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { CheckCircledIcon } from "@radix-ui/react-icons";

export const FormError = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <div className="bg-destructive/15 p-3 flex items-center rounded-md gap-x-2 text-sm text-destructive">
      <ExclamationTriangleIcon className="h-4 w-4" />
      {message}
    </div>
  );
};

export const FormSuccess = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <div className="bg-emerald-500/15 p-3 flex items-center rounded-md gap-x-2 text-sm text-emerald-500">
      <CheckCircledIcon className="h-4 w-4" />
      {message}
    </div>
  );
};

export const FormNotification = ({
  message,
  type,
}: {
  message?: string;
  type: "error" | "success";
}) => {
  if (!message) return null;
  if (type === "error") return <FormError message={message} />;
  if (type === "success") return <FormSuccess message={message} />;
  return null;
};
