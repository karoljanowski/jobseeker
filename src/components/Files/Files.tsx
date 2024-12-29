'use client'

import { File as FileType } from "@prisma/client"
import { Loader2, Trash2Icon } from "lucide-react"
import { Button } from "../ui/button"
import Image from "next/image"
import { startTransition, useActionState, useEffect } from "react"
import { deleteFile } from "@/lib/actions/files"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

const Files = ({ files, onSelect, dialogMode = false }: { files: FileType[], onSelect?: (file: FileType) => void, dialogMode?: boolean }) => {
  return (
    <div className="flex flex-col gap-4 w-full overflow-x-auto">
      {/* Header row */}
      <div className={`min-w-[600px] border-b border-neutral-700 pb-4 grid items-center gap-4 px-4 ${dialogMode ? 'grid-cols-[80px_1fr_100px_100px_120px]' : 'grid-cols-[80px_1fr_100px_100px_120px_60px]'}`}> 
        <div className="text-sm font-medium">Thumb</div>
        <div className="text-sm font-medium">File</div>
        <div className="text-sm font-medium">Size</div>
        <div className="text-sm font-medium">Format</div>
        <div className="text-sm font-medium">Added at</div>
        {!dialogMode && <div className="text-sm font-medium">Actions</div>}
      </div>

      {/* File rows */}
      <div className="flex flex-col gap-2">
        {files.map((file) => (
          <File key={file.id} file={file} onSelect={onSelect ? onSelect : undefined} dialogMode={dialogMode} />
        ))}
        {files.length === 0 && <div className="text-center text-sm text-neutral-400">No files found</div>}
      </div>
    </div>
  )
}

const File = ({ file, onSelect, dialogMode }: { file: FileType, onSelect?: (file: FileType) => void, dialogMode?: boolean }) => {
  const router = useRouter();
  const [state, dispatch, pending] = useActionState(deleteFile, {
    success: false,
    error: null
  });

  const calculateFileSize = (size: number) => {
    const units = ['B', 'KB', 'MB']
    let unitIndex = 0
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`
  }

  const handleDelete = () => {
    startTransition(() => {
      dispatch(file.publicId);
    });
  }

  useEffect(() => {
    if (state.success) {
      toast.success("File deleted successfully");
      router.refresh()
    }else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <div 
      className={`min-w-[600px] grid items-center gap-4 px-4 py-2 rounded-lg transition-colors even:bg-neutral-800/50 ${dialogMode ? 'hover:bg-neutral-800/80 cursor-pointer grid-cols-[80px_1fr_100px_100px_120px]' : 'grid-cols-[80px_1fr_100px_100px_120px_60px]'}`} 
      onClick={() => onSelect?.(file)}
    >
      <Image 
        src={file.thumbnail} 
        alt={file.publicId} 
        width={64}
        height={64}
        className="w-16 h-16 object-cover border border-gray-500 rounded-lg bg-white"
      />
      <p className="truncate">{file.publicId}</p>
      <p className="text-sm">{calculateFileSize(file.bytes)}</p>
      <p className="text-sm">{file.format || '-'}</p>
      <p className="text-sm">{file.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
      {!dialogMode && <div className="flex items-center">
        <Button variant="ghost" size="icon" className="p-2 hover:bg-red-500/20 rounded-full transition-colors" onClick={handleDelete}>
          {pending ? <Loader2 className="w-4 h-4 animate-spin text-red-500" /> : <Trash2Icon className="w-4 h-4 text-red-500" />}
        </Button>
        </div>
      }
    </div>
  )
}

export default Files