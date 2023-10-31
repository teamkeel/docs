import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { GitHubIcon } from "./GitHubIcon";

export const EditThisPageButton = () => {
  const currentPage = useRef("");
  const router = useRouter();

  useEffect(() => {
    if (window.location.pathname === "/") {
      currentPage.current = "index";
      return;
    }
    currentPage.current = window.location.pathname;
    router.events.on("routeChangeComplete", () => {
      currentPage.current = window.location.pathname;
    });
    return () => {
      router.events.off("routeChangeComplete", () => {
        currentPage.current = window.location.pathname;
      });
    };
  }, []);

  return (
    <button
      onClick={() => {
        window.open(
          currentPage.current
            ? `https://github.com/teamkeel/docs/edit/main/pages/${currentPage.current}.mdx`
            : "https://github.com/teamkeel/docs/issues/new",
          "_blank",
          "noopener noreferrer"
        );
      }}
      style={{ display: "flex", alignItems: "center", gap: 8 }}
    >
      <GitHubIcon /> Edit this page
    </button>
  );
};
