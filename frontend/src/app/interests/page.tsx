"use client";

import { useState, useEffect } from "react";
import Background from "@/components/Background";
import AuthProvider from "../../hooks/AuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UserInterests from "@/components/content/UserInterests";
import { User } from "@/models/User";
import { useRouter } from "next/navigation";

export default function InterestsPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Get user from local storage (your auth implementation may differ)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user:", error);
      }
    }
  }, []);

  const handleComplete = () => {
    // Redirect to the home page after selecting interests
    router.push("/");
  };

  return (
    <AuthProvider>
      <Background />
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <UserInterests user={user} onComplete={handleComplete} />
      </div>
      
      <Footer />
    </AuthProvider>
  );
}
