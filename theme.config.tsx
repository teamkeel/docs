import React from "react";
import { DocsThemeConfig, useConfig } from "nextra-theme-docs";
import { useRouter } from "next/router";
import Logo from "./components/logo";
import { EditThisPageButton } from "./components/EditThisPageButton";
import { Callout } from "./components/core/callout";

const config: DocsThemeConfig = {
  logo: <Logo height={32} />,
  logoLink: "https://keel.so",
  project: {
    link: "https://github.com/teamkeel/keel",
  },
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
  components: {
    h1: (props) => (
      <h1
        className="nx-mt-2 nx-text-5xl nx-font-bold nx-tracking-tight nx-text-slate-900 dark:nx-text-slate-100"
        {...props}
      />
    ),
    // h2: props => <HeadingLink tag="h2" context={context} {...props} />,
    // h3: props => <HeadingLink tag="h3" context={context} {...props} />,
    // h4: props => <HeadingLink tag="h4" context={context} {...props} />,
    // h5: props => <HeadingLink tag="h5" context={context} {...props} />,
    // h6: props => <HeadingLink tag="h6" context={context} {...props} />,
    ul: (props) => (
      <ul
        className="nx-mt-6 nx-list-disc first:nx-mt-0 ltr:nx-ml-6 rtl:nx-mr-6"
        {...props}
      />
    ),
    ol: (props) => (
      <ol
        className="nx-mt-6 nx-list-decimal first:nx-mt-0 ltr:nx-ml-6 rtl:nx-mr-6"
        {...props}
      />
    ),
    li: (props) => <li className="nx-my-2" {...props} />,
    hr: (props) => (
      <hr
        className="nx-my-8 nx-border-neutral-200/70 contrast-more:nx-border-neutral-400 dark:nx-border-primary-100/10 contrast-more:dark:nx-border-neutral-400"
        {...props}
      />
    ),
    p: (props) => (
      <p className="nx-mt-6 nx-leading-7 first:nx-mt-0" {...props} />
    ),
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
          "Keel brings operators and engineers together to solve your most critical ops challenges.",
      };
    }
  },
  head: null,
};

export default config;
