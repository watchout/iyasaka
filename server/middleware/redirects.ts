export default defineEventHandler((event) => {
    const url = getRequestURL(event);
    const path = url.pathname; // /iyasaka/services/low-voltage 等

    const map: Record<string, string> = {
        "/services/low-voltage": "/products/weak-current",
        "/services/maintenance": "/products/onsite-support",
        "/services/hotel": "/products/haishin-plus",
        "/services/ai-dx": "/products/ai-plus",
        "/services/media": "/products/haishin-plus",
        "/services/agri": "/products/haishin-plus",
        "/services/weak-current": "/products/weak-current",
    };

    // baseURL配信に対応：/iyasaka/services/... も許容
    const normalized = path.replace(/^\/iyasaka/, "");
    const to = map[normalized];

    if (to) {
        // クエリストリングを維持
        const query = url.search || "";
        const base = path.startsWith("/iyasaka/") ? "/iyasaka" : "";
        return sendRedirect(event, `${base}${to}${query}`, 302);
    }
});
