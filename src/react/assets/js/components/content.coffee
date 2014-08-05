# @cjsx React.DOM

React = require 'react'
React.addons = require 'react-addons'
Quill = require 'quilljs'

Viewer = React.createClass
  displayName: 'ContentViewer'

  propTypes:
    content: React.PropTypes.string

  getDefaultProps: () ->
    onEditContent: () -> debugger

  handleEdit: () ->
    @props.onEditContent()

  render: () ->
    if @props.content? and @props.content isnt ""
      <div className="viewer-container hoverable" onClick={@handleEdit}>
        <button className="action secondary on-hover"
          title={@props.prompt_edit}
          onClick={@handleEdit}>Edit</button>
        <div className="viewer" dangerouslySetInnerHTML={__html: @props.content}>
        </div>
      </div>
    else
      <div className="prompter-container" onClick={@handleEdit}>
        <div className="empty-content">
          <span className="prompt-add-tip">{@props.prompt_add}</span>
        </div>
      </div>

Editor = React.createClass
  displayName: 'ContentEditor'

  getInitialState: () ->
    objects:
      editor: null

  propTypes:
    content: React.PropTypes.string

  getDefaultProps: () ->
    onSaveContent: () -> debugger
    onCancelEdit: () -> debugger
    content: ''
    theme: 'snow'

  focus: () ->
    @state.objects.editor.focus()

  initializeEditor: () ->
    editor = new Quill @refs.editor.getDOMNode(), theme: @props.theme
    editor.addModule 'toolbar',
      container: @refs.toolbar.getDOMNode()
    editor.addModule 'toolbar',
      container: @refs.footer.getDOMNode()
    editor.setHTML @props.content
    @state.objects.editor = editor
    # Focus the editor at the end of the text
    len = editor.getLength() - 1
    editor.setSelection(len, len)

  componentDidMount: () ->
    @initializeEditor()

  componentDidUpdate: () ->
    @initializeEditor()

  componentWillReceiveProps: (newprops) ->
    @state.objects.editor.setHTML newprops.content

  handleSave: () ->
    @props.onSaveContent(@state.objects.editor.getHTML())

  handleCancel: () ->
    @props.onCancelEdit(@state.objects.editor.getHTML())

  render: () ->
    <div className="editor-container">
      <div className="ql-box">
        <div className="ql-toolbar" ref="toolbar">
          <span className="ql-format-group">
            <span title="Bold" className="ql-format-button ql-bold"></span>
            <span className="ql-format-separator"></span>
            <span title="Italic" className="ql-format-button ql-italic"></span>
            <span className="ql-format-separator"></span>
            <span title="Underline" className="ql-format-button ql-underline"></span>
            <span className="ql-format-separator"></span>
            <span title="Strikethrough" className="ql-format-button ql-strike"></span>
          </span>
          <span className="ql-format-group">
            <span title="List" className="ql-format-button ql-list"></span>
            <span className="ql-format-separator"></span>
            <span title="Bullet" className="ql-format-button ql-bullet"></span>
            <span className="ql-format-separator"></span>
            <select title="Text Alignment" defaultValue="left" className="ql-align">
              <option value="left" label="Left"></option>
              <option value="center" label="Center"></option>
              <option value="right" label="Right"></option>
              <option value="justify" label="Justify"></option>
            </select>
          </span>
          <span className="ql-format-group">
            <span title="Link" className="ql-format-button ql-link"></span>
          </span>
        </div>
        <div className="ql-editor" ref="editor"></div>
        <div className="ql-footer" ref="footer">
          <button className="action secondary" onClick={@handleCancel}>Cancel</button>
          <button className="action primary" onClick={@handleSave}>Save</button>
        </div>
      </div>
    </div>

Content = React.createClass
  displayName: 'ContentContainer'
  propTypes:
    content: React.PropTypes.string

  getInitialState: () ->
    mode: 'view'

  onEditContent: () ->
    @setState
      mode: 'edit'

  onCancelEdit: () ->
    @setState
      mode: 'view'

  onSaveContent: (content) ->
    @setState
      mode: 'view'
    @props.onSaveContent(content)

  render: () ->
    hasContent = @props.content? and @props.content isnt ""
    classes = React.addons.classSet
      'content-container': true
      'mode-edit': @state.mode is 'edit'
      'mode-view': @state.mode is 'view' and hasContent
      'mode-prompt': @state.mode is 'view' and not hasContent
    editor = () =>
      <Editor
        ref="editor"
        content={@props.content}
        onCancelEdit={@onCancelEdit}
        onSaveContent={@onSaveContent}
        />
    viewer = () =>
      <Viewer
        content={@props.content}
        prompt_add={@props.prompt_add}
        prompt_edit={@props.prompt_edit}
        onEditContent={@onEditContent}
        />

    item = if @state.mode is 'edit' then editor() else viewer()
    <div className={classes}>
      {item}
    </div>

module.exports = Content
