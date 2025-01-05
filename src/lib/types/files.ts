import { File as FileType } from "@prisma/client"

export type FileWithOffers = FileType & {
    Offer: {
      id: number
      company: string
      position: string
      status: string
    }[]
  }