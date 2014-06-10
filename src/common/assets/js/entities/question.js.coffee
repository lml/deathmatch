Backbone = require 'backbone'
require 'backbone-associations'
Choices = require './choices.js.coffee'
_ = require 'underscore'

class Question extends Backbone.AssociatedModel

  defaults:
    type: 'multiple_choice_question'

  counts: () ->
    counts = @get('choices').countBy('type')
    _.extend {}, {all: 0, none: 0, simple: 0, combo: 0}, counts

  canAddCombo: () ->
    counts = @counts()
    n = counts.simple
    n >= 2 and counts.combo < (2 ** n - (n + 1))

  canAddAll: () ->
    counts = @counts()
    counts.all is 0 and counts.simple >= 2

  canAddNone: () ->
    counts = @counts()
    counts.simple > 1 and counts.none is 0

  relations: [
    {
      type: Backbone.Many,
      key: 'choices',
      collectionType: Choices
    }
  ]

module.exports = Question
