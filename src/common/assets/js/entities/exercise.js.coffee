Backbone = require 'backbone'
Backbone.$ = require 'jquery'
require 'backbone-associations'
Part = require './part.js.coffee'
Parts = require './parts.js.coffee'

class Exercise extends Backbone.AssociatedModel

  urlRoot: '/api/exercises'

  relations: [
    {
      type: Backbone.Many
      key: 'parts'
      relatedModel: Part
      collectionType: Parts
    }
  ]

  defaults:
    number: ''

module.exports = Exercise
