import { AppClient } from "ayasofyazilim-saas";

const appClient = new AppClient({
    BASE: 'http://192.168.1.37:44399',

});

export async function GET(request: Request) {
    // get search params from request
    const url = new URL(request.url);
    const lang = url.searchParams.get('lang') || 'en';
    // Use the client instance to make the API call
    const response =
        await appClient.abpApplicationLocalization.getApiAbpApplicationLocalization(
            lang
        );
    // return response as json
    return new Response(JSON.stringify(response));
}