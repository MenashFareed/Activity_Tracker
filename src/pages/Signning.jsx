import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Button from "../components/Button";
import Divider from "../components/Divider";
import Input from "../components/Input";
import { useAuth } from "../contexts/auth/AuthContext";

function Signning() {
  const { signUp, signIn, signInWithGoogle, resetPassword } = useAuth();
  const history = useHistory();

  const initialValues = { email: "", password: "" };

  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = values;
    if (!email || !password) {
      return setError("Please fill in all fields");
    }

    try {
      setLoading(true);
      await signIn(email, password);
      history.push("/");
    } catch (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = values;
    if (!email || !password) {
      return setError("Please fill in all fields");
    }

    try {
      setLoading(true);
      await signUp(email, password);

      history.push("/");
    } catch (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      await signInWithGoogle();
      history.push("/");
    } catch (error) {
      setError(error.message);
    }

    setGoogleLoading(false);
  };

  const handlePassword = async () => {
    setMessage(null);
    setError(null);

    const { email } = values;

    if (!email) {
      return setError("Please enter an email first");
    }

    try {
      setLoading(true);
      await resetPassword(email);
      setMessage("Successfully sent email reset link");
    } catch (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    const signUpButton = document.getElementById("signUp");
    const signInButton = document.getElementById("signIn");
    const container = document.getElementById("container");

    signUpButton.addEventListener("click", () => {
      container.classList.add("right-panel-active");
    });

    signInButton.addEventListener("click", () => {
      container.classList.remove("right-panel-active");
    });
  }, []);

  return (
    <div class="container" id="container">
      <div class="form-container sign-up-container">
        <form action="#">
          <h1>Create Account</h1>
          <Input
            name="email"
            type="email"
            placeholder="Enter email address.."
            value={values.email}
            handleChange={handleChange}
          />
          <Input
            name="password"
            type="password"
            placeholder="Enter password.."
            value={values.password}
            handleChange={handleChange}
          />
          <Button
            value="Sign Up"
            type="submit"
            variant="primary"
            action={handleSignUpSubmit}
            loading={loading}
            fullWidth
          />
          {error && <div className="text-red-600">{error}</div>}
        </form>
      </div>
      <div class="form-container sign-in-container">
        <form action="#">
          <h1>Sign in</h1>
          <Input
            name="email"
            type="email"
            placeholder="Enter email address.."
            value={values.email}
            handleChange={handleChange}
          />
          <Input
            name="password"
            type="password"
            placeholder="Enter password.."
            value={values.password}
            handleChange={handleChange}
          />
          <div
            onClick={handlePassword}
            className="flex justify-end text-sm text-primary cursor-pointer"
          >
            <p>Forgot password?</p>
          </div>
          <Button
            value="Sign In"
            type="submit"
            variant="primary"
            action={handleSignInSubmit}
            loading={loading}
            fullWidth
          />
          {message && (
            <div className="text-primary font-semibold">{message}</div>
          )}
          {error && <div className="text-red-600">{error}</div>}
          <Divider text="or" />
      <Button
        value="Continue with Google"
        type="submit"
        variant="frame"
        action={handleGoogleSignIn}
        loading={googleLoading}
        fullWidth
      />
        </form>
        
      </div>
      
      <div class="overlay-container">
        <div class="overlay">
          <div class="overlay-panel overlay-left">
            <h1 id="overlay-text">Already Better?</h1>
            <p id="overlay-text">
              To keep improving with us please login with your personal info
            </p>
            <button class="ghost" id="signIn">
              Sign In
            </button>
          </div>
          <div class="overlay-panel overlay-right">
            <h1 id="overlay-text">First Time?</h1>
            <p id="overlay-text">
              Create an account here and start journey with us
            </p>
            <button class="ghost" id="signUp">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signning;
