Backbone = require 'backbone'
require 'backbone_associations'
Question = require './question.js.coffee'
ComboChoices = require './combo_choices.js.coffee'
SimpleChoices = require './simple_choices.js.coffee'

class MultipleChoiceQuestion extends Question

  defaults:
    type: 'multiple_choice_question'

  relations: [
    {
      type: Backbone.Many,
      key: 'simple_choices',
      collectionType: SimpleChoices
    },
    {
      type: Backbone.Many,
      key: 'combo_choices',
      collectionType: ComboChoices
    }
  ]

  constructor: () ->
    @listenTo this, 'change:simple_choices', () ->
      @get('combo_choices').sort()
      @listenTo @get('simple_choices'), 'add remove', () -> @get('combo_choices').sort()

    @listenTo this, 'change:combo_choices', () ->
      @get('combo_choices').sort()

    super

module.exports = MultipleChoiceQuestion
