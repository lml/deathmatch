# @cjsx React.DOM

React = require 'react'
React.Addons = require 'react-addons'

Part = require './part'

PartList = React.createClass
  displayName: 'PartList'

  propTypes:
    collection: React.PropTypes.object.isRequired

  render: () ->
    parts = @props.collection.map (model) ->
      <Part model={model} />
    classes = React.Addons.classSet
      numbered:  parts.length > 1
    <ol className={classes}>
      {parts}
    </ol>

module.exports = PartList
