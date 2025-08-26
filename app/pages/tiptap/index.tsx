"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List as ListIcon,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
} from "lucide-react";

type ToolbarButtonProps = {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
  variant?: "default" | "ghost";
};
const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  onClick,
  isActive = false,
  disabled = false,
  children,
  title,
  variant = "default",
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={[
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200",
      "h-8 w-8 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none",
      isActive
        ? "bg-gray-900 text-white shadow-sm"
        : "text-gray-600 hover:text-gray-900",
      variant === "ghost" ? "hover:bg-gray-50" : "",
    ].join(" ")}
  >
    {children}
  </button>
);

type ColorPickerProps = {
  onColorSelect: (color: string) => void;
  onClose: () => void;
};
const ColorPicker: React.FC<ColorPickerProps> = ({
  onColorSelect,
  onClose,
}) => {
  const textColors = ["#000000", "#ef4444", "#3b82f6"];
  return (
    <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50 w-40">
      <h4 className="text-sm font-medium text-gray-900 mb-3">Metin Rengi</h4>
      <div className="flex gap-2">
        {textColors.map((color) => (
          <button
            key={color}
            onClick={() => {
              onColorSelect(color);
              onClose();
            }}
            className="w-6 h-6 rounded-md border border-gray-200 hover:scale-110 transition-transform shadow-sm"
            style={{ backgroundColor: color }}
            title={`Renk: ${color}`}
          />
        ))}
      </div>
    </div>
  );
};

export default function Tiptap() {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [html, setHtml] = useState<string>("");
  const [json, setJson] = useState<object>({});

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      TextStyle,
      Color,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder: ({ node }) =>
          node.type.name === "heading"
            ? `Başlık ${node.attrs.level}`
            : 'Yazmaya başlamak için "/" yazın...',
      }),
    ],
    content: `
      <h1>Basit Editor'e Hoş Geldiniz!</h1>
      <p>Bu editor ile <strong>temel</strong> ve <em>temiz</em> bir yazı deneyimi yaşayın.</p>
      <h2>Özellikler</h2>
      <ul>
        <li><strong>Zengin metin</strong> — kalın, italik, çizgili</li>
        <li><strong>Başlık seviyeleri</strong> — h1/h2/h3</li>
        <li><strong>Renkli metin</strong> — Color uzantısıyla</li>
        <li><strong>Listeler</strong> — madde & numaralı</li>
      </ul>
    `,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "ProseMirror prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-96 px-6 py-5",
      },
    },
    onUpdate: ({ editor }) => {
      setHtml(editor.getHTML());
      setJson(editor.getJSON());
    },
  });

  useEffect(() => {
    if (editor) {
      setHtml(editor.getHTML());
      setJson(editor.getJSON());
    }
  }, [editor]);

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-gray-500">Editor yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Toolbar */}
          <div className="border-b border-gray-100 bg-gray-50/50 px-4 py-3">
            <div className="flex flex-wrap items-center gap-1">
              <div className="flex items-center gap-1 mr-3 p-1 bg-white rounded-lg shadow-sm">
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  isActive={editor.isActive("bold")}
                  title="Kalın (⌘B)"
                >
                  <Bold size={16} />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  isActive={editor.isActive("italic")}
                  title="İtalik (⌘I)"
                >
                  <Italic size={16} />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  isActive={editor.isActive("strike")}
                  title="Üstü Çizili"
                >
                  <Strikethrough size={16} />
                </ToolbarButton>
              </div>

              <div className="flex items-center gap-1 mr-3 p-1 bg-white rounded-lg shadow-sm">
                <ToolbarButton
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                  }
                  isActive={editor.isActive("heading", { level: 1 })}
                  title="Başlık 1"
                >
                  <Heading1 size={16} />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                  isActive={editor.isActive("heading", { level: 2 })}
                  title="Başlık 2"
                >
                  <Heading2 size={16} />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                  isActive={editor.isActive("heading", { level: 3 })}
                  title="Başlık 3"
                >
                  <Heading3 size={16} />
                </ToolbarButton>
              </div>

              <div className="flex items-center gap-1 mr-3 p-1 bg-white rounded-lg shadow-sm">
                <ToolbarButton
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                  isActive={editor.isActive("bulletList")}
                  title="Madde Listesi"
                >
                  <ListIcon size={16} />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                  }
                  isActive={editor.isActive("orderedList")}
                  title="Numaralı Liste"
                >
                  <ListOrdered size={16} />
                </ToolbarButton>
              </div>

              <div className="flex items-center gap-1 mr-3 p-1 bg-white rounded-lg shadow-sm">
                <ToolbarButton
                  onClick={() =>
                    editor.chain().focus().setTextAlign("left").run()
                  }
                  isActive={editor.isActive({ textAlign: "left" })}
                  title="Sola Hizala"
                >
                  <AlignLeft size={16} />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() =>
                    editor.chain().focus().setTextAlign("center").run()
                  }
                  isActive={editor.isActive({ textAlign: "center" })}
                  title="Ortala"
                >
                  <AlignCenter size={16} />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() =>
                    editor.chain().focus().setTextAlign("right").run()
                  }
                  isActive={editor.isActive({ textAlign: "right" })}
                  title="Sağa Hizala"
                >
                  <AlignRight size={16} />
                </ToolbarButton>
              </div>

              <div className="relative flex items-center gap-1 p-1 bg-white rounded-lg shadow-sm">
                <ToolbarButton
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  title="Renkler"
                >
                  <Palette size={16} />
                </ToolbarButton>
                {showColorPicker && (
                  <ColorPicker
                    onColorSelect={(color) =>
                      editor.chain().focus().setColor(color).run()
                    }
                    onClose={() => setShowColorPicker(false)}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="bg-white min-h-[500px]">
            <EditorContent editor={editor} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 overflow-auto">
          <h3 className="text-sm font-semibold text-gray-500 mb-3">
            HTML Render
          </h3>
          <div
            className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-800">
        <div className="bg-black p-4 overflow-auto">
          <h3 className="text-xs font-semibold text-green-400 mb-2 opacity-80">
            JSON Çıktısı
          </h3>
          <pre className="text-green-400 text-xs leading-relaxed whitespace-pre-wrap">
            {JSON.stringify(json, null, 2)}
          </pre>
        </div>
      </div>

      {showColorPicker && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowColorPicker(false)}
        />
      )}

      <style jsx global>{`
        .ProseMirror {
          outline: none;
        }
        .ProseMirror h1 {
          font-size: 2rem;
          line-height: 1.2;
          font-weight: 700;
          margin: 1.25rem 0 0.75rem;
        }
        .ProseMirror h2 {
          font-size: 1.5rem;
          line-height: 1.3;
          font-weight: 700;
          margin: 1rem 0 0.5rem;
        }
        .ProseMirror h3 {
          font-size: 1.25rem;
          line-height: 1.35;
          font-weight: 600;
          margin: 0.75rem 0 0.5rem;
        }
        .ProseMirror ul {
          list-style: disc;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        .ProseMirror ol {
          list-style: decimal;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        .ProseMirror li {
          margin: 0.25rem 0;
        }
      `}</style>
    </div>
  );
}
