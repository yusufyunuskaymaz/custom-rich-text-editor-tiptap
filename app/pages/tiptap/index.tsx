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
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Save,
  Edit,
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
  const [savedDocs, setSavedDocs] = useState<
    Array<{ id: string; title: string; content: string; date: string }>
  >([]);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("tiptap-saved-docs");
    if (saved) {
      setSavedDocs(JSON.parse(saved));
    }
  }, []);

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

  const handleSave = () => {
    if (!editor) return;

    const content = editor.getHTML();
    if (!content.trim() || content === "<p></p>") return;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    const firstTextNode = tempDiv.textContent || tempDiv.innerText || "";
    const title =
      firstTextNode.split("\n")[0].substring(0, 50) || "Başlıksız Döküman";

    let updatedDocs;

    if (editingDocId) {
      updatedDocs = savedDocs.map((doc) =>
        doc.id === editingDocId
          ? {
              ...doc,
              title,
              content,
              date: new Date().toLocaleDateString("tr-TR"),
            }
          : doc
      );
      setEditingDocId(null);
    } else {
      const newDoc = {
        id: Date.now().toString(),
        title,
        content,
        date: new Date().toLocaleDateString("tr-TR"),
      };
      updatedDocs = [...savedDocs, newDoc];
    }

    setSavedDocs(updatedDocs);
    localStorage.setItem("tiptap-saved-docs", JSON.stringify(updatedDocs));

    editor.commands.setContent("");
  };

  const loadDocument = (doc: any) => {
    if (editor) {
      editor.commands.setContent(doc.content);
      setEditingDocId(doc.id);
    }
  };

  const deleteDocument = (id: string) => {
    const updatedDocs = savedDocs.filter((doc) => doc.id !== id);
    setSavedDocs(updatedDocs);
    localStorage.setItem("tiptap-saved-docs", JSON.stringify(updatedDocs));
  };

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
                  <List size={16} />
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

          <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-3">
            <button
              onClick={handleSave}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save size={16} />
              {editingDocId ? "Güncelle" : "Kaydet"}
            </button>
            {editingDocId && (
              <button
                onClick={() => {
                  editor.commands.setContent("");
                  setEditingDocId(null);
                }}
                className="ml-2 inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                İptal
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 overflow-auto">
          <h3 className="text-sm font-semibold text-gray-500 mb-3">
            HTML Render
          </h3>
          <div
            className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>

      {savedDocs.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Kaydedilmiş Dökümanlar
          </h3>
          <div className="space-y-2">
            {savedDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => loadDocument(doc)}
                >
                  <h4 className="font-medium text-gray-800">{doc.title}</h4>
                  <p className="text-sm text-gray-500">{doc.date}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      loadDocument(doc);
                    }}
                    className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded flex items-center gap-1"
                  >
                    <Edit size={14} />
                    Güncelle
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteDocument(doc.id);
                    }}
                    className="px-3 py-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-800">
        <div className="p-4 overflow-auto">
          <h3 className="text-xs font-semibold  mb-2 opacity-80">
            JSON Çıktısı
          </h3>
          <pre className="text-black text-xs leading-relaxed whitespace-pre-wrap">
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

    </div>
  );
}