import AddFile from "@/components/Files/AddFile";
import { FileIcon, Loader2 } from "lucide-react";
import Files from "@/components/Files/Files";
import { getFiles } from "@/lib/actions/files";
import { Suspense } from "react";

const FilesPage = () => {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <FileIcon className="w-5 h-5" />
                    Files
                </h1>
                <AddFile />
            </div>
            <div className="">
                <Suspense
                    fallback={
                        <div className="p-8 flex justify-center">
                            <Loader2 className="w-6 h-6 animate-spin" />
                        </div>
                    }
                >
                    <FilesWrapper />
                </Suspense>
            </div>
        </div>
    );
}

const FilesWrapper = async () => {
    const files = await getFiles()
    if(files.success && files.files) {
        return <Files files={files.files} />
    }
    return (
        <div className="p-8 text-center text-muted-foreground">
            Error loading files
        </div>
    )
}

export default FilesPage