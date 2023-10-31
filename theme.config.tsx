import React from "react";
import { DocsThemeConfig, useConfig } from "nextra-theme-docs";
import { useRouter } from "next/router";
import Logo from "./components/logo";
import { EditThisPageButton } from "./components/EditThisPageButton";

const config: DocsThemeConfig = {
  logo: <Logo height={32} />,
  project: {},
  footer: {
    text: <span>© Planko Ltd {new Date().getFullYear()}</span>,
  },
  editLink: {
    component: () => null,
  },
  feedback: {
    useLink: () => null,
    content: EditThisPageButton,
  },
  sidebar: {
    // Makes collapsible menus collapsed by default
    defaultMenuCollapseLevel: 1,
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
