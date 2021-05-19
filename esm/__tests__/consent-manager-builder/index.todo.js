import React from 'react'
import { shallow } from 'enzyme'
import nock from 'nock'
import sinon from 'sinon'
import ConsentManagerBuilder from '../../consent-manager-builder'
import { ADVERTISING_CATEGORIES, FUNCTIONAL_CATEGORIES } from '../../consent-manager/categories'
describe('ConsentManagerBuilder', function() {
  beforeEach(function() {
    document = {}
    window = {}
  })
  test.todo('doesn՚t load analytics.js when consent is required')
  test('provides a list of enabled destinations', function(done) {
    nock('https://cdn.segment.com')
      .get('/v1/projects/123/integrations')
      .reply(200, [
        {
          name: 'Google Analytics',
          creationName: 'Google Analytics'
        },
        {
          name: 'Amplitude',
          creationName: 'Amplitude'
        }
      ])
      .get('/v1/projects/abc/integrations')
      .reply(200, [
        {
          name: 'FullStory',
          creationName: 'FullStory'
        }
      ])
    shallow(
      React.createElement(
        ConsentManagerBuilder,
        { writeKey: '123', otherWriteKeys: ['abc'] },
        function(_a) {
          var destinations = _a.destinations
          expect(destinations).toMatchObject([
            {
              id: 'Amplitude',
              name: 'Amplitude'
            },
            {
              id: 'FullStory',
              name: 'FullStory'
            },
            {
              id: 'Google Analytics',
              name: 'Google Analytics'
            }
          ])
          done()
        }
      )
    )
  })
  test('provides a list of newly added destinations', function(done) {
    document.cookie =
      'tracking-preferences={%22version%22:1%2C%22destinations%22:{%22Amplitude%22:true}}'
    window.analytics = {
      load: function() {},
      track: function() {},
      addSourceMiddleware: function() {}
    }
    nock('https://cdn.segment.com')
      .get('/v1/projects/123/integrations')
      .reply(200, [
        {
          name: 'Google Analytics',
          creationName: 'Google Analytics'
        },
        {
          name: 'Amplitude',
          creationName: 'Amplitude'
        }
      ])
    shallow(
      React.createElement(ConsentManagerBuilder, { writeKey: '123' }, function(_a) {
        var newDestinations = _a.newDestinations
        expect(newDestinations).toMatchObject([
          {
            name: 'Google Analytics',
            id: 'Google Analytics'
          }
        ])
        done()
      })
    )
  })
  test('loads analytics.js with the user՚s preferences', function(done) {
    var ajsLoad = sinon.spy()
    document.cookie =
      'tracking-preferences={%22version%22:1%2C%22destinations%22:{%22Amplitude%22:true}}'
    window.analytics = { load: ajsLoad, track: function() {}, addSourceMiddleware: function() {} }
    var writeKey = '123'
    nock('https://cdn.segment.com')
      .get('/v1/projects/123/integrations')
      .reply(200, [
        {
          name: 'Amplitude',
          creationName: 'Amplitude'
        }
      ])
    shallow(
      React.createElement(ConsentManagerBuilder, { writeKey: writeKey }, function() {
        expect(ajsLoad.calledOnce).toBe(true)
        expect(ajsLoad.args[0][0]).toBe(writeKey)
        expect(ajsLoad.args[0][1]).toMatchObject({
          integrations: {
            All: false,
            Amplitude: true,
            'Segment.io': true
          }
        })
        done()
      })
    )
  })
  test('provides an object containing the WIP preferences', function(done) {
    document.cookie =
      'tracking-preferences={%22version%22:1%2C%22destinations%22:{%22Amplitude%22:true}}'
    window.analytics = {
      load: function() {},
      track: function() {},
      addSourceMiddleware: function() {},
      addSourceMiddleware: function() {}
    }
    nock('https://cdn.segment.com')
      .get('/v1/projects/123/integrations')
      .reply(200, [
        {
          name: 'Amplitude',
          creationName: 'Amplitude'
        }
      ])
    shallow(
      React.createElement(ConsentManagerBuilder, { writeKey: '123' }, function(_a) {
        var preferences = _a.preferences
        expect(preferences).toMatchObject({
          Amplitude: true
        })
        done()
      })
    )
  })
  test('does not imply consent on interacation', function(done) {
    nock('https://cdn.segment.com')
      .get('/v1/projects/123/integrations')
      .reply(200, [
        {
          name: 'Amplitude',
          creationName: 'Amplitude'
        }
      ])
    shallow(
      React.createElement(ConsentManagerBuilder, { writeKey: '123' }, function(_a) {
        var preferences = _a.preferences
        expect(preferences).toMatchObject({})
        done()
      })
    )
  })
  test('if defaultDestinationBehavior is set to imply and category is set to true, loads new destination', function(done) {
    document.cookie =
      'tracking-preferences={%22version%22:1%2C%22destinations%22:{%22Amplitude%22:true}%2C%22custom%22:{%22advertising%22:false%2C%22marketingAndAnalytics%22:true%2C%22functional%22:true}}'
    window.analytics = {
      load: function() {},
      identify: function() {},
      track: function() {},
      addSourceMiddleware: function() {}
    }
    nock('https://cdn.segment.com')
      .get('/v1/projects/123/integrations')
      .reply(200, [
        {
          name: 'Google Analytics',
          creationName: 'Google Analytics'
        },
        {
          name: 'Amplitude',
          creationName: 'Amplitude'
        }
      ])
    shallow(
      React.createElement(
        ConsentManagerBuilder,
        {
          defaultDestinationBehavior: 'imply',
          writeKey: '123',
          mapCustomPreferences: function(destinations, preferences) {
            var destinationPreferences = {}
            var customPreferences = {}
            // Default unset preferences to true (for implicit consent)
            for (var _i = 0, _a = Object.keys(preferences); _i < _a.length; _i++) {
              var preferenceName = _a[_i]
              var value = preferences[preferenceName]
              if (typeof value === 'boolean') {
                customPreferences[preferenceName] = value
              } else {
                customPreferences[preferenceName] = true
              }
            }
            var customPrefs = customPreferences
            var _loop_1 = function(destination) {
              // Mark advertising destinations
              if (
                ADVERTISING_CATEGORIES.find(function(c) {
                  return c === destination.category
                }) &&
                destinationPreferences[destination.id] !== false
              ) {
                destinationPreferences[destination.id] = customPrefs.advertising
              }
              // Mark function destinations
              if (
                FUNCTIONAL_CATEGORIES.find(function(c) {
                  return c === destination.category
                }) &&
                destinationPreferences[destination.id] !== false
              ) {
                destinationPreferences[destination.id] = customPrefs.functional
              }
              // Fallback to marketing
              if (!(destination.id in destinationPreferences)) {
                destinationPreferences[destination.id] = customPrefs.marketingAndAnalytics
              }
            }
            for (var _b = 0, destinations_1 = destinations; _b < destinations_1.length; _b++) {
              var destination = destinations_1[_b]
              _loop_1(destination)
            }
            return {
              destinationPreferences: destinationPreferences,
              customPreferences: customPreferences
            }
          }
        },
        function(_a) {
          var destinationPreferences = _a.destinationPreferences
          expect(destinationPreferences).toMatchObject({
            Amplitude: true,
            'Google Analytics': true
          })
          done()
        }
      )
    )
  })
  test('if defaultDestinationBehavior is set to imply and category is set to false, does not load new destination', function(done) {
    document.cookie =
      'tracking-preferences={%22version%22:1%2C%22destinations%22:{%22Amplitude%22:true}%2C%22custom%22:{%22advertising%22:false%2C%22marketingAndAnalytics%22:false%2C%22functional%22:true}}'
    window.analytics = {
      load: function() {},
      identify: function() {},
      track: function() {},
      addSourceMiddleware: function() {}
    }
    nock('https://cdn.segment.com')
      .get('/v1/projects/123/integrations')
      .reply(200, [
        {
          name: 'Google Analytics',
          creationName: 'Google Analytics'
        },
        {
          name: 'Amplitude',
          creationName: 'Amplitude'
        }
      ])
    shallow(
      React.createElement(
        ConsentManagerBuilder,
        {
          defaultDestinationBehavior: 'imply',
          writeKey: '123',
          mapCustomPreferences: function(destinations, preferences) {
            var destinationPreferences = {}
            var customPreferences = {}
            // Default unset preferences to true (for implicit consent)
            for (var _i = 0, _a = Object.keys(preferences); _i < _a.length; _i++) {
              var preferenceName = _a[_i]
              var value = preferences[preferenceName]
              if (typeof value === 'boolean') {
                customPreferences[preferenceName] = value
              } else {
                customPreferences[preferenceName] = true
              }
            }
            var customPrefs = customPreferences
            var _loop_2 = function(destination) {
              // Mark advertising destinations
              if (
                ADVERTISING_CATEGORIES.find(function(c) {
                  return c === destination.category
                }) &&
                destinationPreferences[destination.id] !== false
              ) {
                destinationPreferences[destination.id] = customPrefs.advertising
              }
              // Mark function destinations
              if (
                FUNCTIONAL_CATEGORIES.find(function(c) {
                  return c === destination.category
                }) &&
                destinationPreferences[destination.id] !== false
              ) {
                destinationPreferences[destination.id] = customPrefs.functional
              }
              // Fallback to marketing
              if (!(destination.id in destinationPreferences)) {
                destinationPreferences[destination.id] = customPrefs.marketingAndAnalytics
              }
            }
            for (var _b = 0, destinations_2 = destinations; _b < destinations_2.length; _b++) {
              var destination = destinations_2[_b]
              _loop_2(destination)
            }
            return {
              destinationPreferences: destinationPreferences,
              customPreferences: customPreferences
            }
          }
        },
        function(_a) {
          var destinationPreferences = _a.destinationPreferences
          expect(destinationPreferences).toMatchObject({
            Amplitude: false,
            'Google Analytics': false
          })
          done()
        }
      )
    )
  })
  test('a different cdn is used when cdnHost is set', function(done) {
    nock('https://foo.bar.com')
      .get('/v1/projects/123/integrations')
      .reply(200, [
        {
          name: 'Google Analytics',
          creationName: 'Google Analytics'
        },
        {
          name: 'Amplitude',
          creationName: 'Amplitude'
        }
      ])
      .get('/v1/projects/abc/integrations')
      .reply(200, [
        {
          name: 'FullStory',
          creationName: 'FullStory'
        }
      ])
    shallow(
      React.createElement(
        ConsentManagerBuilder,
        { writeKey: '123', otherWriteKeys: ['abc'], cdnHost: 'foo.bar.com' },
        function(_a) {
          var destinations = _a.destinations
          expect(destinations).toMatchObject([
            {
              id: 'Amplitude',
              name: 'Amplitude'
            },
            {
              id: 'FullStory',
              name: 'FullStory'
            },
            {
              id: 'Google Analytics',
              name: 'Google Analytics'
            }
          ])
          done()
        }
      )
    )
  })
  test.todo('loads analytics.js normally when consent isn՚t required')
  test.todo('still applies preferences when consent isn՚t required')
  test.todo('provides a setPreferences() function for setting the preferences')
  test.todo('setPreferences() function can be passed a boolean to set all preferences')
  test.todo('provides a resetPreferences() function for resetting the preferences')
  test.todo(
    'provides a saveConsent() function for persisting the preferences and loading analytics.js'
  )
  test.todo('saveConsent() can be passed additional preferences to persist')
  test.todo('saveConsent() can be passed a boolean to set all preferences')
  test.todo('saveConsent() fills in missing preferences')
  test.todo('initialPreferences sets the initial preferences')
  test.todo('loads custom preferences')
  test.todo('saveConsent() maps custom preferences to destination preferences')
  test.todo('mapCustomPreferences allows customPreferences to be updated')
  test.todo('saveConsent() saves custom preferences')
  test.todo('cookieDomain sets the cookie domain')
})
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgudG9kby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9fX3Rlc3RzX18vY29uc2VudC1tYW5hZ2VyLWJ1aWxkZXIvaW5kZXgudG9kby5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssTUFBTSxPQUFPLENBQUE7QUFDekIsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFFBQVEsQ0FBQTtBQUNoQyxPQUFPLElBQUksTUFBTSxNQUFNLENBQUE7QUFDdkIsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFBO0FBQ3pCLE9BQU8scUJBQXFCLE1BQU0sK0JBQStCLENBQUE7QUFDakUsT0FBTyxFQUFFLHNCQUFzQixFQUFFLHFCQUFxQixFQUFFLE1BQU0sa0NBQWtDLENBQUE7QUFFaEcsUUFBUSxDQUFDLHVCQUF1QixFQUFFO0lBQ2hDLFVBQVUsQ0FBQztRQUNULFFBQVEsR0FBRyxFQUFFLENBQUE7UUFDYixNQUFNLEdBQUcsRUFBRSxDQUFBO0lBQ2IsQ0FBQyxDQUFDLENBQUE7SUFFRixJQUFJLENBQUMsSUFBSSxDQUFDLG9EQUFvRCxDQUFDLENBQUE7SUFFL0QsSUFBSSxDQUFDLHlDQUF5QyxFQUFFLFVBQUEsSUFBSTtRQUNsRCxJQUFJLENBQUMseUJBQXlCLENBQUM7YUFDNUIsR0FBRyxDQUFDLCtCQUErQixDQUFDO2FBQ3BDLEtBQUssQ0FBQyxHQUFHLEVBQUU7WUFDVjtnQkFDRSxJQUFJLEVBQUUsa0JBQWtCO2dCQUN4QixZQUFZLEVBQUUsa0JBQWtCO2FBQ2pDO1lBQ0Q7Z0JBQ0UsSUFBSSxFQUFFLFdBQVc7Z0JBQ2pCLFlBQVksRUFBRSxXQUFXO2FBQzFCO1NBQ0YsQ0FBQzthQUNELEdBQUcsQ0FBQywrQkFBK0IsQ0FBQzthQUNwQyxLQUFLLENBQUMsR0FBRyxFQUFFO1lBQ1Y7Z0JBQ0UsSUFBSSxFQUFFLFdBQVc7Z0JBQ2pCLFlBQVksRUFBRSxXQUFXO2FBQzFCO1NBQ0YsQ0FBQyxDQUFBO1FBRUos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
