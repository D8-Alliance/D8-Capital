import React from 'react';
import { useDemoStore } from '../store/DemoStore';
import { DemoDataLabel } from './DemoDataLabel';
import { FileText, CheckCircle2, Download, ShieldCheck, Search } from 'lucide-react';

export const ProviderDocumentsPage: React.FC = () => {
  const { state } = useDemoStore();
  const providerApps = state.applications.filter((a) => a.country === state.activeCountry);

  const allDocs = providerApps.flatMap((app) =>
    app.documents.map((doc) => ({
      ...doc,
      applicantName: app.userName || app.applicantKyc?.fullName || 'Applicant',
      applicationNumber: app.applicationNumber,
    }))
  );

  return (
    <div id="provider-documents-page" className="space-y-6 animate-fadeIn pb-24">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Institutional Document Repository
            </h1>
            <DemoDataLabel variant="badge" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Secure dossier attachments and verified KYC verification documents
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                <th className="py-3 px-4">Document Name</th>
                <th className="py-3 px-4">Applicant</th>
                <th className="py-3 px-4">Application #</th>
                <th className="py-3 px-4">File Size</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allDocs.map((doc, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-700 shrink-0" />
                    <span>{doc.name}</span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700">{doc.applicantName}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">#{doc.applicationNumber}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{doc.fileSize}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />
                      {doc.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      className="text-xs font-bold text-blue-700 hover:text-blue-900 transition flex items-center gap-1 ml-auto"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
