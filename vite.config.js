import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
	server: {
		proxy: {
			"/api": {
				target: import.meta.env.VITE_API_URL || "http://localhost:4000",
				secure: false // change to true when Prod
			}
		}
	},
	plugins: [react()],
});
