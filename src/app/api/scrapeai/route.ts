import { NextRequest, NextResponse } from "next/server";
import { scrapOfferData } from "@/lib/actions/scraper";

export const maxDuration = 60;

const POST = async (request: NextRequest) => {
    const { prompt, userId } = await request.json();

    const response = await scrapOfferData(prompt, userId);

    if (!response.success) {
        return NextResponse.json({ error: response.error }, { status: 500 });
    }

    return NextResponse.json(response);
}

export { POST };

