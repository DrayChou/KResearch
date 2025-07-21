import React from 'react';
import { FinalResearchData, FileData } from '../types';
import ReportHeader from './report/ReportHeader';
import MarkdownRenderer from './report/MarkdownRenderer';
import ReportCitations from './report/ReportCitations';
import ReportSummary from './report/ReportSummary';
import ReportToolbox from './report/ReportToolbox';

interface FinalReportProps {
  data: FinalResearchData;
  onVisualize: (reportMarkdown: string) => void;
  isVisualizing: boolean;
  onRegenerate: () => void;
  isRegenerating: boolean;
  onRewrite: (instruction: string, file: FileData | null) => void;
  translatedReport?: string;
  onTranslate?: () => void;
  isTranslating?: boolean;
  showOriginalText?: boolean;
  onToggleOriginal?: () => void;
}

const FinalReport: React.FC<FinalReportProps> = ({ 
  data, 
  onVisualize, 
  isVisualizing, 
  onRegenerate, 
  isRegenerating, 
  onRewrite,
  translatedReport,
  onTranslate,
  isTranslating,
  showOriginalText,
  onToggleOriginal
}) => {
  const { report, citations, researchTimeMs } = data;
  const displayReport = translatedReport && !showOriginalText 
    ? translatedReport 
    : report;
  
  return (
    <div className="flex gap-8">
      <div className="flex-grow w-0 text-gray-800 dark:text-gray-300">
        <ReportHeader
          report={displayReport}
          citations={citations}
          onVisualize={onVisualize}
          isVisualizing={isVisualizing}
          onRegenerate={onRegenerate}
          isRegenerating={isRegenerating}
        />
        
        <MarkdownRenderer report={displayReport} />

        <ReportSummary researchTimeMs={researchTimeMs} citationCount={citations.length} />

        <ReportCitations citations={citations} />
      </div>
       <div className="flex-shrink-0 w-16 sticky top-8 self-start">
          <ReportToolbox 
            onRewrite={onRewrite} 
            isRewriting={isRegenerating}
            onTranslate={onTranslate}
            isTranslating={isTranslating}
            showOriginalText={showOriginalText}
            onToggleOriginal={onToggleOriginal}
            hasTranslation={Boolean(translatedReport)}
          />
      </div>
    </div>
  );
};

export default FinalReport;
