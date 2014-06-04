Backbone = require 'backbone'
require 'backbone_associations'
Questions = require './questions.js.coffee'
MultipleChoiceQuestion = require './multiple_choice_question.js.coffee'

class Part extends Backbone.AssociatedModel

  defaults:
    position: -1,
    credit: -1

  relations: [
    {
      type: Backbone.Many,
      key: 'questions',
      collectionType: Questions,
      relatedModel: (relation, attributes) ->
        return (attrs, options) ->
          if attrs.type == 'multiple_choice_question'
            return new MultipleChoiceQuestion(attrs)
          throw "unknown question type"
    }
  ]


module.exports = Part
