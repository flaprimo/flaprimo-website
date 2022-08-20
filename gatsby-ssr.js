/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

// You can delete this file if you're not using it

exports.onRenderBody = ({ pathname, setHtmlAttributes }) => {
  setHtmlAttributes({ lang: "en-US" });

  switch (pathname) {
    case "/magic-mirror/":
      setHtmlAttributes({ className: "force-portrait-orientation" });
      break;
    case /^\/photography\/.*?\/.*/.test(pathname):
      break;
    default:
      setHtmlAttributes({ style: "padding-top: 3.25rem;" }); // equivalent to .has-navbar-fixed-top
  }
};
