import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";


export default defineConfig({
	server: {
		proxy: {
			"/api": {
				target: process.env.VITE_API_URL || "http://localhost:4000",
				secure: process.env.NODE_ENV === 'production'
			}
		}
	},
	plugins: [react()],
});
