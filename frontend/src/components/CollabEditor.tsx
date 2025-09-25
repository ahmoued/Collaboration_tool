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
        CollaborationCursor.configure({
          provider,
          user: { name: userName, color: userColor },
        }),
      ],
      // Don't set content when using collaboration - content comes from Y.js document
      onUpdate: ({ editor }) => {
        onUpdateContent?.(editor.getJSON());
      },
      editorProps: {
        attributes: {
          class:
            "prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[500px] px-4 py-2",
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
    <div className="w-full">
      <style>{`
        .editor-content .ProseMirror h1 {
          font-size: 2rem !important;
          font-weight: bold !important;
          margin: 1rem 0 !important;
          line-height: 1.2 !important;
        }
        .editor-content .ProseMirror h2 {
          font-size: 1.75rem !important;
          font-weight: bold !important;
          margin: 0.875rem 0 !important;
          line-height: 1.3 !important;
        }
        .editor-content .ProseMirror h3 {
          font-size: 1.5rem !important;
          font-weight: bold !important;
          margin: 0.75rem 0 !important;
          line-height: 1.4 !important;
        }
        .editor-content .ProseMirror h4 {
          font-size: 1.25rem !important;
          font-weight: bold !important;
          margin: 0.625rem 0 !important;
        }
        .editor-content .ProseMirror h5 {
          font-size: 1.125rem !important;
          font-weight: bold !important;
          margin: 0.5rem 0 !important;
        }
        .editor-content .ProseMirror h6 {
          font-size: 1rem !important;
          font-weight: bold !important;
          margin: 0.5rem 0 !important;
        }
        .editor-content .ProseMirror ul {
          list-style-type: disc !important;
          padding-left: 1.5rem !important;
          margin: 1rem 0 !important;
        }
        .editor-content .ProseMirror ol {
          list-style-type: decimal !important;
          padding-left: 1.5rem !important;
          margin: 1rem 0 !important;
        }
        .editor-content .ProseMirror li {
          margin: 0.25rem 0 !important;
        }
        .editor-content .ProseMirror blockquote {
          border-left: 4px solid #e5e7eb !important;
          padding-left: 1rem !important;
          margin: 1rem 0 !important;
          font-style: italic !important;
        }
        .editor-content .ProseMirror code {
          background-color: #f3f4f6 !important;
          padding: 0.25rem !important;
          border-radius: 0.25rem !important;
          font-family: monospace !important;
        }
        .editor-content .ProseMirror pre {
          background-color: #f3f4f6 !important;
          padding: 1rem !important;
          border-radius: 0.5rem !important;
          overflow-x: auto !important;
          margin: 1rem 0 !important;
        }
        .editor-content .ProseMirror pre code {
          background-color: transparent !important;
          padding: 0 !important;
        }
        .editor-content .ProseMirror strong {
          font-weight: bold !important;
        }
        .editor-content .ProseMirror em {
          font-style: italic !important;
        }
      `}</style>
      
      {editor && (
  <div className="flex gap-2 mb-2 border-b pb-2">
    <button
      onClick={() => editor.chain().focus().toggleBold().run()}
      className={editor.isActive("bold") ? "bg-gray-200 px-2" : "px-2"}
    >
      Bold
    </button>
    <button
      onClick={() => editor.chain().focus().toggleItalic().run()}
      className={editor.isActive("italic") ? "bg-gray-200 px-2" : "px-2"}
    >
      Italic
    </button>
    <button
      onClick={() => editor.chain().focus().toggleUnderline().run()}
      className={editor.isActive("underline") ? "bg-gray-200 px-2" : "px-2"}
    >
      Underline
    </button>
    <button
      onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      className={editor.isActive("heading", { level: 1 }) ? "bg-gray-200 px-2" : "px-2"}
    >
      H1
    </button>
    <button
      onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      className={editor.isActive("heading", { level: 2 }) ? "bg-gray-200 px-2" : "px-2"}
    >
      H2
    </button>
  </div>
)}

      <EditorContent
        editor={editor}
        className="editor-content min-h-[500px] focus-within:outline-none border border-border rounded-lg p-4"
      />
    </div>
  );
};

export default CollabEditor;
