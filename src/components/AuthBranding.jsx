export default function AuthBranding({ register = false }) {
  const image = register
    ? "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=900&q=85"
    : "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=900&q=85";

  return (
    <section className="auth-branding">
      <div className="auth-logo">
        <div className="logo-mark">?</div>
        <div>
          <strong>SD COMPUTERS</strong>
          <small>BUILD YOUR DREAM PC</small>
        </div>
      </div>

      <div className="pc-art">
        <img src={image} alt="Gaming PC" />
      </div>

      <h2>
        {register ? "Join " : "High Performance"}
        <em>{register ? "SD Computers" : "PC Components"}</em>
      </h2>

      <p>
        {register
          ? "Create your account and get access to exclusive deals, build your dream PC and more!"
          : "Build, Upgrade, Dominate. Your dream setup starts here."}
      </p>
    </section>
  );
}
