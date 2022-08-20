import React, { Component } from "react";
import Layout from "../components/Layout";
import PropTypes from "prop-types";
import Header from "../components/Header";
import Seo from "../components/Seo";

const contentTitle = "Page not found";
class NotFoundPage extends Component {
  render() {
    return (
      <Layout location={this.props.location}>
        <Header title={contentTitle} subtitle="Page not found" />
        <div className="container section">
          <div className="columns is-centered">
            <div className="content column is-7">
              <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export const Head = ({ location }) => (
  <Seo
    title={contentTitle}
    description={"Whoooooops! This page doesn't exist.. the sadness."}
    url={location.pathname}
    type="website"
  />
);

export default NotFoundPage;

NotFoundPage.propTypes = {
  location: PropTypes.object.isRequired,
};
