"use client";

import { useState } from "react";
import { Toaster, toast } from "sonner";

export default function SignupPage() {
  const [stage, setStage] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
    name: "",
    designation: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (stage === 1) {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        return toast.error("Please fill in all required fields.");
      }
      if (formData.password !== formData.confirmPassword) {
        return toast.error("Passwords do not match.");
      }

      setLoading(true);
      try {
        const res = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, password: formData.password, stage }),
        });

        if (!res.ok) throw new Error("Failed to send OTP");
        toast.success("OTP sent to your email!");
        setStage(2);
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    } else if (stage === 2) {
      setLoading(true);
      try {
        const res = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: formData.email,
            otp: formData.otp,
            name: formData.name,
            stage,
          }),
        });
        if (!res.ok) throw new Error("Invalid OTP");

        toast.success("OTP verified!");
        setStage(3);
      } catch (err) {
        console.error(err);
        toast.error("Invalid OTP. Please try again.");
      } finally {
        setLoading(false);
      }
    } else if (stage === 3) {
      setLoading(true);
      try {
        await fetch("/api/user/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ designation: formData.designation, bio: formData.bio }),
        });
        toast.success("Profile setup complete!");
        window.location.href = "/dashboard";
      } catch (err) {
        console.error(err);
        toast.error("Failed to complete signup. Try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const renderStage = () => {
    switch (stage) {
      case 1:
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 bg-[#1b122a] border border-pink-500/30 rounded-lg text-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/40 outline-none transition"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 block mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2 bg-[#1b122a] border border-pink-500/30 rounded-lg text-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/40 outline-none transition"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-300 block mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 bg-[#1b122a] border border-pink-500/30 rounded-lg text-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/40 outline-none transition"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 block mb-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 bg-[#1b122a] border border-pink-500/30 rounded-lg text-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/40 outline-none transition"
                />
              </div>
            </div>
          </>
        );

      case 2:
        return (
          <div>
            <label className="text-sm text-gray-300 block mb-1">Enter OTP</label>
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              placeholder="123456"
              className="w-full px-4 py-2 bg-[#1b122a] border border-pink-500/30 rounded-lg text-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/40 outline-none transition"
            />
            <p className="text-xs text-gray-400 mt-2 text-center">
              Check your email for the verification code.
            </p>
          </div>
        );

      case 3:
        return (
          <>
            <div>
              <label className="text-sm text-gray-300 block mb-1">Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="e.g. Web Developer"
                className="w-full px-4 py-2 bg-[#1b122a] border border-pink-500/30 rounded-lg text-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/40 outline-none transition"
              />
            </div>
            <div>
              <label className="text-sm text-gray-300 block mb-1">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us something about yourself..."
                className="w-full px-4 py-2 bg-[#1b122a] border border-pink-500/30 rounded-lg text-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/40 outline-none transition"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="min-h-screen flex items-center justify-center bg-[#0a0014]">
        <div className="bg-[#130022] border border-pink-500/20 shadow-[0_0_30px_rgba(236,72,153,0.25)] rounded-2xl px-16 py-8 w-full max-w-3xl">
          <h2 className="text-3xl font-bold text-center text-pink-500 mb-1">
            {stage === 3 ? "Set Up Your Profile" : "Create your Account"}
          </h2>
          <p className="text-gray-400 text-center mb-6">
            {stage === 3 ? "Complete your profile to get started" : "Join our community"}
          </p>

          <div className="text-center text-sm text-gray-400 mb-6">
            Step {stage} of 3
            <div className="w-full bg-gray-800 h-2 mt-2 rounded-full">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-300"
                style={{ width: `${(stage / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {renderStage()}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-700 text-white font-semibold hover:scale-[1.02] transition-transform shadow-[0_0_15px_rgba(255,75,159,0.5)] ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Processing..." : stage === 3 ? "Complete Signup" : "Next"}
            </button>
          </form>

          {stage === 1 && (
            <p className="text-center text-gray-400 text-sm mt-4">
              Already have an account?{" "}
              <a href="/login" className="text-pink-500 hover:underline">
                Sign in
              </a>
            </p>
          )}
        </div>
      </div>
    </>
  );
}
