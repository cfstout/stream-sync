/**
 * Global adapter config
 * 
 * Stream Sync uses a mongo database configuration
 * The configuration details are below
 */

var mongoUri = process.env.MONGOLAB_URI ||
                 process.env.MONGOHQ_URL ||
                 // 'mongodb://heroku:fdecedf5cbea804428ed7433628c19b1@paulo.mongohq.com:10002/app19190792' ||
                 'mongodb://localhost/ssdb';
 
  module.exports.adapters = {
    'default': 'mongo',
     mongo: {
       module   : 'sails-mongo',
       url      : mongoUri
    }
  };