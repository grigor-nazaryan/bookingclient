import { useState, useEffect } from 'react';
import { Card, Button, Badge, Modal } from 'flowbite-react';
import { HiCalendar, HiClock, HiOfficeBuilding, HiTrash, HiX } from 'react-icons/hi';
import { HiMapPin } from 'react-icons/hi2';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import toast from 'react-hot-toast';

export default function DashMyBookings() {
    const axiosPrivate = useAxiosPrivate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    useEffect(() => {
        fetchMyBookings();
    }, []);

    const fetchMyBookings = async () => {
        try {
            const response = await axiosPrivate.get('/api/bookings/my-bookings');
            setBookings(response.data.data || []);
        } catch (error) {
            console.error('Error fetching my bookings:', error);
            toast.error('Failed to load your bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = (booking) => {
        setSelectedBooking(booking);
        setShowCancelModal(true);
    };

    const confirmCancelBooking = async () => {
        try {
            await axiosPrivate.patch(`/api/bookings/${selectedBooking.id}/cancel`);
            toast.success('Booking cancelled successfully!');
            setShowCancelModal(false);
            setSelectedBooking(null);
            fetchMyBookings(); // Refresh the list
        } catch (error) {
            console.error('Error cancelling booking:', error);
            toast.error('Failed to cancel booking');
        }
    };

    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return {
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
    };

    const getBookingStatus = (booking) => {
        const now = new Date();
        const startTime = new Date(booking.startTime);
        const endTime = new Date(booking.endTime);

        if (booking.status === 'cancelled') {
            return { status: 'cancelled', color: 'red', text: 'Cancelled' };
        } else if (now < startTime) {
            return { status: 'upcoming', color: 'info', text: 'Upcoming' };
        } else if (now >= startTime && now <= endTime) {
            return { status: 'ongoing', color: 'success', text: 'Ongoing' };
        } else {
            return { status: 'completed', color: 'gray', text: 'Completed' };
        }
    };

    const sortBookings = (bookings) => {
        return bookings.sort((a, b) => {
            const statusA = getBookingStatus(a);
            const statusB = getBookingStatus(b);

            // Ongoing first, then upcoming, then completed, then cancelled
            const priority = { ongoing: 0, upcoming: 1, completed: 2, cancelled: 3 };
            const priorityDiff = priority[statusA.status] - priority[statusB.status];

            if (priorityDiff !== 0) return priorityDiff;

            // Then sort by start time
            return new Date(a.startTime) - new Date(b.startTime);
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const sortedBookings = sortBookings([...bookings]);

    return (
        <div className="p-4">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
                <p className="text-gray-600">View and manage your meeting room bookings</p>
            </div>

            {sortedBookings.length === 0 ? (
                <div className="text-center py-12">
                    <HiCalendar className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings</h3>
                    <p className="mt-1 text-sm text-gray-500">You haven't made any bookings yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {sortedBookings.map((booking) => {
                        const startDateTime = formatDateTime(booking.startTime);
                        const endDateTime = formatDateTime(booking.endTime);
                        const status = getBookingStatus(booking);
                        const canCancel = status.status === 'upcoming';

                        return (
                            <Card key={booking.id} className="max-w-full">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-3">
                                            <h5 className="text-xl font-bold tracking-tight text-gray-900">
                                                {booking.title}
                                            </h5>
                                            <Badge color={status.color}>
                                                {status.text}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <HiOfficeBuilding className="h-4 w-4 mr-2" />
                                                <span>{booking.meetingRoom?.name || 'Unknown Room'}</span>
                                            </div>

                                            <div className="flex items-center text-sm text-gray-600">
                                                <HiCalendar className="h-4 w-4 mr-2" />
                                                <span>{startDateTime.date}</span>
                                            </div>

                                            <div className="flex items-center text-sm text-gray-600">
                                                <HiClock className="h-4 w-4 mr-2" />
                                                <span>{startDateTime.time} - {endDateTime.time}</span>
                                            </div>

                                            {booking.meetingRoom?.location && (
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <span>📍 {booking.meetingRoom.location}</span>
                                                </div>
                                            )}
                                        </div>

                                        {booking.description && (
                                            <p className="text-sm text-gray-600 mb-4">
                                                {booking.description}
                                            </p>
                                        )}
                                    </div>

                                    {canCancel && (
                                        <Button
                                            color="failure"
                                            size="sm"
                                            onClick={() => handleCancelBooking(booking)}
                                            className="ml-4"
                                        >
                                            <HiTrash className="h-4 w-4 mr-1" />
                                            Cancel
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Cancel Confirmation Modal */}
            <Modal show={showCancelModal} onClose={() => setShowCancelModal(false)} size="md">
                <Modal.Header>
                    Cancel Booking
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center">
                        <HiX className="mx-auto h-12 w-12 text-red-500 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Cancel this booking?
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Are you sure you want to cancel your booking for "{selectedBooking?.title}"?
                            This action cannot be undone.
                        </p>
                        <div className="bg-gray-50 p-3 rounded-lg text-sm">
                            <p><strong>Room:</strong> {selectedBooking?.meetingRoom?.name}</p>
                            <p><strong>Date:</strong> {selectedBooking && formatDateTime(selectedBooking.startTime).date}</p>
                            <p><strong>Time:</strong> {selectedBooking && `${formatDateTime(selectedBooking.startTime).time} - ${formatDateTime(selectedBooking.endTime).time}`}</p>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        color="failure"
                        onClick={confirmCancelBooking}
                    >
                        Yes, Cancel Booking
                    </Button>
                    <Button color="gray" onClick={() => setShowCancelModal(false)}>
                        Keep Booking
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
} 