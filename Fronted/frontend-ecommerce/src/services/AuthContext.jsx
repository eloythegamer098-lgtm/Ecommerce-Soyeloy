import { createContext, useState, useEffect, useContext, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Función para decodificar JWT manualmente sin librerías externas
    const decodeToken = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    };

    // Obtener rol normalizado (soporta .rol y .role)
    const getUserRole = (userData) => {
        if (!userData) return null;
        return userData.rol || userData.role || null;
    };

    const verifyUser = useCallback(async () => {
        if (token) {
            try {
                // Intento inicial rápido mediante el payload del token
                const decoded = decodeToken(token);
                if (decoded) {
                    setUser(prev => prev || decoded);
                }

                const response = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/auth/perfil`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data.perfil);
                } else {
                    // Si el token expiró o es inválido en el server
                    logout();
                }
            } catch (error) {
                console.error("Error verifying user:", error);
                // No cerramos sesión inmediatamente por errores de red, 
                // pero si el token es el problema, logout.
            }
        }
        setLoading(false);
    }, [token]);

    useEffect(() => {
        verifyUser();
    }, [verifyUser]);

    const login = (newToken, userData) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setLoading(false);
    };

    // Flag isAdmin altamente confiable
    const userRole = getUserRole(user);
    const isAdmin = userRole === 'admin';

    return (
        <AuthContext.Provider value={{ 
            user, 
            token, 
            login, 
            logout, 
            loading, 
            isAdmin, 
            role: userRole 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
