import React from "react";
import PropTypes from "prop-types";
import { StaticQuery, graphql, Link } from "gatsby";
import logo from "../../static/logo.svg";

class Nav extends React.Component {
  constructor() {
    super();
    this.state = { visible: false };
  }

  render() {
    const title = this.props.data.site.siteMetadata.title;
    const nav = this.props.data.site.siteMetadata.nav.map((navitem, i) =>
      <Link key={i} className={"navbar-item" +
      ("/" + this.props.location.pathname.split('/')[1] === navitem.url ? " is-active" : "")} to={navitem.url}>
        {navitem.title}
      </Link>
    );

    return (
      <nav className="navbar is-black is-fixed-top">
        <div className="container">
          <div className="navbar-brand">
            <Link className="navbar-item" to={"/"}>
              <img style={{ "height": "28px" }} src={logo} alt="logo"/>
              &emsp;
              <b>{ title }</b>
            </Link>
            <span className={"navbar-burger burger" + (this.state.visible ? " is-active" : "")}
                  onClick={this.toggleBurgerOnClick}>
            <span/>
            <span/>
            <span/>
          </span>
          </div>
          <div className={"navbar-menu" + (this.state.visible ? " is-active" : "")}>
            <div className="navbar-end">
              {nav}
            </div>
          </div>
        </div>
      </nav>
    );
  }

  componentDidMount() {
    window.addEventListener("resize", this.toggleBurgerOnResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.toggleBurgerOnResize);
  }

  toggleBurgerOnClick = () => {
    this.setState({
      visible: !this.state.visible
    });
  };

  toggleBurgerOnResize = () => {
    if (window.innerWidth > 1021) {
      this.setState({
        visible: false
      });
    }
  };
}

/* Query */
export default props => (
  <StaticQuery
    query={graphql`
      query NavQuery {
        site {
          siteMetadata {
            title,
            nav {
              title,
              url
            }
          }
        }
      }
    `}
    render={data => <Nav data={data} {...props} />}
  />
)

Nav.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.shape({
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
        nav: PropTypes.array.isRequired
      }).isRequired
    }).isRequired
  }).isRequired
};