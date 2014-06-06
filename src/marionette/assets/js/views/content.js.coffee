Marionette = require 'marionette'
_ = require 'underscore'

Editor = require './editor.js.coffee'
Viewer = require './viewer.js.coffee'
Prompter = require './prompter.js.coffee'

class Content extends Marionette.LayoutView

  template: "#content-template"

  regions:
    editor: '.js-editor-container'
    viewer: '.js-viewer-container'
    prompter: '.js-prompter-container'

  modeViews: () ->
    edit: @editorView
    view: @viewerView
    prompt: @prompterView

  onShow: () ->
    @editorView = new Editor()
    @viewerView = new Viewer()
    @prompterView = new Prompter @options.prompts
    @listenTo @editorView, 'content:save', () -> @triggerMethod('content:save')
    @listenTo @editorView, 'content:cancel', () -> @triggerMethod('content:cancel')
    @listenTo @viewerView, 'content:edit', () -> @triggerMethod('content:edit')
    @listenTo @prompterView, 'content:edit', () -> @triggerMethod('content:edit')
    @editor.show @editorView
    @viewer.show @viewerView
    @prompter.show @prompterView

  onContentChanged: (content) ->
    _.each @modeViews(), (view, mode) ->
      view?.triggerMethod 'content:changed', content

  onModeChanged: (content, mode) ->
    @triggerMethod('content:changed', content)
    _.each @modeViews(), (view, mode) ->
      view?.triggerMethod 'display'

  editorContent: () ->
    @editorView?.getContent()

module.exports = Content
