/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 **/
import { Server } from 'hapi';
import { environment } from './environments/environment';
const H2o2 = require('@hapi/h2o2');

const init = async () => {
  const server = new Server({
    port: 3333,
    host: 'localhost',
    routes: {
      cors: {
        origin: ["*"],
        headers: ["Accept", "Content-Type"]
      }
    }
  });

  await server.register(H2o2);

  const cacheExpireTime = 24 * 60 * 60 * 1000;

  server.route({
    method: 'GET',
    path: '/beta/stock/{symbol}/chart/{period}',
    handler: {
      proxy: {
        mapUri: function(request: any){
          return {
            uri: environment.apiURL+'/beta/stock/'+request.params.symbol+'/chart/'+request.params.period+'?token='+environment.apiKey
          }
        },
        onResponse: function(err, res){
          return res;
        },
        passThrough: true,
        xforward: true
      }
    },
    options: {
      cache: {
        expiresIn: cacheExpireTime
      }
    }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();
