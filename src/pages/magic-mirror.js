import React, { Component, useState, useEffect } from "react";
import Layout from "../components/Layout";
import { graphql } from "gatsby";
import PropTypes from "prop-types";
import Header from "../components/Header";
import Seo from "../components/Seo";
import me from "../../static/me.jpg";

class MagicMirrorPage extends Component {
  render() {
    const contentTitle = "Magic Mirror";
    const siteTitle = this.props.data.site.siteMetadata.title;

    return (
      <section class="hero is-danger is-fullheight">
        <div class="hero-body">
          <div class="">
            <p class="title">
              It's a kind of magic ✨
            </p>
          </div>
        </div>
      </section>
    );
  }
}

export default MagicMirrorPage;

export const pageQuery = graphql`
  query magicMirrorPageQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;

MagicMirrorPage.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.shape({
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  }).isRequired
};
