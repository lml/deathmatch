Backbone = require 'backbone'
Backbone.$ = require 'jquery'
require 'backbone-associations'
Questions = require './questions.js.coffee'

class Part extends Backbone.AssociatedModel

  resourceName: () ->
    "part"

  defaults:
    position: -1,
    credit: -1

  relations: [
    {
      type: Backbone.Many,
      key: 'questions',
      collectionType: Questions,
    }
  ]

module.exports = Part
