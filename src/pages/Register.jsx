import { useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Lock,
  EyeOff,
  Eye,
  ArrowRight,
} from "lucide-react";

import "../styles/auth.css";
import logo from "../assets/sd-computers-logo.svg";
import { useStore } from "../store/StoreContext.jsx";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const navigate = useNavigate();
  const { register, user, authReady } = useStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCode, setPhoneCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const redirectTimer = useRef(null);

  // Already signed in? Go home (after the stored session is validated).
  // `success` holds the redirect for the ~1s the confirmation banner shows,
  // otherwise this guard would fire the instant signup sets `user`.
  if (authReady && user && !success) {
    return <Navigate to="/" replace />;
  }

  const validate = () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (cleanName.length < 2) return "Please enter your full name.";
    if (!EMAIL_RE.test(cleanEmail)) return "Please enter a valid email address.";
    if (!/^\d{10}$/.test(phone.replace(/\D/g, ""))) {
      return "Please enter a valid 10 digit mobile number.";
    }
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";
    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        phone: `${phoneCode}${phone.replace(/\D/g, "")}`,
        password,
      });

      // Account is created and already signed in — straight to the store.
      setSuccess("Account created successfully!");
      redirectTimer.current = setTimeout(() => {
        navigate("/", { replace: true });
      }, 1200);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
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


      {/* REGISTER CARD */}
      <form
        className="auth-card register-card"
        onSubmit={handleSubmit}
        noValidate
      >
        <h1>Create Account</h1>

        <p>
          Fill in your details to get started
        </p>

        {/* ERROR */}
        {error && (
          <div className="auth-message error">
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="auth-message success">
            {success} Taking you to the store...
          </div>
        )}


        {/* FULL NAME */}
        <div className="auth-input">
          <User />

          <input
            type="text"
            aria-label="Full name"
            placeholder="Full Name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>


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


        {/* PHONE */}
        <div className="phone-row">

          <select
            aria-label="Country code"
            value={phoneCode}
            onChange={(event) => setPhoneCode(event.target.value)}
          >
            <option value="+91">+91</option>
            <option value="+1">+1</option>
            <option value="+44">+44</option>
          </select>


          <div className="auth-input">

            <Phone />

            <input
              type="tel"
              aria-label="Mobile number"
              placeholder="10 digit mobile number"
              required
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />

          </div>

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


        {/* CONFIRM PASSWORD */}
        <div className="auth-input">
          <Lock />

          <input
            type={showConfirm ? "text" : "password"}
            aria-label="Confirm password"
            placeholder="Confirm password"
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />

          <button
            type="button"
            className="password-toggle"
            aria-label={showConfirm ? "Hide password" : "Show password"}
            onClick={() => setShowConfirm((visible) => !visible)}
          >
            {showConfirm ? <Eye /> : <EyeOff />}
          </button>
        </div>


        {/* TERMS */}
        <label className="terms">

          <input
            type="checkbox"
            required
            defaultChecked
          />

          <span>
            I agree to the{" "}
            <Link to="/terms">Terms &amp; Conditions</Link>{" "}
            and{" "}
            <Link to="/privacy">Privacy Policy</Link>
          </span>

        </label>


        {/* REGISTER BUTTON */}
        <button
          className="primary-button"
          type="submit"
          disabled={loading || !authReady}
        >
          {loading ? "Creating Account..." : "Create Account"}
          {!loading && <ArrowRight />}
        </button>


        {/* FOOTER */}
        <footer>
          Already have an account?
          <Link to="/login">Login</Link>
        </footer>

      </form>


      {/* COPYRIGHT */}
      <small className="copyright">
        © 2026 SD Computers. All rights reserved.
      </small>

    </main>
  );
}