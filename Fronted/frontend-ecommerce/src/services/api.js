const BASE_URL = import.meta.env.VITE_PUBLIC_URL;

/**
 * Servicio centralizado para peticiones API
 */
const api = {
    /**
     * Helper para manejar las respuestas y errores
     */
    async handleResponse(response) {
        // Si el token expiró o es inválido (401)
        if (response.status === 401) {
            localStorage.removeItem('token');
            // Redirigir al login si no estamos ya ahí
            if (!window.location.pathname.toLowerCase().includes('login')) {
                window.location.href = '/Login?session=expired';
            }
        }

        const data = await response.json().catch(() => ({}));
        
        if (!response.ok) {
            const error = data.error || data.message || `Error del servidor: ${response.status}`;
            return Promise.reject(error);
        }
        
        return data;
    },

    /**
     * Obtiene los headers con el token si existe
     */
    getHeaders(extraHeaders = {}) {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            ...extraHeaders
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        return headers;
    },

    /**
     * GET Request
     */
    async get(endpoint) {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    },

    /**
     * POST Request
     */
    async post(endpoint, body) {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(body)
        });
        return this.handleResponse(response);
    },

    /**
     * PUT Request
     */
    async put(endpoint, body) {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(body)
        });
        return this.handleResponse(response);
    },

    /**
     * PATCH Request
     */
    async patch(endpoint, body) {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'PATCH',
            headers: this.getHeaders(),
            body: JSON.stringify(body)
        });
        return this.handleResponse(response);
    },

    /**
     * DELETE Request
     */
    async delete(endpoint) {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }
};

// Fallback visual para imágenes (SVG Neón)
export const IMAGE_FALLBACK = 'data:image/svg+xml;charset=UTF-8,<svg%20width%3D"300"%20height%3D"400"%20xmlns%3D"http%3A//www.w3.org/2000/svg"><rect%20width%3D"300"%20height%3D"400"%20fill%3D"%230a0a0a"/><text%20x%3D"50%25"%20y%3D"50%25"%20font-family%3D"monospace"%20font-size%3D"14"%20fill%3D"%23a855f7"%20text-anchor%3D"middle"%20dy%3D".3em">NO%20ASSET%20DATA</text><rect%20x%3D"10"%20y%3D"10"%20width%3D"280"%20height%3D"380"%20fill%3D"none"%20stroke%3D"%23a855f7"%20stroke-width%3D"1"%20stroke-dasharray%3D"5,5"%20opacity%3D"0.3"/></svg>';

export default api;
