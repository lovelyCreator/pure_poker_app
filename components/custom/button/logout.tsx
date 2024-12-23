import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import useLogout from "@/hooks/useLogout";
import React from "react";

export default function LogoutButton() {
  const logout = useLogout();
  return (
    <Button
      variant={"base"}
      className="text-md px-2 py-1 text-red-500"
      onPress={() => {
        toast.promise(logout.mutateAsync(), {
          loading: "Logging out...",
          success: "Successfully logged out",
          error: "Logout failed",
        });
      }}
    >
      Log Out
    </Button>
  );
}
