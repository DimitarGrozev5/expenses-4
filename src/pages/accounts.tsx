import type { Account } from "@prisma/client";
import { type NextPage } from "next";

const AccountsPage: NextPage = () => {
  const accounts: Account[] = [];

  return (
    <>
      {accounts.map((account) => (
        <div key={account.id}>{account.name}</div>
      ))}
    </>
  );
};

export default AccountsPage;
