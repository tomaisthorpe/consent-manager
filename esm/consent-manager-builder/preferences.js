// TODO: remove duplicate cookie library from bundle
import cookies from 'js-cookie'
import topDomain from '@segment/top-domain'
import { EventEmitter } from 'events'
var COOKIE_KEY = 'tracking-preferences'
var COOKIE_DEFAULT_EXPIRES = 365
// TODO: harden against invalid cookies
// TODO: harden against different versions of cookies
export function loadPreferences() {
  var preferences = cookies.getJSON(COOKIE_KEY)
  if (!preferences) {
    return {}
  }
  return {
    destinationPreferences: preferences.destinations,
    customPreferences: preferences.custom
  }
}
var emitter = new EventEmitter()
/**
 * Subscribes to consent preferences changing over time and returns
 * a cleanup function that can be invoked to remove the instantiated listener.
 *
 * @param listener a function to be invoked when ConsentPreferences are saved
 */
export function onPreferencesSaved(listener) {
  emitter.on('preferencesSaved', listener)
  return function() {
    return emitter.off('preferencesSaved', listener)
  }
}
export function savePreferences(_a) {
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
  var domain = cookieDomain || topDomain(window.location.href)
  var expires = cookieExpires || COOKIE_DEFAULT_EXPIRES
  var value = {
    version: 1,
    destinations: destinationPreferences,
    custom: customPreferences
  }
  cookies.set(COOKIE_KEY, value, {
    expires: expires,
    domain: domain
  })
  emitter.emit('preferencesSaved', {
    destinationPreferences: destinationPreferences,
    customPreferences: customPreferences
  })
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZmVyZW5jZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29uc2VudC1tYW5hZ2VyLWJ1aWxkZXIvcHJlZmVyZW5jZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsb0RBQW9EO0FBQ3BELE9BQU8sT0FBTyxNQUFNLFdBQVcsQ0FBQTtBQUMvQixPQUFPLFNBQVMsTUFBTSxxQkFBcUIsQ0FBQTtBQUUzQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sUUFBUSxDQUFBO0FBRXJDLElBQU0sVUFBVSxHQUFHLHNCQUFzQixDQUFBO0FBQ3pDLElBQU0sc0JBQXNCLEdBQUcsR0FBRyxDQUFBO0FBUWxDLHVDQUF1QztBQUN2QyxxREFBcUQ7QUFDckQsTUFBTSxVQUFVLGVBQWU7SUFDN0IsSUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQTtJQUUvQyxJQUFJLENBQUMsV0FBVyxFQUFFO1FBQ2hCLE9BQU8sRUFBRSxDQUFBO0tBQ1Y7SUFFRCxPQUFPO1FBQ0wsc0JBQXNCLEVBQUUsV0FBVyxDQUFDLFlBQW1DO1FBQ3ZFLGlCQUFpQixFQUFFLFdBQVcsQ0FBQyxNQUE2QjtLQUM3RCxDQUFBO0FBQ0gsQ0FBQztBQUlELElBQU0sT0FBTyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUE7QUFFbEM7Ozs7O0dBS0c7QUFDSCxNQUFNLFVBQVUsa0JBQWtCLENBQUMsUUFBc0M7SUFDdkUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxRQUFRLENBQUMsQ0FBQTtJQUN4QyxPQUFPLGNBQU0sT0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLFFBQVEsQ0FBQyxFQUF6QyxDQUF5QyxDQUFBO0FBQ3hELENBQUM7QUFFRCxNQUFNLFVBQVUsZUFBZSxDQUFDLEVBS2Q7UUFKaEIsa0RBQXNCLEVBQ3RCLHdDQUFpQixFQUNqQiw4QkFBWSxFQUNaLGdDQUFhO0lBRWIsSUFBTSxFQUFFLEdBQUcsTUFBdUIsQ0FBQTtJQUNsQyxJQUFJLEVBQUUsQ0FBQyxTQUFTLEVBQUU7UUFDaEIsRUFBRSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUM7WUFDcEIsOEJBQThCLEVBQUUsc0JBQXNCO1lBQ3RELHlCQUF5QixFQUFFLGlCQUFpQjtTQUM3QyxDQUFDLENBQUE7S0FDSDtJQUVELElBQU0sTUFBTSxHQUFHLFlBQVksSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUM5RCxJQUFNLE9BQU8sR0FBRyxhQUFhLElBQUksc0JBQXNCLENBQUE7SUFDdkQsSUFBTSxLQUFLLEdBQUc7UUFDWixPQUFPLEVBQUUsQ0FBQztRQUNWLFlBQVksRUFBRSxzQkFBc0I7UUFDcEMsTUFBTSxFQUFFLGlCQUFpQjtLQUMxQixDQUFBO0lBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsS0FBSyxFQUFFO1FBQzdCLE9BQU8sU0FBQTtRQUNQLE1BQU0sUUFBQTtLQUNQLENBQUMsQ0FBQTtJQUVGLE9BQU8sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUU7UUFDL0Isc0JBQXNCLHdCQUFBO1FBQ3RCLGlCQUFpQixtQkFBQTtLQUNsQixDQUFDLENBQUE7QUFDSixDQUFDIn0=
