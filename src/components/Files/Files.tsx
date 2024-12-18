import { FileIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Files as FileType } from "@prisma/client"
import { Suspense } from "react"
import { cloudinary } from "@/lib/cloudinary"

const Files = ({ files }: { files: FileType[] }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="mt-4 border-t border-gray-700 pt-4 grid grid-cols-[100px_1fr_100px_100px] items-center gap-8"> 
        <span>Thumb</span>
        <span>File</span>
        <span>Size</span>
        <span>Added at</span>
      </div>
      {files.map((file) => (
        <File key={file.id} file={file} />
      ))}
    </div>
  )
}

const File = async ({ file }: { file: FileType }) => {
  const fileData = await cloudinary.api.resources_by_asset_ids(file.file)
  const fileName = fileData.resources[0].public_id
  const fileUrl = fileData.resources[0].secure_url
  const fileSize = fileData.resources[0].bytes
  const addedAt = fileData.resources[0].created_at
  const addedAtDate = new Date(addedAt).toLocaleDateString()

  const calculateFileSize = (size: number) => {
    const units = ['B', 'KB', 'MB']
    let unitIndex = 0
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`
  }

  return (
    <div className="grid grid-cols-[100px_1fr_100px_100px] items-center gap-8">
      <img src={fileUrl} alt={fileName} width={100} height={100} className="border border-gray-500 rounded-lg overflow-hidden" />
      <p>{fileName}</p>
      <p>{calculateFileSize(fileSize)}</p>
      <p>{addedAtDate}</p>
    </div>
  )
}

export default Files