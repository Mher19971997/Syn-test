"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import withoutAuth from "@/hook/withoutAuth";
import Link from "next/link";
import { toast } from "sonner";

function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await axios.post("/api/auth/register", {
        email,
        password,
      });

      if (res.data.token) {
        router.push("/login");
      }
    } catch {
      setError("Email is already registered or an error occurred.");
      toast.warning(`Email is already registered or an error occurred.`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold text-center text-white mb-6">
          Register
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Введите Email"
              required
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Введите пароль"
              required
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-[#6B46C1] hover:bg-[#5C3BA3] rounded-md text-white font-semibold transition duration-200 cursor-pointer"
          >
            Register
          </button>
        </form>
        <p className="text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#6B46C1] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default withoutAuth(RegisterPage);
