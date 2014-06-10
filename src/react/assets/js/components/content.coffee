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
      <div className="viewer-container hoverable">
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

  propTypes:
    content: React.PropTypes.string

  getDefaultProps: () ->
    onSaveContent: () -> debugger
    onCancelEdit: () -> debugger
    content: ''
    theme: 'snow'

  focus: () ->
    @state.editor.focus()

  componentDidMount: () ->
    editor = new Quill @refs.editor.getDOMNode(), theme: @props.theme
    editor.addModule 'toolbar',
      container: @refs.toolbar.getDOMNode()
    editor.addModule 'toolbar',
      container: @refs.footer.getDOMNode()
    editor.setHTML @props.content
    @setState editor: editor

  componentWillReceiveProps: (newprops) ->
    editor = @state.editor.setHTML newprops.content

  handleSave: () ->
    @props.onSaveContent(@state.editor.getHTML())

  handleCancel: () ->
    @props.onCancelEdit(@state.editor.getHTML())

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
    @refs.editor.focus()

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
    <div className={classes}>
      <Editor
        ref="editor"
        content={@props.content}
        onCancelEdit={@onCancelEdit}
        onSaveContent={@onSaveContent}
        />
      <Viewer
        content={@props.content}
        prompt_add={@props.prompt_add}
        prompt_edit={@props.prompt_edit}
        onEditContent={@onEditContent}
        />
    </div>

module.exports = Content
