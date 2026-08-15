
import React, { useState, useEffect } from 'react';
import { Player, DraftPick } from '../types';
import { analyzeTeam } from '../services/geminiService';
import { LoadingSpinner } from './icons/LoadingSpinner';

interface TeamAnalysisProps {
  roster: Player[];
  picks: DraftPick[];
  onCollapse: () => void;
}

export const TeamAnalysis: React.FC<TeamAnalysisProps> = ({ roster, picks, onCollapse }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getAnalysis = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await analyzeTeam(roster, picks);
        setAnalysis(result);
      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("An unknown error occurred while fetching analysis.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    getAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roster, picks]);

  const formattedAnalysis = analysis
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-100 font-semibold">$1</strong>')
    .replace(/\* (.*?)(?=\n\*|\n\n|$)/g, '<li class="ml-4">$1</li>')
    .replace(/<\/li>\n?/g, '</li>') // Clean up newlines after list items
    .replace(/(<li>.*<\/li>)/gs, '<ul class="list-disc list-inside space-y-1 mb-2">$1</ul>');


  return (
    <div className="text-sm">
      <div className="flex justify-between items-center mb-2">
        <h5 className="font-semibold text-fuchsia-400">AI Analysis ✨</h5>
        <button onClick={onCollapse} className="text-slate-400 hover:text-white text-xs">Collapse ^</button>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-slate-400">
          <LoadingSpinner className="w-4 h-4"/>
          <span>Generating insights...</span>
        </div>
      )}

      {error && <p className="text-red-400">{error}</p>}
      
      {!isLoading && !error && analysis && (
         <div 
           className="text-slate-300 space-y-2 prose prose-sm prose-invert prose-p:my-1"
           dangerouslySetInnerHTML={{ __html: formattedAnalysis }} 
         />
      )}
    </div>
  );
};
