import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Sparkles, InfoIcon, Loader2, AlertTriangle, ThumbsUp, FileText, Award, TrendingUp, BookOpen, Zap } from "lucide-react"
import { resumeAnaize } from "@/lib/actions/resumeAnaize"
import { OfferWithNotesFiles } from "@/lib/types/offer"
import { useEffect, useState } from "react"
import { getFileUrl } from "@/lib/actions/resumeAnaize"
import { motion, AnimatePresence } from "framer-motion"
import { ResumeAnaize } from "@/lib/types/resumeAnalize"
type LoadingState = 'false' | 'first' | 'second'

const CheckAI = ({ offer }: { offer: OfferWithNotesFiles }) => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState<LoadingState>('false')
    const [response, setResponse] = useState<ResumeAnaize | null>(null)
    const offerDetails = `
        Position: ${offer.position}\n
        Company: ${offer.company}\n
        Location: ${offer.location}\n
        Requirements: ${offer.requirements}\n
        Description: ${offer.description}\n
        Tags: ${offer.tags}\n
        Source: ${offer.source}\n
    `

    const handleCheck = async () => {
        if(offer.file?.publicId){
            setLoading('first')
            const fileUrl = await getFileUrl(offer.file?.publicId)
            setLoading('second')
            const analysis = await resumeAnaize(fileUrl, offerDetails)
            if(analysis.data) {
                setResponse(analysis.data)
            }
            setLoading('false')
        }
    }

    useEffect(() => {
        if(open) {
            handleCheck()
        }
    }, [open])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant='default'><Sparkles className="w-4 h-4" />AI Resume analyser</Button>
            </DialogTrigger>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <InfoIcon className="w-4 h-4" />
                <p className="leading-none">AI will give you a detailed analysis of your resume and suggest improvements.</p>
            </div>
            <DialogContent className="bg-gray-950 border-gray-900 w-full max-w-[1000px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"><Sparkles className="w-4 h-4" />AI Resume analyser</DialogTitle>
                    <DialogDescription >Unlock the potential of your resume with our AI analysis.</DialogDescription>
                </DialogHeader>
                {loading === 'false' ? <Response response={response} /> : <ResponseLoader loading={loading} />}
            </DialogContent>
        </Dialog>
    )
}

const ResponseLoader = ({loading}: {loading: LoadingState}) => {
    const [loadingText, setLoadingText] = useState('')
    const secondStepTexts = [
        'Analyzing resume...',
        'Checking match...',
        'Adding improvements...',
        'Adding suggestions...',
        'Checking spelling and grammar...',
        'Last improvements...'
    ]

    useEffect(() => {
        if(loading === 'first') {
            setLoadingText('Getting file content...')
        }
        if(loading === 'second') {
            secondStepTexts.forEach((text, index) => {
                setTimeout(() => {
                    setLoadingText(text)
                }, index * 2000)
            })
        }
    }, [loading])
    
    return (
        <div className="min-h-96 w-full flex items-center justify-center">
            <AnimatePresence mode="wait">
                <motion.p 
                    key={loadingText}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-300 text-lg flex items-center gap-2"
                >
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {loadingText}
                </motion.p>
            </AnimatePresence>
        </div>
    )
}

const Response = ({ response }: { response: ResumeAnaize | null }) => {
    return (
        <div className="flex flex-col gap-2 min-h-96 w-full">
<div className="overflow-y-auto h-[70vh] pr-4">
          <div className="space-y-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-purple-500 transition-all duration-300">
              <h3 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4 flex items-center">
                <Award className="mr-2 h-6 w-6 text-yellow-500" />
                Candidate Fit
              </h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Match Percentage:</span>
                <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                  {response?.candidate_fit.match_percentage}%
                </span>
              </div>
              {/* <Progress
                value={response?.candidate_fit.match_percentage}
                className="h-3 mb-4"
                indicatorClassName="bg-gradient-to-r from-green-400 to-blue-500"
              /> */}
              <p className="text-gray-300">{response?.candidate_fit.analysis}</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-blue-500 transition-all duration-300">
              <h3 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-600 mb-4 flex items-center">
                <TrendingUp className="mr-2 h-6 w-6 text-blue-500" />
                CV Improvements
              </h3>
              <p className="text-gray-300">{response?.cv_improvements}</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-green-500 transition-all duration-300">
              <h3 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-yellow-600 mb-4 flex items-center">
                <Zap className="mr-2 h-6 w-6 text-yellow-500" />
                Suggestions for Additions
              </h3>
              <p className="text-gray-300">{response?.suggestions_for_additions}</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-red-500 transition-all duration-300">
              <h3 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-600 mb-4 flex items-center">
                <BookOpen className="mr-2 h-6 w-6 text-red-500" />
                Spelling and Grammar
              </h3>
              
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-pink-500 transition-all duration-300">
              <h3 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600 mb-4 flex items-center">
                <FileText className="mr-2 h-6 w-6 text-pink-500" />
                CV Style Assessment
              </h3>
              <p className="text-gray-300 mb-4">{response?.cv_style_assessment.style_analysis}</p>
              <div className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                <span className="text-gray-300">Style Accepted:</span>
                {response?.cv_style_assessment.accepted ? (
                  <ThumbsUp className="h-8 w-8 text-green-400" />
                ) : (
                  <AlertTriangle className="h-8 w-8 text-yellow-400" />
                )}
              </div>
                </div>
            </div>
        </div>
        </div>
    )
}

export default CheckAI
