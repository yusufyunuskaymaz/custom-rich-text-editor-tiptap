import React, { useState } from "react";
import { Editor } from "@tiptap/react";
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
} from "lucide-react";
import { ToolbarButton } from "../ToolbarButton";
import { ColorPicker } from "../ColorPicker";

type EditorToolbarProps = {
  editor: Editor;
};

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  return (
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
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            title="Madde Listesi"
          >
            <List size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            title="Numaralı Liste"
          >
            <ListOrdered size={16} />
          </ToolbarButton>
        </div>


        <div className="flex items-center gap-1 mr-3 p-1 bg-white rounded-lg shadow-sm">
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={editor.isActive({ textAlign: "left" })}
            title="Sola Hizala"
          >
            <AlignLeft size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={editor.isActive({ textAlign: "center" })}
            title="Ortala"
          >
            <AlignCenter size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
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


      {showColorPicker && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowColorPicker(false)}
        />
      )}
    </div>
  );
};