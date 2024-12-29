import { Loader2Icon } from "lucide-react"

const Loader = () => {
    return (
        <div className="flex justify-center items-center h-[calc(100vh-300px)]">
            <Loader2Icon className="w-5 h-5 animate-spin" />
        </div>
    )
}

export default Loader