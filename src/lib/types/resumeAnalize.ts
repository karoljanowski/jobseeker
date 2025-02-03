export type ResumeAnaize = {
    candidate_fit: {
        match_percentage: number
        analysis: string
    },
    cv_improvements: string
    suggestions_for_additions: string
    spelling_and_grammar: {
        spelling: boolean
        grammar: boolean
    },
    cv_style_assessment: {
        style_analysis: string
        accepted: boolean
    },
}