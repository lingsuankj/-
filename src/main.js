import {
	createSSRApp
} from "vue";
import App from "./App.vue";
import '../mock/index.js';

// import pinia from "./stores/index.js";
export function createApp() {
	const app = createSSRApp(App);
	// app.use(pinia)
	return {
		app,
	};
}