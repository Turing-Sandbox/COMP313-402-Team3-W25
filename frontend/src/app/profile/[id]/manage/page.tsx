"use client";

import Background from "@/app/components/Background";
import Footer from "@/app/components/Footer";
import AuthProvider from "@/app/hooks/AuthProvider";
import ProfileManagement from "../../components/ProfileManagement";

/**
 * Page() -> JSX.Element
 *
 * @description
 * Renders the Profile Management page, allowing users to manage their profile.
 *
 * @returns JSX.Element
 */
export default function Page() {
  return (
    <>
      <Background />
      <AuthProvider>
        <ProfileManagement />

        <div className='footer'>
          <Footer />
        </div>
      </AuthProvider>
    </>
  );
}
