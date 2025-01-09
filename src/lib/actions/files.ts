'use server'

import { cloudinary } from '../cloudinary'
import { prisma } from '../prisma'
import { getUserId } from './auth'

export const getFiles = async () => {
    const userId = await getUserId()
    if (!userId) {
        return { success: false, error: 'Unauthorized' }
    }
    try {
        const files = await prisma.file.findMany({
            where: { userId },
            include: {
                Offer: {
                    select: {
                        id: true,
                        company: true,
                        position: true,
                        status: true
                    }
                }
            }
        })
        return { success: true, files }
    } catch (error) {
        console.error('Error fetching files:', error);
        return { success: false, error: 'Failed to fetch files' }
    }
}

interface UploadFileState {
    success: boolean;
    error: string | null;
    url: string | null;
    publicId: string | null
}

export async function uploadFile(prevState: UploadFileState, file: File) {
    try {
        const userId = await getUserId();
        
        if (!userId) {
            return {
                success: false,
                error: "Unauthorized",
                url: null,
                publicId: null
            };
        }

        if (!file) {
            return {
                success: false,
                error: "No file provided",
                url: null,
                publicId: null
            };
        }

        const exists = await checkFileExists(file.name);
        if (exists) {
            return {
                success: false,
                error: "File with this name already exists",
                url: null,
                publicId: null
            };
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileBase64 = `data:${file.type};base64,${buffer.toString("base64")}`;

        const result = await cloudinary.uploader.upload(fileBase64, {
            resource_type: "auto",
            public_id: file.name
        });

        const thumbnail = cloudinary.url(result.public_id + '.webp', {
            width: 64,
            height: 64,
            crop: 'fit'
        });

        const data = {
            assetId: result.asset_id,
            publicId: result.public_id,
            format: result.format,
            createdAt: result.created_at,
            bytes: result.bytes,
            secureUrl: result.secure_url,
            thumbnail: thumbnail,
            userId: userId
        }

        await saveFile(data);

        return {
            success: true,
            error: null,
            url: result.secure_url,
            publicId: result.public_id,

        };
    } catch (error) {
        console.error("Upload error:", error);
        return {
            success: false,
            error: "Failed to upload file",
            url: null,
            publicId: null
        };
    }
} 

interface SaveFileData {
    assetId: string;
    publicId: string;
    format: string;
    createdAt: string;
    bytes: number;
    secureUrl: string;
    userId: number;
    thumbnail: string;
}

const saveFile = async (data: SaveFileData) => {
    try {
        await prisma.file.create({
            data: {
                publicId: data.publicId,
                assetId: data.assetId,
                format: data.format,
                createdAt: data.createdAt,
                bytes: data.bytes,
                fileUrl: data.secureUrl,
                thumbnail: data.thumbnail,
                userId: data.userId
            }
        });

        return {
            success: true,
            error: null
        };
    } catch (error) {
        console.error("Save file error:", error);
        return {
            success: false,
            error: "Failed to save file"
        };
    }
}

export const checkFileExists = async (publicId: string) => {
    const file = await prisma.file.findUnique({
        where: { publicId: publicId }
    });
    return file ? true : false;
}

export const deleteFile = async (prevState: { success: boolean, error: string | null }, publicId: string) => {
    try {  
        await cloudinary.uploader.destroy(publicId);
        await prisma.file.delete({
            where: { publicId: publicId }
        });
        return { success: true, error: null }
    } catch (error) {
        console.error("Delete file error:", error);
        return { success: false, error: "Failed to delete file" }
    }
}