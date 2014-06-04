Marionette = require 'marionette'
ContentEditable = require '../behaviors/content_editable.js.coffee'

class Question extends Marionette.LayoutView

  id: () ->
    "part-#{@model.collection.owner().get('position')}-question-#{@model.get('position')}-container"

  tagName: 'li'
  className: 'has-drawer'
  template: '#question-template'

  regions:
    content: '.js-question-stem-container'
    questions: '.js-question-choices-container'

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

module.exports = Question
