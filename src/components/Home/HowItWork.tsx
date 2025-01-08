import MotionContainer from "./MotionContainer";

const HowItWork = () => {
    const steps = [
        {
            title: 'Create an account',
            description: 'Get started in seconds. Sign up and start your job search journey.',
            icon: '👤'
        },
        {
            title: 'Add your job opportunities',
            description: 'Track all your applications in one place. Never get lost in your job applications.',
            icon: '📝'
        },
        {
            title: 'Improve your resume',
            description: 'Let AI analyze your resume and suggest improvements to make it stand out to employers.',
            icon: '🚀'
        },
        {
            title: 'Get your dream job',
            description: 'Land your ideal job with the help of Jobseeker. You will find the perfect fit for your skills and aspirations.',
            icon: '🎯'
        },
    ];

    return (
        <div id="how-it-works" className="bg-gray-950 relative">
            <div className="absolute inset-0 before:absolute before:-left-72 top-0 before:w-[800px] before:h-[800px] before:bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] before:from-gray-800/30 before:via-gray-800/10 before:to-transparent before:blur-2xl" />
            
            <div className="container mx-auto px-4 py-16 md:py-24 relative">
                <MotionContainer
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        How it <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">works</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        See how Jobseeker is easy to use and how it can help you get your dream job.
                    </p>
                </MotionContainer>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <MotionContainer
                            key={index}
                            delay={index * 0.1}
                            className="relative"
                        >
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 h-full border border-gray-700 hover:border-blue-500/50 transition-all duration-300 group">
                                <div className="flex flex-col items-center text-center">
                                    <div className="text-4xl mb-4">{step.icon}</div>
                                    <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold">
                                        {index + 1}
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-300 text-sm">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        </MotionContainer>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HowItWork;