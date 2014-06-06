Marionette = require 'marionette'
ActionsView = require '../views/actions.js.coffee'
_ = require 'underscore'

class Actionable extends Marionette.Behavior

  defaults: () ->
    helpers:
      number: () => @view.model.collection.indexOf(@view.model) + 1

  onShow: () ->
    @actionsView = new ActionsView
      model: @view.model
      helpers: _.extend({}, @defaults.helpers, @options.helpers)
    @view.actions.show(@actionsView)

  onRefreshActions: () ->
    @actionsView?.rerender()

module.exports = Actionable
