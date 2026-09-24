import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  LogOut,
  Heart,
  Package,
  KeyRound,
  PencilLine,
} from "lucide-react";
import { useStore } from "../store/StoreContext.jsx";
import { userService } from "../services/userService.js";
import { orderService } from "../services/orderService.js";
import PageState from "../components/PageState.jsx";
import OrderCard from "../components/OrderCard.jsx";
import Breadcrumbs from "../components/Breadcrumbs.jsx";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "edit", label: "Edit Profile" },
  { id: "password", label: "Change Password" },
  { id: "orders", label: "My Orders" },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, wishlistCount, cartCount, logout, refreshProfile } = useStore();
  const [tab, setTab] = useState("overview");
  const [loggingOut, setLoggingOut] = useState(false);

  // Edit profile form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileBusy, setProfileBusy] = useState(false);

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordBusy, setPasswordBusy] = useState(false);

  // Recent orders
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(false);
  const ordersLoadedRef = useRef(false);

  useEffect(() => {
    if (user) {
      // Sync the profile form when the signed-in user is (re)loaded.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  useEffect(() => {
    if (tab !== "orders" || ordersLoadedRef.current) return undefined;

    let cancelled = false;
    setOrdersLoading(true);
    orderService
      .list()
      .then((data) => {
        if (cancelled) return;
        setOrders(data.slice(0, 3));
        ordersLoadedRef.current = true;
      })
      .catch(() => {
        if (!cancelled) setOrdersError(true);
      })
      .finally(() => {
        if (!cancelled) setOrdersLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tab]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    navigate("/");
    window.scrollTo({ top: 0 });
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setProfileMessage("");
    setProfileError("");

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    if (cleanName.length < 2) {
      setProfileError("Please enter your full name.");
      return;
    }
    if (!EMAIL_RE.test(cleanEmail)) {
      setProfileError("Please enter a valid email address.");
      return;
    }
    if (!/^\d{10,15}$/.test(phone.replace(/\D/g, ""))) {
      setProfileError("Please enter a valid phone number.");
      return;
    }

    setProfileBusy(true);
    try {
      await userService.updateProfile({
        name: cleanName,
        email: cleanEmail,
        phone: phone.trim(),
      });
      await refreshProfile();
      setProfileMessage("Profile updated successfully.");
    } catch (err) {
      setProfileError(err.message || "Could not update your profile.");
    } finally {
      setProfileBusy(false);
    }
  };

  const savePassword = async (event) => {
    event.preventDefault();
    setPasswordMessage("");
    setPasswordError("");

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }

    setPasswordBusy(true);
    try {
      await userService.updatePassword({
        currentPassword,
        newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setPasswordMessage("Password updated successfully.");
    } catch (err) {
      setPasswordError(err.message || "Could not update your password.");
    } finally {
      setPasswordBusy(false);
    }
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <div className="profile-page">
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "My Account" },
        ]}
      />
      <div className="profile-head">
        <div className="profile-avatar">
          {user?.name?.trim().charAt(0).toUpperCase()}
        </div>
        <div className="profile-head-text">
          <h1>{user?.name}</h1>
          <p className="profile-email">
            <Mail size={15} /> {user?.email}
          </p>
          {memberSince && <small>Member since {memberSince}</small>}
        </div>
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
          <div>
            <strong>{orders.length}</strong>
            <span>
              <Package size={14} /> Recent Orders
            </span>
          </div>
        </div>
      </div>

      <div className="profile-tabs" role="tablist">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={tab === item.id ? "active" : ""}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="profile-body">
        {tab === "overview" && (
          <div className="overview-grid">
            <div className="info-card">
              <h3>
                <User size={16} /> Account
              </h3>
              <p>
                Signed in as <strong>{user?.email}</strong>
              </p>
              <p>
                Phone <strong>{user?.phone || "—"}</strong>
              </p>
              <p>
                Role <strong>{user?.role}</strong>
              </p>
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
            <div className="info-card quick-links">
              <h3>Quick Links</h3>
              <Link to="/orders">My Orders →</Link>
              <Link to="/wishlist">Wishlist →</Link>
              <Link to="/cart">Cart →</Link>
              <Link to="/search">Shop →</Link>
            </div>
          </div>
        )}

        {tab === "edit" && (
          <form className="panel-form" onSubmit={saveProfile}>
            <h3>
              <PencilLine size={16} /> Edit Profile
            </h3>

            <label className="field">
              <span>Full Name</span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                aria-label="Full name"
              />
            </label>

            <label className="field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-label="Email"
              />
            </label>

            <label className="field">
              <span>Phone</span>
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                aria-label="Phone"
              />
            </label>

            {profileError && <p className="form-error">{profileError}</p>}
            {profileMessage && <p className="form-success">{profileMessage}</p>}

            <button className="btn btn-primary" type="submit" disabled={profileBusy}>
              {profileBusy ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}

        {tab === "password" && (
          <form className="panel-form" onSubmit={savePassword}>
            <h3>
              <KeyRound size={16} /> Change Password
            </h3>

            <label className="field">
              <span>Current Password</span>
              <input
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                aria-label="Current password"
              />
            </label>

            <label className="field">
              <span>New Password</span>
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="At least 8 characters"
                aria-label="New password"
              />
            </label>

            {passwordError && <p className="form-error">{passwordError}</p>}
            {passwordMessage && <p className="form-success">{passwordMessage}</p>}

            <button className="btn btn-primary" type="submit" disabled={passwordBusy}>
              {passwordBusy ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}

        {tab === "orders" && (
          <div className="orders-panel">
            <h3>Recent Orders</h3>
            {ordersLoading ? (
              <PageState variant="loading" title="Loading your orders..." />
            ) : ordersError ? (
              <PageState
                variant="error"
                title="Unable to load orders."
                message="Make sure the backend is running."
              />
            ) : orders.length === 0 ? (
              <div className="empty-with-cta">
                <PageState
                  variant="empty"
                  title="No orders yet."
                  message="When you place an order it will appear here."
                />
                <Link to="/search" className="btn btn-primary">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
                <Link to="/orders" className="all-orders-link">
                  View all orders →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}