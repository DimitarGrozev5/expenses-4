import { useState } from "react";

import { signOut, useSession } from "next-auth/react";

import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";

import { useProtectedRoute } from "~/hooks/use-protected-route";
import { Divider } from "@mui/material";

const Header = () => {
  useProtectedRoute();

  const { data } = useSession();
  const isLoggedIn = !!data;

  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const logoutHandler = () => {
    void signOut();
  };

  return (
    <header className="absolute left-0 right-0 top-0 flex h-20 items-center bg-gray-200 px-4 shadow-md">
      <h1 className="flex-1 text-3xl font-bold text-gray-800">Expenses</h1>
      {/* {isLoggedIn && (
        <Tooltip label="Sign out" side="left">
          <button className="p-2" onClick={logoutHandler}>
            <LogoutIcon />
          </button>
        </Tooltip>
      )} */}

      {isLoggedIn && (
        <button className="p-2" onClick={() => setMenuIsOpen(true)}>
          <MenuIcon />
        </button>
      )}

      {menuIsOpen && (
        <>
          <div
            className="fixed bottom-0 left-0 right-0 top-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setMenuIsOpen(false)}
          ></div>
          <ul className="fixed bottom-0 right-0 top-0 flex w-[80vw] flex-col bg-gray-200 px-4 shadow-md">
            <li className="flex h-20 items-stretch">
              <button
                className="flex flex-1 items-center"
                onClick={() => setMenuIsOpen(false)}
              >
                <div className="flex-1 text-right text-xl">Close Menu</div>
                <div className="p-2">
                  <CloseIcon />
                </div>
              </button>
            </li>
            <Divider />
            <li className="flex h-20 items-stretch">
              <button
                className="flex flex-1 items-center"
                onClick={() => logoutHandler()}
              >
                <div className="flex-1 text-right text-xl">Sign out</div>
                <div className="p-2">
                  <LogoutIcon />
                </div>
              </button>
            </li>
          </ul>
        </>
      )}
    </header>
  );
};

export default Header;
