# @cjsx React.DOM

React = require 'react'
React.addons = require 'react-addons'

Button = require './action_button'
Content = require './content'
Drawer = require './action_drawer'

Question = React.createClass
  displayName: 'Question'

  propTypes:
    model: React.PropTypes.object.isRequired

  getStateFromModel: () ->
    content: @props.model.get('stem')
    choices: @props.model.get('choices')

  getInitialState: () ->
    @getStateFromModel()

  refreshState: () ->
    @setState @getStateFromModel()

  componentDidMount: () ->
    @props.model.on 'change', @refreshState, this
    @state.choices.on 'add remove change', @refreshState, this

  componentWillUnmount: () ->
    @props.model.off 'change', @refreshState, this
    @state.choices.off 'add remove change', @refreshState, this

  onSaveStem: (content) ->
    @props.model.set({stem: content});
    @props.model.save()

  onDeleteQuestion: () ->
    @props.model.destroy {wait: true}

  onAddChoice: (choiceType) ->
    false

  render: () ->
    content = @state.content
    <div className="question-container has-drawer">
      <Content
        prompt_add="Click to add the question stem."
        prompt_edit="Click to edit the question stem."
        content={content}
        onSaveContent={@onSaveStem}
        />
      <Drawer title="Question">
        <Button
          hidden=false
          actionTitle="Add a new choice"
          actionText="Add choice"
          actionName="AddChoice"
          onAction={@onAddChoice}
          />
        <Button
          hidden={not @props.model.canAddCombo()}
          actionTitle="Add a new combo choice"
          actionText="Add '(a) & (b)' choice"
          actionName="AddComboChoice"
          onAction={@onAddChoice}
          />
        <Button
          hidden={not @props.model.canAddAll()}
          actionTitle="Add a new choice"
          actionText="Add 'All of the above' choice"
          actionName="AddAllChoice"
          onAction={@onAddChoice}
          />
        <Button
          hidden={not @props.model.canAddNone()}
          actionTitle="Add a new choice"
          actionText="Add 'None of the above' choice"
          actionName="AddNoneChoice"
          onAction={@onAddChoice}
          />
        <Button
          actionTitle="Delete this question"
          actionText="Delete question"
          actionName="DeleteQuestion"
          onAction={@onDeleteQuestion}
          />
      </Drawer>
    </div>

module.exports = Question
