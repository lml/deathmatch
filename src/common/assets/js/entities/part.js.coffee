require './_namespace.js.coffee'
require './multiple_choice_question.js.coffee'

class ExerciseEditor.Part extends Backbone.AssociatedModel

  defaults:
    position: -1,
    credit: -1

  relations: [
    {
      type: Backbone.Many,
      key: 'questions',
      relatedModel: (relation, attributes) ->
        return (attrs, options) ->
          if attrs.type == 'multiple_choice_question' then
            return new ExerciseEditor.MultipleChoiceQuestion(attrs)
          throw "unknown question type"
    }
  ]
