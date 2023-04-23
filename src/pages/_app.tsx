import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <div className="fixed inset-0 flex flex-col items-stretch overflow-auto bg-gray-200 pt-24">
        <header className="absolute left-0 right-0 top-0 flex h-20 items-center bg-gray-200 px-4 shadow-md">
          <h1 className="flex-1 text-3xl font-bold text-gray-800">Expenses</h1>
        </header>

        <main className="flex flex-1 flex-col gap-4 px-4">
          <Component {...pageProps} />
        </main>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
