'use client'

import { ArrowRightIcon, EyeIcon, Loader2, Trash2Icon } from "lucide-react"
import { Button } from "../ui/button"
import Image from "next/image"
import { startTransition, useActionState, useEffect } from "react"
import { deleteFile } from "@/lib/actions/files"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { FileWithOffers } from "@/lib/types/files"
import { File as FileType } from "@prisma/client"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

interface FilesProps {
  files: FileWithOffers[] | FileType[]
  onSelect?: (file: FileWithOffers | FileType) => void
  dialogMode?: boolean
}

const Files = ({ files, onSelect, dialogMode = false }: FilesProps) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header row */}
      <div className={`min-w-[600px] border-b border-gray-700 pb-4 grid items-center gap-4 px-4 ${dialogMode ? 'grid-cols-[80px_1fr_100px_100px_120px]' : 'grid-cols-[80px_1fr_120px_100px_100px_120px_60px]'}`}> 
        <div className="text-sm font-medium">Thumb</div>
        <div className="text-sm font-medium">File</div>
        {!dialogMode && files && files.some(file => 'Offer' in file) && <div className="text-sm font-medium">Offers</div>}
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
        {files.length === 0 && <div className="text-center text-sm text-gray-400">No files found</div>}
      </div>
    </div>
  )
}

const File = ({ file, onSelect, dialogMode }: { file: FileWithOffers | FileType, onSelect?: (file: FileWithOffers | FileType) => void, dialogMode?: boolean }) => {
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
      className={`min-w-[600px] grid items-center gap-4 px-4 py-2 rounded-lg transition-colors even:bg-gray-800/50 ${dialogMode ? 'hover:bg-gray-800/80 cursor-pointer grid-cols-[80px_1fr_100px_100px_120px]' : 'grid-cols-[80px_1fr_120px_100px_100px_120px_60px]'}`} 
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
      {!dialogMode && file && 'Offer' in file && <FileOffers offers={file.Offer} />}
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

const FileOffers = ({ offers }: { offers: FileWithOffers['Offer'] }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="default" className="px-4 bg-gray-700 hover:bg-gray-600/80 h-8 w-fit">
          <EyeIcon className="w-4 h-4 text-gray-400" /> Offers
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] bg-gray-700 border-none text-white">
        <div className="flex flex-col gap-2">
          {offers.length > 0 && offers.map((offer) => (
            <div key={offer.id} className="flex flex-col border-b border-gray-700 pb-2 last:border-none">
              <p className="bg-gray-200 text-xs text-gray-800 px-2 py-1 rounded-full mb-1 w-fit">{offer.status}</p>
              <p className="text-sm font-medium">{offer.position}</p>
              <p className="text-xs">{offer.company}</p>
            </div>
          ))}
          {offers.length === 0 && <div className="text-center text-sm text-gray-200">File is not associated with any offers</div>}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default Files