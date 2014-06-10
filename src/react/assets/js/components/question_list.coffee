# @cjsx React.DOM

React = require 'react'
React.Addons = require 'react-addons'

Question = require './question'

QuestionList = React.createClass
  displayName: 'QuestionList'

  propTypes:
    collection: React.PropTypes.object.isRequired

  render: () ->
    questions = @props.collection.map (model) ->
      <Question model={model} />
    <ol>
      {questions}
    </ol>

module.exports = QuestionList
