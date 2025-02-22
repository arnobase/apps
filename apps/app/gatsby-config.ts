import type {GatsbyConfig} from 'gatsby'

const config: GatsbyConfig = {
  siteMetadata: {
    title: 'Phala App',
    siteUrl: 'https://app.phala.network',
    description: 'To host, connect, and gain in the world of Web3',
  },
  jsxRuntime: 'automatic',
  // flags: {FAST_DEV: true},
  plugins: [
    'local-plugin-layout', // This plugin's place decides providers order, which is highly important
    'local-plugin-styletron',
    'gatsby-plugin-typescript',
    'gatsby-plugin-netlify',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-fontawesome-css',
    'gatsby-plugin-styled-components',
    {
      resolve: 'gatsby-plugin-google-gtag',
      options: {trackingIds: ['G-E0PDMEJQ0T']},
    },
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /\.svg$/,
        },
      },
    },
    {
      resolve: 'gatsby-plugin-env-variables',
      options: {
        // https://docs.netlify.com/configure-builds/environment-variables/#read-only-variables
        allowList: ['CONTEXT'],
      },
    },
    {
      resolve: 'gatsby-plugin-google-fonts',
      options: {
        // FIXME: Montserrat:400 is too light, load it after css is ready
        fonts: ['Lato', 'Montserrat:500,600,700', 'PT Mono'],
        display: 'swap',
      },
    },
    {
      resolve: '@sentry/gatsby',
      options: {
        dsn: 'https://ba6cd9ff61544ca6a96f3ca1d90445f2@o812739.ingest.sentry.io/5879132',
        sampleRate: 1,
      },
    },
  ],
}

export default config
