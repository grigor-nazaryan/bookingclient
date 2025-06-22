import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";


export default defineConfig({
	server: {
		proxy: {
			"/api": {
				target: "https://bookingserver-096g.onrender.com",
				secure: true
			}
		}
	},
	plugins: [react()],
});
