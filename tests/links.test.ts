import { describe, expect, it } from 'vitest';
import { readFile } from 'fs/promises';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import remarkFrontmatter from 'remark-frontmatter';
import { getAllFiles } from 'get-all-files';
import { kebab } from 'case';
import slash from 'slash';

type FilePath = string;

const contentDir = './pages'

describe('Markdown Link Checker', async () => {
    // 1. Collect data from `contentDir`
    const pages = new Map<FilePath, { anchors: Set<string>; links: Set<string>; }>();

    for await (const filename of getAllFiles(contentDir)) {
        if (!filename.endsWith('.mdx')) continue;

        pages.set(
            slash(filename)
                .replace(contentDir, '') // remove `/pages`
                .slice(0, -4), // remove `.mdx`
            await parseMarkdown(filename)
        );
    }

    // 2. Generate unit tests
    Array.from(pages.entries()).forEach(([page, def]) => {
        if (def.links.size === 0) return;
        describe(page, async () => {
            Array.from(def.links.values()).forEach((link) => {
                it(`Should have ${link} defined`, async () => {
                    const [path] = link.split('#');
                    expect(pages.has(path)).toBeTruthy();
                });
            });
        });
    });
});

/**
 * Retrieve useful information from a markdown file.
 *
 * @param path file path
 */
async function parseMarkdown(path: string) {
    const document = await readFile(path, 'utf-8');
    const links = new Set<string>();
    const anchors = new Set<string>();

    await unified()
        .use(remarkParse)
        .use(remarkFrontmatter)
        .use(() => {
            return function transform(tree) {
                visit(tree, 'link', (linkNode) => {
                    if (linkNode.url.startsWith('/')) {
                        links.add(linkNode.url);
                    }
                });

                visit(tree, 'heading', (headingNode) => {
                    if (headingNode.children[0].type === 'text') {
                        anchors.add(kebab(headingNode.children[0].value));
                    }
                });

                visit(tree, 'paragraph', (paragraphNode) => {
                    if (
                        paragraphNode.children.length === 1 &&
                        paragraphNode.children[0].type === 'text') {
                    }
                });
            };
        })
        .use(remarkStringify)
        .process(document);

    return {
        anchors,
        links,
    };
}