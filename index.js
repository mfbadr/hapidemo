/**
 * Created by mikeybadr on 11/17/14.
 */

var Hapi = require('hapi'),
    Joi  = require('joi'),
    port = process.env.PORT,
    server = new Hapi.Server(port);

//make a route in hapi with server.route

server.route({
    config: {
        description: 'this is the home page route',
        notes: 'these are some awesome notes',
        tags: ['home', 'a', 'b']
    },
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hello, world!');
    }
});

server.route({
    config: {
        validate: {
            params: {
                name: Joi.string().min(3).max(10)
            },
            query: {
                limit: Joi.number().required().min(3)
            }

        }
    },
    method: 'GET',
    path: '/{name}',
    handler: function (request, reply) {
        reply('Hello, ' + (request.params.name) + '!' + request.query.limit);
    }
});

server.route({
    method: 'GET',
    path: '/static/{param*}',
    handler: {
        directory: {
            path: 'public'
        }
    }
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});


server.pack.register(

    [
        {
            plugin: require('good'),
            options: {
                reporters: [{
                    reporter: require('good-console'),
                    args: [{log: '*', request: '*'}]
                }]
            }
        },
        {
            plugin: require('lout')
        }
    ], function (err) {
    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.start(function () {
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});

