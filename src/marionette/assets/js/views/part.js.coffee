Marionette = require 'marionette'
QuestionsView = require './questions.js.coffee'
ContentEditable = require '../behaviors/content_editable.js.coffee'
Actionable = require '../behaviors/actionable.js.coffee'
Deleteable = require '../behaviors/deleteable.js.coffee'

class Part extends Marionette.LayoutView

  id: () ->
    "part-#{@model.get('position')}-container"

  tagName: 'li'
  className: 'part-container has-drawer'
  template: '#part-template'

  regions:
    content: '.js-part-background-container'
    questions: '.js-part-questions-container'
    actions: '.js-part-actions-container'

  triggers:
    'click .js-add-question-button': 'question:add'

  behaviors: () ->
    self = this
    Deleteable:
      behaviorClass: Deleteable
    Actionable:
      behaviorClass: Actionable
    ContentEditable:
      behaviorClass: ContentEditable
      prompts:
        add: 'Click here to add background information for this part.'
        edit: 'Click to edit background information for this part.'
      contentRegion: self.content
      loadContent: () -> self.model.background
      saveChanges: (content) ->
        self.model.background = content
        self.model.save()

  onShow: () ->
    @questionsView = new QuestionsView
      collection: @model.get('questions')
    @questions.show @questionsView

  onQuestionAdd: () ->
    @questionsView?.triggerMethod 'question:add'

module.exports = Part
