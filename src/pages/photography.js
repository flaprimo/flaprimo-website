import React from "react";
import { graphql, Link } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";

import Layout from "../components/Layout";
import PropTypes from "prop-types";
import Header from "../components/Header";
import Seo from "../components/Seo";

const contentTitle = "Photography";
class PhotographyPage extends React.Component {
  render() {
    const blogElements = this.props.data.allMarkdownRemark.edges;

    return (
      <Layout location={this.props.location}>
        <Header title={contentTitle} subtitle="My point of view" />

        <div className="container section">
          <div className="columns is-centered">
            <div className="column is-9">
              <div className="columns is-multiline is-centered">
                {blogElements.map(({ node }) => {
                  const title = node.frontmatter.title || node.fields.slug;
                  const slug = node.fields.slug;
                  const date = node.frontmatter.date;
                  const category = node.frontmatter.category;
                  const excerpt = node.excerpt;
                  const cover =
                    node.frontmatter.cover.childImageSharp.gatsbyImageData;

                  return (
                    <div key={slug} className="column is-half">
                      <div
                        className="card"
                        style={{
                          display: "flex",
                          minHeight: "100%",
                          flexDirection: "column",
                        }}
                      >
                        <div className="card-image">
                          <GatsbyImage
                            image={cover}
                            className="image"
                            alt="cover image"
                          />
                        </div>

                        <div className="card-content" style={{ flex: "1" }}>
                          <h3 className="is-size-4">
                            <Link to={"/photography" + slug}>{title}</Link>
                          </h3>
                          <br />
                          <div className="content">
                            <p dangerouslySetInnerHTML={{ __html: excerpt }} />
                          </div>
                        </div>

                        <footer className="card-footer">
                          <div className="card-footer-item">{date}</div>
                          <div className="card-footer-item">{category}</div>
                        </footer>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export const Head = () => (
  <Seo
    title={contentTitle}
    description={
      "Flavio's photography gallery, photos from the wonderful places I've been."
    }
    type="website"
  />
);

export default PhotographyPage;

export const pageQuery = graphql`
  query photographyPageQuery {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/photography/" } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
            category
            tags
            cover {
              childImageSharp {
                gatsbyImageData(
                  width: 900
                  quality: 85
                  tracedSVGOptions: { color: "#2B2B2F" }
                  placeholder: TRACED_SVG
                  layout: CONSTRAINED
                )
              }
            }
          }
        }
      }
    }
  }
`;

PhotographyPage.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.object.isRequired,
  }).isRequired,
};
