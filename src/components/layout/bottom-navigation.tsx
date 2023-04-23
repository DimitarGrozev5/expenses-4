import Link from "next/link";

import { useSession } from "next-auth/react";

import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SavingsIcon from "@mui/icons-material/Savings";
import BarChartIcon from "@mui/icons-material/BarChart";
import { useRouter } from "next/router";
import clsx from "clsx";

const BottomNavigation: React.FC = () => {
  const { data } = useSession();
  const isLoggedIn = !!data;

  const path = useRouter().pathname;

  return isLoggedIn ? (
    <nav className="fixed bottom-0 left-0 right-0 flex h-20 items-stretch justify-between bg-gray-200 shadow-[0_-5px_50px_-15px_rgba(0,0,0,0.3)]">
      <ul className="flex flex-1 items-stretch justify-around">
        <li className="flex items-stretch justify-center p-2">
          <Link
            href="/expenses"
            className={clsx(
              "flex flex-1 flex-col items-center justify-center p-4",
              path === "/expenses" && "rounded-md border border-gray-400 bg-gray-300"
            )}
          >
            <AttachMoneyIcon />
            <span>Expenses</span>
          </Link>
        </li>
        <li className="flex items-stretch justify-center p-2">
          <Link
            href="/accounts"
            className={clsx(
              "flex flex-1 flex-col items-center justify-center p-4",
              path === "/accounts" && "rounded-md border border-gray-400 bg-gray-300"
            )}
          >
            <SavingsIcon />
            <span>Accounts</span>
          </Link>
        </li>
        <li className="flex items-stretch justify-center p-2">
          <Link
            href="/Overview"
            className={clsx(
              "flex flex-1 flex-col items-center justify-center p-4",
              path === "/Overview" && "rounded-md border border-gray-400 bg-gray-300"
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
