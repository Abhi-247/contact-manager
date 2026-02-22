import { getCurrentUser } from "./actions/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/contact");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Contact Manager
        </h1>
        <p className="text-gray-600 mb-8">
          Manage your contacts easily and efficiently with our simple contact
          management system.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-medium transition"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
