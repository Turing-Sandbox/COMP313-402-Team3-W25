// src/modules/user/controllers/userController.ts
import { Request, Response } from "express";
import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  register,
  login,
  followUser,
  unfollowUser,
  requestFollow,
  changePassword,
  changeEmail,
  changeUsername,
} from "../services/userService";
import { IncomingForm } from "formidable";
import { StorageService } from "../../storage-module/services/serviceStorage";

// ----------------------------------------------------------
// --------------------- Authentication ---------------------
// ----------------------------------------------------------

export async function registerUserController(req: Request, res: Response) {
  console.log("Registering user...");
  const { firstName, lastName, username, email, password } = req.body;

  try {
    const response = await register(
      firstName,
      lastName,
      username,
      email,
      password
    );
    res.status(201).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || "Failed to register user" });
  }
}

export async function loginUserController(req: Request, res: Response) {
  console.log("Logging in user...");
  const { email, password } = req.body;

  try {
    const response = await login(email, password);
    res.status(201).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || "Failed to login user" });
  }
}

// ----------------------------------------------------------
// ---------------------- User - CRUD -----------------------
// ----------------------------------------------------------

export async function uploadProfileImageController(
  req: Request,
  res: Response
) {
  console.log("Uploading Profile Image...");
  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing form: ", err);
      return res.status(500).json({ error: "Failed to upload profile image." });
    }

    const file = files.profileImage[0];
    const fileName = file.newFilename;
    const fileType = file.mimetype;

    // Delete old profile image if it exists
    const oldProfileImage = fields.oldProfileImage;
    if (oldProfileImage) {
      try {
        await StorageService.deleteFile(oldProfileImage);
      } catch (error) {
        console.error("Error deleting old profile image: ", error);
      }
    }

    // Upload profile image to storage
    try {
      // Upload profile image
      const response = await StorageService.uploadFile(
        file,
        "profileImage",
        fileName,
        fileType
      );

      res.status(201).json(response);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: error.message || "Failed to upload profile image" });
    }
  });
}

// Create User
export async function createUserController(req: Request, res: Response) {
  const { firstName, lastName, username, email, password } = req.body;

  try {
    await createUser(firstName, lastName, username, email, password);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create user" });
  }
}

// Get User
export async function getUserController(req: Request, res: Response) {
  console.log("Fetching user...");
  const { uid } = req.params;

  try {
    const user = await getUser(uid);
    if (user) res.status(200).json(user);
    else res.status(404).json({ error: "User not found" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
}

// Update User
export async function updateUserController(req: Request, res: Response) {
  const { uid } = req.params;
  const data = req.body;
  try {
    await updateUser(uid, data);
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to update user" });
  }
}

// Change Password
export async function changePasswordController(req: Request, res: Response) {
  const { userId } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    await changePassword(userId, currentPassword, newPassword);
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ error: error.message || "Failed to update password" });
  }
}

// Change Email Controller
export async function changeEmailController(req: Request, res: Response) {
  const { userId } = req.params;
  const { currentPassword, newEmail } = req.body;

  try {
    await changeEmail(userId, currentPassword, newEmail);

    // If a new email was requested, let the user know about the verification email
    res.status(200).json({
      message:
        "A verification email has been sent to your new email address. Please check your inbox and verify it to complete the email update.",
    });
  } catch (error: any) {
    console.error("Error updating email/username:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to update email/username" });
  }
}

// Update username
export async function changeUsernameController(req: Request, res: Response) {
  const { userId } = req.params;
  const { newUsername } = req.body;

  try {
    await changeUsername(userId, newUsername);

    res.status(200).json({ message: "Username updated successfully" });
  } catch (error: any) {
    console.error("Error updating email/username:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to update email/username" });
  }
}

// Delete User
export async function deleteUserController(req: Request, res: Response) {
  const { uid } = req.params;
  const { password, email } = req.body;

  try {
    await deleteUser(uid, password, email);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message || "Failed to delete user" });
  }
}

// ----------------------------------------------------------
// -------------------- User Interactions -------------------
// ----------------------------------------------------------

// Profile View - Follow User
export async function followUserController(req: Request, res: Response) {
  const { userId, targetId } = req.params;
  try {
    await followUser(userId, targetId);
    res.status(200).json({ message: "User followed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to follow user" });
  }
}

// Profile View - Unfollow User
export async function unfollowUserController(req: Request, res: Response) {
  const { userId, targetId } = req.params;
  try {
    await unfollowUser(userId, targetId);
    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to unfollow user" });
  }
}

// Profile View - Request Follow
export async function requestFollowController(req: Request, res: Response) {
  const { userId, targetId } = req.params;
  try {
    await requestFollow(userId, targetId);
    res.status(200).json({ message: "Follow request sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to send follow request" });
  }
}
