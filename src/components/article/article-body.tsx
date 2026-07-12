type ArticleBodyProps = {
  content: string;
};

export function ArticleBody({ content }: ArticleBodyProps) {
  const paragraphs = content.includes("\n\n")
    ? content.split(/\n\n+/).filter(Boolean)
    : [content];

  return (
    <div className="article-body">
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph.trim()}</p>
      ))}
    </div>
  );
}
