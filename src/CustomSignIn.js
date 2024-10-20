import React, { useState } from 'react';
import { useSignIn, useSignUp } from "@clerk/clerk-react";
import { useNavigate, Link } from 'react-router-dom';

const CustomSignIn = () => {
  const { isLoaded: isSignInLoaded, signIn, setActive } = useSignIn();
  const { isLoaded: isSignUpLoaded, signUp } = useSignUp();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState("identifier");
  const [error, setError] = useState("");

  if (!isSignInLoaded || !isSignUpLoaded) {
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (step === "identifier") {
      try {
        // Handle both phone number and username
        const result = await signIn.create({
          identifier: identifier.includes('+') ? identifier : "Rafaath",
          strategy: identifier.includes('+') ? "phone_number" : "username",
        });

        if (result.status === "needs_first_factor") {
          setStep("password");
        } else {
          console.log(JSON.stringify(result, null, 2));
          setError("Unexpected result. Please try again.");
        }
      } catch (err) {
        console.error("Error: ", err.message);
        if (err.errors && err.errors[0].code === "form_identifier_not_found") {
          setError("Account not found. Would you like to sign up?");
        } else {
          setError(err.message);
        }
      }
    } else if (step === "password") {
      try {
        const result = await signIn.attemptFirstFactor({
          strategy: "password",
          password,
        });

        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId });
          navigate('/');
        } else if (result.status === "needs_second_factor") {
          setStep("verificationCode");
        } else {
          console.log(JSON.stringify(result, null, 2));
          setError("Incorrect password. Please try again.");
        }
      } catch (err) {
        console.error("Error: ", err.message);
        setError(err.message);
      }
    } else if (step === "verificationCode") {
      try {
        const result = await signIn.attemptSecondFactor({
          strategy: "phone_code",
          code: verificationCode,
        });

        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId });
          navigate('/');
        } else {
          console.log(JSON.stringify(result, null, 2));
          setError("Verification failed. Please try again.");
        }
      } catch (err) {
        console.error("Error: ", err.message);
        setError(err.message);
      }
    }
  }

  async function handleSignUp() {
    try {
      const result = await signUp.create({
        phoneNumber: identifier,
      });
      
      if (result.status === "missing_requirements") {
        // Redirect to sign-up page with pre-filled phone number
        navigate('/sign-up', { state: { phoneNumber: identifier } });
      } else {
        console.log(JSON.stringify(result, null, 2));
        setError("Unexpected result. Please try again.");
      }
    } catch (err) {
      console.error("Error: ", err.message);
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-center">{error}</div>
          )}
          {step === "identifier" && (
            <div>
              <label htmlFor="identifier" className="sr-only">Phone Number or Username</label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Phone Number or Username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
          )}
          {step === "password" && (
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}
          {step === "verificationCode" && (
            <div>
              <label htmlFor="verification-code" className="sr-only">Verification Code</label>
              <input
                id="verification-code"
                name="code"
                type="text"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Verification Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </div>
          )}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {step === "identifier" ? "Next" : (step === "password" ? "Sign In" : "Verify")}
            </button>
          </div>
        </form>
        {error === "Account not found. Would you like to sign up?" && (
          <div className="text-center">
            <button
              onClick={handleSignUp}
              className="text-indigo-600 hover:text-indigo-500"
            >
              Sign Up
            </button>
          </div>
        )}
        <div className="text-center">
          <Link to="/sign-up" className="text-indigo-600 hover:text-indigo-500">
            Don't have an account? Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomSignIn;
