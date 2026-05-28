import { Page } from "@playwright/test";
import { Routes } from "../routes/routes";

export async function extractCsrfToken(page: Page, url: string): Promise<string> {
    const loginFormResponse = await page.request.get(url);
    const html = await loginFormResponse.text();

    const csrfMatch = html.match(/<input type='hidden' name='_csrf' value='([^']+)'/);

    if (!csrfMatch) {
        throw new Error('Could not find CSRF token in the login form HTML');
    }

    const csrfToken = csrfMatch[1];
    return csrfToken
}

export async function getAppLink(appName: string, page: Page) {
    const response = await page.request.get(`${process.env.FIWMARE_URL}${Routes.DIGITAL_CITIZEN_DASHBOARD}`);
    const html = await response.text();
    const regex = new RegExp(`<a href="\\s*([^"]+)\\s*"[^>]*>\\s*${appName}\\s*</a>`, 'i');
    const match = html.match(regex);

    if (!match) {
        throw new Error(`Could not find link for app: ${appName}`);
    }
    const appLink = match[1].trim().replace(/&amp;/g, '&');
    return appLink;
}

export async function extractClientId(url: string) {
    try {
        const urlObj = new URL(url);
        const clientId = urlObj.searchParams.get('client_id');

        if (!clientId) {
            throw new Error('client_id not found in URL');
        }

        return clientId;
    } catch (error) {
        throw new Error(`Failed to extract client_id: ${error.message}`);
    }
}