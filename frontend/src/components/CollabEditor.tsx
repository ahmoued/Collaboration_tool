import React, { useEffect, useMemo } from "react";
import { EditorContent, useEditor, JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import "./CollabEditor.css";
import Link from "@tiptap/extension-link";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Image from "@tiptap/extension-image";

interface CollabEditorProps {
  docId: string;
  userName: string;
  userColor?: string;
  initialContent?: string;
  onUpdateContent?: (content: JSONContent) => void;
}

const CollabEditor: React.FC<CollabEditorProps> = ({
  docId,
  userName,
  userColor = "#ffa500",
  initialContent = "",
  onUpdateContent,
}) => {
  // Create Y.js document and provider using useMemo to ensure they're stable
  const { ydoc, provider } = useMemo(() => {
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider("ws://localhost:1234", docId, ydoc);

    return { ydoc, provider };
  }, [docId]);

  // Create the editor with collaboration extensions
  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          history: false, // Y.js handles undo/redo
          paragraph: false,
        }),
        Image.configure({
          inline: false,
          allowBase64: true,
          HTMLAttributes: {
            class: "editor-image",
          },
        }),
        Paragraph,
        Text,
        Link.configure({
          openOnClick: true,
          linkOnPaste: true,
          HTMLAttributes: {
            target: "_blank",
            rel: "noopener noreferrer nofollow",
          },
        }),
        Bold,
        Italic,
        Underline,
        Heading.configure({
          levels: [1, 2, 3],
        }),
        Collaboration.configure({
          document: ydoc, // Pass the Y.Doc directly, not the fragment
        }),
        // Update your CollaborationCursor configuration in CollabEditor.tsx
        CollaborationCursor.configure({
          provider,
          user: { name: userName, color: userColor },
          render: (user: any) => {
            const cursor = document.createElement("span");
            cursor.classList.add("collaboration-cursor__caret");
            cursor.setAttribute("style", `border-color: ${user.color}`);
            return cursor;
          },
          onUpdate: (users: any[]) => {
            // Handle cursor updates if needed
          },
        } as any),
      ],
      // Don't set content when using collaboration - content comes from Y.js document
      onUpdate: ({ editor }) => {
        onUpdateContent?.(editor.getJSON());
      },
      editorProps: {
        attributes: {
          class:
            "prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[750px] px-16 py-12",
          style: "outline: none;",
        },
      },
    },
    [ydoc, provider, userName, userColor]
  );

  // Handle cleanup when component unmounts
  useEffect(() => {
    return () => {
      provider?.destroy();
      ydoc?.destroy();
    };
  }, [provider, ydoc]);

  useEffect(() => {
    if (!editor || !provider || !ydoc || !initialContent) return;

    const seedContent = () => {
      const yXml = ydoc.get("prosemirror", Y.XmlFragment);
      const isEmpty = yXml.length === 0;

      if (isEmpty) {
        // Push saved DB content into Y.Doc
        editor.commands.setContent(initialContent as any);
      }
    };

    provider.once("synced", seedContent);

    if (provider.synced) {
      seedContent();
    }
  }, [editor, provider, ydoc, initialContent]);

  return (
    <div className="w-full space-y-6">
      <style>{`
        .editor-content .ProseMirror h1 {
          font-size: 2.5rem !important;
          font-weight: 800 !important;
          margin: 1.5rem 0 1rem 0 !important;
          line-height: 1.1 !important;
          color: #1f2937 !important;
        }
        .editor-content .ProseMirror h2 {
          font-size: 2rem !important;
          font-weight: 700 !important;
          margin: 1.25rem 0 0.75rem 0 !important;
          line-height: 1.2 !important;
          color: #374151 !important;
        }
        .editor-content .ProseMirror h3 {
          font-size: 1.5rem !important;
          font-weight: 600 !important;
          margin: 1rem 0 0.5rem 0 !important;
          line-height: 1.3 !important;
          color: #4b5563 !important;
        }
        .editor-content .ProseMirror ul {
          list-style-type: disc !important;
          padding-left: 1.75rem !important;
          margin: 1rem 0 !important;
        }
        .editor-content .ProseMirror ol {
          list-style-type: decimal !important;
          padding-left: 1.75rem !important;
          margin: 1rem 0 !important;
        }
        .editor-content .ProseMirror li {
          margin: 0.375rem 0 !important;
          line-height: 1.6 !important;
        }
        .editor-content .ProseMirror blockquote {
          border-left: 4px solid #6366f1 !important;
          background: linear-gradient(90deg, rgba(99, 102, 241, 0.05) 0%, transparent 100%) !important;
          padding: 1rem 1.5rem !important;
          margin: 1.5rem 0 !important;
          font-style: italic !important;
          border-radius: 0 0.5rem 0.5rem 0 !important;
        }
        .editor-content .ProseMirror code {
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%) !important;
          color: #db2777 !important;
          padding: 0.25rem 0.5rem !important;
          border-radius: 0.375rem !important;
          font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace !important;
          font-size: 0.875em !important;
          font-weight: 500 !important;
        }
        .editor-content .ProseMirror pre {
          background: linear-gradient(135deg, #1f2937 0%, #111827 100%) !important;
          color: #f9fafb !important;
          padding: 1.5rem !important;
          border-radius: 0.75rem !important;
          overflow-x: auto !important;
          margin: 1.5rem 0 !important;
          border: 1px solid #374151 !important;
        }
        .editor-content .ProseMirror pre code {
          background-color: transparent !important;
          color: inherit !important;
          padding: 0 !important;
        }
        .editor-content .ProseMirror strong {
          font-weight: 700 !important;
          color: #111827 !important;
        }
        .editor-content .ProseMirror em {
          font-style: italic !important;
          color: #6b7280 !important;
        }
        .editor-content .ProseMirror p {
          line-height: 1.7 !important;
          margin: 0.75rem 0 !important;
        }
        .editor-content .ProseMirror img,
        .editor-content img,
        img.editor-image {
          max-width: 100% !important;
          width: auto !important;
          height: auto !important;
          min-width: 100px !important;
          min-height: 100px !important;
          border-radius: 0.5rem !important;
          margin: 1rem 0 !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
          border: 1px solid #e5e7eb !important;
          display: block !important;
          object-fit: cover !important;
          cursor: grab !important;
          transition: all 0.3s ease !important;
        }
        .editor-content .ProseMirror img:active {
          cursor: grabbing !important;
        }
        .editor-content .ProseMirror img.ProseMirror-selectednode {
          border: 2px solid #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }
        .editor-content .ProseMirror img:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
          transform: scale(1.02) !important;
          transition: all 0.3s ease !important;
        }
        .editor-content .ProseMirror img[src=""], .editor-content .ProseMirror img:not([src]) {
          display: inline-block !important;
          width: 24px !important;
          height: 24px !important;
          background: #f3f4f6 !important;
          border: 2px dashed #d1d5db !important;
          border-radius: 4px !important;
          position: relative !important;
        }
        .editor-content .ProseMirror img[src=""]:before, .editor-content .ProseMirror img:not([src]):before {
          content: "🖼️" !important;
          position: absolute !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          font-size: 12px !important;
        }
        /* Add red margin line like a real notebook */
        .document-paper::before {
          content: '';
          position: absolute;
          left: 64px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #fca5a5;
          opacity: 0.3;
        }
      `}</style>

      {/* Modern Floating Toolbar */}
      {editor && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white/90 backdrop-blur-md border border-gray-200/60 rounded-2xl shadow-2xl shadow-black/10 p-2">
            <div className="flex items-center gap-1">
              {/* Text Formatting Group */}
              <div className="flex items-center gap-0.5 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-1.5 shadow-inner">
                <button
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`
                    group relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 
                    ${
                      editor.isActive("bold")
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 scale-95"
                        : "hover:bg-white hover:shadow-md text-slate-600 hover:text-slate-800 hover:scale-105"
                    }
                  `}
                  title="Bold (Ctrl+B)"
                >
                  <svg
                    className="w-4 h-4 transition-transform group-hover:scale-110"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6 4v12h4.5c2.5 0 4.5-1.5 4.5-3.5 0-1.2-.8-2.3-2-2.8 1-.4 1.7-1.3 1.7-2.4C14.7 5.5 13.2 4 11.2 4H6zm2.5 2h2c.8 0 1.5.7 1.5 1.5S11.3 9 10.5 9h-2V6zm0 5h2.5c1 0 1.8.8 1.8 1.8s-.8 1.7-1.8 1.7H8.5v-3.5z" />
                  </svg>
                </button>

                <button
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`
                    group relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300
                    ${
                      editor.isActive("italic")
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 scale-95"
                        : "hover:bg-white hover:shadow-md text-slate-600 hover:text-slate-800 hover:scale-105"
                    }
                  `}
                  title="Italic (Ctrl+I)"
                >
                  <svg
                    className="w-4 h-4 transition-transform group-hover:scale-110"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M8.5 4h6v2h-2.2l-2.6 8H12v2H6v-2h2.2l2.6-8H8.5V4z" />
                  </svg>
                </button>

                <button
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  className={`
                    group relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300
                    ${
                      editor.isActive("underline")
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 scale-95"
                        : "hover:bg-white hover:shadow-md text-slate-600 hover:text-slate-800 hover:scale-105"
                    }
                  `}
                  title="Underline (Ctrl+U)"
                >
                  <svg
                    className="w-4 h-4 transition-transform group-hover:scale-110"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6 2v8c0 2.2 1.8 4 4 4s4-1.8 4-4V2h-2v8c0 1.1-.9 2-2 2s-2-.9-2-2V2H6zm-2 14h12v2H4v-2z" />
                  </svg>
                </button>
              </div>

              {/* Modern Separator */}
              <div className="w-0.5 h-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent mx-2"></div>

              {/* Heading Group */}
              <div className="flex items-center gap-0.5 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-1.5 shadow-inner">
                <button
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                  }
                  className={`
                    group relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 text-sm font-bold
                    ${
                      editor.isActive("heading", { level: 1 })
                        ? "bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30 scale-95"
                        : "hover:bg-white hover:shadow-md text-slate-600 hover:text-slate-800 hover:scale-105"
                    }
                  `}
                  title="Heading 1"
                >
                  <span className="transition-transform group-hover:scale-110">
                    H1
                  </span>
                </button>

                <button
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                  className={`
                    group relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 text-sm font-bold
                    ${
                      editor.isActive("heading", { level: 2 })
                        ? "bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30 scale-95"
                        : "hover:bg-white hover:shadow-md text-slate-600 hover:text-slate-800 hover:scale-105"
                    }
                  `}
                  title="Heading 2"
                >
                  <span className="transition-transform group-hover:scale-110">
                    H2
                  </span>
                </button>

                <button
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                  className={`
                    group relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 text-sm font-bold
                    ${
                      editor.isActive("heading", { level: 3 })
                        ? "bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30 scale-95"
                        : "hover:bg-white hover:shadow-md text-slate-600 hover:text-slate-800 hover:scale-105"
                    }
                  `}
                  title="Heading 3"
                >
                  <span className="transition-transform group-hover:scale-110">
                    H3
                  </span>
                </button>
              </div>

              {/* Modern Separator */}
              <div className="w-0.5 h-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent mx-2"></div>

              {/* List Group */}
              <div className="flex items-center gap-0.5 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-1.5 shadow-inner">
                <button
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                  className={`
                    group relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300
                    ${
                      editor.isActive("bulletList")
                        ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30 scale-95"
                        : "hover:bg-white hover:shadow-md text-slate-600 hover:text-slate-800 hover:scale-105"
                    }
                  `}
                  title="Bullet List"
                >
                  <svg
                    className="w-4 h-4 transition-transform group-hover:scale-110"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M4 6a2 2 0 11-4 0 2 2 0 014 0zM4 12a2 2 0 11-4 0 2 2 0 014 0zM6 6h10v1H6V6zM6 11h10v1H6v-1z" />
                  </svg>
                </button>

                <button
                  onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                  }
                  className={`
                    group relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300
                    ${
                      editor.isActive("orderedList")
                        ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30 scale-95"
                        : "hover:bg-white hover:shadow-md text-slate-600 hover:text-slate-800 hover:scale-105"
                    }
                  `}
                  title="Numbered List"
                >
                  <svg
                    className="w-4 h-4 transition-transform group-hover:scale-110"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3 4a1 1 0 000 2h1v1H3a1 1 0 100 2h1a1 1 0 001-1V5a1 1 0 00-1-1H3zM3 10a1 1 0 100 2h1v1H3a1 1 0 100 2h1a1 1 0 001-1v-1a1 1 0 00-1-1H3zM7 4h10v2H7V4zM7 10h10v2H7v-2z" />
                  </svg>
                </button>
              </div>

              {/* Modern Separator */}
              <div className="w-0.5 h-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent mx-2"></div>

              {/* Quote & Code Group */}
              <div className="flex items-center gap-0.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-1.5 shadow-inner">
                <button
                  onClick={() =>
                    editor.chain().focus().toggleBlockquote().run()
                  }
                  className={`
                    group relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300
                    ${
                      editor.isActive("blockquote")
                        ? "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30 scale-95"
                        : "hover:bg-white hover:shadow-md text-slate-600 hover:text-slate-800 hover:scale-105"
                    }
                  `}
                  title="Quote"
                >
                  <svg
                    className="w-4 h-4 transition-transform group-hover:scale-110"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.5 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0-3c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zm7 3c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0-3c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1z" />
                  </svg>
                </button>

                <button
                  onClick={() => editor.chain().focus().toggleCode().run()}
                  className={`
                    group relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300
                    ${
                      editor.isActive("code")
                        ? "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30 scale-95"
                        : "hover:bg-white hover:shadow-md text-slate-600 hover:text-slate-800 hover:scale-105"
                    }
                  `}
                  title="Inline Code"
                >
                  <svg
                    className="w-4 h-4 transition-transform group-hover:scale-110"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" />
                  </svg>
                </button>

                <button
                  onClick={() => {
                    const url = prompt("Enter URL");
                    if (url) {
                      // Check if there's a selection
                      const { from, to } = editor.state.selection;
                      const hasSelection = from !== to;

                      if (hasSelection) {
                        // If text is selected, make it a link
                        editor.chain().focus().setLink({ href: url }).run();
                      } else {
                        // If no text is selected, insert the URL as both text and link
                        editor
                          .chain()
                          .focus()
                          .insertContent(`<a href="${url}">${url}</a>`)
                          .run();
                      }
                    }
                  }}
                  className={`
                    group relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300
                    ${
                      editor.isActive("link")
                        ? "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30 scale-95"
                        : "hover:bg-white hover:shadow-md text-slate-600 hover:text-slate-800 hover:scale-105"
                    }
                  `}
                  title="Add Link (Ctrl+K)"
                >
                  <svg
                    className="w-4 h-4 transition-transform group-hover:scale-110"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                <button
                  onClick={() => {
                    const url = prompt(
                      "Enter image URL:\n\nExamples:\n• https://picsum.photos/400/300\n• https://via.placeholder.com/500x300\n• https://example.com/image.jpg"
                    );
                    if (url && url.trim()) {
                      const trimmedUrl = url.trim();
                      // No validation - just insert the image
                      editor
                        .chain()
                        .focus()
                        .setImage({
                          src: trimmedUrl,
                          alt: "Inserted image",
                          title: "Inserted image",
                        })
                        .run();
                    }
                  }}
                  className={`
                    group relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300
                    ${
                      editor.isActive("image")
                        ? "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30 scale-95"
                        : "hover:bg-white hover:shadow-md text-slate-600 hover:text-slate-800 hover:scale-105"
                    }
                  `}
                  title="Insert Image"
                >
                  <svg
                    className="w-4 h-4 transition-transform group-hover:scale-110"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Paper Container */}
      <div className="max-w-4xl mx-auto pt-16">
        {" "}
        {/* Added top padding for floating toolbar */}
        <div className="document-paper relative bg-white shadow-2xl shadow-black/10 rounded-2xl border border-gray-200/60 min-h-[900px] overflow-hidden">
          {/* Paper texture overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50/30 to-gray-100/20 pointer-events-none"></div>

          {/* Editor Content */}
          <div className="relative">
            <EditorContent
              editor={editor}
              className="editor-content focus-within:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollabEditor;
