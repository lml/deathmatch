# @cjsx React.DOM

React = require 'react'
React.addons = require 'react-addons'

Button = require './action_button'
ChoiceList = require './choice_list'
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
    @state.choices.create {type: choiceType}, wait: true

  render: () ->
    content = @state.content
    questionIndex = @props.model.collection.indexOf(@props.model) + 1
    questionTitle = "Question #{questionIndex}"
    <div className="question-container has-drawer">
      <Content
        prompt_add="Click to add the question stem."
        prompt_edit="Click to edit the question stem."
        content={content}
        onSaveContent={@onSaveStem}
        />
      <ChoiceList collection={@state.choices} />
      <Drawer title={questionTitle}>
        <Button
          hidden=false
          actionTitle="Add a new choice"
          actionText="Add choice"
          actionName="simple"
          onAction={@onAddChoice}
          />
        <Button
          hidden={not @props.model.canAddCombo()}
          actionTitle="Add a new combo choice"
          actionText="Add '(a) & (b)' choice"
          actionName="combo"
          onAction={@onAddChoice}
          />
        <Button
          hidden={not @props.model.canAddAll()}
          actionTitle="Add a new choice"
          actionText="Add 'All of the above' choice"
          actionName="all"
          onAction={@onAddChoice}
          />
        <Button
          hidden={not @props.model.canAddNone()}
          actionTitle="Add a new choice"
          actionText="Add 'None of the above' choice"
          actionName="none"
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
