import { useState, useEffect } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

const shiftHeadingLevels = (markdown) => {
  return markdown.replace(/^(#{1,6}) /gm, "$1# "); // Shift headings down
};

const MarkdownRenderer = ({ content }) => {
  const [sanitizedContent, setSanitizedContent] = useState("");

  useEffect(() => {
    if (content) {
      const transformedContent = shiftHeadingLevels(content);
      const rawHTML = marked(transformedContent);
      setSanitizedContent(DOMPurify.sanitize(rawHTML)); // Prevent XSS
    }
  }, [content]);

  return (
    <div
      className="markdown-content py-2"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default MarkdownRenderer;
