# @cjsx React.DOM

React = require 'react'
React.addons = require 'react-addons'
_ = require('underscore')

Button = require './action_button'
Content = require './content'
Drawer = require './action_drawer'

ComboChoiceViewer = React.createClass
  displayName: 'ComboChoiceViewer'

  propTypes:
    model: React.PropTypes.object.isRequired

  getDefaultProps: () ->
    onEditComboChoice: () -> debugger

  handleEdit: () ->
    @props.onEditComboChoice()

  render: () ->
    combos = @props.model.combos()
    choiceText =
      if combos.length > 1
        txt = _.map(_.initial(combos), (c) -> "(#{c.letter()})").join ', '
        txt += ' & '
        txt += "(#{_.last(combos).letter()})"
        txt
      else
        "Invalid selections. Please edit to fix."

    <div className="combo-choice-viewer viewer-container hoverable">
      <button className="action secondary on-hover"
              title="Edit combo choice"
              onClick={@handleEdit}>
        Edit
      </button>
      <div className="viewer">
        {choiceText}
      </div>
    </div>

ComboChoiceEditor = React.createClass
  displayName: 'ComboChoiceEditor'

  propTypes:
    model: React.PropTypes.object.isRequired

  getInitialState: () ->
    selections: @props.model.get('combos')

  getDefaultProps: () ->
    onCancelEdit: () -> debugger
    onSaveChanges: () -> debugger

  handleChange: () ->
    inputs = @refs.editor.getDOMNode().getElementsByTagName 'input'
    selections = (parseInt(input.value) for input in inputs when input.checked is true)
    @setState
      selections: selections

  handleClick: (event) ->
    event.currentTarget.getElementsByTagName('input')[0].checked = true;

  handleSave: () ->
    @props.model.setSelections @state.selections
    @props.model.save
    @props.onSaveChanges()
    false

  handleCancel: () ->
    @props.onCancelEdit()
    false

  render: () ->
    selections = @state.selections
    renderCheckbox = (choice) =>
      <div className='choice-selector-container' onClick={@handleClick} >
        <input type='checkbox'
               onChange={@handleChange}
               value={choice.get('id')}
               checked={choice.id in selections}
        />
        <div className="choice-letter">({choice.letter()})</div>
        <div className="choice-content" dangerouslySetInnerHTML={__html: choice.get('content')} />
      </div>
    inputs = (renderCheckbox choice for choice in @props.model.collection.simples())
    <div className="combo-choice-editor editor" ref='editor'>
      <form className="combo-choice-editor-form form" onSubmit={@handleSave}>
        {inputs}
        <div className="footer button-panel">
          <button className="action secondary" title="Cancel editing" onClick={@handleCancel}>
            Cancel
          </button>
          <button type="submit" className="action primary" title="Done editing">
            Done
          </button>
        </div>
      </form>
    </div>

ComboChoice = React.createClass
  displayName: 'ComboChoice'

  propTypes:
    model: React.PropTypes.object.isRequired

  getInitialState: () ->
    combos = @props.model.get('combos')
    mode = if combos? and combos.length > 1 then 'view' else 'edit'
    mode: mode

  onEdit: () ->
    @setState
      mode: 'edit'

  onCancelEdit: () ->
    @setState
      mode: 'view'

  render: () ->
    if @state.mode is 'edit'
      <ComboChoiceEditor
        model={@props.model}
        onSaveChanges={@onCancelEdit}
        onCancelEdit={@onCancelEdit}/>
    else
      <ComboChoiceViewer
        model={@props.model}
        onEditComboChoice={@onEdit} />

AllChoice = React.createClass
  displayName: 'AllChoice'

  render: () ->
    <div className="quantifier-choice-container viewer">
      <span className="all-choice"> All of the above </span>
    </div>

NoneChoice = React.createClass
  displayName: 'NoneChoice'

  render: () ->
    <div className="quantifier-choice-container viewer">
      <span className="none-choice"> None of the above </span>
    </div>

Choice = React.createClass
  displayName: 'Choice'

  propTypes:
    model: React.PropTypes.object.isRequired

  getStateFromModel: () ->
    content: @props.model.get('content')

  getInitialState: () ->
    @getStateFromModel()

  refreshState: () ->
    @setState @getStateFromModel()

  componentDidMount: () ->
    @props.model.on 'change', @refreshState, this

  componentWillUnmount: () ->
    @props.model.off 'change', @refreshState, this

  onSaveContent: (content) ->
    @props.model.set({content: content});
    @props.model.save()

  onDeleteChoice: () ->
    @props.model.destroy {wait: true}

  onMoveChoiceUp: () ->
    @props.model.moveUp()

  onMoveChoiceDown: () ->
    @props.model.moveDown()

  render: () ->
    content = @state.content
    choiceTitle = "Choice (#{@props.model.letter()})"
    contentNode = switch @props.model.type()
      when 'simple'
        <Content
          prompt_add="Click to add choice content."
          prompt_edit="Click to edit choice."
          content={content}
          onSaveContent={@onSaveContent}
          />
      when 'combo'
        <ComboChoice model={@props.model} />
      when 'all'
        <AllChoice />
      when 'none'
        <NoneChoice />
      else
        console.log 'Invalid choice type'

    <li className="choice-container has-drawer">
      {contentNode}
      <Drawer title={choiceTitle}>
        <Button
          hidden={not @props.model.canMoveUp()}
          actionTitle="Move choice up"
          actionText="Move up"
          actionName="MoveUp"
          onAction={@onMoveChoiceUp}
          />
        <Button
          hidden={not @props.model.canMoveDown()}
          actionTitle="Move choice down"
          actionText="Move down"
          actionName="MoveDown"
          onAction={@onMoveChoiceDown}
          />
        <Button
          actionTitle="Delete this choice"
          actionText="Delete choice"
          actionName="DeleteChoice"
          onAction={@onDeleteChoice}
          />
      </Drawer>
    </li>

module.exports = Choice
