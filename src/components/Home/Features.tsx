import MotionContainer from "./MotionContainer";
import { 
    LayoutDashboard, 
    FileText, 
    BrainCircuit, 
    BarChart,  
    Tag,
    Settings,
} from "lucide-react";

const Features = () => {
    const features = [
        {
            title: "Kanban Board",
            description: "Get a clear overview of your job search progress with our intuitive board. Track all your offers in one place.",
            icon: <LayoutDashboard className="w-6 h-6" />,
        },
        {
            title: "Resume AI Analyser",
            description: "Let AI analyze your resume and suggest improvements to make it stand out to employers.",
            icon: <BrainCircuit className="w-6 h-6" />,
        },
        {
            title: "Progress Statistics",
            description: "Visualize your job search progress with detailed statistics. Understand your success rates and identify areas for improvement.",
            icon: <BarChart className="w-6 h-6" />,
        },
        {
            title: "File Manager",
            description: "Upload and manage your files in one place. Never lose your documents again.",
            icon: <FileText className="w-6 h-6" />,
        },
        {
            title: "Tags & Colors",
            description: "Tag your job applications to keep them organized and easy to find.",
            icon: <Tag className="w-6 h-6" />,
        },
        {
            title: "Easy to use",
            description: "Our platform is designed to be easy to use and understand. You will never get lost in the process again.",
            icon: <Settings className="w-6 h-6" />,
        },
    ];

    return (
        <div className="bg-gray-950 py-24">
            <div className="container mx-auto px-4">
                <MotionContainer
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Powerful <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">Features</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Everything you need to manage your job search process effectively and land your dream job.
                    </p>
                </MotionContainer>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <MotionContainer
                            key={index}
                            delay={index * 0.1}
                            className="relative"
                        >
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 h-full border border-gray-700 hover:border-blue-500/50 transition-all duration-300 group">
                                <div className="bg-blue-900/50 w-12 h-12 rounded-lg flex items-center justify-center mb-6 text-blue-400 group-hover:text-blue-300 transition-colors">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </MotionContainer>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Features;