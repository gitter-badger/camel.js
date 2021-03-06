var fileComponent = require('../components/fileComponent.js');
var cloneTracker = require('../cloneHelper/cloneTracker');

var camelCallback;

var processFunction = function(err, route) {

  if(err) {
    camelCallBack(err);
  } else {

    var currentEndpoint = route.getNextEndpoint();

    if(currentEndpoint !== undefined) {

      if(fileComponent.isFileEndpoint(currentEndpoint)) {

        if(!route.hasStarted) {

          route.hasStarted = true;

          fileComponent.from(currentEndpoint, route, processFunction);

        } else {

          fileComponent.to(currentEndpoint, route, processFunction);

        }

      } else {
        throw new Error("Endpoint "+currentEndpoint+" is not supported");
      }

    } else {

      cloneTracker.finishRoute(route.id);

      if(cloneTracker.allClonesFinished(route.id)) {
        camelCallBack(undefined);
      }

    }
  }

};

exports.process = function (route, callback) {
  camelCallBack = callback;
  processFunction(undefined, route);
};
