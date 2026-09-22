import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import SearchResults from "./pages/SearchResults.jsx";

export default function App() {
  const path = window.location.pathname;

  if (path === "/register") {
    return <Register />;
  }

  if (path === "/SearchResults") {
    return <SearchResults />;
  }

  return <Login />;
}