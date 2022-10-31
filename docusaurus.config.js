// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

// const lightCodeTheme = require("prism-react-renderer/themes/oneLight");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");
const prismOneLight = {
  plain: {
    color: "#383a42",
    backgroundColor: "#fff",
  },
  styles: [
    {
      types: ["comment"],
      style: {
        color: "#A0A1A7",
        fontStyle: "italic",
      },
    },
    {
      types: ["keyword", "selector", "changed", "property"],
      style: {
        color: "#A626A4",
      },
    },
    {
      types: ["operator"],
      style: {
        color: "#383A42",
      },
    },
    {
      types: [
        "constant",
        "hexcode",
        "number",
        "builtin",
        "attr-name",
        "object",
      ],
      style: {
        color: "#986801",
      },
    },
    {
      types: ["char", "symbol", "regex"],
      style: {
        color: "#0184BC",
      },
    },
    {
      types: ["variable", "tag", "deleted"],
      style: {
        color: "#E45649",
      },
    },
    {
      types: ["string", "inserted"],
      style: {
        color: "#50A14F",
      },
    },
    {
      types: ["punctuation"],
      style: {
        color: "#A0A1A7",
      },
    },
    {
      types: ["function", "property-query"],
      style: {
        color: "#4078F2",
      },
    },
    {
      types: ["class-name"],
      style: {
        color: "#C18401",
      },
    },
  ],
};

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Keel Docs",
  tagline: "",
  url: "https://docs.keel.xyz",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.png",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "teamkeel", // Usually your GitHub org/user name.
  projectName: "keel", // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          routeBasePath: "/",
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      docs: {
        sidebar: {
          autoCollapseCategories: false,
        },
      },
      colorMode: {
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: "",
        logo: {
          alt: "Keel logo",
          src: "img/logo.svg",
        },
        items: [
          {
            type: "doc",
            docId: "Getting started/quickstart",
            position: "left",
            label: "Docs",
          },
          {
            to: "https://schema-playground.netlify.app/",
            label: "Schema playground",
            position: "left",
          },
          {
            href: "https://console.keel.xyz",
            label: "Console",
            position: "right",
          },
          {
            href: "https://github.com/teamkeel/keel",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "light",
        copyright: `Copyright © ${new Date().getFullYear()} Planko Ltd`,
      },
      prism: {
        theme: prismOneLight,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
