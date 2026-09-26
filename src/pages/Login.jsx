import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  EyeOff,
  Eye,
  ArrowRight,
} from "lucide-react";

import "../styles/auth.css";
import logo from "../assets/sd-computers-logo.svg";
import { useStore } from "../store/StoreContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, authReady } = useStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Already signed in? Go home (after the stored session is validated).
  if (authReady && user) {
    return <Navigate to="/" replace />;
  }

  const from = location.state?.from || "/";

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      await login(cleanEmail, password, remember);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">

      {/* LOGO */}
      <div className="auth-logo">
        <img className="auth-logo-img" src={logo} alt="SD Computers logo" />

        <div className="logo-text">
          <strong>SD COMPUTERS</strong>
          <small>BUILD YOUR DREAM PC</small>
        </div>
      </div>


      {/* LOGIN CARD */}
      <form
        className="auth-card"
        onSubmit={handleSubmit}
        noValidate
      >
        <h1>Welcome Back</h1>

        <p>
          Login to your account to continue
        </p>

        {/* ERROR */}
        {error && (
          <div className="auth-message error">
            {error}
          </div>
        )}


        {/* EMAIL */}
        <div className="auth-input">
          <Mail />

          <input
            type="email"
            aria-label="Email address"
            placeholder="Email address"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>


        {/* PASSWORD */}
        <div className="auth-input">
          <Lock />

          <input
            type={showPassword ? "text" : "password"}
            aria-label="Password"
            placeholder="Password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <button
            type="button"
            className="password-toggle"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((visible) => !visible)}
          >
            {showPassword ? <Eye /> : <EyeOff />}
          </button>
        </div>


        {/* OPTIONS */}
        <div className="auth-options">

          <label className="remember">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
            />
            <span>Remember me</span>
          </label>

          <span className="forgot-hint" title="Password recovery is not available yet">
            Forgot password?
          </span>

        </div>


        {/* LOGIN BUTTON */}
        <button
          className="primary-button"
          type="submit"
          disabled={loading || !authReady}
        >
          {loading ? "Logging in..." : "Login"}
          {!loading && <ArrowRight />}
        </button>


        {/* FOOTER */}
        <footer>
          Don't have an account?
          <Link to="/register">Register</Link>
        </footer>

      </form>


      {/* COPYRIGHT */}
      <small className="copyright">
        © 2026 SD Computers. All rights reserved.
      </small>

    </main>
  );
}