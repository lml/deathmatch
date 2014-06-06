Marionette = require 'marionette'
SimpleChoiceView = require './simple_choice.js.coffee'
ComboChoiceView = require './combo_choice.js.coffee'
QuantifierChoiceView = require './quantifier_choice.js.coffee'
Actionable = require '../behaviors/actionable.js.coffee'
Deleteable = require '../behaviors/deleteable.js.coffee'

class Choice extends Marionette.LayoutView

  id: () ->
    part = @model.collection.owner().collection.owner().get('position')
    question = @model.collection.owner().get('position')
    choice = @model.position()
    "part-#{part}-question-#{question}-choice-#{choice}-container"

  tagName: 'li'
  className: 'js-choice-container choice-container has-drawer'
  template: "#choice-container-template"

  triggers:
    'click .js-move-up-choice-button': 'choice:moveup'
    'click .js-move-down-choice-button': 'choice:movedown'

  regions:
    container: '.js-choice-item'
    actions: '.js-choice-actions-container'

  behaviors: () ->
    Deleteable:
      behaviorClass: Deleteable
    Actionable:
      behaviorClass: Actionable
      helpers:
        letter: () => @model.letter()
        canMoveUp: () =>
          @model.canMoveUp()
        canMoveDown: () =>
          @model.canMoveDown()

  viewClassMap:
    'simple': SimpleChoiceView
    'combo': ComboChoiceView
    'all': QuantifierChoiceView
    'none': QuantifierChoiceView

  onShow: () ->
    ViewClass = @viewClassMap[@model.type()]
    @container.show(new ViewClass model:@model)

  onChoiceMoveup: () ->
    @model.moveUp()

  onChoiceMovedown: () ->
    @model.moveDown()

module.exports = Choice
