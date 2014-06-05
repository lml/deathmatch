Marionette = require 'marionette'
PartView = require './part.js.coffee'

class Parts extends Marionette.CollectionView

  tagName: 'ol'
  childView: PartView

  onChildrenChanged: () ->
    @$el.toggleClass 'numbered', @collection.length > 1

  onPartAdd: () ->
    @collection.create {}, wait: true

  onAddChild: (child) ->
    child.triggerMethod 'show'
    @triggerMethod 'children:changed'

module.exports = Parts
