import React from "react";

type ColorPickerProps = {
  onColorSelect: (color: string) => void;
  onClose: () => void;
};

export const ColorPicker: React.FC<ColorPickerProps> = ({
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