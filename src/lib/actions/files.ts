'use server'

import { prisma } from '../prisma'
import { getUserId } from './auth'

export const getFiles = async () => {
    const userId = await getUserId()
    if (!userId) {
        return { success: false, errors: 'Unauthorized' }
    }
    const files = await prisma.files.findMany({
        where: { userId }
    })
    return {
        success: true,
        files
    }
}