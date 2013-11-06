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

module.exports.adapters = {
  'default': 'mongo',

  // sails v.0.9.0
  mongo: {
    module   : 'sails-mongo',
    host     : 'localhost',
    port     : 27017,
    user     : 'username',
    password : 'password',
    database : 'your mongo db name here'

    // OR
    module   : 'sails-mongo',
    url      : 'mongodb://USER:PASSWORD@HOST:PORT/DB'
  }

  // sails v.0.8.x
  mongo: {
    module   : 'sails-mongo',
    url      : 'mongodb://USER:PASSWORD@HOST:PORT/DB'
  }
};