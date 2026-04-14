import { useState } from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";

const Login = () => {
  const [state, setState] = useState("Sign In"); // 'Sign In' | 'Sign Up'

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="flex flex-col gap-4 items-center p-8 min-w-[340px] sm:min-w-96 rounded-xl text-gray-600 dark:text-gray-300">
        {state === "Sign In" ? (
          <>
            <SignIn fallbackRedirectUrl="/" />
            <p>
              Don't have an account?{" "}
              <span
                onClick={() => setState("Sign Up")}
                className="text-primary underline cursor-pointer"
              >
                Sign Up
              </span>
            </p>
          </>
        ) : (
          <>
            <SignUp fallbackRedirectUrl="/" />
            <p>
              Already have an account?{" "}
              <span
                onClick={() => setState("Sign In")}
                className="text-primary underline cursor-pointer"
              >
                Sign In
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
