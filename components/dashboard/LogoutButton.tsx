"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    document.cookie = "auth-token=; Max-Age=0; path=/";
    router.push("/login");
  };

  return <Button onClick={handleLogout}>Logout</Button>;
}