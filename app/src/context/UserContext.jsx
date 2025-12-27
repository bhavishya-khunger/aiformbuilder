import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const storedUser = localStorage.getItem('user');
            const storedToken = localStorage.getItem('token');

            if (storedUser && storedToken) {
                const parsedUser = JSON.parse(storedUser);
                
                // Set the axios header immediately
                axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                
                try {
                    // Verify token first
                    await axios.post('http://localhost:8000/api/users/verifyToken', {}, {
                        headers: { Authorization: `Bearer ${storedToken}` }
                    });
                    
                    // Only set user state if token is valid
                    setUser(parsedUser);
                    setToken(storedToken);
                    setIsLoading(false);
                    
                } catch (err) {
                    console.error("Token invalid, logging out...");
                    // Clear invalid data
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    delete axios.defaults.headers.common['Authorization'];
                    setUser(null);
                    setToken(null);
                    setIsLoading(false);
                }
            } else {
                // No stored credentials
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', authToken);
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    };

    const value = {
        user,
        token,
        isLoading,
        login,
        logout,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);