let { ServiceBroker } = require("moleculer");
let ApiService = require("./api.service");
let broker = new ServiceBroker({ logger: console });

// Load other services
broker.loadService('./services/todos.service');

// Load API Gateway
broker.createService(ApiService);

// Start server
broker.start();