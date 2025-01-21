"use client"

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { FileIcon, Loader2, Upload } from "lucide-react";
import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { uploadFile } from "@/lib/actions/files";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AddFile() {
    const router = useRouter()
    const fileInput = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const [state, dispatch, pending] = useActionState(uploadFile, {
        success: false,
        error: null,
        url: '',
        publicId: ''
    });
    const [file, setFile] = useState<File | null>(null);

    const handleUpload = () => {
        if (file) {
            startTransition(() => {
                dispatch(file);
            });
        }
    }

    useEffect(() => {
        if (state.success) {
            toast.success("File uploaded successfully");
            router.refresh()
            setFile(null);
            setTimeout(() => {
                setOpen(false);
            }, 500);
        } else if (state.error) {
            toast.error(state.error)
        }
    }, [state, router]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-800">
                <DialogHeader>
                    <DialogTitle>Upload File</DialogTitle>
                </DialogHeader>
                <div className="grid place-items-center p-4">
                    <input ref={fileInput} type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                    <div onClick={() => fileInput.current?.click()} className="flex flex-col items-center mb-4 gap-2 w-full px-4 py-6 border-2 border-dashed rounded-lg hover:bg-gray-800 transition-all cursor-pointer">
                        {
                            file ? (
                                <>
                                    <FileIcon className="w-8 h-8 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                        {file.name}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <Upload className="w-8 h-8 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                        {pending ? "Uploading..." : "Click to choose a file"}
                                    </span>
                                </>
                            )
                        }
                    </div>
                    <Button onClick={handleUpload} disabled={pending} variant="secondary">
                        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                        Upload File
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}