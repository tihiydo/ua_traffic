type DataMap = Record<string, string>;

export function XWWWFormUrlEncode(data: DataMap) {
    return Object.entries(data)
        .map(([key, value]) => {
            return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        })
        .join("&");
}