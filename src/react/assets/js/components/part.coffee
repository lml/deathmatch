# @cjsx React.DOM

React = require 'react'
React.addons = require 'react-addons'

Button = require './action_button'
Content = require './content'
Drawer = require './action_drawer'
QuestionList = require './question_list'

Part = React.createClass
  displayName: 'Part'

  propTypes:
    model: React.PropTypes.object.isRequired

  getStateFromModel: () ->
    content: @props.model.get('background')
    questions: @props.model.get('questions')

  getInitialState: () ->
    @getStateFromModel()

  refreshState: () ->
    @setState @getStateFromModel()

  componentDidMount: () ->
    @props.model.on 'change', @refreshState, this
    @state.questions.on 'add remove change', @refreshState, this

  componentWillUnmount: () ->
    @props.model.off 'change', @refreshState, this
    @state.questions.off 'add remove change', @refreshState, this

  onSaveBackground: (content) ->
    @props.model.set({background: content});
    @props.model.save()

  onDeletePart: () ->
    @props.model.destroy {wait: true}

  onAddQuestion: () ->
    @state.questions.create {}, wait: true

  render: () ->
    content = @state.content
    <li className="part-container has-drawer">
      <Content
        prompt_add="Click to add background information for this part."
        prompt_edit="Click to edit the background information for this part."
        content={content}
        onSaveContent={@onSaveBackground}
        />
      <QuestionList
        collection={@state.questions}
      />
      <Drawer title="Part">
        <Button
          actionTitle="Add a new question"
          actionText="Add question"
          actionName="AddQuestion"
          onAction={@onAddQuestion}
          />
        <Button
          actionTitle="Delete this part"
          actionText="Delete part"
          actionName="DeletePart"
          onAction={@onDeletePart}
          />
      </Drawer>
    </li>

module.exports = Part
