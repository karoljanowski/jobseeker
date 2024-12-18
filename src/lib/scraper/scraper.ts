'use server'
import { load } from 'cheerio'
import {sites} from './sites'

export const scrapOfferData = async (url: string) => {
    const configSite = sites.find(site => url.includes(site.name))

    if(!configSite) {
        return {
            data: null,
            error: 'We can not get details from this offer',
            success: false
        }
    }
    const response = await fetch(url)
    const html = await response.text()
    const $ = load(html)

    const data = {
        position: $(configSite.position).text().trim() || 'N/A',
        company: $(configSite.company).text().trim() || 'N/A',
        description: $(configSite.description).text().trim() || 'N/A',
        location: $(configSite.location).text().trim() || 'N/A',
    };

    return {
        data,
        error: null,
        success: true
    }

}