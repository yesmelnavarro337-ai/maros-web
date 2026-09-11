const HEADING_RE = /^#{1,2}\s+(.+)$/;
const BULLET_RE = /^\s*[-*•]\s+(.+)$/;

export function BlogContent({ content }: { content: string }) {
  const blocks: { type: "heading" | "paragraph" | "list"; text?: string; items?: string[] }[] = [];

  const rawLines = content.split("\n");
  let currentParagraph: string[] = [];
  let currentList: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      blocks.push({ type: "paragraph", text: currentParagraph.join(" ") });
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (currentList.length > 0) {
      blocks.push({ type: "list", items: [...currentList] });
      currentList = [];
    }
  };

  for (const line of rawLines) {
    const heading = line.match(HEADING_RE);
    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({ type: "heading", text: heading[1] });
      continue;
    }
    const bullet = line.match(BULLET_RE);
    if (bullet) {
      flushParagraph();
      currentList.push(bullet[1]);
      continue;
    }
    if (line.trim() === "") {
      flushParagraph();
      flushList();
      continue;
    }
    flushList();
    currentParagraph.push(line.trim());
  }
  flushParagraph();
  flushList();

  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        if (block.type === "heading") {
          return (
            <h2 key={i} className="font-heading text-2xl text-foreground mt-8">
              {block.text}
            </h2>
          );
        }
        if (block.type === "list") {
          return (
            <ul key={i} className="list-disc pl-5 space-y-1.5 text-foreground leading-relaxed">
              {block.items?.map((item, j) => <li key={j}>{item}</li>)}
            </ul>
          );
        }
        return (
          <p key={i} className="text-foreground leading-relaxed">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}