import { useState, useEffect } from 'react';
import { Card, Button, Modal, TextInput, Label, Textarea, Table } from 'flowbite-react';
import { HiOfficeBuilding, HiPlus, HiPencil, HiTrash, HiUsers } from 'react-icons/hi';
import { HiMapPin } from 'react-icons/hi2';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function DashManageRooms() {
    const axiosPrivate = useAxiosPrivate();
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [meetingRooms, setMeetingRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        capacity: '',
        location: '',
        description: ''
    });

    useEffect(() => {
        if (currentUser && currentUser?.role !== 'admin') {
            navigate('/dashboard?tab=overview');
            toast.error('You are not authorized to view this page.');
            return;
        }
        fetchMeetingRooms();
    }, [currentUser, navigate]);

    const fetchMeetingRooms = async () => {
        try {
            const response = await axiosPrivate.get('/api/meeting-rooms');
            setMeetingRooms(response.data.data || []);
        } catch (error) {
            console.error('Error fetching meeting rooms:', error);
            toast.error('Failed to load meeting rooms');
        } finally {
            setLoading(false);
        }
    };

    const handleAddRoom = () => {
        setEditingRoom(null);
        setFormData({
            name: '',
            capacity: '',
            location: '',
            description: ''
        });
        setShowModal(true);
    };

    const handleEditRoom = (room) => {
        setEditingRoom(room);
        setFormData({
            name: room.name,
            capacity: room.capacity.toString(),
            location: room.location || '',
            description: room.description || ''
        });
        setShowModal(true);
    };

    const handleDeleteRoom = async (roomId) => {
        if (!window.confirm('Are you sure you want to delete this meeting room? This action cannot be undone.')) {
            return;
        }

        try {
            await axiosPrivate.delete(`/api/meeting-rooms/${roomId}`);
            toast.success('Meeting room deleted successfully!');
            fetchMeetingRooms();
        } catch (error) {
            console.error('Error deleting meeting room:', error);
            toast.error('Failed to delete meeting room');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.capacity) {
            toast.error('Please fill in all required fields');
            return;
        }

        const capacity = parseInt(formData.capacity);
        if (isNaN(capacity) || capacity <= 0) {
            toast.error('Capacity must be a positive number');
            return;
        }

        try {
            const roomData = {
                name: formData.name,
                capacity: capacity,
                location: formData.location,
                description: formData.description
            };

            if (editingRoom) {
                await axiosPrivate.put(`/api/meeting-rooms/${editingRoom.id}`, roomData);
                toast.success('Meeting room updated successfully!');
            } else {
                await axiosPrivate.post('/api/meeting-rooms', roomData);
                toast.success('Meeting room created successfully!');
            }

            setShowModal(false);
            setEditingRoom(null);
            setFormData({
                name: '',
                capacity: '',
                location: '',
                description: ''
            });
            fetchMeetingRooms();
        } catch (error) {
            console.error('Error saving meeting room:', error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to save meeting room');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Meeting Rooms</h1>
                    <p className="text-gray-600">Add, edit, or remove meeting rooms</p>
                </div>
                <Button
                    onClick={handleAddRoom}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                    <HiPlus className="mr-2 h-4 w-4" />
                    Add Room
                </Button>
            </div>

            {meetingRooms.length === 0 ? (
                <div className="text-center py-12">
                    <HiOfficeBuilding className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No meeting rooms</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating your first meeting room.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <Table>
                        <Table.Head>
                            <Table.HeadCell>Room Name</Table.HeadCell>
                            <Table.HeadCell>Capacity</Table.HeadCell>
                            <Table.HeadCell>Location</Table.HeadCell>
                            <Table.HeadCell>Description</Table.HeadCell>
                            <Table.HeadCell>Actions</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                            {meetingRooms.map((room) => (
                                <Table.Row key={room.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        {room.name}
                                    </Table.Cell>
                                    <Table.Cell className="flex items-center">
                                        <HiUsers className="h-4 w-4 mr-1 text-gray-500" />
                                        {room.capacity} people
                                    </Table.Cell>
                                    <Table.Cell>
                                        {room.location ? (
                                            <div className="flex items-center">
                                                <HiMapPin className="h-4 w-4 mr-1 text-gray-500" />
                                                {room.location}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">Not specified</span>
                                        )}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {room.description ? (
                                            <span className="max-w-xs truncate block" title={room.description}>
                                                {room.description}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">No description</span>
                                        )}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div className="flex space-x-2">
                                            <Button
                                                size="sm"
                                                color="gray"
                                                onClick={() => handleEditRoom(room)}
                                            >
                                                <HiPencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                color="failure"
                                                onClick={() => handleDeleteRoom(room.id)}
                                            >
                                                <HiTrash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </div>
            )}

            {/* Add/Edit Room Modal */}
            <Modal show={showModal} onClose={() => setShowModal(false)} size="md">
                <Modal.Header>
                    {editingRoom ? 'Edit Meeting Room' : 'Add New Meeting Room'}
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name" value="Room Name *" />
                            <TextInput
                                id="name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter room name"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="capacity" value="Capacity *" />
                            <TextInput
                                id="capacity"
                                type="number"
                                value={formData.capacity}
                                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                placeholder="Enter capacity"
                                min="1"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="location" value="Location" />
                            <TextInput
                                id="location"
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="Enter room location (optional)"
                            />
                        </div>

                        <div>
                            <Label htmlFor="description" value="Description" />
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Enter room description (optional)"
                                rows={3}
                            />
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={handleSubmit}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    >
                        {editingRoom ? 'Update Room' : 'Create Room'}
                    </Button>
                    <Button color="gray" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
} 