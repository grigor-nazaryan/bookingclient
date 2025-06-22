import { Sidebar } from 'flowbite-react';
import {
	HiUser,
	HiArrowSmRight,
	HiDocumentText,
	HiOutlineUserGroup,
	HiAnnotation,
	HiChartPie,
	HiOfficeBuilding,
	HiCalendar,
	HiPlusCircle,
} from 'react-icons/hi';
import { IoIosSettings } from "react-icons/io";

import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

export default function DashSidebar() {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { currentUser, token } = useSelector((state) => state.user);

	const [tab, setTab] = useState('');

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const tabFromUrl = urlParams.get('tab');
		if (tabFromUrl) setTab(tabFromUrl)
	}, [location.search]);


	return (
		<Sidebar className='w-full md:w-[192px]'>
			<Sidebar.Items>
				<Sidebar.ItemGroup className='flex flex-col gap-1'>

					<Link to='/dashboard?tab=overview'>
						<Sidebar.Item
							active={tab === 'overview'}
							className={tab === 'overview' ? 'bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300' : 'hover:bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100'}
							icon={HiChartPie}
							as='div'
						>
							Dashboard
						</Sidebar.Item>
					</Link>

					<Link to='/dashboard?tab=meeting-rooms'>
						<Sidebar.Item
							active={tab === 'meeting-rooms'}
							className={tab === 'meeting-rooms' ? 'bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300' : 'hover:bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100'}
							icon={HiOfficeBuilding}
							as='div'
						>
							Meeting Rooms
						</Sidebar.Item>
					</Link>

					<Link to='/dashboard?tab=my-bookings'>
						<Sidebar.Item
							active={tab === 'my-bookings'}
							className={tab === 'my-bookings' ? 'bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300' : 'hover:bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100'}
							icon={HiCalendar}
							as='div'
						>
							My Bookings
						</Sidebar.Item>
					</Link>

					{/* Admin only sections */}
					{currentUser?.role === 'admin' && (
						<>
							<Link to='/dashboard?tab=manage-rooms'>
								<Sidebar.Item
									active={tab === 'manage-rooms'}
									className={tab === 'manage-rooms' ? 'bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300' : 'hover:bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100'}
									icon={HiPlusCircle}
									as='div'
								>
									Manage Rooms
								</Sidebar.Item>
							</Link>

							<Link to='/dashboard?tab=all-bookings'>
								<Sidebar.Item
									active={tab === 'all-bookings'}
									className={tab === 'all-bookings' ? 'bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300' : 'hover:bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100'}
									icon={HiOutlineUserGroup}
									as='div'
								>
									All Bookings
								</Sidebar.Item>
							</Link>
						</>
					)}

					<Link to='/dashboard?tab=settings'>
						<Sidebar.Item
							active={tab === 'settings'}
							className={tab === 'settings' ? 'bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300' : 'hover:bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100'}
							icon={IoIosSettings}
							labelColor='dark'
							as='div'
						>
							Settings
						</Sidebar.Item>
					</Link>
				</Sidebar.ItemGroup>
			</Sidebar.Items>
		</Sidebar >
	);
}