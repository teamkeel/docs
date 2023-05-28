import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logo: <span>Keel</span>,
  project: {
    link: "https://github.com/teamkeel/keel",
  },
  footer: {
    text: "Keel",
  },
  editLink: {
    component: () => null,
  },
  feedback: {
    useLink: () => `mailto:help@keel.xyz`,
  },
};

export default config;
