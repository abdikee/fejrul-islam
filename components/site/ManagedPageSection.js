'use client';

import { useEffect, useState } from 'react';

function isSafeHttpUrl(url) {
  try {
    const parsed = new URL(url, 'https://example.com');
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function renderInline(text) {
  // Minimal inline markdown:
  // - `code`
  // - **bold**
  // - *italic* / _italic_
  // - [label](https://url)
  const nodes = [];
  let i = 0;

  const pushText = (value) => {
    if (!value) return;
    nodes.push(value);
  };

  while (i < text.length) {
    // Inline code
    if (text[i] === '`') {
      const end = text.indexOf('`', i + 1);
      if (end !== -1) {
        const code = text.slice(i + 1, end);
        nodes.push(<code key={`code-${i}`} className="px-1 py-0.5 rounded bg-slate-100">{code}</code>);
        i = end + 1;
        continue;
      }
    }

    // Link [label](url)
    if (text[i] === '[') {
      const closeLabel = text.indexOf(']', i + 1);
      const openUrl = closeLabel !== -1 ? text[closeLabel + 1] : null;
      if (closeLabel !== -1 && openUrl === '(') {
        const closeUrl = text.indexOf(')', closeLabel + 2);
        if (closeUrl !== -1) {
          const label = text.slice(i + 1, closeLabel);
          const url = text.slice(closeLabel + 2, closeUrl);
          if (isSafeHttpUrl(url)) {
            nodes.push(
              <a
                key={`a-${i}`}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 underline"
              >
                {label || url}
              </a>
            );
          } else {
            // Unsafe/invalid URL: render as plain text
            pushText(text.slice(i, closeUrl + 1));
          }
          i = closeUrl + 1;
          continue;
        }
      }
    }

    // Bold **...**
    if (text[i] === '*' && text[i + 1] === '*') {
      const end = text.indexOf('**', i + 2);
      if (end !== -1) {
        const inner = text.slice(i + 2, end);
        nodes.push(<strong key={`b-${i}`}>{inner}</strong>);
        i = end + 2;
        continue;
      }
    }

    // Italic *...* or _..._
    if (text[i] === '*' || text[i] === '_') {
      const marker = text[i];
      const end = text.indexOf(marker, i + 1);
      if (end !== -1) {
        const inner = text.slice(i + 1, end);
        nodes.push(<em key={`i-${i}`}>{inner}</em>);
        i = end + 1;
        continue;
      }
    }

    // Default: consume until next special char
    const nextSpecialCandidates = ['`', '[', '*', '_']
      .map((ch) => text.indexOf(ch, i + 1))
      .filter((idx) => idx !== -1);
    const next = nextSpecialCandidates.length ? Math.min(...nextSpecialCandidates) : -1;
    if (next === -1) {
      pushText(text.slice(i));
      break;
    }
    pushText(text.slice(i, next));
    i = next;
  }

  return nodes;
}

function renderMarkdown(content) {
  const lines = String(content ?? '').replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let i = 0;

  const consumeCodeBlock = () => {
    const start = i;
    i++; // skip opening ```
    const codeLines = [];
    while (i < lines.length && !lines[i].startsWith('```')) {
      codeLines.push(lines[i]);
      i++;
    }
    if (i < lines.length && lines[i].startsWith('```')) i++; // skip closing ```
    const code = codeLines.join('\n');
    blocks.push(
      <pre key={`pre-${start}`} className="p-4 rounded-lg bg-slate-900 text-slate-100 overflow-x-auto">
        <code>{code}</code>
      </pre>
    );
  };

  const consumeList = (ordered) => {
    const start = i;
    const items = [];
    while (i < lines.length) {
      const line = lines[i];
      if (!line.trim()) break;
      if (ordered) {
        const match = line.match(/^\s*(\d+)\.\s+(.*)$/);
        if (!match) break;
        items.push(match[2]);
      } else {
        const match = line.match(/^\s*[-*]\s+(.*)$/);
        if (!match) break;
        items.push(match[1]);
      }
      i++;
    }

    const ListTag = ordered ? 'ol' : 'ul';
    const listClass = ordered ? 'list-decimal' : 'list-disc';

    blocks.push(
      <ListTag key={`list-${start}`} className={`${listClass} pl-6 space-y-1`}>
        {items.map((item, idx) => (
          <li key={`li-${start}-${idx}`} className="text-slate-700">
            {renderInline(item)}
          </li>
        ))}
      </ListTag>
    );
  };

  const consumeParagraph = () => {
    const start = i;
    const parts = [];
    while (i < lines.length && lines[i].trim()) {
      parts.push(lines[i].trim());
      i++;
    }
    const text = parts.join(' ');
    blocks.push(
      <p key={`p-${start}`} className="text-slate-700 leading-relaxed">
        {renderInline(text)}
      </p>
    );
  };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    if (trimmed.startsWith('```')) {
      consumeCodeBlock();
      continue;
    }

    const h3 = trimmed.match(/^###\s+(.*)$/);
    if (h3) {
      blocks.push(
        <h3 key={`h3-${i}`} className="text-lg font-semibold text-slate-800 mt-6">
          {renderInline(h3[1])}
        </h3>
      );
      i++;
      continue;
    }

    const h2 = trimmed.match(/^##\s+(.*)$/);
    if (h2) {
      blocks.push(
        <h2 key={`h2-${i}`} className="text-xl font-bold text-slate-800 mt-8">
          {renderInline(h2[1])}
        </h2>
      );
      i++;
      continue;
    }

    const h1 = trimmed.match(/^#\s+(.*)$/);
    if (h1) {
      blocks.push(
        <h1 key={`h1-${i}`} className="text-2xl font-bold text-slate-800 mt-10">
          {renderInline(h1[1])}
        </h1>
      );
      i++;
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      consumeList(false);
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      consumeList(true);
      continue;
    }

    consumeParagraph();
  }

  return blocks;
}

export default function ManagedPageSection({ slug }) {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`/api/pages/${encodeURIComponent(slug)}`);
        const data = await res.json();
        if (!cancelled && data?.success) {
          setPage(data.page);
        }
      } catch (e) {
        // Silent fail: public pages should still render without CMS data
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) return null;
  if (!page || !page.content) return null;

  return (
    <section className="py-10 bg-white border-t border-slate-200">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">{page.title}</h2>
          <div className="space-y-3">
            {renderMarkdown(page.content)}
          </div>
        </div>
      </div>
    </section>
  );
}
