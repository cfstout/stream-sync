// global initializers
var $initializers = {
    soundcloud: {
        isReady: false,
        queue: []
    },
    youtube: {
        isReady: false,
        queue: []
    },
    phonegap: {
        isReady: false,
        queue: []
    },
    onReadyApply: function(service) {
        service.isReady = true;
        service.queue.forEach(function(fn) {
            fn.func.apply(null, fn.args);
        });
    },
    doWhenReadyApply: function(service, fn, args) {
        if (typeof args === 'undefined') {
            args = [];
        } else if(Object.prototype.toString.call(args) !== '[object Array]') {
            args = [args];
        }
        if (service.isReady) {
            fn.apply(null, args);
        } else {
            service.queue.push({
                func: fn,
                args: args
            });
        }
    }
};

// phonegap
function phonegapReady() {
    $initializers.onReadyApply($initializers.phonegap);
}

document.addEventListener('deviceready', phonegapReady, false);  

// youtube
function onYouTubeIframeAPIReady() {
    $initializers.onReadyApply($initializers.youtube);
}