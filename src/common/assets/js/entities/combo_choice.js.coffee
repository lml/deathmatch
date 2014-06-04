Backbone = require 'backbone'
require 'backbone_associations'
ComboSimpleChoice = require './combo_simple_choice.js.coffee'

class ComboChoice extends Backbone.AssociatedModel
  relations: [
    {
      type: Backbone.Many,
      key: 'combo_simple_choices',
      relatedModel: ComboSimpleChoice,
    }
  ]

  question: () ->
    @collection.owner()

  letter: () ->
    String.fromCharCode(97 + @collection.indexOf(this) + @simpleChoices().length)

  simpleChoices: () ->
    @question().get('simple_choices')

  selectedSimpleChoices: () ->
    simples = @simpleChoices()
    @get('combo_simple_choices').map((csc) ->
      simples.get(csc.get('simple_choice_id'))).sortBy((sc) ->
        sc.get('position'))

module.exports = ComboChoice
