const STRAPI_HOST = process.env.STRAPI_HOST || process.env.NEXT_PUBLIC_STRAPI_HOST || ''

export async function getStrapiData(url: string) {
    if (!STRAPI_HOST) {
        console.warn('STRAPI_HOST / NEXT_PUBLIC_STRAPI_HOST no está definida; omitiendo fetch a Strapi.')
        return null
    }
    try {
        const response = await fetch(`${STRAPI_HOST}${url}`)
        if (!response.ok) {
            throw new Error(`Http error status: ${response.status}`)
        }

        const data = await response.json()
        return data.data || data

    } catch (error) {
        console.error("Error fetching data", error)
        return null
    }
}