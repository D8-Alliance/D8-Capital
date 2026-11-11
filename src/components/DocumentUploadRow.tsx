import React, { useState, useRef } from 'react';
import { ApplicationDocument } from '../types';
import { useI18n } from '../i18n';
import { UploadCloud, CheckCircle2, FileText, AlertTriangle, Trash2 } from 'lucide-react';

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
  const { t } = useI18n();
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
          ? 'bg-[#141414] border-[#c4a67e]/40'
          : isDragging
          ? 'bg-[#181818] border-[#c4a67e] ring-1 ring-[#c4a67e]'
          : 'bg-[#141414] border-white/10 hover:border-white/20'
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
                : 'bg-white/5 border border-white/10 text-[#c4a67e]'
            }`}
          >
            {existingDoc ? <FileText className="w-5 h-5" /> : <UploadCloud className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium text-white">{documentName}</h4>
              {required && (
                <span className="text-[10px] uppercase font-mono font-bold text-[#c4a67e] bg-[#c4a67e]/15 border border-[#c4a67e]/30 px-1.5 py-0.5 rounded">
                  Required
                </span>
              )}
            </div>
            <p className="text-xs text-white/40 mt-0.5">{categoryName}</p>
          </div>
        </div>

        <div>
          {existingDoc ? (
            <div className="flex items-center gap-3 bg-[#181818] px-3 py-1.5 rounded-lg border border-white/10">
              <div className="text-right">
                <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {existingDoc.name}
                </span>
                <span className="text-[10px] text-white/40 font-mono block">
                  {existingDoc.fileSize} • Verified (Demo)
                </span>
              </div>
              {onRemove && (
                <button
                  type="button"
                  onClick={onRemove}
                  className="p-1 text-white/40 hover:text-rose-400 rounded transition cursor-pointer"
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
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSimulatingUpload ? (
                  <>
                    <span className="w-3 h-3 border-2 border-[#c4a67e] border-t-transparent rounded-full animate-spin"></span>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-3.5 h-3.5 text-[#c4a67e]" />
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
