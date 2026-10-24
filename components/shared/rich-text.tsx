import parse, {
  domToReact,
  type DOMNode,
  type HTMLReactParserOptions,
  Element,
} from "html-react-parser";

/**
 * Whitelist of HTML tags that are safe to render from CMS content.
 * Everything else is stripped (the children are kept as text).
 */
const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "del",
  "mark",
  "small",
  "sub",
  "sup",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "a",
  "blockquote",
  "pre",
  "code",
  "hr",
  "span",
  "div",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "img",
  "figure",
  "figcaption",
]);

/**
 * Attributes that are safe to keep. Everything else is removed.
 */
const ALLOWED_ATTRS = new Set([
  "href",
  "target",
  "rel",
  "src",
  "alt",
  "width",
  "height",
  "class",
  "id",
]);

const parserOptions: HTMLReactParserOptions = {
  replace(domNode: DOMNode) {
    if (domNode instanceof Element) {
      // Strip disallowed tags but keep their children
      if (!ALLOWED_TAGS.has(domNode.name)) {
        return <>{domToReact(domNode.children as DOMNode[], parserOptions)}</>;
      }

      // Sanitize attributes
      if (domNode.attribs) {
        const clean: Record<string, string> = {};
        for (const [key, val] of Object.entries(domNode.attribs)) {
          if (ALLOWED_ATTRS.has(key)) {
            // Block javascript: URIs in href/src
            if (
              (key === "href" || key === "src") &&
              val.trim().toLowerCase().startsWith("javascript:")
            ) {
              continue;
            }
            clean[key] = val;
          }
        }
        domNode.attribs = clean;

        // External links open in new tab safely
        if (domNode.name === "a" && domNode.attribs.href) {
          domNode.attribs.target = "_blank";
          domNode.attribs.rel = "noopener noreferrer";
        }
      }
    }
  },
};

interface RichTextProps {
  /** Raw HTML string from the CMS / admin panel. */
  html: string;
  /** Extra CSS class names for the wrapper. */
  className?: string;
}

/**
 * Renders sanitised HTML content from the CMS with proper typographic styles.
 *
 * Usage:
 * ```tsx
 * <RichText html={post.content} />
 * <RichText html={product.description} className="text-sm" />
 * ```
 */
export function RichText({ html, className = "" }: RichTextProps) {
  if (!html) return null;

  return (
    <div className={`rich-text ${className}`.trim()}>
      {parse(html, parserOptions)}
    </div>
  );
}
