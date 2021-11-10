import React, { Component } from "react";
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
      <Layout siteTitle={siteTitle} contentTitle={contentTitle} location={this.props.location}>
        <Seo title={contentTitle + " | " + siteTitle}
             description={"Hi, I'm Flavio, pleased to meet you!"}
             url={this.props.location.href}
             type="website"
        />
        <Header title={contentTitle} subtitle="Let's talk about me"/>

        <div className="container section">
          <div className="columns is-centered">
            <div className="content column is-5">
              <figure className="image">
                <img className="is-rounded" src={me} alt="me"/>
              </figure>
            </div>
          </div>
          <div className="columns is-centered">
            <div className="content column is-7">
              <p>I am <b>Flavio Primo</b> an Italian Cloud Data Architect at <a target="_blank"
                                                                       rel="noopener noreferrer"
                                                                       href="https://www.bipconsulting.com/who-we-are/practices/x-Tech">Bip xTech</a>.</p>
              <p>I am an all around developer with a focus on Data Science and Engineering with a MSc degree in Computer
                Science and Engineering at <a target="_blank" rel="noopener noreferrer" href="https://www.polimi.it">Politecnico di Milano</a>.</p>
              <p>I am currently studying for a second level master&#39;s degree in Cloud Data Architecture at <a target="_blank"
                                                                                                                 rel="noopener noreferrer"
                                                                                                                 href="https://www.cefriel.com/en">Cefriel - Politecnico
                di Milano</a>.</p>
              <p>I enjoy reading news about technology and politics, watching movies and TV series (my favorites are SciFi
                and thought provoker genres), listening to music (pretty much anything), travelling, running, reading books and
                having Belgian ales with my friends.</p>
              <p>I&#39;m a firm supporter of open-source software and technologies.</p>
            </div>
          </div>
        </div>
      </Layout>
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

AboutPage.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.shape({
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  }).isRequired
};
