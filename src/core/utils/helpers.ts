export function getImageUrl(path: string | undefined): string | undefined {
    if (!path) return undefined
    if (path.startsWith("http")) return path

    const apiUrl = import.meta.env.VITE_API_URL
    if (apiUrl) {
        const cleanUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl
        const cleanPath = path.startsWith('/') ? path : `/${path}`
        return `${cleanUrl}${cleanPath}`
    }

    return path
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
