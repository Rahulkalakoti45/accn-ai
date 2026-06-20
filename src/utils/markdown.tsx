import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  language: string;
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  return (
    <div className="my-4 border border-cardBorder bg-void/85 rounded-xl overflow-hidden font-mono text-[11px] md:text-xs shadow-inner">
      <div className="bg-cardSurface/60 px-4 py-2 border-b border-cardBorder flex justify-between items-center text-textSecondary text-[10px] uppercase tracking-wider font-semibold select-none">
        <span>{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-accentGreen" />
              <span className="text-accentGreen">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-textPrimary leading-relaxed select-text">
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
};

const renderInline = (text: string): React.ReactNode[] => {
  // Regex to split by bold (**text**), italic (*text*), and inline code (`code`)
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i} className="italic text-textPrimary">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="px-1.5 py-0.5 rounded bg-white/10 border border-white/5 font-mono text-[10px] text-accentCyan">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
};

const renderTextWithFormatting = (text: string, keyPrefix: string): React.ReactNode => {
  const lines = text.split('\n');
  const renderedElements = lines.map((line, lIdx) => {
    const trimmed = line.trim();

    // Check Headers
    if (trimmed.startsWith('### ')) {
      return (
        <h3 key={lIdx} className="text-xs md:text-sm font-bold text-white mt-4 mb-2 font-heading tracking-wide">
          {renderInline(trimmed.slice(4))}
        </h3>
      );
    }
    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={lIdx} className="text-sm md:text-base font-bold text-white mt-5 mb-2.5 font-heading tracking-wide border-b border-cardBorder/30 pb-1">
          {renderInline(trimmed.slice(3))}
        </h2>
      );
    }
    if (trimmed.startsWith('# ')) {
      return (
        <h1 key={lIdx} className="text-base md:text-lg font-bold text-white mt-6 mb-3 font-heading tracking-wide">
          {renderInline(trimmed.slice(2))}
        </h1>
      );
    }

    // Check Bullet List
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      return (
        <li key={lIdx} className="list-disc ml-6 my-1.5 text-textPrimary select-text text-[11px] md:text-xs">
          {renderInline(trimmed.slice(2))}
        </li>
      );
    }

    // Check Numbered List
    const numMatch = trimmed.match(/^(\d+)\.\s(.*)/);
    if (numMatch) {
      return (
        <li key={lIdx} className="list-decimal ml-6 my-1.5 text-textPrimary select-text text-[11px] md:text-xs" style={{ listStyleType: 'decimal' }}>
          {renderInline(numMatch[2])}
        </li>
      );
    }

    // Empty line
    if (!trimmed) {
      return <div key={lIdx} className="h-2" />;
    }

    return (
      <p key={lIdx} className="my-1.5 text-textPrimary leading-relaxed select-text text-[11px] md:text-xs">
        {renderInline(line)}
      </p>
    );
  });

  return <div key={keyPrefix} className="flex flex-col">{renderedElements}</div>;
};

const renderTable = (rows: string[][], key: string) => {
  if (rows.length === 0) return null;
  const headers = rows[0];
  const bodyRows = rows.slice(1);

  return (
    <div key={key} className="my-4 overflow-x-auto border border-cardBorder rounded-xl max-w-full glass-panel">
      <table className="w-full text-left border-collapse text-[10px] md:text-xs select-text">
        <thead>
          <tr className="bg-cardSurface/60 border-b border-cardBorder text-textSecondary font-semibold">
            {headers.map((h, i) => (
              <th key={i} className="p-3 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((row, rIdx) => (
            <tr key={rIdx} className="border-b border-cardBorder/40 hover:bg-cardSurface/20 transition-colors">
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="p-3 text-textPrimary">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const renderMarkdown = (text: string): React.ReactNode => {
  // Regex to split code blocks from normal text
  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="markdown-body space-y-1">
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          const match = part.match(/```(\w*)\n([\s\S]*?)```/);
          const language = match ? match[1] : 'code';
          const codeContent = match ? match[2] : part.slice(3, -3);

          return <CodeBlock key={`code-${index}`} language={language} code={codeContent} />;
        }

        // Parse tables
        if (part.includes('|')) {
          const lines = part.split('\n');
          const rows: string[][] = [];
          let inTable = false;

          const renderedBlocks: React.ReactNode[] = [];
          let textBuffer: string[] = [];

          for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith('|') && line.endsWith('|')) {
              if (!inTable) {
                // Flush text buffer
                if (textBuffer.length > 0) {
                  renderedBlocks.push(renderTextWithFormatting(textBuffer.join('\n'), `text-${index}-${i}`));
                  textBuffer = [];
                }
                inTable = true;
              }
              // Parse columns
              const cols = line.split('|').slice(1, -1).map(c => c.trim());
              // Skip formatting lines like |---|---|
              if (!cols.every(c => c.match(/^:-*-?:?$/) || c.match(/^-+$/))) {
                rows.push(cols);
              }
            } else {
              if (inTable) {
                // Flush table
                renderedBlocks.push(renderTable(rows, `table-${index}-${i}`));
                rows.length = 0;
                inTable = false;
              }
              textBuffer.push(lines[i]);
            }
          }

          if (inTable && rows.length > 0) {
            renderedBlocks.push(renderTable(rows, `table-${index}-end`));
          }
          if (textBuffer.length > 0) {
            renderedBlocks.push(renderTextWithFormatting(textBuffer.join('\n'), `text-${index}-end`));
          }

          return <React.Fragment key={`block-${index}`}>{renderedBlocks}</React.Fragment>;
        }

        return renderTextWithFormatting(part, `text-${index}`);
      })}
    </div>
  );
};
