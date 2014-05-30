Backbone = require 'backbone'
require 'backbone_associations'
require './store.js.coffee'

class ExerciseEditor.SimpleChoice extends Backbone.AssociatedModel

  initialize: (attributes, options) ->
    ExerciseEditor.Store.addModel(this)
    @listenTo this, 'change:position', () -> @trigger('change:letter')

  question: () ->
    @collection.owner()

  letter: () ->
    String.fromCharCode(97 + @get('position'))

  compare: (other) ->
    pos = @get('position')
    opos = other.get('position')
    return 0 if pos == opos
    -1 if pos > opos else 1
