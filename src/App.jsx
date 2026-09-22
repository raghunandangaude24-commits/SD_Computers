import "./App.css";
import { StoreProvider, useStore } from "./store/StoreContext.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import WishlistPage from "./pages/WishlistPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

function StorefrontShell({ children }) {
  const { cartCount, wishlistCount } = useStore();

  return (
    <div className="app">
      <Header cartCount={cartCount} wishlistCount={wishlistCount} />
      <main className="page-content">{children}</main>
      <Footer />
    </div>
  );
}

function resolvePage() {
  const path = window.location.pathname;

  const productMatch = path.match(/^\/product\/(\d+)$/);
  if (productMatch) {
    return <ProductDetailPage productId={Number(productMatch[1])} />;
  }
  if (path.startsWith("/search")) return <SearchResults />;
  if (path.startsWith("/category")) return <CategoryPage />;
  if (path === "/cart") return <CartPage />;
  if (path === "/wishlist") return <WishlistPage />;
  if (path === "/profile") return <ProfilePage />;

  // Default: the Home page.
  return <HomePage />;
}

function AppRoutes() {
  const path = window.location.pathname;

  if (path === "/login") return <Login />;
  if (path === "/register") return <Register />;

  return <StorefrontShell>{resolvePage()}</StorefrontShell>;
}

function App() {
  return (
    <StoreProvider>
      <AppRoutes />
    </StoreProvider>
  );
}

export default App;