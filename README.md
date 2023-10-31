<p align="center">
  <a href="https://keel.so/">
    <img alt="Keel" src="static/keel.svg" width="300" />
  </a>
</p>

  <p align="center">Your production-grade backend from one file<p>

<p align="center">
   <a href="https://keel.so">Try it Out</a> | <a href="https://keel.so/discord">Join our Discord</a>
</p>

---

## Documentation

This repo contains the documentation for Keel. It is a Next.js site built with the pages router. Every `.mdx` file in the pages directory represents a page in the docs.

## Getting Started

Since this is just another Next.js project, you can get started by cloning the repo and running `npm install` to install the dependencies. Then, you can run `npm run dev` to start the development server.

## Testing Broken Links

We make sure there are no broken links in these docs using [Vitest](https://vitest.dev). To run the link test (and other tests), run

```bash
npm run test
```

Vitest also runs on every PR branch, so you can check the status of the docs link test in the GitHub Actions tab, and take advantage of its `--watch` mode during local development.
