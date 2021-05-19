import EventEmitter from 'events'
import React from 'react'
import Banner from './banner'
import PreferenceDialog from './preference-dialog'
import CancelDialog from './cancel-dialog'
import { ADVERTISING_CATEGORIES, FUNCTIONAL_CATEGORIES } from './categories'
var emitter = new EventEmitter()
export function openDialog() {
  emitter.emit('openDialog')
}
function normalizeDestinations(destinations) {
  var marketingDestinations = []
  var advertisingDestinations = []
  var functionalDestinations = []
  var _loop_1 = function(destination) {
    if (
      ADVERTISING_CATEGORIES.find(function(c) {
        return c === destination.category
      })
    ) {
      advertisingDestinations.push(destination)
    } else if (
      FUNCTIONAL_CATEGORIES.find(function(c) {
        return c === destination.category
      })
    ) {
      functionalDestinations.push(destination)
    } else {
      // Fallback to marketing
      marketingDestinations.push(destination)
    }
  }
  for (var _i = 0, destinations_1 = destinations; _i < destinations_1.length; _i++) {
    var destination = destinations_1[_i]
    _loop_1(destination)
  }
  return {
    marketingDestinations: marketingDestinations,
    advertisingDestinations: advertisingDestinations,
    functionalDestinations: functionalDestinations
  }
}
var Container = function(props) {
  var _a = React.useState(
      false || (props.workspaceAddedNewDestinations && props.defaultDestinationBehavior === 'ask')
    ),
    isDialogOpen = _a[0],
    toggleDialog = _a[1]
  var _b = React.useState(true),
    showBanner = _b[0],
    toggleBanner = _b[1]
  var _c = React.useState(false),
    isCancelling = _c[0],
    toggleCancel = _c[1]
  var banner = React.useRef(null)
  var preferenceDialog = React.useRef(null)
  var cancelDialog = React.useRef(null)
  var _d = normalizeDestinations(props.destinations),
    marketingDestinations = _d.marketingDestinations,
    advertisingDestinations = _d.advertisingDestinations,
    functionalDestinations = _d.functionalDestinations
  var handleBodyClick = function(e) {
    // Do nothing if no new implicit consent needs to be saved
    if (
      !props.isConsentRequired ||
      !props.implyConsentOnInteraction ||
      props.newDestinations.length === 0
    ) {
      return
    }
    // Ignore propogated clicks from inside the consent manager
    if (
      (banner.current && banner.current.contains(e.target)) ||
      (preferenceDialog.current && preferenceDialog.current.contains(e.target)) ||
      (cancelDialog.current && cancelDialog.current.contains(e.target))
    ) {
      return
    }
    props.saveConsent(undefined, false)
  }
  var showDialog = function() {
    return toggleDialog(true)
  }
  React.useEffect(function() {
    emitter.on('openDialog', showDialog)
    if (props.isConsentRequired && props.implyConsentOnInteraction) {
      document.body.addEventListener('click', handleBodyClick, false)
    }
    return function() {
      emitter.removeListener('openDialog', showDialog)
      document.body.removeEventListener('click', handleBodyClick, false)
    }
  })
  React.useEffect(
    function() {
      if (isDialogOpen) {
        props.resetPreferences()
      }
    },
    [isDialogOpen]
  )
  var onClose = function() {
    if (props.closeBehavior === undefined || props.closeBehavior === 'dismiss' /* DISMISS */) {
      return toggleBanner(false)
    }
    if (props.closeBehavior === 'accept' /* ACCEPT */) {
      return props.saveConsent()
    }
    if (props.closeBehavior === 'deny' /* DENY */) {
      var falsePreferences = Object.keys(props.preferences).reduce(function(acc, category) {
        acc[category] = false
        return acc
      }, {})
      props.setPreferences(falsePreferences)
      return props.saveConsent()
    }
    // closeBehavior is a custom function
    var customClosePreferences = props.closeBehavior(props.preferences)
    props.setPreferences(customClosePreferences)
    props.saveConsent()
    return toggleBanner(false)
  }
  var handleCategoryChange = function(category, value) {
    var _a
    props.setPreferences(((_a = {}), (_a[category] = value), _a))
  }
  var handleSave = function() {
    toggleDialog(false)
    props.saveConsent()
  }
  var handleCancel = function() {
    // Only show the cancel confirmation if there's unconsented destinations
    if (props.newDestinations.length > 0) {
      toggleCancel(true)
    } else {
      toggleDialog(false)
      props.resetPreferences()
    }
  }
  var handleCancelBack = function() {
    toggleCancel(false)
  }
  var handleCancelConfirm = function() {
    toggleCancel(false)
    toggleDialog(false)
    props.resetPreferences()
  }
  return React.createElement(
    'div',
    null,
    showBanner &&
      props.isConsentRequired &&
      props.newDestinations.length > 0 &&
      React.createElement(Banner, {
        innerRef: function(current) {
          return (banner = { current: current })
        },
        onClose: onClose,
        onChangePreferences: function() {
          return toggleDialog(true)
        },
        content: props.bannerContent,
        subContent: props.bannerSubContent,
        textColor: props.bannerTextColor,
        backgroundColor: props.bannerBackgroundColor
      }),
    isDialogOpen &&
      React.createElement(PreferenceDialog, {
        customCategories: props.customCategories,
        destinations: props.destinations,
        preferences: props.preferences,
        innerRef: function(current) {
          return (preferenceDialog = { current: current })
        },
        onCancel: handleCancel,
        onSave: handleSave,
        onChange: handleCategoryChange,
        marketingDestinations: marketingDestinations,
        advertisingDestinations: advertisingDestinations,
        functionalDestinations: functionalDestinations,
        marketingAndAnalytics: props.preferences.marketingAndAnalytics,
        advertising: props.preferences.advertising,
        functional: props.preferences.functional,
        title: props.preferencesDialogTitle,
        content: props.preferencesDialogContent
      }),
    isCancelling &&
      React.createElement(CancelDialog, {
        innerRef: function(current) {
          return (cancelDialog = { current: current })
        },
        onBack: handleCancelBack,
        onConfirm: handleCancelConfirm,
        title: props.cancelDialogTitle,
        content: props.cancelDialogContent
      })
  )
}
export default Container
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGFpbmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbnNlbnQtbWFuYWdlci9jb250YWluZXIudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sWUFBWSxNQUFNLFFBQVEsQ0FBQTtBQUNqQyxPQUFPLEtBQUssTUFBTSxPQUFPLENBQUE7QUFDekIsT0FBTyxNQUFNLE1BQU0sVUFBVSxDQUFBO0FBQzdCLE9BQU8sZ0JBQWdCLE1BQU0scUJBQXFCLENBQUE7QUFDbEQsT0FBTyxZQUFZLE1BQU0saUJBQWlCLENBQUE7QUFDMUMsT0FBTyxFQUFFLHNCQUFzQixFQUFFLHFCQUFxQixFQUFFLE1BQU0sY0FBYyxDQUFBO0FBUTVFLElBQU0sT0FBTyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUE7QUFDbEMsTUFBTSxVQUFVLFVBQVU7SUFDeEIsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQTtBQUM1QixDQUFDO0FBb0NELFNBQVMscUJBQXFCLENBQUMsWUFBMkI7SUFDeEQsSUFBTSxxQkFBcUIsR0FBa0IsRUFBRSxDQUFBO0lBQy9DLElBQU0sdUJBQXVCLEdBQWtCLEVBQUUsQ0FBQTtJQUNqRCxJQUFNLHNCQUFzQixHQUFrQixFQUFFLENBQUE7NEJBRXJDLFdBQVc7UUFDcEIsSUFBSSxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLEtBQUssV0FBVyxDQUFDLFFBQVEsRUFBMUIsQ0FBMEIsQ0FBQyxFQUFFO1lBQ2hFLHVCQUF1QixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTtTQUMxQzthQUFNLElBQUkscUJBQXFCLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxLQUFLLFdBQVcsQ0FBQyxRQUFRLEVBQTFCLENBQTBCLENBQUMsRUFBRTtZQUN0RSxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7U0FDekM7YUFB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
