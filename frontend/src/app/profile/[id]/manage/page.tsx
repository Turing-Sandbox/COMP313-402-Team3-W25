"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
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
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
  const [imageError, setImageError] = useState("");
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

  // Update profile image if it exists
  useEffect(() => {
    if (user?.profileImage) {
      setProfileImagePreview(user.profileImage);
    }
  }, [user]);

  /**
   * @description
   * Handles the file upload for the thumbnail, and sets the thumbnail preview
   * to the file that was uploaded. If the file is not an image, or one was not provided, it
   * will throw and error indicating that the thumbnail was not set and to try again.
   *
   * @param e - Change Event for Thumbnail File
   * @returns void
   */
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError("");
    const file = e.target.files ? e.target.files[0] : null;

    if (file && file.type.startsWith("image/")) {
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    } else {
      setProfileImage(null);
      setProfileImagePreview(null);
      setImageError("Please select a valid image file.");
    }
  };

  /**
   * @description
   * Handles the edit profile form, setting the error and success states
   * to an empty string and calling the backend to update the user profile.
   *
   * @param e - Form Event
   * @returns void
   */

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
      setErrorEditProfile("Please fill out all fields with: *.");
      return;
    }

    // 2- Send upload image request to backend if profile image exists
    if (profileImage) {
      await uploadProfileImage();
    }

    // 3- Update user profile
    try {
      const res = await axios.put(`${apiURL}/user/${id}`, user);

      // 3- Handle response
      if (res.status === 200 || res.status === 201) {
        setSuccessEditProfile("Profile updated successfully.");
      } else {
        setErrorEditProfile("An error occurred. Please try again.");
      }
    } catch (error) {
      setErrorEditProfile("Failed to update profile. Please try again.");
    }
  };

  /**
   * @description
   * Uploads the profile image to the backend, and sets the user's profile image
   * to the new profile image.
   *
   * @returns void
   */
  const uploadProfileImage = async () => {
    if (!user) {
      setErrorEditProfile("No user found.");
      return;
    }

    if (!profileImage) {
      setErrorEditProfile("No profile image found.");
      return;
    }

    const oldProfileImage = user.profileImage || "";

    try {
      const formData = new FormData();
      formData.append("profileImage", profileImage);
      formData.append("oldProfileImage", oldProfileImage);

      const res = await axios.post(
        `${apiURL}/user/upload-profile-image`,
        formData
      );

      if (res.status === 200 || res.status === 201) {
        user.profileImage = res.data.url;
      } else {
        console.error("Error uploading profile image:", res);
        setErrorEditProfile("An error occurred. Please try again.");
        return;
      }
    } catch (error) {
      setErrorEditProfile("Failed to upload profile image. Please try again.");
      return;
    }
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

            <form onSubmit={handleEditProfile}>
              {/* TODO: Profile Image */}
              <div className='profile-image-section'>
                <div className='input-group'>
                  {profileImagePreview ? (
                    <Image
                      src={profileImagePreview}
                      width={200}
                      height={200}
                      alt='Profile Picture'
                      className='profile-edit-image'
                    />
                  ) : (
                    <h1 className='profile-edit-image profile-initial'>
                      {user?.username[0].toUpperCase()}
                    </h1>
                  )}
                </div>

                <div>
                  <label
                    htmlFor='profile-image'
                    className='profile-image-upload'
                  >
                    {profileImage ? "Change" : "Upload"} Profile Image
                  </label>
                  <input
                    id='profile-image'
                    type='file'
                    accept='image/*'
                    onChange={handleProfileImageChange}
                  />
                  {imageError && <p className='error-message'>{imageError}</p>}
                </div>
              </div>

              <div className='form-group'>
                {/* TODO: First Name */}
                <div className='input-group'>
                  <label htmlFor='firstName'>First Name *</label>
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
                  />
                </div>

                {/* TODO: Last Name */}
                <div className='input-group'>
                  <label htmlFor='lastName'>Last Name *</label>
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
                />
              </div>

              {errorEditProfile && (
                <p className='error-message'>{errorEditProfile}</p>
              )}

              {successEditProfile && (
                <p className='success-message'>{successEditProfile}</p>
              )}

              <button type='submit' className='save-button'>
                Save Changes
              </button>
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
            <p>
              By checking this box, I acknoledge the account will be deleted
              from this platform as well as all the content related. There is no
              recovery once an account is deleted.
            </p>
          </div>
        </div>

        <div className='footer'>
          <Footer />
        </div>
      </AuthProvider>
    </>
  );
}
