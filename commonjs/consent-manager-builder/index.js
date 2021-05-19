'use strict'
var __extends =
  (this && this.__extends) ||
  (function() {
    var extendStatics = function(d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function(d, b) {
            d.__proto__ = b
          }) ||
        function(d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]
        }
      return extendStatics(d, b)
    }
    return function(d, b) {
      extendStatics(d, b)
      function __() {
        this.constructor = d
      }
      d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __())
    }
  })()
var __assign =
  (this && this.__assign) ||
  function() {
    __assign =
      Object.assign ||
      function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i]
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p]
        }
        return t
      }
    return __assign.apply(this, arguments)
  }
var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function(resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __generator =
  (this && this.__generator) ||
  function(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
          if (t[0] & 1) throw t[1]
          return t[1]
        },
        trys: [],
        ops: []
      },
      f,
      y,
      t,
      g
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function() {
          return this
        }),
      g
    )
    function verb(n) {
      return function(v) {
        return step([n, v])
      }
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.')
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t
          if (((y = 0), t)) op = [op[0] & 2, t.value]
          switch (op[0]) {
            case 0:
            case 1:
              t = op
              break
            case 4:
              _.label++
              return { value: op[1], done: false }
            case 5:
              _.label++
              y = op[1]
              op = [0]
              continue
            case 7:
              op = _.ops.pop()
              _.trys.pop()
              continue
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0
                continue
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1]
                break
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1]
                t = op
                break
              }
              if (t && _.label < t[2]) {
                _.label = t[2]
                _.ops.push(op)
                break
              }
              if (t[2]) _.ops.pop()
              _.trys.pop()
              continue
          }
          op = body.call(thisArg, _)
        } catch (e) {
          op = [6, e]
          y = 0
        } finally {
          f = t = 0
        }
      if (op[0] & 5) throw op[1]
      return { value: op[0] ? op[1] : void 0, done: true }
    }
  }
