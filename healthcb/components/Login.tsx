"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Stethoscope, User, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from 'next/navigation';
import withAuth from "@/components/withAuth";
import { Console } from "console";

function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [stateError, setStateError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams.get('error');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employee_id: id, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("accessToken", data.data.access);
        localStorage.setItem("refreshToken", data.data.refresh);
        localStorage.setItem("first_name", data.data.employee_name);
        localStorage.setItem("isDefaultPassword", data.data.isDefaultPassword);
        
        if (data.data.isDefaultPassword) {
          localStorage.setItem("defaultPassword", password);
          router.push("/force-change-password");
        } else {
          router.push("/admin");
        }
      } else {
        setStateError("Invalid credentials. Please try again.");
      }
    } catch (error) {
      setStateError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-white to-[#7FD6FB]/10 relative overflow-hidden">
        {/* Background Animations */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Gradient Wave */}
          <div className="absolute left-0 top-0 h-full w-[50%] opacity-30"
            style={{
              background: 'linear-gradient(to right, #7FD6FB, transparent)',
            }}
          />
          
          {/* Animated Circles */}
          <motion.div
            className="absolute left-[20%] top-[20%] w-24 h-24 rounded-full bg-[#7FD6FB] opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute left-[10%] top-[60%] w-32 h-32 rounded-full bg-[#7FD6FB] opacity-20"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-secondary text-transparent bg-clip-text mb-2">
              Welcome Back!
            </h2>
            <p className="text-gray-600">Please sign in to continue</p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            {(stateError || urlError) && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                {stateError || urlError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="id" className="text-gray-700">Employee ID</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <User className="h-5 w-5" />
                  </div>
                  <Input
                    id="id"
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-gray-500 focus:ring-gray-500 bg-white text-gray-900 placeholder-gray-400"
                    placeholder="Enter your ID"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-gray-500 focus:ring-gray-500 bg-white text-gray-900 placeholder-gray-400"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-secondary hover:opacity-90 transition-all animate-gradient-x text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            <div className="text-center">
              <Link href="/patient/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                Login as Patient
              </Link>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Right side with image */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-blue items-center justify-center">
        <div className="relative w-full h-screen">
          <Image
            src="/siabgadmin.png"
            alt="Healthcare Admin Illustration"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}

export default withAuth(Login, true);