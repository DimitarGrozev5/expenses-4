import Link from "next/link";

import { useSession } from "next-auth/react";

import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SavingsIcon from "@mui/icons-material/Savings";
import BarChartIcon from "@mui/icons-material/BarChart";
import ChecklistIcon from "@mui/icons-material/Checklist";

import { useRouter } from "next/router";
import clsx from "clsx";
import { api } from "~/utils/api";
import { useMemo } from "react";

const BottomNavigation: React.FC = () => {
  const { data } = useSession();
  const isLoggedIn = !!data;

  const path = useRouter().pathname;

  // Get account data
  const { data: accounts } = api.accounts.getAll.useQuery();

  // Calculate total deficit on all accounts
  const totalDeficit = useMemo(() => {
    if (!accounts) {
      return null;
    }

    return accounts.reduce((acc, curr) => {
      return acc + +curr.initAmount - +curr.credit - +curr.currentAmount;
    }, 0);
  }, [accounts]);

  return isLoggedIn ? (
    <nav className="fixed bottom-0 left-0 right-0 flex h-20 items-stretch justify-between bg-gray-200 shadow-[0_-5px_50px_-15px_rgba(0,0,0,0.3)]">
      <ul className="flex flex-1 items-stretch justify-around">
        <li className="flex items-stretch justify-center p-2">
          <Link
            href="/expenses"
            className={clsx(
              "flex flex-1 flex-col items-center justify-center p-4",
              path === "/expenses" &&
                "rounded-md border border-gray-400 bg-gray-300"
            )}
          >
            <AttachMoneyIcon />
            <span>Expenses</span>
          </Link>
        </li>
        <li className="flex items-stretch justify-center p-2">
          <Link
            href="/budget"
            className={clsx(
              "flex flex-1 flex-col items-center justify-center p-4",
              path === "/budget" &&
                "rounded-md border border-gray-400 bg-gray-300"
            )}
          >
            <ChecklistIcon />
            <span>Budget</span>
          </Link>
        </li>
        <li className="relative flex items-stretch justify-center p-2">
          <Link
            href="/accounts"
            className={clsx(
              "flex flex-1 flex-col items-center justify-center p-4",
              path === "/accounts" &&
                "rounded-md border border-gray-400 bg-gray-300"
            )}
          >
            <SavingsIcon />
            <span>Accounts</span>
          </Link>

          {totalDeficit !== null && (
            <div
              className={clsx(
                "absolute -right-1 top-0 rounded-full border p-0.5 text-sm  shadow-sm",
                totalDeficit <= 0
                  ? "border-green-200 bg-green-50 text-green-500"
                  : "border-red-200 bg-red-50 text-red-500"
              )}
            >
              {(-1 * totalDeficit).toFixed(2)}
            </div>
          )}
        </li>
        <li className="flex items-stretch justify-center p-2">
          <Link
            href="/Overview"
            className={clsx(
              "flex flex-1 flex-col items-center justify-center p-4",
              path === "/overview" &&
                "rounded-md border border-gray-400 bg-gray-300"
            )}
          >
            <BarChartIcon />
            <span>Overview</span>
          </Link>
        </li>
      </ul>
    </nav>
  ) : null;
};

export default BottomNavigation;
