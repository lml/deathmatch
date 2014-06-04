Backbone = require 'backbone'
require 'backbone_associations'
Store = require './store.js.coffee'

class SimpleChoice extends Backbone.AssociatedModel

  initialize: (attributes, options) ->
    Store.addModel(this)
    @listenTo this, 'change:position', () -> @trigger('change:letter')

  question: () ->
    @collection.owner()

  letter: () ->
    String.fromCharCode(97 + @get('position'))

  compare: (other) ->
    pos = @get('position')
    opos = other.get('position')
    return 0 if pos == opos
    if pos > opos then -1 else 1

module.exports = SimpleChoice
