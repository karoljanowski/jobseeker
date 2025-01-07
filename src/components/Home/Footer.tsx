'use client'
import { Github, Linkedin, Globe } from "lucide-react"
import Link from "next/link"

const Footer = () => {
    return (
        <footer className="bg-gray-900 border-t border-gray-800">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-gray-400 text-sm">
                        © {new Date().getFullYear()} Jobseeker. All rights reserved.
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <Link 
                            href="https://github.com/karoljanowski" 
                            target="_blank"
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <Github className="w-5 h-5" />
                        </Link>
                        <Link 
                            href="https://linkedin.com/in/karol-janowski-dev" 
                            target="_blank"
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <Linkedin className="w-5 h-5" />
                        </Link>
                        <Link 
                            href="https://karoljanowski.vercel.app" 
                            target="_blank"
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <Globe className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer