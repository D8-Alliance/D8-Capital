import React, { useState, useRef } from 'react';
import { ApplicationDocument } from '../types';
import { UploadCloud, CheckCircle2, FileText, Trash2 } from 'lucide-react';

interface DocumentUploadRowProps {
  documentName: string;
  categoryName: string;
  required?: boolean;
  existingDoc?: ApplicationDocument;
  onUpload: (doc: { name: string; type: string; fileSize: string; status: 'VERIFIED' | 'PENDING' }) => void;
  onRemove?: () => void;
}

export const DocumentUploadRow: React.FC<DocumentUploadRowProps> = ({
  documentName,
  categoryName,
  required = true,
  existingDoc,
  onUpload,
  onRemove,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isSimulatingUpload, setIsSimulatingUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSimulateFile = (fileName: string) => {
    setIsSimulatingUpload(true);
    setTimeout(() => {
      onUpload({
        name: fileName || `${documentName.replace(/\s+/g, '_')}.pdf`,
        type: categoryName,
        fileSize: `${(Math.random() * 2 + 1).toFixed(1)} MB`,
        status: 'VERIFIED',
      });
      setIsSimulatingUpload(false);
    }, 600);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleSimulateFile(e.dataTransfer.files[0].name);
    } else {
      handleSimulateFile(`${documentName.replace(/\s+/g, '_')}.pdf`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleSimulateFile(e.target.files[0].name);
    }
  };

  return (
    <div
      id={`doc-upload-${documentName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
      className={`p-4 rounded-xl border transition-all duration-200 ${
        existingDoc
          ? 'bg-stone-50 border-[#c4a67e]/40'
          : isDragging
          ? 'bg-stone-100 border-[#c4a67e] ring-1 ring-[#c4a67e]'
          : 'bg-stone-50 border-slate-200 hover:border-slate-300'
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={`p-2.5 rounded-lg shrink-0 ${
              existingDoc
                ? 'bg-[#c4a67e] text-black'
                : 'bg-slate-100 border border-slate-200 text-[#8a6a3a]'
            }`}
          >
            {existingDoc ? <FileText className="w-5 h-5" /> : <UploadCloud className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium text-slate-900">{documentName}</h4>
              {required && (
                <span className="text-[10px] uppercase font-mono font-bold text-[#8a6a3a] bg-[#c4a67e]/15 border border-[#c4a67e]/30 px-1.5 py-0.5 rounded">
                  Required
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{categoryName}</p>
          </div>
        </div>

        <div>
          {existingDoc ? (
            <div className="flex items-center gap-3 bg-stone-100 px-3 py-1.5 rounded-lg border border-slate-200">
              <div className="text-right">
                <span className="text-xs font-medium text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  {existingDoc.name}
                </span>
                <span className="text-[10px] text-slate-500 font-mono block">
                  {existingDoc.fileSize} • Verified (Demo)
                </span>
              </div>
              {onRemove && (
                <button
                  type="button"
                  onClick={onRemove}
                  className="p-1 text-slate-500 hover:text-rose-600 rounded transition cursor-pointer"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg"
              />
              <button
                type="button"
                disabled={isSimulatingUpload}
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-900 text-xs font-medium transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSimulatingUpload ? (
                  <>
                    <span className="w-3 h-3 border-2 border-[#c4a67e] border-t-transparent rounded-full animate-spin"></span>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-3.5 h-3.5 text-[#8a6a3a]" />
                    <span>Attach File (Demo)</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
