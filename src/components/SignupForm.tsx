"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import google from "@/assets/iconGoogle.svg";
import facebook from "@/assets/btnSigninwithFb.svg";

interface SignupFormData {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export default function SignupForm() {
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        return;
      }

      setShowOtpForm(true);
    } catch (err) {
      console.error("Signup error:", err);
      setError("An error occurred during signup");
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/users/signup", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          otp,
        }),
      });

      const data = await res.json();

      if (data.status === "error") {
        setError(data.message);
        return;
      }

      window.location.href = "/login";
    } catch (err) {
      console.error("Verification error:", err);
      setError("An error occurred during verification");
    }
  };

  return (
    <div className="max-w-md mx-auto lg:p-6 lg:pt-0 flex flex-col justify-center items-center w-full gap-4">
      {!showOtpForm ? (
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6">
            Sign Up
          </h2>

          <div className="form-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 lg:px-4 py-2.5 lg:py-3.5 border border-white/30 rounded-full bg-transparent focus:bg-transparent focus:outline-none focus:ring-2 focus:ring-[#F8623A] focus:border-transparent text-white placeholder:text-gray-500"
              placeholder=""
              required
            />
            <label>Full Name</label>
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 lg:px-4 py-2.5 lg:py-3.5 border border-white/30 rounded-full bg-transparent focus:bg-transparent focus:outline-none focus:ring-2 focus:ring-[#F8623A] focus:border-transparent text-white placeholder:text-gray-500"
              placeholder=""
              required
            />
            <label>Email</label>
          </div>

          <div className="form-group">
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-3 lg:px-4 py-2.5 lg:py-3.5 border border-white/30 rounded-full bg-transparent focus:bg-transparent focus:outline-none focus:ring-2 focus:ring-[#F8623A] focus:border-transparent text-white placeholder:text-gray-500"
              placeholder=""
              required
            />
            <label>Phone Number</label>
          </div>

          <div className="form-group">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 lg:px-4 py-2.5 lg:py-3.5 border border-white/30 rounded-full bg-transparent focus:bg-transparent focus:outline-none focus:ring-2 focus:ring-[#F8623A] focus:border-transparent text-white placeholder:text-gray-500"
                placeholder=""
                required
              />
              <label>Password</label>
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
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#F8623A] text-white px-3 lg:px-4 py-[0.75rem] rounded-full hover:bg-[#F8623A]/80 font-semibold text-lg lg:text-xl"
          >
            Sign Up
          </button>

          <div className="flex items-center gap-2 lg:gap-4 w-full my-4">
            <div className="h-[1.5px] bg-white/70 flex-grow"></div>
            <span className="text-white/50 text-xs lg:text-sm whitespace-nowrap">
              Or Sign Up With
            </span>
            <div className="h-[1.5px] bg-white/70 flex-grow"></div>
          </div>

          <div className="flex gap-4 w-full">
            <button className="w-full bg-white text-black px-4 py-2 rounded-full font-normal lg:text-xl flex items-center justify-center gap-2">
              <Image src={google} alt="Google" width={20} height={20} />
              Google
            </button>
            <button
              type="submit"
              className="w-full bg-white text-black px-4 py-2 rounded-full font-normal lg:text-xl flex items-center justify-center gap-2"
            >
              <Image src={facebook} alt="Facebook" width={20} height={20} />
              Facebook
            </button>
          </div>

          <p className="text-xs lg:text-sm text-white/50 text-center mt-4">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-[#EA9459]">
              Sign In
            </Link>
          </p>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className="space-y-4 w-full">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6">
            Verify OTP
          </h2>

          <div className="form-group">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-3 lg:px-4 py-2.5 lg:py-3.5 border border-white/30 rounded-full bg-transparent focus:bg-transparent focus:outline-none focus:ring-2 focus:ring-[#F8623A] focus:border-transparent text-white placeholder:text-gray-500"
              placeholder=""
              required
            />
            <label>Enter OTP</label>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#F8623A] text-white px-3 lg:px-4 py-2.5 lg:py-3.5 rounded-full hover:bg-[#F8623A]/80 font-semibold text-lg lg:text-xl"
          >
            Verify OTP
          </button>
        </form>
      )}
    </div>
  );
}
