"use server";

import { cloudinary } from "@/lib/cloudinary";
import { prisma } from "../prisma";
import { getUserId } from "./auth";

interface UploadFileState {
    success: boolean;
    error: string | null;
    url: string | null;
    publicId: string | null
}

export async function uploadFile(prevState: UploadFileState, file: File) {
    try {
        if (!file) {
            return {
                success: false,
                error: "No file provided",
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

        await saveFile(result.asset_id);

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

const saveFile = async (assetId: string) => {
    try {
        const userId = await getUserId();
        
        if (!userId) {
            return {
                success: false,
                error: "Unauthorized"
            };
        }

        await prisma.files.create({
            data: {
                file: assetId,
                userId
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
