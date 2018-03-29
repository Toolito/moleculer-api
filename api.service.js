let APIGatewayService = require("moleculer-web");
const {MoleculerError} = require('moleculer').Errors;

module.exports = {
    mixins: APIGatewayService,
    settings: {
        routes: [{
            aliases: {
				"REST todos": "todos",
				// etc. declare other RESTFUL services
				// "REST recipes": "recipes"
			},
			// Disable direct URLs (`/posts/find` or `/posts.find`)
			mappingPolicy: "restrict"
        }]
    },
	// actions are declared in todos.service
	events: {
		"echo.event"(data, sender) {
			this.logger.info(`<< MATH: Echo event received from ${sender}. Counter: ${data.counter}. Send reply...`);
			this.broker.emit("reply.event", data);
		}
	}
};