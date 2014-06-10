# @cjsx React.DOM

React = require 'react'
React.Addons = require 'react-addons'
Content = require './content'
Drawer = require './action_drawer'
Button = require './action_button'
PartList = require './part_list'

Exercise = React.createClass

  propTypes:
    model: React.PropTypes.object.isRequired

  getStateFromModel: () ->
    content: @props.model.get('background')
    parts: @props.model.get('parts')

  refreshState: () ->
    @setState @getStateFromModel()

  componentDidMount: () ->
    @props.model.on 'change', @refreshState, this
    @state.parts.on 'add remove change', @refreshState, this

  componentWillUnmount: () ->
    @props.model.off 'change', @refreshState, this
    @state.parts.off 'add remove change', @refreshState, this

  getInitialState: () ->
    @getStateFromModel()

  onSaveBackground: (content) ->
    @props.model.set({background: content});
    @props.model.save().done () =>
      @setState @getStateFromModel()

  onAddPart: () ->
    parts = @props.model.get('parts')
    parts.create {}, wait: true

  render: () ->
    content = @state.content
    <div className="exercise-container has-drawer">
      <Content
        prompt_add="Click to add background information for the entire exercise."
        prompt_edit="Click to edit the background information for the entire exercise."
        content={content}
        onSaveContent={@onSaveBackground}
        />
      <PartList
        collection={@state.parts}
        />
      <Drawer title="Exercise">
        <Button
          actionTitle="Add a new part"
          actionText="Add Part"
          actionName="AddPart"
          onAction={@onAddPart}
          />
      </Drawer>
    </div>

module.exports = Exercise
