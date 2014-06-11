Marionette = require 'marionette'

class Actions extends Marionette.ItemView

  initialize: () ->
    @template = "#" + "#{@model.resourceName()}-actions-template"
    @listenTo @model.collection, 'change add remove', @rerender

  rerender: () ->
    if not @isDestroyed
      @render()

  templateHelpers: () ->
    @options.helpers

module.exports = Actions
