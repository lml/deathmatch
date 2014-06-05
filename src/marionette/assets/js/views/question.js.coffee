Marionette = require 'marionette'
ChoicesView = require './choices.js.coffee'
ContentEditable = require '../behaviors/content_editable.js.coffee'
$ = require 'jquery'

class Question extends Marionette.LayoutView

  id: () ->
    "part-#{@model.collection.owner().get('position')}-question-#{@model.get('position')}-container"

  tagName: 'li'
  className: 'question-container has-drawer'
  template: '#question-template'

  regions:
    content: '.js-question-stem-container'
    choices: '.js-question-choices-container'

  events:
    'click .js-add-choice-button': 'OnAddButtonClick'
    'click .js-add-combo-choice-button': 'OnAddButtonClick'
    'click .js-add-all-choice-button': 'OnAddButtonClick'
    'click .js-add-none-choice-button': 'OnAddButtonClick'

  behaviors: () ->
    self = this
    ContentEditable:
      behaviorClass: ContentEditable
      prompts:
        add: 'Click here to add the question stem.'
        edit: 'Click to edit the question stem.'
      contentRegion: self.content
      loadContent: () -> self.model.questionStem
      saveChanges: (content) ->
        self.model.questionStem = content
        self.model.save()

  onShow: () ->
    @choicesView = new ChoicesView
      collection: @model.get('choices')
    @choices.show @choicesView

  OnAddButtonClick: (e) ->
    e.preventDefault()
    e.stopPropagation()
    self = this
    _.each ['simple', 'combo', 'all', 'none'], (type) ->
      if $(e.currentTarget).hasClass "#{type}-choice"
        self.choicesView?.triggerMethod 'choice:add', type
        return false


module.exports = Question
