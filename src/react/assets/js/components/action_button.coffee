# @cjsx React.DOM

React = require 'react'
React.Addons = require 'react-addons'

ActionButton = React.createClass

  getDefaultProps: () ->
    hidden: false
    actionText: ""
    buttonMainClass: "action"
    buttonTypeClass: "secondary"
    extraButtonClasses: []

  propTypes:
    hidden: React.PropTypes.bool
    onAction: React.PropTypes.func.isRequired
    actionName: React.PropTypes.string.isRequired
    actionText: React.PropTypes.string.isRequired
    actionTitle: React.PropTypes.string

  handleAction: () ->
    @props.onAction(@props.actionName)

  render: () ->
    classes = hidden: @props.hidden
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
