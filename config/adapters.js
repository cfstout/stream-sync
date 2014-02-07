/**
 * Global adapter config
 * 
 * The `adapters` configuration object lets you create different global "saved settings"
 * that you can mix and match in your models.  The `default` option indicates which 
 * "saved setting" should be used if a model doesn't have an adapter specified.
 *
 * Keep in mind that options you define directly in your model definitions
 * will override these settings.
 *
 * For more information on adapter configuration, check out:
 * http://sailsjs.org/#documentation
 */

var mongoUri = process.env.MONGOLAB_URI ||
                 process.env.MONGOHQ_URL ||
                 'mongodb://heroku:fdecedf5cbea804428ed7433628c19b1@paulo.mongohq.com:10002/app19190792' ||
                 // 'mongodb://localhost/ssdb';
 
  module.exports.adapters = {
    'default': 'mongo',
     mongo: {
       module   : 'sails-mongo',
       url      : mongoUri
    }
  };