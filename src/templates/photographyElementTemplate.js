import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import PropTypes from "prop-types";
import NextPrevElements from "../components/NextPrevElements";
import Tags from "../components/Tags";
import Img from "gatsby-image";
import Header from "../components/Header";
import Link from "gatsby-link";
import Seo from "../components/Seo";

class PhotographyElementTemplate extends React.Component {
  render() {
    const siteTitle = this.props.data.site.siteMetadata.title;
    const { previous, next } = this.props.pageContext;

    const photographyElement = this.props.data.markdownRemark;
    const title = photographyElement.frontmatter.title;
    const category = photographyElement.frontmatter.category;
    const tags = photographyElement.frontmatter.tags;
    const date = photographyElement.frontmatter.date;
    const html = photographyElement.html;
    const cover = String(photographyElement.frontmatter.cover.childImageSharp.resize.src);

    return (
      <Layout contentTitle={title} siteTitle={siteTitle} location={this.props.location}>
        <Seo title={title}
             description={photographyElement.excerpt}
             url={this.props.location.href}
             image={cover}
             type="article"
        />
        <Header title={title} subtitle={date + " - " + category}/>

        <div className="container section" style={{
          backgroundColor: "rgba(255,255,255, 0.9)"
        }}>

          <div className="content" dangerouslySetInnerHTML={{ __html: html }}/>
          <div className="columns is-multiline is-centered">
            {this.props.data.allFile.edges.map((image, i) => (
              <Link key={i} className="column is-narrow"
                    to={this.props.location.pathname +
                    image.node.childImageSharp.fixed.src.split("/")[4].split(".")[0]}>
                <Img fixed={image.node.childImageSharp.fixed} alt="big size photo in the gallery"/>
              </Link>
            ))}
          </div>
          <Tags tags={tags}/>

          <NextPrevElements type={"/photography"} previous={previous} next={next}/>
        </div>
      </Layout>
    );
  }
}

export default PhotographyElementTemplate;

export const pageQuery = graphql`
  query photographyElementQuery($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      excerpt
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        category
        tags
        cover {
          childImageSharp {
            resize(width: 1000) {
              src
              height
              width
            }
          }
        }
      }
    }
    allFile(
    filter: {
      sourceInstanceName: {eq: "photography"},
      internal: {mediaType: {eq: "image/jpeg"}},
      absolutePath: {regex: $slug}
    },
    sort: {fields: [name], order: ASC}
    )
    {
      edges {
        node {
          childImageSharp {
            fixed(width: 300, height: 300, quality: 85) {
              ...GatsbyImageSharpFixed_tracedSVG
            }
          }
        }
      }
    }
  }
`;

PhotographyElementTemplate.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.shape({
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    markdownRemark: PropTypes.object.isRequired,
    allFile: PropTypes.object.isRequired
  }).isRequired,
  pageContext: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    next: PropTypes.object,
    previous: PropTypes.object
  }).isRequired
};