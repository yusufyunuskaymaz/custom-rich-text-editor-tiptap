"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { Save } from "lucide-react";
import { EditorToolbar } from "../EditorToolbar";
import { SavedDocuments } from "../SavedDocuments";

type SavedDocument = {
  id: string;
  title: string;
  content: string;
  date: string;
};

export default function TiptapEditor() {
  const [html, setHtml] = useState<string>("");
  const [json, setJson] = useState<object>({});
  const [savedDocs, setSavedDocs] = useState<SavedDocument[]>([]);
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

  const loadDocument = (doc: SavedDocument) => {
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

  const handleCancel = () => {
    if (editor) {
      editor.commands.setContent("");
      setEditingDocId(null);
    }
  };

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-gray-500">Editor yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl max-md:px-4 mx-auto space-y-6 mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <EditorToolbar editor={editor} />

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
                onClick={handleCancel}
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


      <SavedDocuments
        savedDocs={savedDocs}
        onLoadDocument={loadDocument}
        onDeleteDocument={deleteDocument}
      />


      <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-800">
        <div className="p-4 overflow-auto">
          <h3 className="text-xs font-semibold mb-2 opacity-80">
            JSON Çıktısı
          </h3>
          <pre className="text-black text-xs leading-relaxed whitespace-pre-wrap">
            {JSON.stringify(json, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}