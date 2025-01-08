import { Button } from "../ui/button"
import Image from "next/image"
import MotionContainer from "./MotionContainer"
import Link from "next/link"

const Hero = () => {
    return (
        <div className="bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 border-b-2 border-gray-800">
            <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center">

                <MotionContainer
                    delay={0.2}
                    className="flex flex-col items-center justify-center max-w-3xl mt-20 md:mt-28"
                >
                    <h1 className="text-3xl md:text-6xl text-center text-white mb-4">Your best solution for keeping track of your <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text font-bold">job applications</span></h1>
                    <p className="text-md leading-tight md:text-2xl text-center text-white">Manage your job applications, improve your resume with AI and get your dream job. You will never get lost in the process again.</p>
                </MotionContainer>

                <MotionContainer
                    delay={0.2}
                    className="flex items-center justify-center mt-8 gap-4"
                >
                    <Button>
                        <Link className="w-full" href="#how-it-works">How it works</Link>
                    </Button>
                    <Button variant="secondary">
                        <Link className="w-full" href="/register">Try for free</Link>
                    </Button>
                </MotionContainer>

                <div className="flex items-center justify-center mt-16 gap-4 rounded-t-xl overflow-hidden border-x-8 border-t-8 border-gray-700">
                    <Image src="/hero.webp" alt="Hero" width={1000} height={500} />
                </div>
            </div>
        </div>
    )
}

export default Hero