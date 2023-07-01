/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const Promise = require("bluebird");
const path = require("path");
const { createFilePath } = require("gatsby-source-filesystem");

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  const createCustomPage = (elements, type, template) => (
    elements.forEach((element, index) => {
      const slug = element.node.fields.slug;
      const previous = index === elements.length - 1 ? null : elements[index + 1].node;
      const next = index === 0 ? null : elements[index - 1].node;

      createPage({
        path: type + slug,
        component: template,
        context: {
          slug: slug,
          previous,
          next
        }
      });
    })
  );

  const createCustomGallery = (elements, type, template) => {
    const getGalleries = (elements) => {
      const g = {};
      elements.forEach((e) => {
        const galleryName = e.node.relativePath.split('/')[0];
        if (g[galleryName] == null)
          g[galleryName] = [];
        g[galleryName].push(e.node);
      });

      return g;
    };

    const galleries = getGalleries(elements);

    for (let galleryName in galleries) {
      if (Object.prototype.hasOwnProperty.call(galleries, galleryName)) {
        const gallery = galleries[galleryName];

        gallery.forEach((element, index) => {
          const slug = "/" + element.relativePath.split(".")[0] + "/";
          const previous = index === gallery.length - 1 ? null : gallery[index + 1];
          const next = index === 0 ? null : gallery[index - 1];

          createPage({
            path: type + slug,
            component: template,
            context: {
              slug: slug,
              gallery: type + "/" + galleryName + "/",
              previous,
              next
            }
          });
        });
      }
    }
  };

  return new Promise((resolve, reject) => {
    resolve(
      graphql(
        `{
  blog: allMarkdownRemark(
    filter: {fileAbsolutePath: {regex: "/blog/"}}
    sort: {frontmatter: {date: DESC}}
  ) {
    edges {
      node {
        fields {
          slug
        }
        frontmatter {
          date(formatString: "DD MMMM YYYY")
        }
      }
    }
  }
  photography: allMarkdownRemark(
    filter: {fileAbsolutePath: {regex: "/photography/"}}
    sort: {frontmatter: {date: DESC}}
  ) {
    edges {
      node {
        fields {
          slug
        }
        frontmatter {
          date(formatString: "DD MMMM YYYY")
        }
      }
    }
  }
  photo: allFile(
    filter: {sourceInstanceName: {eq: "photography"}, internal: {mediaType: {eq: "image/jpeg"}}}
    sort: {name: DESC}
  ) {
    edges {
      node {
        relativePath
        childImageSharp {
          resize(width: 1000) {
            src
          }
        }
      }
    }
  }
}`
      ).then(result => {
        if (result.errors) {
          console.log(result.errors);
          reject(result.errors);
        }

        const blogTemplate = path.resolve("./src/templates/blogElementTemplate.js");
        const photographyTemplate = path.resolve("./src/templates/photographyElementTemplate.js");
        const photoTemplate = path.resolve("./src/templates/photoElementTemplate.js");

        const blogElements = result.data.blog.edges;
        const photographyElements = result.data.photography.edges;
        const photoElements = result.data.photo.edges;

        createCustomPage(blogElements, "/blog", blogTemplate);
        createCustomPage(photographyElements, "/photography", photographyTemplate);
        createCustomGallery(photoElements, "/photography", photoTemplate);
      })
    );
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === "MarkdownRemark") {
    createNodeField({
      name: "slug",
      node,
      value: createFilePath({ node, getNode })
    });
  }
};