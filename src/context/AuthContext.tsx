"use client"
import { useAuthModal } from '@/hooks/loginModal';
import { axiosInstance } from '@/redux/api';
import { jwtDecode } from 'jwt-decode';
import { useCookies } from 'next-client-cookies';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface User {
    username: string;
    id: string
    email: string
    role: string;
    name: string
    // Add any other user data you expect from the JWT or external API
}

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    signUp: (d: any) => Promise<void>;
    isAuth: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuth, setIsAuth] = useState(false)
    const { setOpen } = useAuthModal()
    const router = useRouter()
    const cookies = useCookies()

    // Initialize user from cookies when the app loads
    useEffect(() => {
        const token = cookies.get('auth_token')

        if (token) {
            try {
                const decodedUser = jwtDecode<User>(token); // Decode JWT token to get user info
                if (decodedUser.id) {
                    setIsAuth(true)
                }
                setUser(decodedUser); // Set user if token exists
            } catch (error) {
                console.error('Invalid token', error);
            }
        }
    }, [cookies]);

    // Login function
    const login = async (email: string, password: string) => {
        try {
            const response = await axiosInstance.post('/auth/login', {
                email,
                password
            });

            const { accessToken } = response.data.data
            const decodedUser = jwtDecode<User>(accessToken);
            cookies.set('auth_token', accessToken, {
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
            })
            setIsAuth(true)
            setUser(decodedUser); // Set the user
            setOpen()

        } catch (error: any) {
            const message = error.response.data.message;

            if (message instanceof Array) {
                toast.error(message.join(', '))
            } else {
                toast.error(message);
            }
        }
    };

    // Sign Up Function
    const signUp = async (d: any) => {
        try {
            const response = await axiosInstance.post('/auth/register', d);
            const { accessToken } = response.data.data
            const decodedUser = jwtDecode<User>(accessToken);
            cookies.set('auth_token', accessToken, {
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
            })
            setUser(decodedUser); // Set the user
            setIsAuth(true)
            setOpen()
        } catch (error: any) {
            const message = error.response.data.message;
            if (message instanceof Array) {
                toast.error(message.join(', '))
            } else {
                toast.error(message);
            }
        }
    };

    // Logout function
    const logout = () => {
        cookies.remove('auth_token'); // Delete the auth_token cookie
        setIsAuth(false)
        router.push('/')
        setUser(null); // Reset user state
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, signUp, isAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
