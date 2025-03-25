import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch('http://localhost:3002/api/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    if (response.status === 401) {
                        logout();
                        alert('Session expired. Please log in again.');
                        navigate('/login');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data._id) {
                        setUser(data);
                    }
                })
                .catch(error => {
                    console.error('Error fetching user:', error);
                });
        }
    }, [navigate]);

    const login = async (email, password) => {
        try {
            const response = await fetch('http://localhost:3002/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                fetch('http://localhost:3002/api/users/me', {
                    headers: {
                        'Authorization': `Bearer ${data.token}`
                    }
                })
                    .then(response => response.json())
                    .then(userData => {
                        setUser(userData);
                    })
                    .catch(error => {
                        console.error('Error fetching user:', error);
                    });
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while logging in.');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};