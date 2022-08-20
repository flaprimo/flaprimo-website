import React from "react";
import PropTypes from "prop-types";
import bg from "../../static/bg_index.svg";
import Layout from "../components/Layout";
import Seo from "../components/Seo";

class IndexPage extends React.Component {
  render() {
    return (
      <Layout location={this.props.location}>
        <div
          className="hero is-medium is-fullheight-with-navbar"
          style={{
            backgroundImage: "url(" + bg + ")",
            backgroundPosition: "center center",
            backgroundSize: "cover",
            backgroundColor: "white",
          }}
        >
          <div className="hero-body" />
          <div className="hero-foot">
            <div
              className="container"
              style={{
                paddingBottom: "20px",
                textShadow: "5px 5px 15px rgba(0,0,0,0.6)",
                WebkitTextStroke: "1px black",
              }}
            >
              <h1
                className="title has-text-white has-text-weight-bold"
                style={{
                  fontSize: "6em",
                }}
              >
                FLAVIO PRIMO
              </h1>
              <h2
                className="subtitle has-text-white"
                style={{
                  fontSize: "4em",
                }}
              >
                Just another dev blog_
              </h2>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export const Head = ({ location }) => (
  <Seo url={location.pathname} type="website" />
);

export default IndexPage;

IndexPage.propTypes = {
  location: PropTypes.object.isRequired,
};
