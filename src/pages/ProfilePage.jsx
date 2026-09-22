import { useState } from "react";
import { User, Mail, LogOut, Heart } from "lucide-react";
import { authService } from "../services/authService.js";
import PageState from "../components/PageState.jsx";
import { useStore } from "../store/StoreContext.jsx";

/**
 * Profile page. Shows the currently authenticated user (from the JWT
 * session stored by authService) with the option to log out. If no user
 * is signed in, a login prompt is shown.
 */
export default function ProfilePage() {
  const { wishlistCount, cartCount } = useStore();
  const [loggingOut, setLoggingOut] = useState(false);

  const user = authService.getUser();

  if (!user) {
    return (
      <div className="profile-wrap">
        <PageState
          variant="empty"
          title="You are not signed in."
          message="Login to view your account and track your orders."
        />
        <div className="profile-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              window.location.href = "/login";
            }}
          >
            Login
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              window.location.href = "/register";
            }}
          >
            Create Account
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    setLoggingOut(true);
    authService.clearSession();
    window.location.href = "/";
  };

  return (
    <div className="profile-wrap">
      <div className="profile-card">
        <div className="profile-avatar">
          {user.name.trim().charAt(0).toUpperCase()}
        </div>
        <h2>{user.name}</h2>
        <p className="profile-email">
          <Mail size={15} /> {user.email}
        </p>

        <div className="profile-stats">
          <div>
            <strong>{wishlistCount}</strong>
            <span>
              <Heart size={14} /> Wishlist
            </span>
          </div>
          <div>
            <strong>{cartCount}</strong>
            <span>Cart Items</span>
          </div>
        </div>

        <button
          type="button"
          className="logout-btn"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          <LogOut size={16} />
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>

      <div className="profile-meta">
        <p>
          <User size={15} /> Signed in as <strong>{user.email}</strong>
        </p>
      </div>
    </div>
  );
}