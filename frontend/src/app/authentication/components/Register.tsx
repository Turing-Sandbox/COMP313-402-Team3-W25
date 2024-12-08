/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import "../styles/authentication.scss";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/AuthProvider";
import { apiURL } from "@/app/scripts/api";

function Register() {
  // ---------------------------------------
  // -------------- Variables --------------
  // ---------------------------------------
  const [error, setError] = useState("");
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();
  const auth = useAuth();

  // ---------------------------------------
  // ------------ Event Handler ------------
  // ---------------------------------------

  // Check if passwords match
  useEffect(() => {
    if (user.password !== user.confirmPassword) {
      setError("Passwords do not match");
    } else {
      setError("");
    }
  }, [user.password, user.confirmPassword]);

  // ---------------------------------------
  // -------------- Functions --------------
  // ---------------------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1 - Reset Error Message
    setError("");

    // 2 - Validate user input
    if (user.password !== user.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // 3 - Register user
    axios
      .post(`${apiURL}/user/register`, user)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          const userUID = res.data.userUID;
          const token = res.data.token;

          // 3 - Set User Session (Save Token and User UID)
          auth.login(token, userUID);

          // 4 - Redirect to home page
          router.push("/");

          // 5 - Error Handling
        } else {
          setError("An error occurred. Please try again.");
        }
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          setError(error.response.data.error);
        } else {
          setError("An error occurred. Please try again.");
        }
      });
  };

  // Redirect to home page if user is already logged in
  if (auth.getUserUID() !== null && auth.getToken() !== null) {
    router.push("/");
  }

  // --------------------------------------
  // -------------- Render ----------------
  // --------------------------------------
  return (
    <>
      <div className='container'>
        <div className='auth-box'>
          <h1 className='auth-title summarizz-logo'>Summarizz</h1>

          <form className='auth-form' onSubmit={handleSubmit}>
            <input
              type='text'
              value={user.firstName}
              onChange={handleChange}
              name='firstName'
              id='firstName'
              placeholder='First Name'
              className='auth-input'
              required
            />
            <input
              type='text'
              value={user.lastName}
              onChange={handleChange}
              name='lastName'
              id='lastName'
              placeholder='Last Name'
              className='auth-input'
              required
            />
            <input
              type='text'
              value={user.username}
              onChange={handleChange}
              name='username'
              id='username'
              placeholder='Username'
              className='auth-input'
              required
            />
            <input
              type='email'
              value={user.email}
              onChange={handleChange}
              name='email'
              id='email'
              placeholder='Email'
              className='auth-input'
              required
            />
            <input
              type='password'
              value={user.password}
              onChange={handleChange}
              name='password'
              id='password'
              placeholder='Password'
              className='auth-input'
              required
            />
            <input
              type='password'
              value={user.confirmPassword}
              onChange={handleChange}
              name='confirmPassword'
              id='confirmPassword'
              placeholder='Confirm Password'
              className='auth-input'
              required
            />

            {error && <p className='auth-error'>{error}</p>}

            <button type='submit' className='auth-button'>
              Register
            </button>
          </form>

          {/* --------------------------------------------------------- */}
          {/* ------------------------- OAUTH ------------------------- */}
          {/* --------------------------------------------------------- */}


          {/* --------------------------------------------------------- */}
          {/* ------------------------- OAUTH ------------------------- */}
          {/* --------------------------------------------------------- */}

          <a href='/authentication/login' className='auth-link'>
            <p>
              Already have an account? <b>Login</b>
            </p>
          </a>
        </div>
      </div>
    </>
  );
}

export default Register;
