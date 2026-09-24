import { useEffect } from "react";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import { StoreProvider } from "./store/StoreContext.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import StoreSidebar from "./components/StoreSidebar.jsx";
import HomePage from "./pages/HomePage.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import WishlistPage from "./pages/WishlistPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import OrderDetailPage from "./pages/OrderDetailPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import PrivacyPage from "./pages/PrivacyPage.jsx";
import TermsPage from "./pages/TermsPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import "./App.css";

/**
 * Scrolls to the top whenever the route (path or query) changes, matching
 * the old full-page-load behaviour.
 */
function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname, search]);
  return null;
}

/**
 * The storefront shell: header + page content + footer around every
 * customer-facing route. Auth pages (login/register) render standalone.
 *
 * The content sits inside the same three-column spine the Home page was
 * built on: left category rail + page content. The Search/Category
 * pages skip the shared left rail because their filter sidebar
 * stands in for it. (The old right widget rail — PC builder,
 * newsletter, cart CTA — was removed at the user's request; the
 * cart lives in the header navbar only.)
 */
function Layout() {
  const { pathname } = useLocation();
  const hasFilterRail =
    pathname === "/search" ||
    pathname === "/category" ||
    pathname.startsWith("/category/");

  return (
    <div className="app">
      <Header />
      <main className="page-content">
        <div className={`store-layout${hasFilterRail ? " no-left" : ""}`}>
          {!hasFilterRail && <StoreSidebar />}
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />

        <Route
          path="/checkout"
          element={
            <RequireAuth>
              <CheckoutPage />
            </RequireAuth>
          }
        />
        <Route
          path="/orders"
          element={
            <RequireAuth>
              <OrdersPage />
            </RequireAuth>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <RequireAuth>
              <OrderDetailPage />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <ScrollToTop />
      <AppRoutes />
    </StoreProvider>
  );
}