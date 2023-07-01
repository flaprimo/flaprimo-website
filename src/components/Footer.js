import React from "react";
import { Link } from "gatsby"
import SocialButton from "./SocialButtons";

const Footer = () => (
  <footer className="footer">
    <div className="container level">

      <div className="level-left">
      <SocialButton className="column is-half" />
      </div>

      <Link className="level-right" to="/cookie-policy">
        Cookie Policy
      </Link>
    </div>
  </footer>
);

export default Footer;