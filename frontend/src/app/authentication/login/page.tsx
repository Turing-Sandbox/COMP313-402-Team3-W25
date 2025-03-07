"use client";

import Login from "@/components/authentication/Login";
import Background from "@/components/Background";
import Footer from "@/components//Footer";
import AuthProvider from "@/hooks/AuthProvider";
import "@/app/styles/authentication/authentication.scss";

export default function Page() {
  return (
    <>
      <Background />
      <AuthProvider>
        <div className='authentication'>
          <Login />
        </div>

        <div className='footer'>
          <Footer />
        </div>
      </AuthProvider>
    </>
  );
}
