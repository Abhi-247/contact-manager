import Link from "next/link";
import LogoutButton from "./logoutButton";
import { getCurrentUser } from "../actions/auth";

const Navbar = async () => {
  const user = await getCurrentUser();
  const session = !!user;

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          Contact Manager
        </Link>
        <div className="flex items-center space-x-4">
          {session ? (
            <>
              <span className="text-sm text-gray-700">
                Welcome, {user?.name}
              </span>
              <Link
                href="/contact"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Contacts
              </Link>
              <Link
                href="/contact/new"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Add Contact
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
