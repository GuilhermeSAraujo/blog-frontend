import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export function useAdminAuth(): { isChecking: boolean; isLoggedIn: boolean } {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = typeof window !== "undefined" && sessionStorage.getItem("adminLoggedIn") === "true";
    if (!loggedIn) {
      router.push("/admin/login");
      setIsChecking(false);
      setIsLoggedIn(false);
      return;
    }
    setIsChecking(false);
    setIsLoggedIn(true);
  }, [router]);

  return { isChecking, isLoggedIn };
}
