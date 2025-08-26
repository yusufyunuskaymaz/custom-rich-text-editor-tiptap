'use client'

import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
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
  Type,
  Hash
} from 'lucide-react';

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
  variant?: 'default' | 'ghost';
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ 
  onClick, 
  isActive = false, 
  disabled = false,
  children, 
  title,
  variant = 'default'
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`
      inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200
      h-8 w-8 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none
      ${isActive ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}
      ${variant === 'ghost' ? 'hover:bg-gray-50' : ''}
    `}
  >
    {children}
  </button>
);

interface ColorPickerProps {
  onColorSelect: (color: string) => void;
  onClose: () => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ onColorSelect, onClose }) => {
  const textColors = ['#000000', '#ef4444', '#3b82f6'];

  return (
    <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50 w-40">
      <div>
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
    </div>
  );
};

const Tiptap = () => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return `Başlık ${node.attrs.level}`;
          }
          return 'Yazmaya başlamak için "/" yazın...';
        },
      }),
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: `
      <div class="max-w-none">
        <h1> Basit Editor'e Hoş Geldiniz!</h1>
        <p>Bu editor ile <strong>temel</strong> ve <em>temiz</em> bir yazı deneyimi yaşayın.</p>
        
        <h2> Özellikler</h2>
        <ul>
          <li><strong>Rich Text Formatting</strong> - Kalın, italik, vurgulu metinler</li>
          <li><strong>Başlık Seviyeleri</strong> - Organize edilmiş içerik yapısı</li>
          <li><strong>Renkli Metinler</strong> - Dikkat çekici içerikler</li>
          <li><strong>Liste Desteği</strong> - Madde ve numaralı listeler</li>
        </ul>

        <p>Yazmaya başlamak için bu metni silebilir ve kendi içeriğinizi oluşturabilirsiniz. Harika bir yazı deneyimi sizi bekliyor!</p>
      </div>
    `,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-96 px-8 py-6',
      },
    },
  });

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-gray-500">Editor yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Basit Editor
        </h1>
        <p className="text-gray-600">
          Modern ve temiz bir yazı deneyimi
        </p>
      </div>


      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
          <div className="flex flex-wrap items-center gap-1">

            <div className="flex items-center gap-1 mr-4 p-1 bg-white rounded-lg shadow-sm">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                title="Kalın (⌘B)"
              >
                <Bold size={16} />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                title="İtalik (⌘I)"
              >
                <Italic size={16} />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={editor.isActive('strike')}
                title="Üstü Çizili"
              >
                <Strikethrough size={16} />
              </ToolbarButton>
            </div>


            <div className="flex items-center gap-1 mr-4 p-1 bg-white rounded-lg shadow-sm">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editor.isActive('heading', { level: 1 })}
                title="Başlık 1"
              >
                <Heading1 size={16} />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive('heading', { level: 2 })}
                title="Başlık 2"
              >
                <Heading2 size={16} />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                isActive={editor.isActive('heading', { level: 3 })}
                title="Başlık 3"
              >
                <Heading3 size={16} />
              </ToolbarButton>
            </div>


            <div className="flex items-center gap-1 mr-4 p-1 bg-white rounded-lg shadow-sm">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
                title="Madde Listesi"
              >
                <List size={16} />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
                title="Numaralı Liste"
              >
                <ListOrdered size={16} />
              </ToolbarButton>
            </div>


            <div className="flex items-center gap-1 mr-4 p-1 bg-white rounded-lg shadow-sm">
              <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                isActive={editor.isActive({ textAlign: 'left' })}
                title="Sola Hizala"
              >
                <AlignLeft size={16} />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                isActive={editor.isActive({ textAlign: 'center' })}
                title="Ortala"
              >
                <AlignCenter size={16} />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                isActive={editor.isActive({ textAlign: 'right' })}
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
                  onColorSelect={(color) => editor.chain().focus().setColor(color).run()}
                  onClose={() => setShowColorPicker(false)}
                />
              )}
            </div>
          </div>
        </div>

        <div className="bg-white min-h-[500px]">
          <EditorContent editor={editor} />
        </div>

        <div className="border-t border-gray-100 px-6 py-3 bg-gray-50/30">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Type size={14} />
                {editor?.storage?.characterCount?.words?.() || 0} kelime
              </span>
              <span className="flex items-center gap-1">
                <Hash size={14} />
                {editor?.storage?.characterCount?.characters?.() || 0} karakter
              </span>
            </div>
            <div className="text-xs text-gray-400">
              Son güncelleme: {new Date().toLocaleTimeString('tr-TR')}
            </div>
          </div>
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

export default Tiptap;