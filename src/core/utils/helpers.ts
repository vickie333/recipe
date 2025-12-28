export function getImageUrl(path: any): string | undefined {
    if (!path) return undefined

    // If the backend returns an object (like the Vercel Blob response), extract the URL
    let url = typeof path === 'object' ? path.url || path.image || path.path : path

    if (typeof url !== 'string') return undefined
    if (url.startsWith("http")) return url

    // Use the same logic as apiClient.ts for the base URL
    const apiUrl = import.meta.env.VITE_API_URL ||
        (import.meta.env.DEV
            ? "http://localhost:8000/api"
            : "https://recipe-app-gamma-gold.vercel.app/api");

    if (apiUrl) {
        // Remove /api from the end if it exists
        const baseUrl = apiUrl.replace(/\/api$/, '')
        const cleanUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl

        // Ensure the path starts with /
        let cleanPath = url.startsWith('/') ? url : `/${url}`

        // If it's a local media path and doesn't have /media/, add it (common in Django)
        if (!cleanPath.startsWith('/media/') && !cleanPath.startsWith('/static/')) {
            // Only add /media/ if it's not a full URL and doesn't look like a direct path
            // This is a heuristic, adjust if necessary
            // cleanPath = `/media${cleanPath}`
        }

        return `${cleanUrl}${cleanPath}`
    }

    return url
}

export function formatPrice(price: string | number): string {
    const numPrice = typeof price === "string" ? parseFloat(price) : price
    if (isNaN(numPrice)) return "$0.00"

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(numPrice)
}

export function formatTime(minutes: number): string {
    if (!minutes || isNaN(minutes)) return "0 min"

    if (minutes < 60) {
        return `${minutes} min`
    }

    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (remainingMinutes === 0) {
        return `${hours}h`
    }

    return `${hours}h ${remainingMinutes}m`
}
