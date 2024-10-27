export function objectToQueryParams(obj: Record<string, number | string>): string {
    const params = new URLSearchParams();
    
    Object.keys(obj).forEach(key => {
        if (!obj[key]) params.append(key, String(obj[key]));
    });
    
    return params.toString();
}