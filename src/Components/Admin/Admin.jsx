import React from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
    const navigate = useNavigate();

    const handleRedirect = (path) => {
        navigate(path); // Redirige a la ruta correspondiente
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Bienvenido, Admin</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <button
                    onClick={() => handleRedirect('/admin/users')}
                    className="w-full py-3 px-6 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
                >
                    Usuarios
                </button>

                <button
                    onClick={() => handleRedirect('/admin/employees')}
                    className="w-full py-3 px-6 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600"
                >
                    Empleados
                </button>

                <button
                    onClick={() => handleRedirect('/admin/appointments')}
                    className="w-full py-3 px-6 bg-yellow-500 text-white rounded-md shadow-md hover:bg-yellow-600"
                >
                    Citas
                </button>
            </div>
        </div>
    );
};

export default Admin;
