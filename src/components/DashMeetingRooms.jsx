import { useState, useEffect } from 'react';
import { Card, Button, Modal, TextInput, Label, Textarea } from 'flowbite-react';
import { HiOfficeBuilding, HiCalendar, HiClock, HiUsers } from 'react-icons/hi';
import { HiMapPin } from 'react-icons/hi2';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import toast from 'react-hot-toast';

export default function DashMeetingRooms() {
    const axiosPrivate = useAxiosPrivate();
    const [meetingRooms, setMeetingRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [bookingForm, setBookingForm] = useState({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        date: ''
    });

    useEffect(() => {
        fetchMeetingRooms();
    }, []);

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

    const handleBookRoom = (room) => {
        setSelectedRoom(room);
        setShowBookingModal(true);
        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        setBookingForm({
            title: '',
            description: '',
            startTime: '',
            endTime: '',
            date: today
        });
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();

        if (!bookingForm.title || !bookingForm.startTime || !bookingForm.endTime || !bookingForm.date) {
            toast.error('Please fill in all required fields');
            return;
        }

        const startDateTime = new Date(`${bookingForm.date}T${bookingForm.startTime}`);
        const endDateTime = new Date(`${bookingForm.date}T${bookingForm.endTime}`);

        if (startDateTime >= endDateTime) {
            toast.error('End time must be after start time');
            return;
        }

        try {
            const bookingData = {
                meetingRoomId: selectedRoom.id,
                title: bookingForm.title,
                description: bookingForm.description,
                startTime: startDateTime.toISOString(),
                endTime: endDateTime.toISOString()
            };

            await axiosPrivate.post('/api/bookings', bookingData);
            toast.success('Booking created successfully!');
            setShowBookingModal(false);
            setSelectedRoom(null);
            setBookingForm({
                title: '',
                description: '',
                startTime: '',
                endTime: '',
                date: ''
            });
        } catch (error) {
            console.error('Error creating booking:', error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to create booking');
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
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Meeting Rooms</h1>
                <p className="text-gray-600">Browse and book available meeting rooms</p>
            </div>

            {meetingRooms.length === 0 ? (
                <div className="text-center py-12">
                    <HiOfficeBuilding className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No meeting rooms</h3>
                    <p className="mt-1 text-sm text-gray-500">No meeting rooms are currently available.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {meetingRooms.map((room) => (
                        <Card key={room.id} className="max-w-sm">
                            <div className="flex items-center justify-between">
                                <h5 className="text-xl font-bold tracking-tight text-gray-900">
                                    {room.name}
                                </h5>
                                <HiOfficeBuilding className="h-6 w-6 text-indigo-600" />
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center text-sm text-gray-600">
                                    <HiUsers className="h-4 w-4 mr-2" />
                                    <span>Capacity: {room.capacity} people</span>
                                </div>

                                {room.location && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <HiMapPin className="h-4 w-4 mr-2" />
                                        <span>{room.location}</span>
                                    </div>
                                )}

                                {room.description && (
                                    <p className="text-sm text-gray-600">
                                        {room.description}
                                    </p>
                                )}
                            </div>

                            <Button
                                onClick={() => handleBookRoom(room)}
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                            >
                                <HiCalendar className="mr-2 h-4 w-4" />
                                Book Room
                            </Button>
                        </Card>
                    ))}
                </div>
            )}

            {/* Booking Modal */}
            <Modal show={showBookingModal} onClose={() => setShowBookingModal(false)} size="md">
                <Modal.Header>
                    Book Meeting Room: {selectedRoom?.name}
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleBookingSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="title" value="Meeting Title *" />
                            <TextInput
                                id="title"
                                type="text"
                                value={bookingForm.title}
                                onChange={(e) => setBookingForm({ ...bookingForm, title: e.target.value })}
                                placeholder="Enter meeting title"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="description" value="Description" />
                            <Textarea
                                id="description"
                                value={bookingForm.description}
                                onChange={(e) => setBookingForm({ ...bookingForm, description: e.target.value })}
                                placeholder="Enter meeting description (optional)"
                                rows={3}
                            />
                        </div>

                        <div>
                            <Label htmlFor="date" value="Date *" />
                            <TextInput
                                id="date"
                                type="date"
                                value={bookingForm.date}
                                onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="startTime" value="Start Time *" />
                                <TextInput
                                    id="startTime"
                                    type="time"
                                    value={bookingForm.startTime}
                                    onChange={(e) => setBookingForm({ ...bookingForm, startTime: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="endTime" value="End Time *" />
                                <TextInput
                                    id="endTime"
                                    type="time"
                                    value={bookingForm.endTime}
                                    onChange={(e) => setBookingForm({ ...bookingForm, endTime: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={handleBookingSubmit}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    >
                        Book Meeting
                    </Button>
                    <Button color="gray" onClick={() => setShowBookingModal(false)}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
} 