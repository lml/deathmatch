AssociatedCollection = require './associated_collection.js.coffee'
Part = require './part.js.coffee'

class Parts extends AssociatedCollection
  model: Part

  resourceName: () ->
    "parts"

module.exports = Parts
