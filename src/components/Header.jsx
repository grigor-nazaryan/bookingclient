import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import avatarsConfig from "../helpers/avatarsConfig";
import { signoutSuccess } from "../redux/user/userSlice";
import axios from "../api/axios";

export default function Header() {
	const path = useLocation().pathname;
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { currentUser, token } = useSelector((state) => state.user);

	const handleSignout = async () => {
		try {
			console.log("token: ", token);

			const res = await axios.post('/api/auth/logout', {});

			console.log("res: ", res);
			const data = res.data;

			if (data.status !== 200) {
				console.log(data.message);
			} else {
				dispatch(signoutSuccess());
				navigate("/");
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<Navbar className="border-b-2 sticky top-0 z-50">
			<Link to={currentUser && path !== "/" ? "/dashboard" : "/"} className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white">
				<span className="px-2 py-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-lg text-white">
					Booking
				</span>
				Hub
			</Link>

			{!currentUser || path === "/" && (
				<div className="flex gap-2 md:order-1 ml-auto mr-16">
					<Navbar.Collapse>
					</Navbar.Collapse>
				</div>
			)
			}

			<div className="flex gap-2 md:order-2">
				{currentUser ? (
					path === "/" ? (
						<Link to="/dashboard">
							<Button gradientDuoTone="purpleToBlue">Dashboard</Button>
						</Link>
					) : (
						<Dropdown
							arrowIcon={true}
							inline
							label={
								<div
									className="rounded-full flex items-center justify-center"
									style={{
										background: `linear-gradient(${avatarsConfig[currentUser.email[0].toUpperCase()].join(', ')})`,
										width: '40px',
										height: '40px',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontFamily: 'Comic Sans MS',
										fontSize: '18px',
										fontWeight: 'bold',
										color: 'black',
										border: '2px solid black',
									}}
								>
									{`${currentUser.email[0].toUpperCase()}`}
								</div>
							}
						>
							<Dropdown.Header>
								<span className="block text-sm font-medium truncate">{currentUser.email}</span>
							</Dropdown.Header>
							<Link to={"/dashboard?tab=settings"}>
								<Dropdown.Item>Settings</Dropdown.Item>
							</Link>
							<Dropdown.Divider />
							<Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
						</Dropdown>
					)
				) : (
					<>
						<Link to="/login">
							<Button gradientDuoTone="purpleToBlue">Login</Button>
						</Link>
						<Link to="/sign-up">
							<Button gradientDuoTone="purpleToBlue">Sign Up</Button>
						</Link>
					</>
				)}
				<Navbar.Toggle />
			</div>

		</Navbar >
	);
}
