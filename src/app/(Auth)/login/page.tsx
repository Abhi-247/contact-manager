// This is the login page for the application. It contains a form for users to enter their credentials and log in to the application.
//this is a server component, so we can use server-side rendering to fetch data and render the page on the server before sending it to the client. This is useful for SEO and performance reasons.

import Link from "next/link"
import LoginForm from "../../_components/loginForm"
const LoginPage = () => {
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <LoginForm/>
        <p className="mt-4 text-center">Don't have an account? <Link href="/register" className="text-blue-600 hover:underline">Register</Link></p>

    </div>
  )
}
export default LoginPage