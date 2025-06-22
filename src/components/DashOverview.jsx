import { useState, useEffect } from 'react';
import { Card } from 'flowbite-react';
import { HiOfficeBuilding, HiCalendar, HiClock, HiUsers } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import toast from 'react-hot-toast';

export default function DashOverview() {
    const axiosPrivate = useAxiosPrivate();
    const { currentUser } = useSelector((state) => state.user);
    const [stats, setStats] = useState({
        totalRooms: 0,
        totalBookings: 0,
        myBookings: 0,
        upcomingBookings: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const [roomsResponse, bookingsResponse, myBookingsResponse] = await Promise.all([
                axiosPrivate.get('/api/meeting-rooms'),
                currentUser?.role === 'admin' ? axiosPrivate.get('/api/bookings') : Promise.resolve({ data: { data: [] } }),
                axiosPrivate.get('/api/bookings/my-bookings')
            ]);

            const rooms = roomsResponse.data.data || [];
            const allBookings = bookingsResponse.data.data || [];
            const myBookings = myBookingsResponse.data.data || [];

            const now = new Date();
            const upcomingBookings = myBookings.filter(booking =>
                new Date(booking.startTime) > now
            ).length;

            setStats({
                totalRooms: rooms.length,
                totalBookings: allBookings.length,
                myBookings: myBookings.length,
                upcomingBookings: upcomingBookings
            });
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            toast.error('Failed to load dashboard statistics');
        } finally {
            setLoading(false);
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                <p className="text-gray-600">Welcome back, {currentUser?.email}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <HiOfficeBuilding className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Rooms</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalRooms}</p>
                        </div>
                    </div>
                </Card>

                {currentUser?.role === 'admin' && (
                    <Card>
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <HiCalendar className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                            </div>
                        </div>
                    </Card>
                )}

                <Card>
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <HiUsers className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">My Bookings</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.myBookings}</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <HiClock className="h-6 w-6 text-orange-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Upcoming</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.upcomingBookings}</p>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-1">Book a Meeting Room</h4>
                            <p className="text-sm text-gray-600">Reserve a meeting room for your next meeting</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-1">View My Bookings</h4>
                            <p className="text-sm text-gray-600">Check your upcoming and past bookings</p>
                        </div>
                        {currentUser?.role === 'admin' && (
                            <>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <h4 className="font-medium text-gray-900 mb-1">Manage Rooms</h4>
                                    <p className="text-sm text-gray-600">Add, edit, or remove meeting rooms</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <h4 className="font-medium text-gray-900 mb-1">View All Bookings</h4>
                                    <p className="text-sm text-gray-600">Monitor all bookings across the organization</p>
                                </div>
                            </>
                        )}
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Meeting Rooms Available</span>
                            <span className="text-sm font-medium text-green-600">✓ Active</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Booking System</span>
                            <span className="text-sm font-medium text-green-600">✓ Online</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">User Authentication</span>
                            <span className="text-sm font-medium text-green-600">✓ Secure</span>
                        </div>
                        {currentUser?.role === 'admin' && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Admin Panel</span>
                                <span className="text-sm font-medium text-green-600">✓ Accessible</span>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
} 