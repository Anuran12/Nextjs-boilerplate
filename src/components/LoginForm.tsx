"use client";
import Image from "next/image";
import { useState } from "react";
import google from "@/assets/iconGoogle.svg";
import facebook from "@/assets/btnSigninwithFb.svg";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface LoginFormData {
  identifier: string;
  password: string;
}

export default function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    identifier: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Use NextAuth signIn with credentials
      const result = await signIn("credentials", {
        identifier: formData.identifier,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      // Redirect to home page after successful login
      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Use redirect: true to allow the NextAuth flow to handle redirects
      await signIn("google", {
        callbackUrl: "/",
        redirect: true,
      }).then((result) => {
        // This code won't run on client-side due to redirect
        // But it helps if redirect doesn't work for some reason
        if (result?.error) {
          console.error("Google sign-in result error:", result.error);
          setError(
            "An error occurred during Google sign-in. Please try again."
          );
          setIsLoading(false);
        }
      });

      // The above should redirect, so code below shouldn't execute
      // unless there's an error or redirect fails
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError("An error occurred during Google sign-in. Please try again.");
      setIsLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Use redirect: true to allow the NextAuth flow to handle redirects
      await signIn("facebook", {
        callbackUrl: "/",
        redirect: true,
      }).then((result) => {
        // This code won't run on client-side due to redirect
        // But it helps if redirect doesn't work for some reason
        if (result?.error) {
          console.error("Facebook sign-in result error:", result.error);
          setError(
            "An error occurred during Facebook sign-in. Please try again."
          );
          setIsLoading(false);
        }
      });

      // The above should redirect, so code below shouldn't execute
      // unless there's an error or redirect fails
    } catch (error) {
      console.error("Facebook sign-in error:", error);
      setError("An error occurred during Facebook sign-in. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto lg:mt-8 lg:p-6 flex flex-col justify-center items-center w-full gap-4">
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <h2 className="text-3xl font-bold mb-6">Login</h2>

        <div className="form-group">
          <input
            type="text"
            name="identifier"
            value={formData.identifier}
            onChange={handleChange}
            className="w-full px-4 py-3.5 border border-white/30 rounded-full bg-transparent focus:bg-transparent focus:outline-none focus:ring-2 focus:ring-[#F8623A] focus:border-transparent text-white placeholder:text-gray-500"
            placeholder=""
            required
          />
          <label>Email / Phone</label>
        </div>

        <div className="form-group">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3.5 border border-white/30 rounded-full bg-transparent focus:bg-transparent focus:outline-none focus:ring-2 focus:ring-[#F8623A] focus:border-transparent text-white placeholder:text-gray-500"
              placeholder=""
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </button>
            <label>Password</label>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-end">
          <button className="text-[#F8623A] text-sm self-end">
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#F8623A] text-white px-4 py-[0.75rem] rounded-full hover:bg-[#F8623A]/80 font-semibold text-xl disabled:opacity-70"
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </button>
      </form>
      <div className="flex items-center gap-4 w-full">
        <div className="h-[1.5px] bg-white/70 flex-grow"></div>
        <span className="text-white/50 text-sm">Or Sign In With</span>
        <div className="h-[1.5px] bg-white/70 flex-grow"></div>
      </div>
      <div className="flex gap-4 w-full">
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full bg-white text-black px-4 py-2 rounded-full font-normal lg:text-xl flex items-center justify-center gap-2 disabled:opacity-70"
        >
          <Image src={google} alt="Google" width={20} height={20} />
          Google
        </button>
        <button
          type="button"
          onClick={handleFacebookSignIn}
          disabled={isLoading}
          className="w-full bg-white text-black px-4 py-2 rounded-full font-normal lg:text-xl flex items-center justify-center gap-2 disabled:opacity-70"
        >
          <Image src={facebook} alt="Facebook" width={20} height={20} />
          Facebook
        </button>
      </div>
      <p className="text-sm text-white/50">
        Don&#39;t have an account?{" "}
        <Link href={"/signup"} className="font-bold text-[#EA9459]">
          Join Us
        </Link>
      </p>
    </div>
  );
}
