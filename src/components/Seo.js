import React from "react";
import { StaticQuery, graphql } from "gatsby";
import PropTypes from "prop-types";
import seoImageBg from "../../static/bg_seo.png";

const Seo = ({ title, description, url, image, type }) => (
  <StaticQuery
    query={graphql`
      query SeoQuery {
        site {
          siteMetadata {
            title
            description
            author
            siteUrl
            social {
              title
              user
            }
          }
        }
      }
    `}
    render={({ site: { siteMetadata: seo } }) => {
      const seoTitle =
        title !== undefined ? title + " | " + seo.title : seo.title;
      const seoDescription = description || seo.description;
      const seoImage =
        seo.siteUrl.replace(/\/$/, "") + (image ? image : seoImageBg);
      const seoUrl = url || seo.siteUrl;
      const seoType = type;
      const twitterAuthor =
        "@" + seo.social.filter((s) => s.title === "Twitter")[0].user;

      return (
        <>
          {/* General tags */}
          <title>{seoTitle}</title>
          <meta name="description" content={seoDescription} />
          <meta name="image" content={seoImage} />

          {/* OpenGraph tags */}
          <meta property="og:url" content={seoUrl} />
          <meta property="og:type" content={seoType} />
          <meta property="og:title" content={seoTitle} />
          <meta property="og:description" content={seoDescription} />
          <meta property="og:image" content={seoImage} />

          {/* Twitter Card tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:creator" content={twitterAuthor} />
          <meta name="twitter:title" content={seoTitle} />
          <meta name="twitter:description" content={seoDescription} />
          <meta name="twitter:image" content={seoImage} />

          {/* Site Verification */}
          <meta
            name="google-site-verification"
            content="Y8B6_MX40JiCVBbuwf-2tVFuGbifcfFi2tBlSPxhJDE"
          />
        </>
      );
    }}
  />
);

Seo.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  url: PropTypes.string,
  type: PropTypes.string,
  image: PropTypes.string,
};

export default Seo;
