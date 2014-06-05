Marionette = require 'marionette'
ChoiceView = require './choice.js.coffee'

class Choices extends Marionette.CollectionView

  tagName: 'ol'
  className: 'js-choices-list letters'
  childView: ChoiceView

  onChoiceAdd: (choiceType) ->
    @collection.create {type: choiceType}, wait: true

  onAddChild: (child) ->
    child.triggerMethod 'show'
    @triggerMethod 'children:changed'

module.exports = Choices
