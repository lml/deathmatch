Marionette = require 'marionette'
PartView = require './part.js.coffee'

class Parts extends Marionette.CollectionView

  tagName: 'ol'
  childView: PartView

  onPartAdd: () ->
    @collection.create {}, wait: true

  onAddChild: (child) ->
    child.triggerMethod 'show'

module.exports = Parts
