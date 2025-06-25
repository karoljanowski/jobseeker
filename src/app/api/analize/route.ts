import { NextRequest, NextResponse } from "next/server";
import { resumeAnaize } from "@/lib/actions/resumeAnaize";

export const maxDuration = 60;

const POST = async (request: NextRequest) => {
    const { offer } = await request.json();
    const response = await resumeAnaize(offer)
    if(!response.success){
        return NextResponse.json({ error: response.error }, { status: 500 })
    }
    return NextResponse.json({ response: response.response })
}

export { POST }
