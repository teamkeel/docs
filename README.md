# Keel Docs

These are our docs.

## Testing Broken Links

We make sure there are no broken links in these docs using [Vitest](https://vitest.dev). To run the link test (and other tests), run

```bash
npm run test
```

Vitest also runs on every push to the `main` branch, so you can check the status of the docs link test in the GitHub Actions tab, and take advantage of its `--watch` mode during local development.
