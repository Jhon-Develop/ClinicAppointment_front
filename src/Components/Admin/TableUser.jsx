import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

const TableUser = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userData, setUserData] = useState({});
    const navigate = useNavigate();

    // Function to load users from the API
    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5251/api/v1/users');
            const filteredUsers = response.data.filter(user => user.roleId === 3);
            setUsers(filteredUsers);
        } catch (error) {
            console.error("Error fetching users", error);
        }
    };

    // Load users when the component is mounted
    useEffect(() => {
        fetchUsers();
    }, []);

    // Redirect to the user details page
    const handleView = (userId) => {
        const user = users.find(user => user.id === userId);
        setUserData(user);
        setIsModalOpen(true); // Open user view modal
    };

    // Redirect to the user edit page
    const handleEdit = (userId) => {
        const user = users.find(user => user.id === userId);
        setUserData(user);
        setIsEditModalOpen(true); // Open user edit modal
    };

    // Delete user
    const handleDelete = (userId) => {
        const user = users.find(user => user.id === userId);
        setSelectedUser(user);
        setIsDeleteModalOpen(true); // Open delete confirmation modal
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:5251/api/v1/users/${selectedUser.id}`);
            fetchUsers(); // Reload users after deletion
            setIsDeleteModalOpen(false); // Close modal
        } catch (error) {
            console.error("Error deleting user", error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5251/api/v1/users/${userData.id}`, userData);
            fetchUsers(); // Reload users after update
            setIsEditModalOpen(false); // Close edit modal
        } catch (error) {
            console.error("Error updating user", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevState => ({ ...prevState, [name]: value }));
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Users</h1>
            <table className="min-w-full table-auto border-collapse">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">Role</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="py-2 px-4 text-center">No users found.</td>
                        </tr>
                    ) : (
                        users.map(user => (
                            <tr key={user.id}>
                                <td className="py-2 px-4 border-b">{user.id}</td>
                                <td className="py-2 px-4 border-b">{user.name}</td>
                                <td className="py-2 px-4 border-b">{user.email}</td>
                                <td className="py-2 px-4 border-b">{user.role}</td>
                                <td className="py-2 px-4 border-b">
                                    <button
                                        onClick={() => handleView(user.id)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mr-2"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => handleEdit(user.id)}
                                        className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* User view modal */}
            <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} className="modal">
                <div className="bg-white p-6 rounded-md shadow-lg max-w-md mx-auto">
                    <h2 className="text-2xl font-bold mb-4">User Details</h2>
                    <p><strong>ID:</strong> {userData.id}</p>
                    <p><strong>Name:</strong> {userData.name}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Role:</strong> {userData.role}</p>
                    <div className="flex justify-end gap-4 mt-4">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Modal>

            {/* User edit modal */}
            <Modal isOpen={isEditModalOpen} onRequestClose={() => setIsEditModalOpen(false)} className="modal">
                <div className="bg-white p-6 rounded-md shadow-lg max-w-md mx-auto">
                    <h2 className="text-2xl font-bold mb-4">Edit User</h2>
                    <form onSubmit={handleUpdate}>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2">Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={userData.name || ''}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded-md shadow-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2">Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={userData.email || ''}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded-md shadow-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2">Role:</label>
                            <select
                                name="role"
                                value={userData.role || ''}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded-md shadow-sm"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                                <option value="employee">Employee</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-4">
                            <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                                Update
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Delete confirmation modal */}
            <Modal isOpen={isDeleteModalOpen} onRequestClose={() => setIsDeleteModalOpen(false)} className="modal">
                <div className="bg-white p-6 rounded-md shadow-lg max-w-md mx-auto">
                    <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
                    <p>Are you sure you want to delete this user?</p>
                    <div className="flex justify-end gap-4 mt-4">
                        <button
                            onClick={confirmDelete}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                            Delete
                        </button>
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default TableUser;
