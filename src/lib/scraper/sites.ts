export type SiteConfig = {
    name: string;
    position: string;
    company: string;
    location: string;
    description: string;
};

export const sites: SiteConfig[] = [
    {
        'name': 'theprotocol.it',
        'position': '[data-test="text-offerTitle"]',
        'company': '[data-test="anchor-company-link"]',
        'location': '[data-test="text-currentLocation"]',
        'description': 'div.job-description'
    },
    {
        'name': 'bulldogjob.pl',
        'position': 'div.position',
        'company': 'a.company-name',
        'location': 'span.location',
        'description': 'div.job-description'
    },
    {
        'name': 'indeed.com',
        'position': 'div.jobsearch-JobInfoHeader-subtitle',
        'company': 'div.jobsearch-InlineCompanyRating div:first-child',
        'location': 'div.jobsearch-InlineCompanyRating div:last-child',
        'description': 'div#jobDescriptionText'
    },
    {
        'name': 'justjoin.it',
        'position': 'span.css-1w2zoug',
        'company': 'span.css-1x9zltl',
        'location': 'span.css-1wh1k8s',
        'description': 'div.css-1k2lqp9'
    },
    {
        'name': 'pracuj.pl',
        'position': 'span.position',
        'company': 'a.employer-name',
        'location': 'span.location',
        'description': 'div.job-description'
    },
    {
        'name': 'olx.pl',
        'position': 'div.position',
        'company': 'span.company-name',
        'location': 'span.location',
        'description': 'div.description'
    },
    {
        'name': 'jooble.org',
        'position': 'div.position',
        'company': 'span.company-name',
        'location': 'span.location',
        'description': 'div.job-description'
    },
    {
        'name': 'nofluffjobs.com',
        'position': 'span.position',
        'company': 'a.company-name',
        'location': 'span.location',
        'description': 'div.description'
    },
    {
        'name': 'solid.jobs',
        'position': 'div.position',
        'company': 'span.company-name',
        'location': 'span.location',
        'description': 'div.job-description'
    }
];