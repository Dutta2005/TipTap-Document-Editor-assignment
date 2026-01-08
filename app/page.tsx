'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Link2,
  Download,
  Printer,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const PAGE_HEIGHT = 1056;
const PAGE_WIDTH = 816;
const PAGE_PADDING = 96;

export default function PaginatedEditor() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return <EditorComponent />;
}

function EditorComponent() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState([1]);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      Placeholder.configure({
        placeholder: 'Start typing your document...',
      }),
    ],
    content: '<p>Start typing your document here...</p>',
    immediatelyRender: false, // prevents SSR issues   :contentReference[oaicite:1]{index=1}
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none',
      },
    },
    onUpdate: ({ editor }) => {
      updateStats(editor);
      updatePagination();
    },
  });

  const updateStats = (editor: any) => {
    const text = editor.getText();
    setCharCount(text.length);
    setWordCount(text.split(/\s+/).filter(Boolean).length);
  };

  const updatePagination = () => {
    if (!editorRef.current) return;

    const contentHeight = editorRef.current.scrollHeight;
    const availableHeight = PAGE_HEIGHT - PAGE_PADDING * 2;
    const numPages = Math.ceil(contentHeight / availableHeight);

    setPages(Array.from({ length: Math.max(1, numPages) }, (_, i) => i + 1));
  };

  useEffect(() => {
    updatePagination();
    window.addEventListener('resize', updatePagination);
    return () => window.removeEventListener('resize', updatePagination);
  }, []);

  if (!editor) {
    return (
      <div className="min-h-[300px] flex items-center justify-center text-gray-500">
        Initializing editor…
      </div>
    );
  }

  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleUnderline = () => editor.chain().focus().toggleUnderline().run();
  const setH1 = () => editor.chain().focus().toggleHeading({ level: 1 }).run();
  const setH2 = () => editor.chain().focus().toggleHeading({ level: 2 }).run();
  const setAlign = (align: 'left' | 'center' | 'right') =>
    editor.chain().focus().setTextAlign(align).run();
  const toggleBulletList = () =>
    editor.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () =>
    editor.chain().focus().toggleOrderedList().run();
  const insertLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const handlePrint = () => window.print();
  const handleExportHTML = () => {
    const html = editor.getHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="sticky top-0 bg-white border-b shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-2">
          <div className="flex gap-1">
            <Button
              variant={editor.isActive('bold') ? 'default' : 'ghost'}
              size="sm"
              onClick={toggleBold}
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </Button>

            <Button
              variant={editor.isActive('italic') ? 'default' : 'ghost'}
              size="sm"
              onClick={toggleItalic}
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </Button>

            <Button
              variant={editor.isActive('underline') ? 'default' : 'ghost'}
              size="sm"
              onClick={toggleUnderline}
              title="Underline"
            >
              <UnderlineIcon className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex gap-1">
            <Button
              variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
              size="sm"
              onClick={setH1}
            >
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
              size="sm"
              onClick={setH2}
            >
              <Heading2 className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex gap-1">
            <Button
              variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setAlign('left')}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setAlign('center')}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setAlign('right')}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex gap-1">
            <Button
              variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
              size="sm"
              onClick={toggleBulletList}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
              size="sm"
              onClick={toggleOrderedList}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <Button
            variant={editor.isActive('link') ? 'default' : 'ghost'}
            size="sm"
            onClick={insertLink}
          >
            <Link2 className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <Button variant="ghost" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleExportHTML}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {pages.map((num, i) => (
            <div
              key={num}
              className="bg-white shadow-lg mx-auto relative"
              style={{
                width: PAGE_WIDTH,
                minHeight: PAGE_HEIGHT,
              }}
            >
              <div className="absolute top-4 right-4 text-xs text-gray-400">
                Page {num}
              </div>

              {i === 0 && (
                <div ref={editorRef} style={{ padding: PAGE_PADDING }}>
                  <div suppressHydrationWarning={true}>
                    <EditorContent editor={editor} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <BubbleMenu
        editor={editor}
        className="bg-gray-900 rounded-lg shadow-xl flex gap-1 p-1"
      >
        <Button variant="ghost" size="sm" onClick={toggleBold}>
          <Bold className="h-4 w-4 text-white" />
        </Button>
        <Button variant="ghost" size="sm" onClick={toggleItalic}>
          <Italic className="h-4 w-4 text-white" />
        </Button>
        <Button variant="ghost" size="sm" onClick={toggleUnderline}>
          <UnderlineIcon className="h-4 w-4 text-white" />
        </Button>
        <Button variant="ghost" size="sm" onClick={insertLink}>
          <Link2 className="h-4 w-4 text-white" />
        </Button>
      </BubbleMenu>
    </div>
  );
}
