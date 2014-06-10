# @cjsx React.DOM

React = require 'react'# @cjsx React.DOM

React.addons = require 'react-addons'
Content = require './content'
Drawer = require './action_drawer'
Button = require './action_button'

Part = React.createClass
  displayName: 'Part'

  getStateFromModel: () ->
    content: @props.model.get('background')

  getInitialState: () ->
    @getStateFromModel()

  propTypes:
    model: React.PropTypes.object.isRequired

  getDefaultProps: () ->
    onPartDelete: () -> debugger

  onSaveBackground: (content) ->
    @props.model.set({background: content});
    @props.model.save().done () =>
      @setState @getStateFromModel()

  onDeletePart: () ->
    @props.model.destroy {wait: true}

  onAddQuestion: () ->
    false

  render: () ->
    content = @state.content
    <div className="part-container has-drawer">
      <Content
        prompt_add="Click to add background information for this part."
        prompt_edit="Click to edit the background information for this part."
        content={content}
        onSaveContent={@onSaveBackground}
        />
      <Drawer title="Part">
        <Button
          actionTitle="Add a new question"
          actionText="Add Question"
          actionName="AddQuestion"
          onAction={@onAddQuestion}
          />
        <Button
          actionTitle="Delete this part"
          actionText="Delete Part"
          actionName="DeletePart"
          onAction={@onDeletePart}
          />
      </Drawer>
    </div>

module.exports = Part
