# @cjsx React.DOM

React = require 'react'
React.Addons = require 'react-addons'

Choice = require './choice'

ChoiceList = React.createClass
  displayName: 'ChoiceList'

  propTypes:
    collection: React.PropTypes.object.isRequired

  render: () ->
    choices = @props.collection.map (model) ->
      <Choice key={model.id} model={model} />
    <ol className="letters">
      {choices}
    </ol>

module.exports = ChoiceList
