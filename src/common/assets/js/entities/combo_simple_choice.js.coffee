ExerciseEditor = require('./_namespace.js.coffee')
ExerciseEditor.Store = require './store.js.coffee'
require './simple_choice.js.coffee'

class ExerciseEditor.ComboSimpleChoice extends Backbone.AssociatedModel

  initialize: () ->
    @listenToOnce this, 'change:simple_choice_id', () =>
      ExerciseEditor.Store.onModelAvailable('SimpleChoice', @get('simple_choice_id'), (sc) =>
        @listenTo sc, 'destroy', () =>
          # The CSC is already deleted on the server side when an SC is destroyed
          @synclessDestroy()
      )

  simpleChoice: () ->
    if @simpleChoice? then return @simpleChoice
    @simpleChoice = @collection.owner()
