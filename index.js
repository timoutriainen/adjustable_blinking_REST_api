const restify = require('restify');
const restifyPlugins = require('restify-plugins');
const routes = require('./routes');

const server = restify.createServer({
	name: 'adjustable_blinking_REST_api',
	version: '1.0.0',
});

server.use(restifyPlugins.jsonBodyParser({ mapParams: true }));
server.use(restifyPlugins.acceptParser(server.acceptable));
server.use(restifyPlugins.queryParser({ mapParams: true }));
server.use(restifyPlugins.fullResponse());

routes(server);

const port = 3000;
server.listen(port, () => {
  //require('./routes/blink')(server);
	console.log(`${server.name} is listening on ${server.url}`);
});
