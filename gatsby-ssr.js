/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

// You can delete this file if you're not using it

exports.onRenderBody = ({ pathname, setHtmlAttributes, setBodyAttributes }) => {
  setHtmlAttributes({ lang: "en-US" });

  switch (pathname) {
    case "/magic-mirror/":
      setHtmlAttributes({ className: "force-portrait-orientation" });
      break;
    case /^\/photography\/.*?\/.*/i.test(pathname):
      break;
    default:
      setBodyAttributes({ className: "has-navbar-fixed-top" });
  }
};
