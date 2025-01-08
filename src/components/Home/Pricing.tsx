import MotionContainer from "./MotionContainer";
import { Check } from "lucide-react";
import { Button } from "../ui/button";

const Pricing = () => {
    const features = [
        "Kanban board for job applications",
        "AI-powered resume analysis",
        "File manager",
    ];

    return (
        <div id="pricing" className="bg-gradient-to-b from-gray-950 to-gray-900 py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-12">
                    <MotionContainer
                        className="text-center md:text-left md:max-w-xl"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                            Early Access <span className="bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">Pricing</span>
                        </h2>
                        <p className="text-gray-400 text-lg">
                            Get in early and enjoy all features at no cost. Join thousands of job seekers who are already optimizing their job search with our platform.
                        </p>
                    </MotionContainer>

                    <MotionContainer
                        delay={0.2}
                        className="w-full md:w-[450px] flex-shrink-0"
                    >
                        <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-1">
                            <div className="relative bg-gray-900 rounded-xl p-8">
                                <div className="text-center mb-8">
                                    <div className="inline-block px-4 py-1 bg-gradient-to-r from-gray-400/10 to-gray-600/10 rounded-full mb-4">
                                        <span className="text-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text font-medium">
                                            Free for now
                                        </span>
                                    </div>
                                    <div className="flex items-end justify-center gap-2 mb-4">
                                        <span className="text-5xl font-bold text-white">$0</span>
                                        <span className="text-gray-400">/month</span>
                                    </div>
                                    <Button variant="secondary" className="w-full">
                                        Start Free Trial
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {features.map((feature, index) => (
                                        <MotionContainer
                                            key={index}
                                            delay={0.3 + index * 0.1}
                                            className="flex items-center gap-3"
                                        >
                                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-600/20 flex items-center justify-center">
                                                <Check className="w-3 h-3 text-blue-400" />
                                            </div>
                                            <span className="text-gray-300">{feature}</span>
                                        </MotionContainer>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </MotionContainer>
                </div>
            </div>
        </div>
    );
};

export default Pricing;