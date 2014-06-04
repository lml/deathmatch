Marionett = require 'marionette'
Quill = require 'quilljs'

class Editor extends Marionette.ItemView

  options:
    theme: 'snow'
    editorSelector: '.ql-editor'
    toolbarSelector: '.ql-toolbar'
    footerSelector: '.ql-footer'

  triggers:
    'click @ui.saveButton': 'content:save'
    'click @ui.cancelButton': 'content:cancel'

  ui:
    saveButton: '.js-editor-save-button'
    cancelButton: '.js-editor-cancel-button'

  template: "#editor-template"

  onShow: () ->
    if not @editor?
      @editor = new Quill @$(@options.editorSelector)[0], theme: @options.theme
      @editor.addModule 'toolbar',
        container:
          @$(@options.toolbarSelector)[0]
      @editor.addModule 'toolbar',
        container:
          @$(@options.footerSelector)[0]

  getContent: () ->
    @editor?.getHTML()

  onContentChanged: (html) ->
    @editor?.setHTML html

module.exports = Editor
