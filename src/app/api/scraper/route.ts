import { NextRequest, NextResponse } from "next/server";

const POST = async (request: NextRequest) => {
    const { link } = await request.json();

    if (!link || !isValidUrl(link)) {
        return NextResponse.json({ error: "Invalid link" }, { status: 400 });
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(link, {
            signal: controller.signal,
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
            return NextResponse.json({ error: "Failed to fetch URL" }, { status: 500 });
        }
        
        const html = await response.text();
        return NextResponse.json({ html });
    } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
            return NextResponse.json({ error: "Request timed out" }, { status: 408 });
        }
        
        return NextResponse.json({ error: "Failed to fetch URL" }, { status: 500 });
    }
}

const isValidUrl = (url: string) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

export { POST };