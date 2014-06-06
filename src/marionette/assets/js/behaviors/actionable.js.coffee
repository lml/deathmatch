Marionette = require 'marionette'
ActionsView = require '../views/actions.js.coffee'

class Actionable extends Marionette.Behavior

  defaults: () ->
    helpers:
      number: () => @view.model.collection.indexOf(@view.model) + 1

  onShow: () ->
    @actionsView = new ActionsView
      model: @view.model
      helpers: @options.helpers
    @view.actions.show(@actionsView)

module.exports = Actionable
