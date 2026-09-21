import {
  Mail,
  Lock,
  EyeOff,
  ArrowRight,
} from "lucide-react";

import "../styles/auth.css";

export default function Login() {
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


      {/* LOGIN CARD */}
      <form
        className="auth-card"
        onSubmit={(event) => event.preventDefault()}
      >
        <h1>Welcome Back</h1>

        <p>
          Login to your account to continue
        </p>


        {/* EMAIL */}
        <div className="auth-input">
          <Mail />

          <input
            type="email"
            placeholder="Email address"
            required
          />
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


        {/* OPTIONS */}
        <div className="auth-options">

          <label className="remember">
            <input type="checkbox" />
            <span>Remember me</span>
          </label>

          <a href="#forgot">
            Forgot password?
          </a>

        </div>


        {/* LOGIN BUTTON */}
        <button
          className="primary-button"
          type="submit"
        >
          Login
          <ArrowRight />
        </button>


        {/* DIVIDER */}
        <div className="divider">
          <span>OR</span>
        </div>


        {/* SOCIAL LOGIN */}
        <div className="social-buttons">

          <button type="button">

            <svg
              className="brand-icon"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M21.35 12.27c0-.79-.07-1.55-.22-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.44h3.14c1.84-1.69 2.91-4.18 2.91-7.41Z"
              />
              <path
                fill="currentColor"
                d="M12 21.5c2.63 0 4.83-.87 6.44-2.36l-3.14-2.44c-.87.58-1.98.92-3.3.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.52A9.73 9.73 0 0 0 12 21.5Z"
              />
              <path
                fill="currentColor"
                d="M6.54 13.59a5.85 5.85 0 0 1 0-3.18V7.89H3.3a9.74 9.74 0 0 0 0 8.22l3.24-2.52Z"
              />
              <path
                fill="currentColor"
                d="M12 6.38c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.82 3.5 14.62 2.5 12 2.5a9.73 9.73 0 0 0-8.7 5.39l3.24 2.52C7.31 8.1 9.46 6.38 12 6.38Z"
              />
            </svg>

            Continue with Google

          </button>


          <button type="button">

            <svg
              className="brand-icon github-icon"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M12 .5A11.5 11.5 0 0 0 8.36 22.9c.58.11.79-.25.79-.56v-2.18c-3.23.7-3.91-1.56-3.91-1.56-.53-1.38-1.3-1.75-1.3-1.75-1.06-.72.08-.7.08-.7 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.72 1.27 3.38.97.1-.75.41-1.27.74-1.56-2.58-.29-5.29-1.29-5.29-5.75 0-1.27.45-2.3 1.2-3.11-.12-.29-.52-1.47.11-3.07 0 0 .98-.31 3.2 1.19a11.1 11.1 0 0 1 5.83 0c2.22-1.5 3.2-1.19 3.2-1.19.63 1.6.23 2.78.11 3.07.75.81 1.2 1.84 1.2 3.11 0 4.47-2.72 5.46-5.31 5.75.42.36.79 1.07.79 2.16v3.2c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"
              />
            </svg>

            Continue with GitHub

          </button>

        </div>


        {/* FOOTER */}
        <footer>
          Don't have an account?
          <a href="/register">Register</a>
        </footer>

      </form>


      {/* COPYRIGHT */}
      <small className="copyright">
        © 2026 SD Computers. All rights reserved.
      </small>

    </main>
  );
}