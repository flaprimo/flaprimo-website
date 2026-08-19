/** Site-wide metadata. Replaces Gatsby's `siteMetadata` in gatsby-config.js. */

export const site = {
  title: "Flavio Primo",
  author: "Flavio Primo",
  description: "Just another dev blog",
  url: "https://flavioprimo.xyz",
  /** Default Open Graph / Twitter card image, served from `public/`. */
  seoImage: "/bg_seo.png",
  googleSiteVerification: "Y8B6_MX40JiCVBbuwf-2tVFuGbifcfFi2tBlSPxhJDE",
} as const;

/** URLs carry a trailing slash to match `trailingSlash: "always"`. */
export const nav = [
  { title: "Home", url: "/" },
  { title: "Blog", url: "/blog/" },
  { title: "Photography", url: "/photography/" },
  { title: "About", url: "/about/" },
] as const;

/**
 * `icon` matches a key in `src/components/social-icons.ts`, which holds the
 * inline SVG paths that used to come from `react-social-icons`.
 */
export const social = [
  {
    title: "Facebook",
    user: "flaprimo1",
    baseurl: "https://www.facebook.com/",
    icon: "facebook",
  },
  {
    title: "LinkedIn",
    user: "flavioprimo",
    baseurl: "https://linkedin.com/in/",
    icon: "linkedin",
  },
  {
    title: "GitHub",
    user: "flaprimo",
    baseurl: "https://github.com/",
    icon: "github",
  },
  {
    title: "Twitter",
    user: "flaprimo1",
    baseurl: "https://twitter.com/",
    icon: "x",
  },
  {
    title: "Instagram",
    user: "flaprimo1",
    baseurl: "https://instagram.com/",
    icon: "instagram",
  },
  {
    title: "Spotify",
    user: "1168817494",
    baseurl: "https://open.spotify.com/user/",
    icon: "spotify",
  },
  {
    title: "Mastodon",
    user: "@flaprimo",
    baseurl: "https://mastodon.social/",
    icon: "mastodon",
  },
  {
    title: "Keybase",
    user: "flaprimo",
    baseurl: "https://keybase.io/",
    icon: "keybase",
  },
] as const;

/** The Twitter handle used for `twitter:creator`. */
export const twitterHandle =
  "@" + social.find((s) => s.title === "Twitter")!.user;
