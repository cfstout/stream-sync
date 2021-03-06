/** 
* Manages receiving ntp time from the server for synchronization
*/

(function (root) {

  var ntp  = {}
    , offsets = []

  /* Initializes the ntp operator */
  ntp.init = function (options) {
    options = options || {};

    socket.on('ntp:server_sync', function(data) {
      onSync(data);
    });
    setInterval(sync, options.interval || 1000);
  };

  /* finds offset */
  var onSync = function (data) {
    var diff = Date.now() - data.t1 + ((Date.now() - data.t0)/2);

    offsets.unshift(diff);

    if (offsets.length > 10) {
      offsets.pop();
    }
  };

  /* retrieves offset and returns to user */
  ntp.offset = function () {
    var sum = 0;
    for (var i = 0; i < offsets.length; i++)
      sum += offsets[i];

    sum /= offsets.length;
    return sum;
  };

  /* syncs user to server time */
  var sync = function () {
    socket.emit('ntp:client_sync', { t0 : Date.now() });
  };

  // AMD/requirejs
  if (typeof define === 'function' && define.amd) {
    define('ntp', [], function () {
      return ntp;
    });
  } else {
    root.ntp = ntp;
  }

})(window);
