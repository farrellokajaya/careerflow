"use client";

import { LoaderCircle, LogOut } from "lucide-react";
import { useFormStatus } from "react-dom";

import { logoutAction } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";

function LogoutSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="outline" disabled={pending}>
      {pending ? (
        <>
          <LoaderCircle className="animate-spin" aria-hidden="true" />
          Keluar...
        </>
      ) : (
        <>
          <LogOut aria-hidden="true" />
          Logout
        </>
      )}
    </Button>
  );
}

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <LogoutSubmitButton />
    </form>
  );
}
