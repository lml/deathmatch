Marionette = require 'marionette'
_ = require 'underscore'
$ = require 'jquery'

ContentView = require '../views/content.js.coffee'

class ContentEditable extends Marionette.Behavior

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

  setMode: (content, mode) ->
    @container()
      .removeClass(_.without(@modes, @modes[mode]).join(' '))
      .addClass(@modes[mode])
    @contentView?.triggerMethod('mode:changed', content, mode)

  viewOrPrompt: (content) ->
    if not content?
      content = @options.loadContent() ? ""
    mode = if content is "" then 'prompt' else 'view'
    @setMode content, mode

  #
  # Element accessors
  #
  container: () ->
    @options.contentRegion.$el

  #
  # View event handlers
  #
  onContentEdit: () ->
    @editContent()

  onContentView: () ->
    @cancelEditing()

  onContentCancel: () ->
    @cancelEditing()

  onContentSave: () ->
    @saveAndClose()

  onShow: () ->
    @contentView = new ContentView
      prompts: @options.prompts
    @listenTo @contentView, 'content:save', @saveAndClose
    @listenTo @contentView, 'content:cancel', @cancelEditing
    @listenTo @contentView, 'content:edit', @editContent

    @options.contentRegion.show @contentView
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
      @viewOrPrompt()


  editContent: () ->
    html = @options.loadContent()
    @setMode html, 'edit'

  save: (cb=null) ->
    $.when(@options.saveChanges @contentView?.editorContent())
      .done () -> cb?()
      .fail (message) -> @showError(message)

  saveAndClose: () ->
    self = this
    @save () -> self.viewOrPrompt()

module.exports = ContentEditable
