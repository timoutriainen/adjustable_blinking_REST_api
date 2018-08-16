
const restify = require('restify');
const restifyPlugins = require('restify-plugins');


const server = restify.createServer({
	name: 'server1',
	version: 1,
});

server.use(restifyPlugins.jsonBodyParser({ mapParams: true }));
server.use(restifyPlugins.acceptParser(server.acceptable));
server.use(restifyPlugins.queryParser({ mapParams: true }));
server.use(restifyPlugins.fullResponse());

/**
  * Start Server
  */
server.listen(3000, () => {
    require('./routes/routes')(server);
	console.log(`Server is listening on port 3000`);
});
