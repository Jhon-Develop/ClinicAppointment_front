import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const base64UrlToBase64 = (base64Url) => {
        return base64Url.replace(/-/g, '+').replace(/_/g, '/');
    };

    const parseJwt = (token) => {
        const base64Url = token.split('.')[1];  // Obtener la parte del payload
        const base64 = base64UrlToBase64(base64Url);  // Decodificar Base64Url a Base64
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);  // Convertir la cadena JSON en un objeto
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5251/api/v1/auth/login', 
                { email, password },
                { withCredentials: true }  // Para enviar cookies o credenciales con la solicitud
            );

            const token = response.data.token;  // Suponiendo que el backend devuelve el token

            // Decodificar el JWT manualmente
            const decodedToken = parseJwt(token);
            const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]; // Accede al rol del token decodificado

            // Guardar el token en el localStorage
            localStorage.setItem('token', token);

            // Redirigir según el rol
            if (role === "Admin") {
                navigate('/admin');  // Redirige a /admin si el rol es Admin
            } else if (role === "User") {
                navigate('/user');   // Redirige a /user si el rol es User
            } else if (role === "Employee"){
                navigate('/employee');   // Redirige a /employee si el rol es Employee
            }
            else {
                navigate('/');      // Redirige a la página de inicio si el rol es desconocido
            }
        } catch (error) {
            setError('Credenciales incorrectas.');
        }
    };

    return (
        <div className="max-w-sm mx-auto mt-10 p-6 bg-white border border-gray-300 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center">Login</h1>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <form onSubmit={handleLogin}>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium">Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 font-medium">Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
