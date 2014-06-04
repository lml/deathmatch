Marionette = require 'marionette'

class Prompter extends Marionette.ItemView

  options:
    add: "Click to add new content."
    edit: "Click to edit content"

  triggers:
    'click': 'content:edit'

  template: "#prompter-template"

  onContentChanged: (content) ->
    @$el.toggleClass 'empty-content', content is ''

  serializeData: () ->
    prompts:
      add: @options.add
      edit: @options.edit

module.exports = Prompter
