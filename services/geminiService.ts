
import { GoogleGenAI } from "@google/genai";
import { Player, DraftPick } from '../types';

let ai: GoogleGenAI | null = null;
const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;

if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
}

const generatePrompt = (roster: Player[], picks: DraftPick[]): string => {
    const rosterSummary = roster.map(p => `${p.name} (${p.position})`).join(', ');
    const picksByYear: { [key: string]: number[] } = {};
    
    picks.forEach(pick => {
        if (!picksByYear[pick.year]) {
            picksByYear[pick.year] = [];
        }
        picksByYear[pick.year].push(pick.round);
    });

    const picksSummary = Object.entries(picksByYear)
        .map(([year, rounds]) => `${year}: Round ${rounds.join(', ')}`)
        .join('; ');

    return `
        Analyze this fantasy football dynasty team for the upcoming 2024 season. The league is likely Superflex (assume so unless roster construction is obviously 1QB).

        **Team Roster:**
        ${rosterSummary}

        **Upcoming Draft Picks:**
        ${picksSummary || 'None'}

        **Analysis Guidelines:**
        1.  **Overall Outlook:** Briefly state if this team is a contender, a rebuilder, or somewhere in the middle.
        2.  **Strengths:** Identify the strongest position groups or key players.
        3.  **Weaknesses:** Point out the weakest areas or lack of depth.
        4.  **Keep the analysis concise, under 150 words total.** Use bullet points for strengths and weaknesses. Be direct and insightful.
    `;
};

export async function analyzeTeam(roster: Player[], picks: DraftPick[]): Promise<string> {
    if (!ai) {
        return "AI analysis is currently unavailable because the API key is not configured.";
    }

    const prompt = generatePrompt(roster, picks);

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        
        return response.text;
    } catch (error) {
        console.error("Error generating team analysis:", error);
        return "Could not generate AI analysis. The model may be unavailable or the request was blocked.";
    }
}
