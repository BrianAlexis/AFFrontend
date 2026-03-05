const { STRAPI_HOST } = process.env

export async function getStrapiData(url: string) {
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