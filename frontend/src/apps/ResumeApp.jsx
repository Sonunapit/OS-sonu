import { Download, ExternalLink } from 'lucide-react';
import { usePortfolio } from '../store/portfolioStore.js';
import { api } from '../services/api.js';

export default function ResumeApp() {
  const resume = usePortfolio((s) => s.data.resume);
  if (!resume) return <div className="p-8"><h1 className="font-display text-xl">Resume not published yet</h1><p className="text-muted mt-2">Upload a PDF in the admin dashboard and publish it. It will appear here.</p></div>;
  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-wrap items-center gap-2 p-3 border-b border-line">
        <p className="font-medium mr-auto truncate">{resume.title || 'Resume'}</p>
        <a className="btn btn-primary" href={api.resumeDownloadUrl} download><Download size={16} />Download</a>
        <a className="btn" href={resume.url} target="_blank" rel="noopener noreferrer"><ExternalLink size={16} />Open in new tab</a>
      </div>
      <iframe title="Resume preview" src={`${resume.url}#toolbar=0&view=FitH`} className="flex-1 w-full bg-white" />
      <p className="sm:hidden text-xs text-muted p-2">If the preview is blank on your phone, use Open in new tab.</p>
    </div>
  );
}
