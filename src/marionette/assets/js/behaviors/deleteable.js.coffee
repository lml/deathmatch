Marionette = require 'marionette'

class Deletable extends Marionette.Behavior

  events: () ->
    eventName = "click .js-delete-#{@view.model.constructor.name.toLowerCase()}-button"
    evs = {}
    evs[eventName] = 'deleteClicked'
    evs

  deleteClicked: () ->
    @view.model.destroy()

module.exports = Deletable
