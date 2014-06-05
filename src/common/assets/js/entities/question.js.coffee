Backbone = require 'backbone'
require 'backbone_associations'
Choices = require './choices.js.coffee'

class Question extends Backbone.AssociatedModel

  defaults:
    type: 'multiple_choice_question'

  relations: [
    {
      type: Backbone.Many,
      key: 'choices',
      collectionType: Choices
    }
  ]

module.exports = Question
