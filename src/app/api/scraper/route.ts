import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

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
        const optimizedHtml = optimizeHtml(html);
        return NextResponse.json({ html: optimizedHtml });
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

const optimizeHtml = (html: string) => {
    const $ = cheerio.load(html);
    
    // Try to find the main content
    const mainElement = $('main, article, .job-description, .job-details, #job-description, .description');
    
    let result = '';
    
    if (mainElement.length > 0) {
        // If we found a main content element, use that as our base
        const mainHtml = cheerio.load(mainElement.html() || '');
        
        // Clean up the main content
        mainHtml('script').remove();
        mainHtml('style').remove();
        mainHtml('iframe').remove();
        mainHtml('video').remove();
        mainHtml('audio').remove();
        mainHtml('svg').remove();
        
        result = mainHtml.html() || '';
    } else {
        // If no main content found, clean up the entire document
        $('script').remove();
        $('style').remove();
        $('header').remove();
        $('footer').remove();
        $('aside').remove();
        $('nav').remove();
        $('form').remove();
        $('input').remove();
        $('button').remove();
        $('select').remove();
        $('textarea').remove();
        $('img').remove();
        $('iframe').remove();
        $('video').remove();
        $('audio').remove();
        $('svg').remove();
        
        result = $.html();
    }
    
    
    return result;
}

export { POST };