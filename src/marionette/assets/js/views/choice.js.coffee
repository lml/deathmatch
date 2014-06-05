Marionette = require 'marionette'
SimpleChoiceView = require './simple_choice.js.coffee'
ComboChoiceView = require './combo_choice.js.coffee'
QuantifierChoiceView = require './quantifier_choice.js.coffee'

class Choice extends Marionette.LayoutView

  id: () ->
    part = @model.collection.owner().collection.owner().get('position')
    question = @model.collection.owner().get('position')
    choice = @model.position()
    "part-#{part}-question-#{question}-choice-#{choice}-container"

  tagName: 'li'
  className: 'js-choice-container hoverable'
  template: "#choice-container-template"

  regions:
    container: '.js-choice-item'

  viewClassMap:
    'simple': SimpleChoiceView
    'combo': ComboChoiceView
    'all': QuantifierChoiceView
    'none': QuantifierChoiceView

  onShow: () ->
    ViewClass = @viewClassMap[@model.type()]
    @container.show(new ViewClass model:@model)

module.exports = Choice
