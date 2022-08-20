import React from "react";
import { graphql } from "gatsby";
import PropTypes from "prop-types";
import "bulma/css/bulma.css";
import Link from "gatsby-link";
import Seo from "../components/Seo";
import styled from "styled-components";

const ArrowIcon = styled.i`
  & {
    border: solid #f5f5f5;
    padding: 5px;
    transform: rotate(45deg);

    &.left-arrow {
      border-width: 0 0 2px 2px;
    }

    &.right-arrow {
      border-width: 2px 2px 0 0;
    }
  }
`;

const CloseIcon = styled.i`
  & {
    width: 80%;
    height: 80%;
    position: relative;

    &:before,
    &:after {
      content: "";
      position: absolute;
      background: #f5f5f5;
      width: 2px;
      height: 100%;
    }

    &:before {
      transform: rotate(45deg);
    }

    &:after {
      transform: rotate(-45deg);
    }
  }
`;

function getImagePreload(image) {
  const imageUrl = image.childImageSharp.resize.src;
  return <link rel="preload" as="image" href={imageUrl} />;
}

class PhotoElementTemplate extends React.Component {
  render() {
    const { previous, next } = this.props.pageContext;
    const baseUrl = this.props.location.pathname.substring(
      0,
      this.props.location.pathname.lastIndexOf("/") + 1
    );

    function getImageButton(image, direction) {
      const imagePage =
        baseUrl + image.relativePath.split("/")[1].split(".")[0];
      return (
        <p className="control">
          <Link to={imagePage} replace className="button is-dark">
            <span className="icon is-small">
              <ArrowIcon className={direction + "-arrow"} />
            </span>
          </Link>
        </p>
      );
    }

    const previousButton =
      previous != null ? getImageButton(previous, "left") : "";
    const nextButton = next != null ? getImageButton(next, "right") : "";

    const photo = this.props.data.photo.childImageSharp.resize;
    // const blogElement = this.props.data.markdownRemark;
    // const title = blogElement.frontmatter.title;
    // const category = blogElement.frontmatter.category;
    // const tags = blogElement.frontmatter.tags;
    // const date = blogElement.frontmatter.date;
    // const html = blogElement.html;

    return (
      <div className="hero has-background-black is-fullheight">
        <div
          className="hero-body"
          style={{
            padding: 0,
            alignItems: "normal",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              height: "90vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              style={{
                // backgroundImage: `url("${decodeURIComponent(photo.tracedSVG)}")`,
                width: "auto",
                height: "auto",
                maxWidth: "100%",
                maxHeight: "100%",
              }}
              src={photo.src}
              height={photo.height}
              width={photo.width}
              alt="photo in the gallery"
            />
          </div>
          <nav
            className="level is-mobile"
            style={{
              height: "10vh",
              paddingLeft: "1rem",
              paddingRight: "1rem",
            }}
          >
            <div className="level-left">
              <div className="field has-addons">
                {previousButton}
                {nextButton}
              </div>
            </div>
            <div className="level-right">
              <p className="control">
                <Link
                  to={baseUrl}
                  replace
                  className="button is-dark"
                  style={{
                    borderTopRightRadius: "4px",
                    borderBottomRightRadius: "4px",
                  }}
                >
                  <span className="icon is-small is-rounded">
                    <CloseIcon />
                  </span>
                </Link>
              </p>
            </div>
          </nav>
        </div>
      </div>
    );
  }
}

export const Head = ({ location, pageContext }) => (
  <>
    <Seo title={pageContext.gallery} url={location.pathname} type="article" />
    {pageContext.next != null ? getImagePreload(pageContext.next) : ""}
    {pageContext.previous != null ? getImagePreload(pageContext.previous) : ""}
  </>
);

export default PhotoElementTemplate;

export const pageQuery = graphql`
  query photoElementQuery($slug: String!) {
    photo: file(relativePath: { regex: $slug }) {
      childImageSharp {
        resize(width: 1000) {
          src
          height
          width
        }
      }
    }
  }
`;

PhotoElementTemplate.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.shape({
    photo: PropTypes.object.isRequired,
  }).isRequired,
  pageContext: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    gallery: PropTypes.string,
    next: PropTypes.object,
    previous: PropTypes.object,
  }).isRequired,
};
