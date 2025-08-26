import React from "react";
import { Edit } from "lucide-react";

type SavedDocument = {
  id: string;
  title: string;
  content: string;
  date: string;
};

type SavedDocumentsProps = {
  savedDocs: SavedDocument[];
  onLoadDocument: (doc: SavedDocument) => void;
  onDeleteDocument: (id: string) => void;
};

export const SavedDocuments: React.FC<SavedDocumentsProps> = ({
  savedDocs,
  onLoadDocument,
  onDeleteDocument,
}) => {
  if (savedDocs.length === 0) {
    return null;
  }

  return (
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
              onClick={() => onLoadDocument(doc)}
            >
              <h4 className="font-medium text-gray-800">{doc.title}</h4>
              <p className="text-sm text-gray-500">{doc.date}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLoadDocument(doc);
                }}
                className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded flex items-center gap-1"
              >
                <Edit size={14} />
                Güncelle
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteDocument(doc.id);
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
  );
};