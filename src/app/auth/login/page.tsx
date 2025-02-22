"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Dumbbell } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignIn, SignUp } from "@clerk/nextjs";

function LoginComponent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "register" ? "register" : "login";
  const [selectedTab, setSelectedTab] = useState(initialTab);

  useEffect(() => {
    setSelectedTab(initialTab);
  }, [initialTab]);

  return (
    <>
      <motion.div
        className="flex flex-col justify-center p-8 md:p-12"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto w-full max-w-sm">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="login" className="flex-1">
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="flex-1">
                Register
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <SignIn routing="hash" appearance={{ variables: { colorPrimary: "#4CAF50" } }} />
            </TabsContent>
            <TabsContent value="register">
              <SignUp routing="hash" appearance={{ variables: { colorPrimary: "#4CAF50" } }} />
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>

      <motion.div
        className="hidden md:flex flex-col items-center justify-center p-8 bg-[#f0f7f0] text-center"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Dumbbell className="w-16 h-16 text-[#4CAF50] mb-6" />
        <h2 className="text-3xl font-bold text-[#4CAF50] mb-4">FitCircuit</h2>
        <p className="text-muted-foreground max-w-sm">
          Your personalized fitness journey starts here. Get AI-powered workout plans and nutrition guidance tailored to
          your goals.
        </p>
      </motion.div>
    </>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginComponent />
    </Suspense>
  );
}
