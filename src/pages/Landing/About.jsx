import { Button } from 'flowbite-react'
import About01 from '../../assets/about-01.svg'
import About02 from '../../assets/about-02.svg'
import { Link } from 'react-router-dom'

const About = () => {
    return (
        <div id="about" className="md:px-14 p-4 max-w-s mx-auto space-y-10">
            {/* First Pert */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-40">
                <div className="md:w-1/3">
                    <img src={About01} alt="Room Booking Illustration" />
                </div>

                {/* About Content */}
                <div className="md:w-2/5">
                    <h2 className="md:text-4xl text-2xl font-bold text-primary mb-5 leading-normal">Book a Room for Your Conversations <span className="text-secondary">with Ease</span></h2>
                    <p className="text-tertiary text-base mb-7">
                        Discover the simplicity of booking a room for your important conversations. Our platform offers a seamless experience, ensuring you have the perfect space to connect and collaborate. Whether it's a business meeting or a casual chat, we've got you covered.
                    </p>
                    <Link to="/login">
                        <Button gradientMonochrome="purple">Book Now</Button>
                    </Link>
                </div>
            </div>

            {/* Second Pert */}
            <div className="flex flex-col md:flex-row-reverse justify-center items-center gap-40">
                <div className="md:w-1/3">
                    <img src={About02} alt="Flexible Booking Options" />
                </div>

                {/* About Content */}
                <div className="md:w-2/5">
                    <h2 className="md:text-4xl text-2xl font-bold text-primary mb-5 leading-normal">Flexible Booking Options <span className="text-secondary">to Suit Your Schedule</span></h2>
                    <p className="text-tertiary text-base mb-7">
                        Our booking system is designed to fit your busy lifestyle. Choose from a variety of rooms and time slots that work best for you. Enjoy the convenience of booking at any time, from anywhere, and make the most of your conversations.
                    </p>
                    <Link to="/login">
                        <Button gradientMonochrome="purple">Explore Options</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default About