import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import PropTypes from "prop-types";
import NextPrevElements from "../components/NextPrevElements";
import Tags from "../components/Tags";
import Header from "../components/Header";
import Comments from "../components/Comments";
import Seo from "../components/Seo";
import styled from "styled-components";

const Content = styled.div`
  & {
    word-wrap: break-word;
    overflow-wrap: break-word;

    & pre {
      overflow-x: scroll;
    }
  }
`;

class BlogElementTemplate extends React.Component {
  render() {
    const { previous, next } = this.props.pageContext;

    const blogElement = this.props.data.markdownRemark;
    const title = blogElement.frontmatter.title;
    const category = blogElement.frontmatter.category;
    const tags = blogElement.frontmatter.tags;
    const date = blogElement.frontmatter.date;
    const html = blogElement.html;

    return (
      <Layout location={this.props.location}>
        <Header title={title} subtitle={date + " - " + category} />

        <div
          className="container section"
          style={{
            backgroundColor: "rgba(255,255,255, 0.9)",
          }}
        >
          <div className="columns is-centered">
            <div className="column is-7">
              <Content
                className="content"
                dangerouslySetInnerHTML={{ __html: html }}
              />

              <Tags tags={tags} />

              <NextPrevElements
                type={"/blog"}
                previous={previous}
                next={next}
              />
              <Comments title={title} type="blog" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export const Head = ({ location, data }) => (
  <Seo
    title={data.markdownRemark.frontmatter.title}
    url={location.pathname}
    description={data.markdownRemark.excerpt}
    type="article"
  />
);

export default BlogElementTemplate;

export const pageQuery = graphql`
  query blogElementQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        category
        tags
      }
    }
  }
`;

BlogElementTemplate.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.shape({
    markdownRemark: PropTypes.object.isRequired,
  }).isRequired,
  pageContext: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    next: PropTypes.object,
    previous: PropTypes.object,
  }).isRequired,
};
