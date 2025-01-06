import AddFile from "@/components/Files/AddFile";
import { FileIcon, Loader2 } from "lucide-react";
import Files from "@/components/Files/Files";
import { getFiles } from "@/lib/actions/files";
import { Suspense } from "react";
import Loader from "@/components/Loader";

const FilesPage = () => {
    return (
        <div className="flex flex-col gap-2 h-full">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <FileIcon className="w-5 h-5" />
                        Files
                    </h1>
                    <p className="text-sm text-gray-400">
                        Manage your files
                    </p>
                </div>
                <AddFile />

            </div>
            <Suspense fallback={<Loader />}>
                <FilesWrapper />
            </Suspense>
        </div>
    );
}
const FilesWrapper = async () => {
    const files = await getFiles()
    if(files.success && files.files) {
        return <Files files={files.files} />
    }
    return (
        <div className="p-8 text-center">
            {files.error}
        </div>
    )
}

export default FilesPage
