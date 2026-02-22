"use client";

import { logoutUser } from "../actions/auth";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm font-medium text-gray-700 hover:text-gray-900 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
