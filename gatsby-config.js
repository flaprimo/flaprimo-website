module.exports = {
  siteMetadata: {
    title: "Flavio Primo",
    author: "Flavio Primo",
    description: "Just another dev blog",
    siteUrl: "https://flavioprimo.xyz",
    nav: [
      {
        title: "Home",
        url: "/"
      },
      {
        title: "Blog",
        url: "/blog"
      },
      {
        title: "Photography",
        url: "/photography"
      },
      {
        title: "About",
        url: "/about"
      }
    ],
    social: [
      {
        title: "Facebook",
        user: "flaprimo1",
        baseurl: "https://www.facebook.com/"
      },
      {
        title: "LinkedIn",
        user: "flavioprimo",
        baseurl: "https://linkedin.com/in/"
      },
      {
        title: "GitHub",
        user: "flaprimo",
        baseurl: "https://github.com/"
      },
      {
        title: "Twitter",
        user: "flaprimo1",
        baseurl: "https://twitter.com/"
      },
      {
        title: "Instagram",
        user: "flaprimo1",
        baseurl: "https://instagram.com/"
      },
      {
        title: "Spotify",
        user: "1168817494",
        baseurl: "https://open.spotify.com/user/"
      },
      {
        title: "Mastodon",
        user: "@flaprimo",
        baseurl: "https://mastodon.social/"
      },
      {
        title: "Keybase",
        user: "flaprimo",
        baseurl: "https://keybase.io/"
      }
    ]
  },
  pathPrefix: "/",
  plugins: [
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/content/blog`,
        name: "blog"
      }
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/content/photography`,
        name: "photography"
      }
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 590,
              quality: 90,
              linkImagesToOriginal: true
            }
          },
          {
            resolve: "gatsby-remark-responsive-iframe",
            options: {
              wrapperStyle: "margin-bottom: 1.0725rem"
            }
          },
          "gatsby-remark-prismjs",
          "gatsby-remark-copy-linked-files",
          "gatsby-remark-smartypants"
          // {
          //   resolve: 'gatsby-remark-external-links',
          //   options: {
          //     target: '_blank',
          //     rel: 'nofollow noopener noreferrer',
          //   }
          // }
        ]
      }
    },

    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "Flavio Primo",
        short_name: "Flavio Primo",
        description: "Just another dev blog",
        start_url: "/",
        background_color: "red",
        theme_color: "red",
        display: "standalone",
        icon: `${__dirname}/static/logo.svg`
      }
    },
    "gatsby-plugin-catch-links",
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    "gatsby-plugin-nprogress",
    "gatsby-plugin-purgecss",
    "gatsby-plugin-offline",
    "gatsby-plugin-sitemap",
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`
  ]
};