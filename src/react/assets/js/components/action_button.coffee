# @cjsx React.DOM

React = require 'react'
React.Addons = require 'react-addons'
ActionButton = React.createClass

  getDefaultProps: () ->
    actionText: ""
    buttonMainClass: "action"
    buttonTypeClass: "secondary"
    extraButtonClasses: []

  propTypes:
    onAction: React.PropTypes.func.isRequired
    actionName: React.PropTypes.string.isRequired
    actionText: React.PropTypes.string.isRequired
    actionTitle: React.PropTypes.string

  handleAction: () ->
    @props.onAction(@props.actionName)

  render: () ->
    classes = {}
    classes[@props.buttonMainClass] = true
    classes[@props.buttonTypeClass] = true

    for className in @props.extraButtonClasses
      classes[className] = true
    classes = React.Addons.classSet classes
    <button className={classes}
      title={@props.actionTitle}
      name={@props.actionName}
      onClick={@handleAction}>{@props.actionText}</button>

module.exports = ActionButton
