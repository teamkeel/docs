import React from "react";
import { DocsThemeConfig, useConfig } from "nextra-theme-docs";
import { useRouter } from "next/router";

const config: DocsThemeConfig = {
  logo: <span>Keel</span>,
  project: {},
  footer: {
    text: "Keel",
  },
  editLink: {
    component: () => null,
  },
  feedback: {
    useLink: () => `mailto:help@keel.so`,
  },
  useNextSeoProps: () => {
    const { asPath } = useRouter();
    const { frontMatter } = useConfig();

    if (asPath !== "/") {
      return {
        titleTemplate: "%s – Keel",
        description:
          frontMatter.description ||
          "Keel solves the backend puzzle so you can focus on customers.",
      };
    }
  },
  head: null,
};

export default config;
