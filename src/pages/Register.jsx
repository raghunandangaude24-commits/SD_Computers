import {
  User,
  Mail,
  Phone,
  Lock,
  EyeOff,
  ArrowRight,
} from "lucide-react";

import "../styles/auth.css";

export default function Register() {
  return (
    <main className="auth-page">

      {/* LOGO */}
      <div className="auth-logo">
        <div className="logo-mark">◈</div>

        <div className="logo-text">
          <strong>SD COMPUTERS</strong>
          <small>BUILD YOUR DREAM PC</small>
        </div>
      </div>


      {/* REGISTER CARD */}
      <form
        className="auth-card register-card"
        onSubmit={(event) => event.preventDefault()}
      >
        <h1>Create Account</h1>

        <p>
          Fill in your details to get started
        </p>


        {/* FULL NAME */}
        <div className="auth-input">
          <User />

          <input
            type="text"
            placeholder="Full Name"
            required
          />
        </div>


        {/* EMAIL */}
        <div className="auth-input">
          <Mail />

          <input
            type="email"
            placeholder="Email address"
            required
          />
        </div>


        {/* PHONE */}
        <div className="phone-row">

          <select
            defaultValue="+91"
            aria-label="Country code"
          >
            <option value="+91">+91</option>
            <option value="+1">+1</option>
            <option value="+44">+44</option>
          </select>


          <div className="auth-input">

            <Phone />

            <input
              type="tel"
              placeholder="10 digit mobile number"
              required
            />

          </div>

        </div>


        {/* PASSWORD */}
        <div className="auth-input">
          <Lock />

          <input
            type="password"
            placeholder="Password"
            required
          />

          <button
            type="button"
            className="password-toggle"
            aria-label="Show password"
          >
            <EyeOff />
          </button>
        </div>


        {/* CONFIRM PASSWORD */}
        <div className="auth-input">
          <Lock />

          <input
            type="password"
            placeholder="Confirm password"
            required
          />

          <button
            type="button"
            className="password-toggle"
            aria-label="Show password"
          >
            <EyeOff />
          </button>
        </div>


        {/* TERMS */}
        <label className="terms">

          <input
            type="checkbox"
            required
          />

          <span>
            I agree to the{" "}
            <a href="#terms">
              Terms & Conditions
            </a>{" "}
            and{" "}
            <a href="#privacy">
              Privacy Policy
            </a>
          </span>

        </label>


        {/* REGISTER BUTTON */}
        <button
          className="primary-button"
          type="submit"
        >
          Create Account
          <ArrowRight />
        </button>


        {/* FOOTER */}
        <footer>
          Already have an account?
          <a href="/login">Login</a>
        </footer>

      </form>


      {/* COPYRIGHT */}
      <small className="copyright">
        © 2026 SD Computers. All rights reserved.
      </small>

    </main>
  );
}