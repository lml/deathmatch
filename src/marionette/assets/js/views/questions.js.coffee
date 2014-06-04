Marionette = require 'marionette'
QuestionView = require './question.js.coffee'
QuestionModel = require '../entities/question.js.coffee'

class Questions extends Marionette.CollectionView

  tagName: 'ol'
  childView: QuestionView

  onQuestionAdd: () ->
    @collection.create {type: 'multiple_choice_question'}, wait: true

  onAddChild: (child) ->
    child.triggerMethod 'show'

module.exports = Questions
