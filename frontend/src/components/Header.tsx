import { Menu, Search } from "lucide-react";
import "./Header.css";

const Header = () => {
  return (
    <header className="header-container">
      <div className="header-content">
        <div className="header-left">
          <button className="header-icon-btn">
            <Menu size={24} color="var(--color-text-dark)" />
          </button>
          <div className="header-logo">
            <span className="logo-text-dark">TEMPLATE</span>
            <span className="logo-text-primary">.NET</span>
          </div>
        </div>
        <div className="header-right">
          <button className="header-icon-btn">
            <Search size={20} color="var(--color-text-dark)" />
          </button>
          <button className="header-signup-btn">Sign Up</button>
        </div>
      </div>
    </header>
  );
};
export default Header;
