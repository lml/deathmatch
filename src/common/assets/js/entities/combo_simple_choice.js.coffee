Backbone = require 'backbone'
require 'backbone_associations'
Store  = require './store.js.coffee'
SimpleChoice = require './simple_choice.js.coffee'

class ComboSimpleChoice extends Backbone.AssociatedModel

  initialize: () ->
    @listenToOnce this, 'change:simple_choice_id', () =>
      Store.onModelAvailable('SimpleChoice', @get('simple_choice_id'), (sc) =>
        @listenTo sc, 'destroy', () =>
          # The CSC is already deleted on the server side when an SC is destroyed
          @synclessDestroy()
      )

  simpleChoice: () ->
    if @simpleChoice? then return @simpleChoice
    @simpleChoice = @collection.owner()

module.exports = ComboSimpleChoice
