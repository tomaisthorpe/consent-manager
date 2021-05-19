'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
var sinon_1 = __importDefault(require('sinon'))
var analytics_1 = __importDefault(require('../../consent-manager-builder/analytics'))
describe('analytics', function() {
  var wd
  beforeEach(function() {
    window = {}
    wd = window
    wd.analytics = {
      track: function(_event, _properties, _optionsWithConsent, _callback) {},
      addSourceMiddleware: function(_middleware) {}
    }
  })
  test('loads analytics.js with preferences', function() {
    var ajsLoad = sinon_1.default.spy()
    wd.analytics.load = ajsLoad
    var writeKey = '123'
    var destinations = [{ id: 'Amplitude' }]
    var destinationPreferences = {
      Amplitude: true
    }
    analytics_1.default({
      writeKey: writeKey,
      destinations: destinations,
      destinationPreferences: destinationPreferences,
      isConsentRequired: true,
      categoryPreferences: {}
    })
    expect(ajsLoad.calledOnce).toBe(true)
    expect(ajsLoad.args[0][0]).toBe(writeKey)
    expect(ajsLoad.args[0][1]).toMatchObject({
      integrations: {
        All: false,
        Amplitude: true,
        'Segment.io': true
      }
    })
  })
  test('doesn՚t load analytics.js when there are no preferences', function() {
    var ajsLoad = sinon_1.default.spy()
    wd.analytics.load = ajsLoad
    var writeKey = '123'
    var destinations = [{ id: 'Amplitude' }]
    var destinationPreferences = null
    analytics_1.default({
      writeKey: writeKey,
      destinations: destinations,
      destinationPreferences: destinationPreferences,
      isConsentRequired: true,
      categoryPreferences: {}
    })
    expect(ajsLoad.notCalled).toBe(true)
  })
  test('doesn՚t load analytics.js when all preferences are false', function() {
    var ajsLoad = sinon_1.default.spy()
    wd.analytics.load = ajsLoad
    var writeKey = '123'
    var destinations = [{ id: 'Amplitude' }]
    var destinationPreferences = {
      Amplitude: false
    }
    analytics_1.default({
      writeKey: writeKey,
      destinations: destinations,
      destinationPreferences: destinationPreferences,
      isConsentRequired: true,
      categoryPreferences: {}
    })
    expect(ajsLoad.notCalled).toBe(true)
  })
  test('reloads the page when analytics.js has already been initialised', function() {
    wd.analytics.load = function load() {
      this.initialized = true
    }
    jest.spyOn(window.location, 'reload')
    var writeKey = '123'
    var destinations = [{ id: 'Amplitude' }]
    var destinationPreferences = {
      Amplitude: true
    }
    analytics_1.default({
      writeKey: writeKey,
      destinations: destinations,
      destinationPreferences: destinationPreferences,
      isConsentRequired: true,
      categoryPreferences: {}
    })
    analytics_1.default({
      writeKey: writeKey,
      destinations: destinations,
      destinationPreferences: destinationPreferences,
      isConsentRequired: true,
      categoryPreferences: {}
    })
    expect(window.location.reload).toHaveBeenCalled()
  })
  test('should allow the reload behvaiour to be disabled', function() {
    var reload = sinon_1.default.spy()
    wd.analytics.load = function load() {
      this.initialized = true
    }
    wd.location = { reload: reload }
    var writeKey = '123'
    var destinations = [{ id: 'Amplitude' }]
    var destinationPreferences = {
      Amplitude: true
    }
    analytics_1.default({
      writeKey: writeKey,
      destinations: destinations,
      destinationPreferences: destinationPreferences,
      isConsentRequired: true,
      categoryPreferences: {}
    })
    analytics_1.default({
      writeKey: writeKey,
      destinations: destinations,
      destinationPreferences: destinationPreferences,
      isConsentRequired: true,
      shouldReload: false,
      categoryPreferences: {}
    })
    expect(reload.calledOnce).toBe(false)
  })
  test('loads analytics.js normally when consent isn՚t required', function() {
    var ajsLoad = sinon_1.default.spy()
    wd.analytics.load = ajsLoad
    var writeKey = '123'
    var destinations = [{ id: 'Amplitude' }]
    var destinationPreferences = null
    analytics_1.default({
      writeKey: writeKey,
      destinations: destinations,
      destinationPreferences: destinationPreferences,
      isConsentRequired: false,
      categoryPreferences: {}
    })
    expect(ajsLoad.calledOnce).toBe(true)
    expect(ajsLoad.args[0][0]).toBe(writeKey)
    expect(ajsLoad.args[0][1]).toBeUndefined()
  })
  test('still applies preferences when consent isn՚t required', function() {
    var ajsLoad = sinon_1.default.spy()
    wd.analytics.load = ajsLoad
    var writeKey = '123'
    var destinations = [{ id: 'Amplitude' }]
    var destinationPreferences = {
      Amplitude: true
    }
    analytics_1.default({
      writeKey: writeKey,
      destinations: destinations,
      destinationPreferences: destinationPreferences,
      isConsentRequired: false,
      categoryPreferences: {}
    })
    expect(ajsLoad.calledOnce).toBe(true)
    expect(ajsLoad.args[0][0]).toBe(writeKey)
    expect(ajsLoad.args[0][1]).toMatchObject({
      integrations: {
        All: false,
        Amplitude: true,
        'Segment.io': true
      }
    })
  })
  test('sets new destinations to false if defaultDestinationBehavior is set to "disable"', function() {
    var ajsLoad = sinon_1.default.spy()
    wd.analytics.load = ajsLoad
    var writeKey = '123'
    var destinations = [{ id: 'Amplitude' }, { id: 'Google Analytics' }]
    var destinationPreferences = {
      Amplitude: true
    }
    analytics_1.default({
      writeKey: writeKey,
      destinations: destinations,
      destinationPreferences: destinationPreferences,
      isConsentRequired: false,
      shouldReload: true,
      defaultDestinationBehavior: 'disable',
      categoryPreferences: {}
    })
    expect(ajsLoad.args[0][1]).toMatchObject({
      integrations: {
        All: false,
        Amplitude: true,
        'Google Analytics': false,
        'Segment.io': true
      }
    })
  })
  test('sets new destinations to true if defaultDestinationBehavior is set to "enable"', function() {
    var ajsLoad = sinon_1.default.spy()
    wd.analytics.load = ajsLoad
    var writeKey = '123'
    var destinations = [{ id: 'Amplitude' }, { id: 'Google Analytics' }]
    var destinationPreferences = {
      Amplitude: true
    }
    analytics_1.default({
      writeKey: writeKey,
      destinations: destinations,
      destinationPreferences: destinationPreferences,
      isConsentRequired: false,
      shouldReload: true,
      defaultDestinationBehavior: 'enable',
      categoryPreferences: {}
    })
    expect(ajsLoad.args[0][1]).toMatchObject({
      integrations: {
        All: false,
        Amplitude: true,
        'Google Analytics': true,
        'Segment.io': true
      }
    })
  })
})
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5hbHl0aWNzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvX190ZXN0c19fL2NvbnNlbnQtbWFuYWdlci1idWlsZGVyL2FuYWx5dGljcy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsZ0RBQXlCO0FBRXpCLHNGQUFnRjtBQUVoRixRQUFRLENBQUMsV0FBVyxFQUFFO0lBQ3BCLElBQUksRUFBRSxDQUFBO0lBRU4sVUFBVSxDQUFDO1FBQ1QsTUFBTSxHQUFHLEVBQW1CLENBQUE7UUFDNUIsRUFBRSxHQUFHLE1BQU0sQ0FBQTtRQUNYLEVBQUUsQ0FBQyxTQUFTLEdBQUc7WUFDYixLQUFLLEVBQUUsVUFBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLG1CQUFtQixFQUFFLFNBQVMsSUFBTSxDQUFDO1lBQ2xFLG1CQUFtQixFQUFFLFVBQUMsV0FBdUIsSUFBTSxDQUFDO1NBQ3JELENBQUE7SUFDSCxDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUksQ0FBQyxxQ0FBcUMsRUFBRTtRQUMxQyxJQUFNLE9BQU8sR0FBRyxlQUFLLENBQUMsR0FBRyxFQUFFLENBQUE7UUFDM0IsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFBO1FBQzNCLElBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQTtRQUN0QixJQUFNLFlBQVksR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLFdBQVcsRUFBaUIsQ0FBQyxDQUFBO1FBQ3pELElBQU0sc0JBQXNCLEdBQUc7WUFDN0IsU0FBUyxFQUFFLElBQUk7U0FDaEIsQ0FBQTtRQUVELG1CQUEwQixDQUFDO1lBQ3pCLFFBQVEsVUFBQTtZQUNSLFlBQVksY0FBQTtZQUNaLHNCQUFzQix3QkFBQTtZQUN0QixpQkFBaUIsRUFBRSxJQUFJO1lBQ3ZCLG1CQUFtQixFQUFFLEVBQUU7U0FDeEIsQ0FBQyxDQUFBO1FBRUYsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDckMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDekMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUM7WUFDdkMsWUFBWSxFQUFFO2dCQUNaLEdBQUcsRUFBRSxLQUFLO2dCQUNWLFNBQVMsRUFBRSxJQUFJO2dCQUNmLFlBQVksRUFBRSxJQUFJO2FBQ25CO1NBQ0YsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixJQUFJLENBQUMseURBQXlELEVBQUU7UUFDOUQsSUFBTSxPQUFPLEdBQUcsZUFBSyxDQUFDLEdBQUcsRUFBRSxDQUFBO1FBQzNCLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQTtRQUMzQixJQUFNLFFBQVEsR0FBRyxLQUFLLENBQUE7UUFDdEIsSUFBTSxZQUFZLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxXQUFXLEVBQWlCLENBQUMsQ0FBQTtRQUN6RCxJQUFNLHNCQUFzQixHQUFHLElBQUksQ0FBQTtRQUVuQyxtQkFBMEIsQ0FBQztZQUN6QixRQUFRLFVBQUE7WUFDUixZQUFZLGNBQUE7WUFDWixzQkFBc0Isd0JBQUE7WUFDdEIsaUJBQWlCLEVBQUUsSUFBSTtZQUN2QixtQkFBbUIsRUFBRSxFQUFFO1NBQ3hCLENBQUMsQ0FBQTtRQUVGLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3RDLENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBSSxDQUFDLDBEQUEwRCxFQUFFO1FBQy9ELElBQU0sT0FBTyxHQUFHLGVBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQTtRQUMzQixFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUE7UUFDM0IsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFBO1FBQ3RCLElBQU0sWUFBWSxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsV0FBVyxFQUFpQixDQUFDLENBQUE7UUFDekQsSUFBTSxzQkFBc0IsR0FBRztZQUM3QixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFBO1FBRUQsbUJBQTBCLENBQUM7WUFDekIsUUFBUSxVQUFBO1lBQ1IsWUFBWSxjQUFBO1lBQ1osc0JBQXNCLHdCQUFBO1lBQ3RCLGlCQUFpQixFQUFFLElBQUk7WUFDdkIsbUJBQW1CLEVBQUUsRUFBRTtTQUN4QixDQUFDLENBQUE7UUFFRixNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUN0QyxDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUksQ0FBQyxpRUFBaUUsRUFBRTtRQUN0RSxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxTQUFTLElBQUk7WUFDL0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUE7UUFDekIsQ0FBQyxDQUFBO1FBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFBO1FBRXJDLElBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQTtRQUN0QixJQUFNLFlBQVksR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLFdBQVcsRUFBaUIsQ0FBQyxDQUFBO1FBQ3pELElBQU0sc0JBQXNCLEdBQUc7WUFDN0IsU0FBUyxFQUFFLElBQUk7U0FDaEIsQ0FBQTtRQUVELG1CQUEwQixDQUFDO1lBQ3pCLFFBQVEsVUFBQTtZQUNSLFlBQVksY0FBQTtZQUNaLHNCQUFzQix3QkFBQTtZQUN0QixpQkFBaUIsRUFBRSxJQUFJO1lBQ3ZCLG1CQUFtQixFQUFFLEVBQUU7U0FDeEIsQ0FBQyxDQUFBO1FBQ0YsbUJBQTBCLENBQUM7WUFDekIsUUFBUSxVQUFBO1lBQ1IsWUFBWSxjQUFBO1lBQ1osc0JBQXNCLHdCQUFBO1lBQ3RCLGlCQUFpQixFQUFFLElBQUk7WUFDdkIsbUJBQW1CLEVBQUUsRUFBRTtTQUN4QixDQUFDLENBQUE7UUFFRixNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO0lBQ25ELENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBSSxDQUFDLGtEQUFrRCxFQUFFO1FBQ3ZELElBQU0sTUFBTSxHQUFHLGVBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQTtRQUMxQixFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxTQUFTLElBQUk7WUFDL0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUE7UUFDekIsQ0FBQyxDQUFBO1FBQ0QsRUFBRSxDQUFDLFFBQVEsR0FBRyxFQUFFLE1BQU0sUUFBQSxFQUFFLENBQUE7UUFDeEIsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFBO1FBQ3RCLElBQU0sWUFBWSxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsV0FBVyxFQUFpQixDQUFDLENBQUE7UUFDekQsSUFBTSxzQkFBc0IsR0FBRztZQUM3QixTQUFTLEVBQUUsSUFBSTtTQUNoQixDQUFBO1FBRUQsbUJBQTBCLENBQUM7WUFDekIsUUFBUSxVQUFBO1lBQ1IsWUFBWSxjQUFBO1lBQ1osc0JBQXNCLHdCQUFBO1lBQ3RCLGlCQUFpQixFQUFFLElBQUk7WUFDdkIsbUJBQW1CLEVBQUUsRUFBRTtTQUN4QixDQUFDLENBQUE7UUFDRixtQkFBMEIsQ0FBQztZQUN6QixRQUFRLFVBQUE7WUFDUixZQUFZLGNBQUE7WUFDWixzQkFBc0Isd0JBQUE7WUFDdEIsaUJBQWlCLEVBQUUsSUFBSTtZQUN2QixZQUFZLEVBQUUsS0FBSztZQUNuQixtQkFBbUIsRUFBRSxFQUFFO1NBQ3hCLENBQUMsQ0FBQTtRQUVGLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ3ZDLENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBSSxDQUFDLHlEQUF5RCxFQUFFO1FBQzlELElBQU0sT0FBTyxHQUFHLGVBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQTtRQUMzQixFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUE7UUFDM0IsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFBO1FBQ3RCLElBQU0sWUFBWSxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsV0FBVyxFQUFpQixDQUFDLENBQUE7UUFDekQsSUFBTSxzQkFBc0IsR0FBRyxJQUFJLENBQUE7UUFFbkMsbUJBQTBCLENBQUM7WUFDekIsUUFBUSxVQUFBO1lBQ1IsWUFBWSxjQUFBO1lBQ1osc0JBQXNCLHdCQUFBO1lBQ3RCLGlCQUFpQixFQUFFLEtBQUs7WUFDeEIsbUJBQW1CLEVBQUUsRUFBRTtTQUN4QixDQUFDLENBQUE7UUFFRixNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNyQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUN6QyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFBO0lBQzVDLENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBSSxDQUFDLHVEQUF1RCxFQUFFO1FBQzVELElBQU0sT0FBTyxHQUFHLGVBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQTtRQUMzQixFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUE7UUFDM0IsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFBO1FBQ3RCLElBQU0sWUFBWSxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsV0FBVyxFQUFpQixDQUFDLENBQUE7UUFDekQsSUFBTSxzQkFBc0IsR0FBRztZQUM3QixTQUFTLEVBQUUsSUFBSTtTQUNoQixDQUFBO1FBRUQsbUJBQTBCLENBQUM7WUFDekIsUUFBUSxVQUFBO1lBQ1IsWUFBWSxjQUFBO1lBQ1osc0JBQXNCLHdCQUFBO1lBQ3RCLGlCQUFpQixFQUFFLEtBQUs7WUFDeEIsbUJBQW1CLEVBQUUsRUFBRTtTQUN4QixDQUFDLENBQUE7UUFFRixNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNyQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUN6QyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQztZQUN2QyxZQUFZLEVBQUU7Z0JBQ1osR0FBRyxFQUFFLEtBQUs7Z0JBQ1YsU0FBUyxFQUFFLElBQUk7Z0JBQ2YsWUFBWSxFQUFFLElBQUk7YUFDbkI7U0FDRixDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUksQ0FBQyxrRkFBa0YsRUFBRTtRQUN2RixJQUFNLE9BQU8sR0FBRyxlQUFLLENBQUMsR0FBRyxFQUFFLENBQUE7UUFDM0IsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFBO1FBQzNCLElBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQTtRQUN0QixJQUFNLFlBQVksR0FBRztZQUNuQixFQUFFLEVBQUUsRUFBRSxXQUFXLEVBQWlCO1lBQ2xDLEVBQUUsRUFBRSxFQUFFLGtCQUFrQixFQUFpQjtTQUMxQyxDQUFBO1FBQ0QsSUFBTSxzQkFBc0IsR0FBRztZQUM3QixTQUFTLEVBQUUsSUFBSTtTQUNoQixDQUFBO1FBRUQsbUJBQTBCLENBQUM7WUFDekIsUUFBUSxVQUFBO1lBQ1IsWUFBWSxjQUFBO1lBQ1osc0JBQXNCLHdCQUFBO1lBQ3RCLGlCQUFpQixFQUFFLEtBQUs7WUFDeEIsWUFBWSxFQUFFLElBQUk7WUFDbEIsMEJBQTBCLEVBQUUsU0FBUztZQUNyQyxtQkFBbUIsRUFBRSxFQUFFO1NBQ3hCLENBQUMsQ0FBQTtRQUVGLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDO1lBQ3ZDLFlBQVksRUFBRTtnQkFDWixHQUFHLEVBQUUsS0FBSztnQkFDVixTQUFTLEVBQUUsSUFBSTtnQkFDZixrQkFBa0IsRUFBRSxLQUFLO2dCQUN6QixZQUFZLEVBQUUsSUFBSTthQUNuQjtTQUNGLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBSSxDQUFDLGdGQUFnRixFQUFFO1FBQ3JGLElBQU0sT0FBTyxHQUFHLGVBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQTtRQUMzQixFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUE7UUFDM0IsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFBO1FBQ3RCLElBQU0sWUFBWSxHQUFHO1lBQ25CLEVBQUUsRUFBRSxFQUFFLFdBQVcsRUFBaUI7WUFDbEMsRUFBRSxFQUFFLEVBQUUsa0JBQWtCLEVBQWlCO1NBQzFDLENBQUE7UUFDRCxJQUFNLHNCQUFzQixHQUFHO1lBQzdCLFNBQVMsRUFBRSxJQUFJO1NBQ2hCLENBQUE7UUFFRCxtQkFBMEIsQ0FBQztZQUN6QixRQUFRLFVBQUE7WUFDUixZQUFZLGNBQUE7WUFDWixzQkFBc0Isd0JBQUE7WUFDdEIsaUJBQWlCLEVBQUUsS0FBSztZQUN4QixZQUFZLEVBQUUsSUFBSTtZQUNsQiwwQkFBMEIsRUFBRSxRQUFRO1lBQ3BDLG1CQUFtQixFQUFFLEVBQUU7U0FDeEIsQ0FBQyxDQUFBO1FBRUYsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUM7WUFDdkMsWUFBWSxFQUFFO2dCQUNaLEdBQUcsRUFBRSxLQUFLO2dCQUNWLFNBQVMsRUFBRSxJQUFJO2dCQUNmLGtCQUFrQixFQUFFLElBQUk7Z0JBQ3hCLFlBQVksRUFBRSxJQUFJO2FBQ25CO1NBQ0YsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSJ9
