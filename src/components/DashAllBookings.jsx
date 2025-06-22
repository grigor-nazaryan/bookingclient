import { useState, useEffect } from 'react';
import { Card, Badge, Table, Select } from 'flowbite-react';
import { HiCalendar, HiClock, HiOfficeBuilding, HiUser } from 'react-icons/hi';
import { HiMapPin } from 'react-icons/hi2';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function DashAllBookings() {
    const axiosPrivate = useAxiosPrivate();
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (currentUser && currentUser?.role !== 'admin') {
            navigate('/dashboard?tab=overview');
            toast.error('You are not authorized to view this page.');
            return;
        }
        fetchAllBookings();
    }, [currentUser, navigate]);

    const fetchAllBookings = async () => {
        try {
            const response = await axiosPrivate.get('/api/bookings');
            setBookings(response.data.data || []);
        } catch (error) {
            console.error('Error fetching all bookings:', error);
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
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

        if (now < startTime) {
            return { status: 'upcoming', color: 'info', text: 'Upcoming' };
        } else if (now >= startTime && now <= endTime) {
            return { status: 'ongoing', color: 'success', text: 'Ongoing' };
        } else {
            return { status: 'completed', color: 'gray', text: 'Completed' };
        }
    };

    const filterBookings = (bookings) => {
        if (filter === 'all') return bookings;

        return bookings.filter(booking => {
            const status = getBookingStatus(booking);
            return status.status === filter;
        });
    };

    const sortBookings = (bookings) => {
        return bookings.sort((a, b) => {
            const statusA = getBookingStatus(a);
            const statusB = getBookingStatus(b);

            // Ongoing first, then upcoming, then completed
            const priority = { ongoing: 0, upcoming: 1, completed: 2 };
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

    const filteredAndSortedBookings = sortBookings(filterBookings([...bookings]));

    return (
        <div className="p-4">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">All Bookings</h1>
                <p className="text-gray-600">Monitor all meeting room bookings across the organization</p>
            </div>

            {/* Filter Controls */}
            <div className="mb-6 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-gray-700">Filter by status:</label>
                    <Select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-40"
                    >
                        <option value="all">All Bookings</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                    </Select>
                </div>
                <div className="text-sm text-gray-600">
                    Total: {filteredAndSortedBookings.length} booking{filteredAndSortedBookings.length !== 1 ? 's' : ''}
                </div>
            </div>

            {filteredAndSortedBookings.length === 0 ? (
                <div className="text-center py-12">
                    <HiCalendar className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {filter === 'all' ? 'No bookings have been made yet.' : `No ${filter} bookings found.`}
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <Table>
                        <Table.Head>
                            <Table.HeadCell>Meeting Title</Table.HeadCell>
                            <Table.HeadCell>User</Table.HeadCell>
                            <Table.HeadCell>Room</Table.HeadCell>
                            <Table.HeadCell>Date</Table.HeadCell>
                            <Table.HeadCell>Time</Table.HeadCell>
                            <Table.HeadCell>Status</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                            {filteredAndSortedBookings.map((booking) => {
                                const startDateTime = formatDateTime(booking.startTime);
                                const endDateTime = formatDateTime(booking.endTime);
                                const status = getBookingStatus(booking);

                                return (
                                    <Table.Row key={booking.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell className="font-medium text-gray-900 dark:text-white">
                                            <div>
                                                <div className="font-semibold">{booking.title}</div>
                                                {booking.description && (
                                                    <div className="text-sm text-gray-500 truncate max-w-xs" title={booking.description}>
                                                        {booking.description}
                                                    </div>
                                                )}
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="flex items-center">
                                                <HiUser className="h-4 w-4 mr-1 text-gray-500" />
                                                {booking.user?.email || 'Unknown User'}
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="flex items-center">
                                                <HiOfficeBuilding className="h-4 w-4 mr-1 text-gray-500" />
                                                <div>
                                                    <div className="font-medium">{booking.meetingRoom?.name || 'Unknown Room'}</div>
                                                    {booking.meetingRoom?.location && (
                                                        <div className="text-sm text-gray-500 flex items-center">
                                                            <HiMapPin className="h-3 w-3 mr-1" />
                                                            {booking.meetingRoom.location}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="flex items-center">
                                                <HiCalendar className="h-4 w-4 mr-1 text-gray-500" />
                                                {startDateTime.date}
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="flex items-center">
                                                <HiClock className="h-4 w-4 mr-1 text-gray-500" />
                                                {startDateTime.time} - {endDateTime.time}
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Badge color={status.color}>
                                                {status.text}
                                            </Badge>
                                        </Table.Cell>
                                    </Table.Row>
                                );
                            })}
                        </Table.Body>
                    </Table>
                </div>
            )}

            {/* Summary Cards */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <HiCalendar className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Upcoming</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {bookings.filter(b => getBookingStatus(b).status === 'upcoming').length}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <HiClock className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Ongoing</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {bookings.filter(b => getBookingStatus(b).status === 'ongoing').length}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center">
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <HiOfficeBuilding className="h-6 w-6 text-gray-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Completed</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {bookings.filter(b => getBookingStatus(b).status === 'completed').length}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
} 