var __spreadArrays =
  (this && this.__spreadArrays) ||
  function() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j]
    return r
  }
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
var react_1 = require('react')
var preferences_1 = require('./preferences')
var fetch_destinations_1 = __importDefault(require('./fetch-destinations'))
var analytics_1 = __importDefault(require('./analytics'))
function getNewDestinations(destinations, preferences) {
  var newDestinations = []
  // If there are no preferences then all destinations are new
  if (!preferences) {
    return destinations
  }
  for (var _i = 0, destinations_1 = destinations; _i < destinations_1.length; _i++) {
    var destination = destinations_1[_i]
    if (preferences[destination.id] === undefined) {
      newDestinations.push(destination)
    }
  }
  return newDestinations
}
var ConsentManagerBuilder = /** @class */ (function(_super) {
  __extends(ConsentManagerBuilder, _super)
  function ConsentManagerBuilder() {
    var _this = (_super !== null && _super.apply(this, arguments)) || this
    _this.state = {
      isLoading: true,
      destinations: [],
      newDestinations: [],
      preferences: {},
      destinationPreferences: {},
      isConsentRequired: true,
      havePreferencesChanged: false,
      workspaceAddedNewDestinations: false
    }
    _this.initialise = function() {
      return __awaiter(_this, void 0, void 0, function() {
        var _a,
          writeKey,
          _b,
          otherWriteKeys,
          _c,
          shouldRequireConsent,
          initialPreferences,
          mapCustomPreferences,
          defaultDestinationBehavior,
          cookieDomain,
          cookieExpires,
          _d,
          cdnHost,
          _e,
          destinationPreferences,
          customPreferences,
          _f,
          isConsentRequired,
          destinations,
          newDestinations,
          workspaceAddedNewDestinations,
          preferences,
          hasInitialPreferenceToTrue,
          emptyCustomPreferecences,
          mapped
        return __generator(this, function(_g) {
          switch (_g.label) {
            case 0:
              ;(_a = this.props),
                (writeKey = _a.writeKey),
                (_b = _a.otherWriteKeys),
                (otherWriteKeys =
                  _b === void 0 ? ConsentManagerBuilder.defaultProps.otherWriteKeys : _b),
                (_c = _a.shouldRequireConsent),
                (shouldRequireConsent =
                  _c === void 0 ? ConsentManagerBuilder.defaultProps.shouldRequireConsent : _c),
                (initialPreferences = _a.initialPreferences),
                (mapCustomPreferences = _a.mapCustomPreferences),
                (defaultDestinationBehavior = _a.defaultDestinationBehavior),
                (cookieDomain = _a.cookieDomain),
                (cookieExpires = _a.cookieExpires),
                (_d = _a.cdnHost),
                (cdnHost = _d === void 0 ? ConsentManagerBuilder.defaultProps.cdnHost : _d)
              ;(_e = preferences_1.loadPreferences()),
                (destinationPreferences = _e.destinationPreferences),
                (customPreferences = _e.customPreferences)
              return [
                4 /*yield*/,
                Promise.all([
                  shouldRequireConsent(),
                  fetch_destinations_1.default(cdnHost, __spreadArrays([writeKey], otherWriteKeys))
                ])
              ]
            case 1:
              ;(_f = _g.sent()), (isConsentRequired = _f[0]), (destinations = _f[1])
              newDestinations = getNewDestinations(destinations, destinationPreferences || {})
              workspaceAddedNewDestinations =
                destinationPreferences &&
                Object.keys(destinationPreferences).length > 0 &&
                newDestinations.length > 0
              if (mapCustomPreferences) {
                preferences = customPreferences || initialPreferences || {}
                hasInitialPreferenceToTrue = Object.values(initialPreferences || {}).some(Boolean)
                emptyCustomPreferecences = Object.values(customPreferences || {}).every(function(
                  v
                ) {
                  return v === null || v === undefined
                })
                if (
                  (hasInitialPreferenceToTrue && emptyCustomPreferecences) ||
                  (defaultDestinationBehavior === 'imply' && workspaceAddedNewDestinations)
                ) {
                  mapped = mapCustomPreferences(destinations, preferences)
                  destinationPreferences = mapped.destinationPreferences
                  customPreferences = mapped.customPreferences
                  preferences_1.savePreferences({
                    destinationPreferences: destinationPreferences,
                    customPreferences: customPreferences,
                    cookieDomain: cookieDomain,
                    cookieExpires: cookieExpires
                  })
                }
              } else {
                preferences = destinationPreferences || initialPreferences
              }
              analytics_1.default({
                writeKey: writeKey,
                destinations: destinations,
                destinationPreferences: destinationPreferences,
                isConsentRequired: isConsentRequired,
                defaultDestinationBehavior: defaultDestinationBehavior,
                categoryPreferences: preferences
              })
              this.setState({
                isLoading: false,
                destinations: destinations,
                newDestinations: newDestinations,
                preferences: preferences,
                isConsentRequired: isConsentRequired,
                destinationPreferences: destinationPreferences,
                workspaceAddedNewDestinations: Boolean(workspaceAddedNewDestinations)
              })
              return [2 /*return*/]
          }
        })
      })
    }
    _this.handleSetPreferences = function(newPreferences) {
      _this.setState(function(prevState) {
        var destinations = prevState.destinations,
          existingPreferences = prevState.preferences
        var preferences = _this.mergePreferences({
          destinations: destinations,
          newPreferences: newPreferences,
          existingPreferences: existingPreferences
        })
        return __assign(__assign({}, prevState), {
          preferences: preferences,
          havePreferencesChanged: true
        })
      })
    }
    _this.handleResetPreferences = function() {
      var _a = _this.props,
        initialPreferences = _a.initialPreferences,
        mapCustomPreferences = _a.mapCustomPreferences
      var _b = preferences_1.loadPreferences(),
        destinationPreferences = _b.destinationPreferences,
        customPreferences = _b.customPreferences
      var preferences
      if (mapCustomPreferences) {
        preferences = customPreferences || initialPreferences
      } else {
        preferences = destinationPreferences || initialPreferences
      }
      _this.setState({ preferences: preferences })
    }
    _this.handleSaveConsent = function(newPreferences, shouldReload) {
      var _a = _this.props,
        writeKey = _a.writeKey,
        cookieDomain = _a.cookieDomain,
        cookieExpires = _a.cookieExpires,
        mapCustomPreferences = _a.mapCustomPreferences,
        defaultDestinationBehavior = _a.defaultDestinationBehavior
      _this.setState(function(prevState) {
        var destinations = prevState.destinations,
          existingPreferences = prevState.preferences,
          isConsentRequired = prevState.isConsentRequired
        var preferences = _this.mergePreferences({
          destinations: destinations,
          newPreferences: newPreferences,
          existingPreferences: existingPreferences
        })
        var destinationPreferences
        var customPreferences
        if (mapCustomPreferences) {
          var custom = mapCustomPreferences(destinations, preferences)
          destinationPreferences = custom.destinationPreferences
          customPreferences = custom.customPreferences
          if (customPreferences) {
            // Allow the customPreferences to be updated from mapCustomPreferences
            preferences = customPreferences
          } else {
            // Make returning the customPreferences from mapCustomPreferences optional
            customPreferences = preferences
          }
        } else {
          destinationPreferences = preferences
        }
        var newDestinations = getNewDestinations(destinations, destinationPreferences)
        // If preferences haven't changed, don't reload the page as it's a disruptive experience for end-users
        if (prevState.havePreferencesChanged || newDestinations.length > 0) {
          preferences_1.savePreferences({
            destinationPreferences: destinationPreferences,
            customPreferences: customPreferences,
            cookieDomain: cookieDomain,
            cookieExpires: cookieExpires
          })
          analytics_1.default({
            writeKey: writeKey,
            destinations: destinations,
            destinationPreferences: destinationPreferences,
            isConsentRequired: isConsentRequired,
            shouldReload: shouldReload,
            defaultDestinationBehavior: defaultDestinationBehavior,
            categoryPreferences: customPreferences
          })
        }
        return __assign(__assign({}, prevState), {
          destinationPreferences: destinationPreferences,
          preferences: preferences,
          newDestinations: newDestinations
        })
      })
    }
    _this.mergePreferences = function(args) {
      var destinations = args.destinations,
        existingPreferences = args.existingPreferences,
        newPreferences = args.newPreferences
      var preferences
      if (typeof newPreferences === 'boolean') {
        var destinationPreferences = {}
        for (var _i = 0, destinations_2 = destinations; _i < destinations_2.length; _i++) {
          var destination = destinations_2[_i]
          destinationPreferences[destination.id] = newPreferences
        }
        preferences = destinationPreferences
      } else if (newPreferences) {
        preferences = __assign(__assign({}, existingPreferences), newPreferences)
      } else {
        preferences = existingPreferences
      }
      return preferences
    }
    return _this
  }
  ConsentManagerBuilder.prototype.render = function() {
    var _a = this.props,
      children = _a.children,
      customCategories = _a.customCategories
    var _b = this.state,
      isLoading = _b.isLoading,
      destinations = _b.destinations,
      preferences = _b.preferences,
      newDestinations = _b.newDestinations,
      isConsentRequired = _b.isConsentRequired,
      havePreferencesChanged = _b.havePreferencesChanged,
      workspaceAddedNewDestinations = _b.workspaceAddedNewDestinations,
      destinationPreferences = _b.destinationPreferences
    if (isLoading) {
      return null
    }
    return children({
      destinations: destinations,
      customCategories: customCategories,
      newDestinations: newDestinations,
      preferences: preferences,
      isConsentRequired: isConsentRequired,
      havePreferencesChanged: havePreferencesChanged,
      workspaceAddedNewDestinations: workspaceAddedNewDestinations,
      destinationPreferences: destinationPreferences,
      setPreferences: this.handleSetPreferences,
      resetPreferences: this.handleResetPreferences,
      saveConsent: this.handleSaveConsent
    })
  }
  ConsentManagerBuilder.prototype.componentDidMount = function() {
    return __awaiter(this, void 0, void 0, function() {
      var onError, e_1
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            onError = this.props.onError
            if (!(onError && typeof onError === 'function')) return [3 /*break*/, 6]
            _a.label = 1
          case 1:
            _a.trys.push([1, 3, , 5])
            return [4 /*yield*/, this.initialise()]
          case 2:
            _a.sent()
            return [3 /*break*/, 5]
          case 3:
            e_1 = _a.sent()
            return [4 /*yield*/, onError(e_1)]
          case 4:
            _a.sent()
            return [3 /*break*/, 5]
          case 5:
            return [3 /*break*/, 8]
          case 6:
            return [4 /*yield*/, this.initialise()]
          case 7:
            _a.sent()
            _a.label = 8
          case 8:
            return [2 /*return*/]
        }
      })
    })
  }
  ConsentManagerBuilder.displayName = 'ConsentManagerBuilder'
  ConsentManagerBuilder.defaultProps = {
    otherWriteKeys: [],
    onError: undefined,
    shouldRequireConsent: function() {
      return true
    },
    initialPreferences: {},
    cdnHost: 'cdn.segment.com'
  }
  return ConsentManagerBuilder
})(react_1.Component)
exports.default = ConsentManagerBuilder
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29uc2VudC1tYW5hZ2VyLWJ1aWxkZXIvaW5kZXgudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLCtCQUFpQztBQUNqQyw2Q0FBZ0U7QUFDaEUsNEVBQW9EO0FBQ3BELDBEQUFvRDtBQVFwRCxTQUFTLGtCQUFrQixDQUFDLFlBQTJCLEVBQUUsV0FBZ0M7SUFDdkYsSUFBTSxlQUFlLEdBQWtCLEVBQUUsQ0FBQTtJQUV6Qyw0REFBNEQ7SUFDNUQsSUFBSSxDQUFDLFdBQVcsRUFBRTtRQUNoQixPQUFPLFlBQVksQ0FBQTtLQUNwQjtJQUVELEtBQTBCLFVBQVksRUFBWiw2QkFBWSxFQUFaLDBCQUFZLEVBQVosSUFBWSxFQUFFO1FBQW5DLElBQU0sV0FBVyxxQkFBQTtRQUNwQixJQUFJLFdBQVcsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLEtBQUssU0FBUyxFQUFFO1lBQzdDLGVBQWUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7U0FDbEM7S0FDRjtJQUVELE9BQU8sZUFBZSxDQUFBO0FBQ3hCLENBQUM7QUFxRkQ7SUFBbUQseUNBQXVCO0lBQTFFO1FBQUEscUVBa1BDO1FBdk9DLFdBQUssR0FBRztZQUNOLFNBQVMsRUFBRSxJQUFJO1lBQ2YsWUFBWSxFQUFFLEVBQUU7WUFDaEIsZUFBZSxFQUFFLEVBQUU7WUFDbkIsV0FBVyxFQUFFLEVBQUU7WUFDZixzQkFBc0IsRUFBRSxFQUFFO1lBQzFCLGlCQUFpQixFQUFFLElBQUk7WUFDdkIsc0JBQXNCLEVBQUUsS0FBSztZQUM3Qiw2QkFBNkIsRUFBRSxLQUFLO1NBQ3JDLENBQUE7UUE4Q0QsZ0JBQVUsR0FBRzs7Ozs7d0JBQ0wsS0FVRixJQUFJLENBQUMsS0FBSyxFQVRaLFFBQVEsY0FB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
