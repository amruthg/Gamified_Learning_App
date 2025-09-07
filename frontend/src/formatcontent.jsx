// formatContent.js
import React from 'react';

export const formatContent = (text) => {
  const lines = text.split('\n');
  let listItems = [];
  const formattedLines = [];

  lines.forEach((line, index) => {
    // Handle headers marked with "**Header Text**" or "***Subheader***"
    if (line.startsWith("***")) {
      // If there is an open list, finalize it first
      if (listItems.length > 0) {
        formattedLines.push(
          <ul key={`ul-${index}`} style={{ marginLeft: "1.5rem", marginTop: "0.5rem" }}>
            {listItems.map((item, idx) => (
              <li key={`li-${idx}`}>{item}</li>
            ))}
          </ul>
        );
        listItems = [];
      }
      formattedLines.push(
        <h4 key={index} style={{ color: "#555", marginTop: "1rem" }}>
          {line.replace(/\*{3}/g, "").trim()}
        </h4>
      );
      return;
    } else if (line.startsWith("**")) {
      // If there is an open list, finalize it first
      if (listItems.length > 0) {
        formattedLines.push(
          <ul key={`ul-${index}`} style={{ marginLeft: "1.5rem", marginTop: "0.5rem" }}>
            {listItems.map((item, idx) => (
              <li key={`li-${idx}`}>{item}</li>
            ))}
          </ul>
        );
        listItems = [];
      }
      formattedLines.push(
        <h3 key={index} style={{ color: "#007acc", marginTop: "1.5rem" }}>
          {line.replace(/\*\*/g, "").trim()}
        </h3>
      );
      return;
    }

    // Check for list items (e.g., "- Item")
    if (line.startsWith("-")) {
      listItems.push(line.replace("-", "").trim());
      return;
    }

    // If the current line is not part of a list, finalize any open list
    if (listItems.length > 0) {
      formattedLines.push(
        <ul key={`ul-${index}`} style={{ marginLeft: "1.5rem", marginTop: "0.5rem" }}>
          {listItems.map((item, idx) => (
            <li key={`li-${idx}`}>{item}</li>
          ))}
        </ul>
      );
      listItems = [];
    }

    // Add paragraphs with inline formatting
    const formattedParagraph = line
      .replace(/__(.*?)__/g, "<em>$1</em>") // Italic
      .replace(/_(.*?)_/g, "<strong>$1</strong>"); // Bold

    formattedLines.push(
      <p
        key={index}
        dangerouslySetInnerHTML={{ __html: formattedParagraph }}
        style={{ marginBottom: "1rem", lineHeight: "1.6" }}
      ></p>
    );
  });

  // If there's an open list at the end, add it to the formatted lines
  if (listItems.length > 0) {
    formattedLines.push(
      <ul style={{ marginLeft: "1.5rem", marginTop: "0.5rem" }}>
        {listItems.map((item, idx) => (
          <li key={`li-final-${idx}`}>{item}</li>
        ))}
      </ul>
    );
  }

  return formattedLines;
};