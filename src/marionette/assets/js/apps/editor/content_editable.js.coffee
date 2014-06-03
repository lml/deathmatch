Marionette = require 'marionette'
_ = require 'underscore'
$ = require 'jquery'
Quill = require 'quilljs'

class ContentEditable extends Marionette.Behavior

  defaults:
    tips:
      add: "Click to add new content."
      edit: "Click to edit content"

  #
  # Editor modes
  #
  modes:
    edit: 'mode-edit'
    view: 'mode-view'
    prompt: 'mode-prompt'

  mode: () ->
    switch
      when @container().hasClass(@modes.edit)
        'edit'
      when @container().hasClass(@modes.view)
        'view'
      else
        'prompt'

  setMode: (mode) ->
    @container()
      .removeClass(_.without(@modes, @modes[mode]).join(' '))
      .addClass(@modes[mode])

  viewOrPrompt: (content) ->
    if not content?
      content = @options.loadContent() ? ""
    if content is ""
      @prompter().html(@options.tips.add)
      @setMode 'prompt'
    else
      @prompter().html(@options.tips.edit)
      @viewer().html(content)
      @setMode 'view'

  #
  # Element accessors
  #
  container: () ->
    @view.ui.container

  editor: () ->
    if not @_editor?
      @_editor = new Quill @options.editor.selector, theme: 'snow'
      @_editor.addModule 'toolbar',
        container:
          @options.editor.toolbar
    @_editor

  prompter: () ->
    @view.ui.prompter

  viewer: () ->
    @view.ui.viewer


  #
  # View event handlers
  #
  onContentEdit: () ->
    @editContent()

  onContentView: () ->
    @cancelEditing()

  onShow: () ->
    if @mode() is 'edit'
      @editContent()
    else
      @viewOrPrompt()

  #
  # API
  #
  cancelEditing: () ->
    # TODO: Ask for confirmation?
    if @mode() is 'edit'
      html = @options.loadContent
      @editor().setHTML html
      @viewOrPrompt html


  editContent: () ->
    @editor().setHTML @options.loadContent()
    @setMode 'edit'

  save: (cb=null) ->
    $.when(@options.saveChanges @editor().getHTML())
      .done () -> cb?()
      .fail (message) -> @showError(message)

  saveAndClose: () ->
    @save () -> @cancelEditing()

module.exports = ContentEditable
