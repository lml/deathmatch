# @cjsx React.DOM

React = require 'react'
Content = require './content.coffee'

Exercise = React.createClass

  propTypes:
    model: React.PropTypes.object.isRequired

  getStateFromModel: () ->
    content: @props.model.get('background')

  getInitialState: () ->
    @getStateFromModel()

  onSaveBackground: (content) ->
    @props.model.set({background: content});
    @props.model.save().done () =>
      @setState @getStateFromModel()

  render: () ->
    content = @state.content
    <Content
      prompt_add="Click to add background information for the entire exercise."
      prompt_edit="Click to edit the background information for the entire exercise."
      content={content}
      onSaveContent={@onSaveBackground}
      />

module.exports = Exercise
