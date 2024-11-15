import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

const TableAppointment = () => {
    // States to handle appointments, modals, and appointment data
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // View Appointment Modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Edit Appointment Modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Delete Confirmation Modal
    const [appointmentData, setAppointmentData] = useState({}); // Holds data for appointment details
    const [appointmentHistory, setAppointmentHistory] = useState([]); // Holds appointment history
    const navigate = useNavigate();

    // Function to fetch appointments from the API
    const fetchAppointments = async () => {
        try {
            const response = await axios.get('http://localhost:5251/api/v1/appointments');
            setAppointments(response.data); // Set the state with the retrieved appointments
            console.log(response); // Log the response for debugging
        } catch (error) {
            console.error("Error fetching appointments", error); // Error handling
        }
    };

    // Fetch appointments when the component mounts
    useEffect(() => {
        fetchAppointments();
    }, []);

    // Function to fetch the history of a specific appointment
    const fetchAppointmentHistory = async (appointmentId) => {
        try {
            const response = await axios.get(`http://localhost:5251/api/v1/appointment-histories/appointment/${appointmentId}`);
            setAppointmentHistory(response.data); // Set the appointment history
        } catch (error) {
            console.error("Error fetching appointment history", error); // Error handling
        }
    };

    // Function to view the appointment details in a modal
    const handleView = (appointmentId) => {
        const appointment = appointments.find(app => app.id === appointmentId);
        setAppointmentData(appointment);
        fetchAppointmentHistory(appointmentId); // Fetch the appointment history
        setIsModalOpen(true); // Open the view appointment modal
    };

    // Function to edit an appointment
    const handleEdit = (appointmentId) => {
        const appointment = appointments.find(app => app.id === appointmentId);
        setAppointmentData(appointment);
        setIsEditModalOpen(true); // Open the edit appointment modal
    };

    // Function to delete an appointment
    const handleDelete = (appointmentId) => {
        const appointment = appointments.find(app => app.id === appointmentId);
        setSelectedAppointment(appointment);
        setIsDeleteModalOpen(true); // Open the delete confirmation modal
    };

    // Confirm deletion of an appointment
    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:5251/api/v1/appointments/${selectedAppointment.id}`);
            fetchAppointments(); // Reload the appointments after deletion
            setIsDeleteModalOpen(false); // Close the delete modal
        } catch (error) {
            console.error("Error deleting appointment", error); // Error handling
        }
    };

    // Handle form submission for updating appointment data
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5251/api/v1/appointments/${appointmentData.id}`, appointmentData);
            fetchAppointments(); // Reload appointments after update
            setIsEditModalOpen(false); // Close the edit modal
        } catch (error) {
            console.error("Error updating appointment", error); // Error handling
        }
    };

    // Handle input changes in the edit form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAppointmentData(prevState => ({ ...prevState, [name]: value }));
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Appointments</h1>
            <table className="min-w-full table-auto border-collapse">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Patient</th> {/* Patient column */}
                        <th className="py-2 px-4 border-b">Doctor</th> {/* Doctor column */}
                        <th className="py-2 px-4 border-b">Date</th>
                        <th className="py-2 px-4 border-b">Status</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="py-2 px-4 text-center">No appointments found.</td>
                        </tr>
                    ) : (
                        appointments.map(appointment => (
                            <tr key={appointment.id}>
                                <td className="py-2 px-4 border-b">{appointment.id}</td>
                                <td className="py-2 px-4 border-b">{appointment.patient ? appointment.patient.name : 'Unavailable'}</td>
                                <td className="py-2 px-4 border-b">{appointment.doctor ? appointment.doctor.name : 'Unavailable'}</td>
                                <td className="py-2 px-4 border-b">{appointment.date}</td>
                                <td className="py-2 px-4 border-b">{appointment.status}</td>
                                <td className="py-2 px-4 border-b">
                                    <button
                                        onClick={() => handleView(appointment.id)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mr-2"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => handleEdit(appointment.id)}
                                        className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(appointment.id)}
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

            {/* View Appointment Modal */}
            <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} className="modal">
                <div className="bg-white p-6 rounded-md shadow-lg max-w-md mx-auto">
                    <h2 className="text-2xl font-bold mb-4">Appointment Details</h2>
                    <p><strong>ID:</strong> {appointmentData.id}</p>
                    <p><strong>Patient:</strong> {appointmentData.patientName}</p>
                    <p><strong>Doctor:</strong> {appointmentData.doctorName}</p>
                    <p><strong>Date:</strong> {appointmentData.date}</p>
                    <p><strong>Status:</strong> {appointmentData.status}</p>
                    <h3 className="text-xl font-semibold mt-4">Appointment History:</h3>
                    {appointmentHistory.length === 0 ? (
                        <p>No history available.</p>
                    ) : (
                        appointmentHistory.map((history, index) => (
                            <p key={index}><strong>{history.date}:</strong> {history.details}</p>
                        ))
                    )}
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

            {/* Edit Appointment Modal */}
            <Modal isOpen={isEditModalOpen} onRequestClose={() => setIsEditModalOpen(false)} className="modal">
                <div className="bg-white p-6 rounded-md shadow-lg max-w-md mx-auto">
                    <h2 className="text-2xl font-bold mb-4">Edit Appointment</h2>
                    <form onSubmit={handleUpdate}>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2">Patient:</label>
                            <input
                                type="text"
                                name="patientName"
                                value={appointmentData.patientName || ''}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded-md shadow-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2">Doctor:</label>
                            <input
                                type="text"
                                name="doctorName"
                                value={appointmentData.doctorName || ''}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded-md shadow-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2">Date:</label>
                            <input
                                type="datetime-local"
                                name="date"
                                value={appointmentData.date || ''}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded-md shadow-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2">Status:</label>
                            <select
                                name="status"
                                value={appointmentData.status || ''}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded-md shadow-sm"
                            >
                                <option value="Scheduled">Scheduled</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={isDeleteModalOpen} onRequestClose={() => setIsDeleteModalOpen(false)} className="modal">
                <div className="bg-white p-6 rounded-md shadow-lg max-w-md mx-auto">
                    <h2 className="text-2xl font-bold mb-4">Are you sure you want to delete this appointment?</h2>
                    <div className="flex justify-end gap-4">
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

export default TableAppointment;
