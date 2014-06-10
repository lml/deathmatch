# @cjsx React.DOM

React = require 'react'

ActionDrawer = React.createClass

  render: () ->
    <div className="action-panel drawer">
      <h4>{@props.title}</h4>
      {@props.children}
    </div>

module.exports = ActionDrawer
