export const API_BASE_URL = ''; // Relative path for both Dev (via Proxy) and Prod

/**
 * Helper to get full image URL
 * @param {string} path - Relative path or full URL
 * @returns {string} Full URL
 */
export const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    if (path.startsWith('/')) return `${API_BASE_URL}${path}`;
    return `${API_BASE_URL}/${path}`;
};

/**
 * Standardized fetch wrapper
 * @param {string} endpoint - API endpoint (e.g., '/api/folders')
 * @param {object} options - Fetch options
 * @returns {Promise<any>}
 */
export const apiFetch = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, options);

    // Handle 204 No Content
    if (response.status === 204) {
        return null;
    }

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.detail || data.message || 'API request failed');
        }
        return data; // standard JSON response
    } else {
        if (!response.ok) {
            throw new Error('API request failed');
        }
        return response.text(); // text/plain or other
    }
};
