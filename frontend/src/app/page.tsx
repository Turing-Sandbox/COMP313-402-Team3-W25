"use client";

import { useRouter } from "next/navigation";
import Background from "./components/Background";
import { Footer } from "./components/Footer";
import Navbar from "./components/Navbar";
import AuthProvider, { useAuth } from "./hooks/AuthProvider";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  const auth = useAuth();

  if (auth.userUID === null) {
    router.push("/authentication/login");
  }

  return (
    <AuthProvider>
      <Background />
      <Navbar />

      <div className='main-content'>
        <div className='header'>
          <h1>Summarizz</h1>
          <p>Summarize your text with ease</p>
        </div>
      </div>

      <div className='footer'>
        <Footer />
      </div>
    </AuthProvider>
  );
}
