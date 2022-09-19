const { defineConfig } = require("cypress");

module.exports = defineConfig({
	e2e: {
		baseUrl: 'http://localhost:8003',
		setupNodeEvents(on, config) {
			// implement node event listeners here
		},
	},
});
