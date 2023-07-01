import React from "react";
import PropTypes from "prop-types";

import Footer from "./Footer";
import Nav from "./Nav";

class Layout extends React.Component {
  render() {
    const { location, children } = this.props;
    return (
      <div>
        <Nav location={location} />
        {children}
        <Footer />
      </div>
    );
  }
}

export default Layout;

Layout.propTypes = {
  location: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
};
