AssociatedCollection = require './associated_collection.js.coffee'
Question = require './question.js.coffee'

class Questions extends AssociatedCollection
  model: Question

  resourceName: () ->
    "questions"


module.exports = Questions
