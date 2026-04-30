import { Link, NavLink, useSearchParams, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useAuth } from "../context/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryInputRef = useRef(null);
  const queryParam = searchParams.get("q") ?? "";

  function submitSearch(e) {
    e.preventDefault();
    const trimmed = (queryInputRef.current?.value ?? "").trim();
    if (trimmed.length === 0) {
      navigate("/");
      return;
    }
    navigate(`/?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          ShopHub
        </Link>
        <div className="navbar-links" />
        <div className="navbar-auth">
          {!user ? (
            <div className="navbar-auth-links">
              <form className="navbar-search" onSubmit={submitSearch}>
                <input
                  className="navbar-search-input"
                  key={queryParam}
                  defaultValue={queryParam}
                  ref={queryInputRef}
                  placeholder="Search products..."
                  aria-label="Search products"
                />
              </form>
              <Link to="/checkout" className="btn btn-secondary">
                Cart
              </Link>
              <Link to="/auth" className="btn btn-secondary">
                Login
              </Link>
              <Link to="/auth" className="btn btn-primary">
                Signup
              </Link>
            </div>
          ) : (
            <div className="navbar-user">
              <span className="navbar-greeting">Hello, {user.email}</span>
              <form className="navbar-search" onSubmit={submitSearch}>
                <input
                  className="navbar-search-input"
                  key={queryParam}
                  defaultValue={queryParam}
                  ref={queryInputRef}
                  placeholder="Search products..."
                  aria-label="Search products"
                />
              </form>
              <Link to="/checkout" className="btn btn-secondary">
                Cart
              </Link>
              <button className="btn btn-secondary" onClick={logout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}