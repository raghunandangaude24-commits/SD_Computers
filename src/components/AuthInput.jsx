export default function AuthInput({ icon, type = "text", placeholder }) {
  return (
    <label className="auth-input">
      <span>{icon}</span>
      <input type={type} placeholder={placeholder} required />
    </label>
  );
}
