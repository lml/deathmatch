Marionette = require 'marionette'
ChoicesView = require './choices.js.coffee'
ContentEditable = require '../behaviors/content_editable.js.coffee'
Actionable = require '../behaviors/actionable.js.coffee'
Deleteable = require '../behaviors/deleteable.js.coffee'
$ = require 'jquery'

class Question extends Marionette.LayoutView

  id: () ->
    "part-#{@model.collection.owner().get('position')}-question-#{@model.get('position')}-container"

  initialize: () ->
    @listenTo @model.get('choices'), 'add remove', () => @triggerMethod('refresh:actions')

  tagName: 'li'
  className: 'question-container has-drawer'
  template: '#question-template'

  regions:
    content: '.js-question-stem-container'
    choices: '.js-question-choices-container'
    actions: '.js-question-actions-container'

  events:
    'click .js-add-choice-button': 'OnAddButtonClick'
    'click .js-add-combo-choice-button': 'OnAddButtonClick'
    'click .js-add-all-choice-button': 'OnAddButtonClick'
    'click .js-add-none-choice-button': 'OnAddButtonClick'

  behaviors: () ->
    Deleteable:
      behaviorClass: Deleteable
    Actionable:
      behaviorClass: Actionable
      helpers:
        canAddCombo: () =>
          @model.canAddCombo()
        canAddAll: () =>
          @model.canAddAll()
        canAddNone: () =>
          @model.canAddNone()
    ContentEditable:
      behaviorClass: ContentEditable
      prompts:
        add: 'Click here to add the question stem.'
        edit: 'Click to edit the question stem.'
      contentRegion: @content
      loadContent: () => @model.questionStem
      saveChanges: (content) =>
        @model.questionStem = content
        @model.save()

  onShow: () ->
    @choicesView = new ChoicesView
      collection: @model.get('choices')
    @choices.show @choicesView

  OnAddButtonClick: (e) ->
    e.preventDefault()
    e.stopPropagation()
    _.each ['simple', 'combo', 'all', 'none'], (type) =>
      if $(e.currentTarget).hasClass "#{type}-choice"
        @choicesView?.triggerMethod 'choice:add', type
        return false

module.exports = Question
