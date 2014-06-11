Marionette = require 'marionette'

class Deletable extends Marionette.Behavior

  events: () ->
    eventName = "click .js-delete-#{@view.model.resourceName()}-button"
    evs = {}
    evs[eventName] = 'deleteClicked'
    evs

  deleteClicked: () ->
    @view.model.destroy()

module.exports = Deletable
