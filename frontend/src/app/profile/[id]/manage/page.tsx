"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";

import { apiURL } from "@/app/scripts/api";
import AuthProvider from "@/hooks/AuthProvider";
import { User } from "@/models/User";

import Navbar from "@/components/Navbar";
import Background from "@/components/Background";
import Footer from "@/components/Footer";

import "@/app/styles/profile/ProfileManagement.scss";
import { useParams } from "next/navigation";

/**
 * Page() -> JSX.Element
 *
 * @description
 * Renders the Profile Management page, allowing users to manage their profile.
 *
 * @returns JSX.Element
 */
export default function Page() {
  // ---------------------------------------
  // -------------- Variables --------------
  // ---------------------------------------
  const { id } = useParams();

  const [user, setUser] = useState<User | null>(null);
  const [errorEditProfile, setErrorEditProfile] = useState("");
  const [successEditProfile, setSuccessEditProfile] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorEditPassword, setErrorEditPassword] = useState("");
  const [successEditPassord, setSuccessEditPassord] = useState("");

  const [newEmail, setNewEmail] = useState("");
  const [errorEditEmail, setErrorEditEmail] = useState("");
  const [successEditEmail, setSuccessEditEmail] = useState("");

  const [newUsername, setNewUsername] = useState("");
  const [errorEditUsername, setErrorEditUsername] = useState("");
  const [successEditUsername, setSuccessEditUsername] = useState("");

  // ---------------------------------------
  // ------------ Event Handlers -----------
  // ---------------------------------------
  /**
   * hasFetchedData() -> void
   *
   * @description
   * Used to prevent fetching user data on page load.
   *
   * @returns void
   */
  const hasFetchedData = useRef(false);
  useEffect(() => {
    if (!hasFetchedData.current) {
      if (typeof id === "string") {
        getUserInfo(id);
      }
      hasFetchedData.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorEditProfile("");
    setSuccessEditProfile("");

    // 1- Validation
    if (!user) {
      setErrorEditProfile("No user found.");
      return;
    }

    if (!user?.firstName || !user?.lastName) {
      setErrorEditProfile("Please fill out all fields.");
      return;
    }

    // 2- Send request to backend

    // 3- Update user hook

    // 4- Handle response
  };

  /**
   * handleChangePassword() -> void
   *
   * @description
   * Handles the change password form, setting the error and success states
   * to an empty string and calling the backend to change the password.
   *
   * @param e - Form Event
   * @returns void
   */
  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorEditPassword("");
    setSuccessEditPassord("");

    if (newPassword !== confirmPassword) {
      setErrorEditPassword("New passwords do not match.");
      return;
    }

    try {
      // Send a request to the backend to change the password
      await axios.post(`${apiURL}/user/${id}/change-password`, {
        userId: id,
        currentPassword,
        newPassword,
      });
      setSuccessEditPassord("Password has been successfully updated.");
    } catch (error) {
      console.error("Error changing password:", error);
      setErrorEditPassword(
        "Failed to update password. Please check your current password and try again."
      );
    }
  };

  /**
   * handleUpdateEmailUsername() -> void
   *
   * @description
   * Handles the update email or username form, setting the error and success states
   * to an empty string and calling the backend to update the email or username.
   *
   * @param e - Form Event
   * @returns void
   */
  // const handleUpdateEmailUsername = async (
  //   e: React.FormEvent<HTMLFormElement>
  // ) => {
  //   e.preventDefault();
  //   setError("");
  //   setSuccess("");

  //   const auth = getAuth();
  //   const user = auth.currentUser;

  //   if (!user) {
  //     setError("No user is signed in.");
  //     return;
  //   }

  //   if (!user.email) {
  //     setError("User does not have an email associated with their account.");
  //     return;
  //   }

  //   if (!currentPassword) {
  //     setError("Please provide your current password.");
  //     return;
  //   }

  //   // Check if at least one field is provided
  //   if (!newEmail && !newUsername) {
  //     setError("Please provide a new email or username.");
  //     return;
  //   }

  //   try {
  //     // Re-authenticate the user
  //     const credential = EmailAuthProvider.credential(
  //       user.email,
  //       currentPassword
  //     );
  //     await reauthenticateWithCredential(user, credential);

  //     // If a new email is provided, initiate verifyBeforeUpdateEmail client-side

  //     if (newEmail && newEmail !== user?.email) {
  //       await verifyBeforeUpdateEmail(user!, newEmail);
  //       setSuccess(
  //         "A verification link has been sent to your new email. Please verify it to complete the update."
  //       );
  //     }

  //     // If a new username is provided, update it via server
  //     if (newUsername) {
  //       await axios.put(`${apiURL}/user/${userUID}`, { username: newUsername });
  //       setSuccess((prev) =>
  //         prev
  //           ? prev + " Username updated successfully."
  //           : "Username updated successfully."
  //       );
  //     }
  //   } catch (err: any) {
  //     console.error("Error updating email/username:", err);
  //     setError(err.message || "Failed to update information.");
  //   }
  // };

  // --------------------------------------
  // ------------- Functions --------------
  // --------------------------------------

  /**
   * getUserInfo() -> void
   *
   * @description
   * Fetches user data from the backend using the id provided in the route, this
   * will fetch { firstName, lastName, bio, profileImage, followedBy, followRequests }
   * from the backend and set the user accordingly.
   *
   * @param userId - The id of the user to fetch
   */
  function getUserInfo(userId: string) {
    axios
      .get(`${apiURL}/user/${userId}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((error) => {
        console.error("Error fetching user info:", error);
      });
  }

  // --------------------------------------
  // -------------- Render ----------------
  // --------------------------------------
  return (
    <>
      <Background />
      <AuthProvider>
        <Navbar />
        <div className='main-content'>
          {/******************** EDIT PROFILE  ********************/}
          <div className='profile-management-section'>
            <h2>Edit Profile</h2>

            <form>
              {/* TODO: Profile Image */}
              <div className='input-group'>
                <label htmlFor='profileImage'>Profile Image</label>
                <input
                  type='file'
                  id='profileImage'
                  accept='image/*'
                  // onChange={handleProfileImageChange}
                />
              </div>

              <div className='form-group'>
                {/* TODO: First Name */}
                <div className='input-group'>
                  <label htmlFor='firstName'>First Name</label>
                  <input
                    type='text'
                    id='firstName'
                    placeholder='First Name'
                    value={user?.firstName ? user.firstName : ""}
                    onChange={(e) =>
                      setUser(
                        user ? { ...user, firstName: e.target.value } : null
                      )
                    }
                    required
                  />
                </div>

                {/* TODO: Last Name */}
                <div className='input-group'>
                  <label htmlFor='lastName'>Last Name</label>
                  <input
                    type='text'
                    id='lastName'
                    placeholder='Last Name'
                    value={user?.lastName ? user.lastName : ""}
                    onChange={(e) =>
                      setUser(
                        user ? { ...user, lastName: e.target.value } : null
                      )
                    }
                    required
                  />
                </div>
              </div>

              {/* TODO: Bio */}
              <div className='input-group'>
                <label htmlFor='bio'>Bio</label>
                <textarea
                  id='bio'
                  placeholder='Tell us about yourself...'
                  value={user?.bio ? user.bio : ""}
                  onChange={(e) =>
                    setUser(user ? { ...user, bio: e.target.value } : null)
                  }
                  required
                />
              </div>

              {/* TODO: Phone */}
              <div className='input-group'>
                <label htmlFor='phone'>Phone</label>
                <input
                  type='tel'
                  id='phone'
                  placeholder='(123) 321-1234'
                  value={user?.phone ? user.phone : ""}
                  onChange={(e) =>
                    setUser(user ? { ...user, phone: e.target.value } : null)
                  }
                  required
                />
              </div>

              {/* TODO: Date of Birth */}
              <div className='input-group'>
                <label htmlFor='dob'>Date of Birth</label>
                <input
                  type='date'
                  id='dob'
                  value={user?.dateOfBirth ? user.dateOfBirth : ""}
                  onChange={(e) =>
                    setUser(
                      user ? { ...user, dateOfBirth: e.target.value } : null
                    )
                  }
                  required
                />
              </div>
            </form>
          </div>

          {/******************** EDIT CREDENTIALS  ********************/}
          <div className='profile-management-section'>
            <h2>Edit Credentials</h2>
            <h3>Change Password</h3>
            <form onSubmit={handleChangePassword}>
              <div className='input-group'>
                <label htmlFor='currentPassword'>Current Password</label>
                <input
                  type='password'
                  id='currentPassword'
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div className='form-group'>
                <div className='input-group'>
                  <label htmlFor='newPassword'>New Password</label>
                  <input
                    type='password'
                    id='newPassword'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <div className='input-group'>
                  <label htmlFor='confirmPassword'>Confirm New Password</label>
                  <input
                    type='password'
                    id='confirmPassword'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* {error && <p className='error-message'>{error}</p>}
            {success && <p className='success-message'>{success}</p>} */}

              <button type='submit' className='save-button'>
                Change Password
              </button>
            </form>

            <h3>Change Email</h3>
            <form>
              <div className='input-group'>
                <label htmlFor='newEmail'>New Email</label>
                <input
                  type='email'
                  id='newEmail'
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>

              <div className='input-group'>
                <label htmlFor='currentPassword'>Enter Password</label>
                <input
                  type='password'
                  id='currentPassword'
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              {/* {error && <p className='error-message'>{error}</p>}
            {success && <p className='success-message'>{success}</p>} */}

              <button type='submit' className='save-button'>
                Change Email
              </button>
            </form>

            <h3>Change Username</h3>
            <form>
              <div className='input-group'>
                <label htmlFor='newUsername'>New Username</label>
                <input
                  type='text'
                  id='newUsername'
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
              </div>

              <div className='input-group'>
                <label htmlFor='currentPassword'>Enter Password</label>
                <input
                  type='password'
                  id='currentPassword'
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              {/* {error && <p className='error-message'>{error}</p>}
            {success && <p className='success-message'>{success}</p>} */}

              <button type='submit' className='save-button'>
                Change Username
              </button>
            </form>
          </div>

          {/******************** DELETE ACCOUNT  ********************/}
          <div className='profile-management-section'>
            <h2>Delete Account</h2>
          </div>
        </div>

        <div className='footer'>
          <Footer />
        </div>
      </AuthProvider>
    </>
  );
}
