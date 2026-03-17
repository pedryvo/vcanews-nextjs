"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function AgeGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const user = session.user as any;
      if (user.isBlocked && pathname !== "/auth/blocked") {
        router.push("/auth/blocked");
        return;
      }

      const isVerifyPage = pathname === "/auth/verify-age";
      const isSignInPage = pathname === "/auth/signin";
      const isBlockedPage = pathname === "/auth/blocked";

      if (!user.birthDate && !isVerifyPage && !isSignInPage && !isBlockedPage) {
        router.push("/auth/verify-age");
      }
    }
  }, [session, status, pathname, router]);

  return <>{children}</>;
}
