import AuthFeatureList from "../components/AuthFeatureList.jsx";
import "../styles/auth.css";

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
      <path d="M9.9 4.3A10.8 10.8 0 0 1 12 4c5 0 8.7 3.5 10 8-0.4 1.4-1.1 2.6-2 3.7" />
      <path d="M6.2 6.2C4.6 7.4 3.4 9.2 2 12c1.3 4.5 5 8 10 8 1.3 0 2.5-.2 3.6-.7" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        stroke="none"
        d="M12 2C6.48 2 2 6.58 2 12.24c0 4.53 2.87 8.37 6.84 9.72.5.1.68-.22.68-.49v-1.9c-2.78.62-3.37-1.37-3.37-1.37-.46-1.2-1.11-1.52-1.11-1.52-.91-.64.07-.63.07-.63 1 .08 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.93.86.09-.67.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.2 9.2 0 0 1 12 6.8c.85 0 1.71.12 2.51.36 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9v2.74c0 .27.18.6.69.49A10.25 10.25 0 0 0 22 12.24C22 6.58 17.52 2 12 2Z"
      />
    </svg>
  );
}

export default function Login() {
  return (
    <main className="auth-page">
      <section className="auth-container">

        {/* LOGO */}
        <div className="auth-logo">
          <div className="logo-mark">
            ◈
          </div>

          <div className="logo-text">
            <strong>SD COMPUTERS</strong>
            <small>BUILD YOUR DREAM PC</small>
          </div>
        </div>


        {/* LEFT SIDE */}
        <div className="auth-left">

          <div className="pc-art">
            <img
              src="/assets/login-pc.jpg"
              alt="Gaming PC"
            />
          </div>

          <div className="auth-branding-text">
            <h2>
              High Performance
              <em>PC Components</em>
            </h2>

            <p>
              Build, Upgrade, Dominate.
              <br />
              Your dream setup starts here.
            </p>
          </div>

          <AuthFeatureList />

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

            <MailIcon />

            <input
              type="email"
              placeholder="Email address"
              autoComplete="email"
            />

          </div>


          {/* PASSWORD */}
          <div className="auth-input">

            <LockIcon />

            <input
              type="password"
              placeholder="Password"
              autoComplete="current-password"
            />

            <button
              type="button"
              className="password-toggle"
              aria-label="Show password"
            >
              <EyeOffIcon />
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
            <span>Login</span>
            <ArrowRightIcon />
          </button>


          {/* DIVIDER */}
          <div className="divider">
            <span>OR</span>
          </div>


          {/* SOCIAL BUTTONS */}
          <div className="social-buttons">

            <button type="button">
              <span className="google-icon">
                G
              </span>

              <span>
                Continue with Google
              </span>
            </button>


            <button type="button">

              <GithubIcon />

              <span>
                Continue with GitHub
              </span>

            </button>

          </div>


          {/* REGISTER */}
          <footer>
            Don't have an account?

            <a href="/register">
              Register
            </a>
          </footer>

        </form>


        {/* COPYRIGHT */}
        <small className="copyright">
          © 2026 SD Computers. All rights reserved.
        </small>

      </section>
    </main>
  );
}