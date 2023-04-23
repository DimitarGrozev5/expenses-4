import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "~/utils/api";

import "~/styles/globals.css";
import Header from "~/components/layout/header";
import BottomNavigation from "~/components/layout/bottom-navigation";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <div className="fixed inset-0 flex flex-col items-stretch overflow-auto bg-gray-200 pb-24 pt-24">
        <Header />

        <main className="flex flex-1 flex-col gap-4 px-4">
          <Component {...pageProps} />
        </main>

        <BottomNavigation />
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
