'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
// TODO: remove duplicate cookie library from bundle
var js_cookie_1 = __importDefault(require('js-cookie'))
var top_domain_1 = __importDefault(require('@segment/top-domain'))
var events_1 = require('events')
var COOKIE_KEY = 'tracking-preferences'
var COOKIE_DEFAULT_EXPIRES = 365
// TODO: harden against invalid cookies
// TODO: harden against different versions of cookies
function loadPreferences() {
  var preferences = js_cookie_1.default.getJSON(COOKIE_KEY)
  if (!preferences) {
    return {}
  }
  return {
    destinationPreferences: preferences.destinations,
    customPreferences: preferences.custom
  }
}
exports.loadPreferences = loadPreferences
var emitter = new events_1.EventEmitter()
/**
 * Subscribes to consent preferences changing over time and returns
 * a cleanup function that can be invoked to remove the instantiated listener.
 *
 * @param listener a function to be invoked when ConsentPreferences are saved
 */
function onPreferencesSaved(listener) {
  emitter.on('preferencesSaved', listener)
  return function() {
    return emitter.off('preferencesSaved', listener)
  }
}
exports.onPreferencesSaved = onPreferencesSaved
function savePreferences(_a) {
  var destinationPreferences = _a.destinationPreferences,
    customPreferences = _a.customPreferences,
    cookieDomain = _a.cookieDomain,
    cookieExpires = _a.cookieExpires
  var wd = window
  if (wd.analytics) {
    wd.analytics.identify({
      destinationTrackingPreferences: destinationPreferences,
      customTrackingPreferences: customPreferences
    })
  }
  var domain = cookieDomain || top_domain_1.default(window.location.href)
  var expires = cookieExpires || COOKIE_DEFAULT_EXPIRES
  var value = {
    version: 1,
    destinations: destinationPreferences,
    custom: customPreferences
  }
  js_cookie_1.default.set(COOKIE_KEY, value, {
    expires: expires,
    domain: domain
  })
  emitter.emit('preferencesSaved', {
    destinationPreferences: destinationPreferences,
    customPreferences: customPreferences
  })
}
exports.savePreferences = savePreferences
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZmVyZW5jZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29uc2VudC1tYW5hZ2VyLWJ1aWxkZXIvcHJlZmVyZW5jZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvREFBb0Q7QUFDcEQsd0RBQStCO0FBQy9CLG1FQUEyQztBQUUzQyxpQ0FBcUM7QUFFckMsSUFBTSxVQUFVLEdBQUcsc0JBQXNCLENBQUE7QUFDekMsSUFBTSxzQkFBc0IsR0FBRyxHQUFHLENBQUE7QUFRbEMsdUNBQXVDO0FBQ3ZDLHFEQUFxRDtBQUNyRCxTQUFnQixlQUFlO0lBQzdCLElBQU0sV0FBVyxHQUFHLG1CQUFPLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0lBRS9DLElBQUksQ0FBQyxXQUFXLEVBQUU7UUFDaEIsT0FBTyxFQUFFLENBQUE7S0FDVjtJQUVELE9BQU87UUFDTCxzQkFBc0IsRUFBRSxXQUFXLENBQUMsWUFBbUM7UUFDdkUsaUJBQWlCLEVBQUUsV0FBVyxDQUFDLE1BQTZCO0tBQzdELENBQUE7QUFDSCxDQUFDO0FBWEQsMENBV0M7QUFJRCxJQUFNLE9BQU8sR0FBRyxJQUFJLHFCQUFZLEVBQUUsQ0FBQTtBQUVsQzs7Ozs7R0FLRztBQUNILFNBQWdCLGtCQUFrQixDQUFDLFFBQXNDO0lBQ3ZFLE9BQU8sQ0FBQyxFQUFFLENBQUMsa0JBQWtCLEVBQUUsUUFBUSxDQUFDLENBQUE7SUFDeEMsT0FBTyxjQUFNLE9BQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxRQUFRLENBQUMsRUFBekMsQ0FBeUMsQ0FBQTtBQUN4RCxDQUFDO0FBSEQsZ0RBR0M7QUFFRCxTQUFnQixlQUFlLENBQUMsRUFLZDtRQUpoQixrREFBc0IsRUFDdEIsd0NBQWlCLEVBQ2pCLDhCQUFZLEVBQ1osZ0NBQWE7SUFFYixJQUFNLEVBQUUsR0FBRyxNQUF1QixDQUFBO0lBQ2xDLElBQUksRUFBRSxDQUFDLFNBQVMsRUFBRTtRQUNoQixFQUFFLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztZQUNwQiw4QkFBOEIsRUFBRSxzQkFBc0I7WUFDdEQseUJBQXlCLEVBQUUsaUJBQWlCO1NBQzdDLENBQUMsQ0FBQTtLQUNIO0lBRUQsSUFBTSxNQUFNLEdBQUcsWUFBWSxJQUFJLG9CQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUM5RCxJQUFNLE9BQU8sR0FBRyxhQUFhLElBQUksc0JBQXNCLENBQUE7SUFDdkQsSUFBTSxLQUFLLEdBQUc7UUFDWixPQUFPLEVBQUUsQ0FBQztRQUNWLFlBQVksRUFBRSxzQkFBc0I7UUFDcEMsTUFBTSxFQUFFLGlCQUFpQjtLQUMxQixDQUFBO0lBRUQsbUJBQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLEtBQUssRUFBRTtRQUM3QixPQUFPLFNBQUE7UUFDUCxNQUFNLFFBQUE7S0FDUCxDQUFDLENBQUE7SUFFRixPQUFPLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFO1FBQy9CLHNCQUFzQix3QkFBQTtRQUN0QixpQkFBaUIsbUJBQUE7S0FDbEIsQ0FBQyxDQUFBO0FBQ0osQ0FBQztBQS9CRCwwQ0ErQkMifQ==
