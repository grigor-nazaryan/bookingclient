import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashSettings from '../components/DashSettings';
import DashOverview from '../components/DashOverview';
import DashMeetingRooms from '../components/DashMeetingRooms';
import DashMyBookings from '../components/DashMyBookings';
import DashManageRooms from '../components/DashManageRooms';
import DashAllBookings from '../components/DashAllBookings';

const Dashboard = () => {
	const location = useLocation();
	const [tab, setTab] = useState('overview');

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const tabFromUrl = urlParams.get('tab');
		if (tabFromUrl) {
			setTab(tabFromUrl);
		} else {
			setTab('overview');
		}
	}, [location.search]);

	return (
		<div className='min-h-screen flex flex-col md:flex-row'>
			<div className='md:w-48'>
				<DashSidebar />
			</div>
			<div className='flex-1'>
				{tab === 'overview' && <DashOverview />}
				{tab === 'meeting-rooms' && <DashMeetingRooms />}
				{tab === 'my-bookings' && <DashMyBookings />}
				{tab === 'manage-rooms' && <DashManageRooms />}
				{tab === 'all-bookings' && <DashAllBookings />}
				{tab === 'settings' && <DashSettings />}
			</div>
		</div>
	);
}

export default Dashboard;