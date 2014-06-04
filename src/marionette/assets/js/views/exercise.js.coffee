Marionette = require 'marionette'
PartsView = require './parts.js.coffee'
ContentEditable = require '../behaviors/content_editable.js.coffee'

class Exercise extends Marionette.LayoutView

  id: 'exercise-container'
  className: 'has-drawer'
  template: '#exercise-template'

  regions:
    content: '.js-exercise-background-container'
    parts: '.js-exercise-parts-container'

  triggers:
    'click .js-add-part-button': 'part:add'

  behaviors: () ->
    self = this
    ContentEditable:
      behaviorClass: ContentEditable
      prompts:
        add: 'Click here to add background information for the entire exercise.'
        edit: 'Click to edit background information for the entire exercise.'
      contentRegion: self.content
      loadContent: () -> self.model.background
      saveChanges: (content) ->
        self.model.background = content
        self.model.save()

  onShow: () ->
    @partsView = new PartsView
      collection: @model.get('parts')
    @parts.show @partsView

  onPartAdd: () ->
    @partsView?.triggerMethod 'part:add'

module.exports = Exercise
