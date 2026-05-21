import { useState } from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";

const Login = () => {
  const [state, setState] = useState("Sign In");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-white dark:from-gray-950 dark:to-black px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-6 sm:p-8">
        
        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Welcome to Medicare
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            Book appointments with trusted doctors
          </p>
        </div>

        {/* Auth Component */}
        <div className="flex justify-center">
          {state === "Sign In" ? (
            <SignIn
              fallbackRedirectUrl="/"
              appearance={{
                elements: {
                  card: "shadow-none border-0 bg-transparent",
                  footer: "hidden",
                  socialButtonsBlockButton:
                    "rounded-xl border-gray-200 hover:bg-gray-50",
                  formButtonPrimary:
                    "bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl",
                  formFieldInput:
                    "rounded-xl border-gray-300 focus:border-cyan-500 focus:ring-cyan-500",
                },
              }}
            />
          ) : (
            <SignUp
              fallbackRedirectUrl="/"
              appearance={{
                elements: {
                  card: "shadow-none border-0 bg-transparent",
                  footer: "hidden",
                  socialButtonsBlockButton:
                    "rounded-xl border-gray-200 hover:bg-gray-50",
                  formButtonPrimary:
                    "bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl",
                  formFieldInput:
                    "rounded-xl border-gray-300 focus:border-cyan-500 focus:ring-cyan-500",
                },
              }}
            />
          )}
        </div>

        {/* Custom Toggle */}
        <div className="text-center mt-4">
          {state === "Sign In" ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Don&apos;t have an account?{" "}
              <button
                onClick={() => setState("Sign Up")}
                className="text-cyan-600 hover:text-cyan-700 font-medium underline"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <button
                onClick={() => setState("Sign In")}
                className="text-cyan-600 hover:text-cyan-700 font-medium underline"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;