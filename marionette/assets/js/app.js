(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var AssociatedCollection, Backbone,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require("./../../../../../bower_components/backbone/backbone.js");

require("./../../../../../bower_components/backbone-associations/backbone-associations.js");

AssociatedCollection = (function(_super) {
  __extends(AssociatedCollection, _super);

  function AssociatedCollection() {
    return AssociatedCollection.__super__.constructor.apply(this, arguments);
  }

  AssociatedCollection.prototype.owner = function() {
    if ((this.parents != null) && (this.parents[0] != null)) {
      return this.parents[0];
    }
  };

  AssociatedCollection.prototype.resourceName = function() {
    return this.constructor.name.toLowerCase();
  };

  AssociatedCollection.prototype.url = function() {
    var owner;
    owner = this.owner();
    if (owner) {
      return "" + (owner.url()) + "/" + (this.resourceName());
    }
  };

  return AssociatedCollection;

})(Backbone.Collection);

module.exports = AssociatedCollection;


},{"./../../../../../bower_components/backbone-associations/backbone-associations.js":"isMywK","./../../../../../bower_components/backbone/backbone.js":"KDJVm1"}],2:[function(require,module,exports){
var Backbone, Choice, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require("./../../../../../bower_components/backbone/backbone.js");

require("./../../../../../bower_components/backbone-associations/backbone-associations.js");

_ = require("./../../../../../bower_components/underscore/underscore.js");

Choice = (function(_super) {
  __extends(Choice, _super);

  function Choice() {
    return Choice.__super__.constructor.apply(this, arguments);
  }

  Choice.prototype.question = function() {
    return this.collection.owner();
  };

  Choice.prototype.position = function() {
    return this.get('position');
  };

  Choice.prototype.letter = function() {
    return String.fromCharCode(97 + this.position());
  };

  Choice.prototype.canMoveUp = function() {
    return this.type() === 'simple' && this.position() > 0;
  };

  Choice.prototype.canMoveDown = function() {
    var isBottom, isLastSimpleChoice;
    isBottom = (function(_this) {
      return function() {
        return _this.position() === _this.collection.length - 1;
      };
    })(this);
    isLastSimpleChoice = (function(_this) {
      return function() {
        return _this.collection.at(_this.position() + 1).type() !== 'simple';
      };
    })(this);
    return this.type() === 'simple' && !(isBottom() || isLastSimpleChoice());
  };

  Choice.prototype.type = function() {
    return this.get('type');
  };

  Choice.prototype.weight = function() {
    switch (this.type()) {
      case 'simple':
        return -100 + this.position();
      case 'all':
        return 500;
      case 'none':
        return 10000;
      default:
        return this.get('combos').length;
    }
  };

  Choice.prototype.compare = function(other) {
    var leftWins, res, result, rightWins, simple_compare, tied, _ref;
    leftWins = -1;
    rightWins = 1;
    tied = 0;
    simple_compare = function(l, r) {
      switch (false) {
        case l !== r:
          return tied;
        case !(l < r):
          return leftWins;
        default:
          return rightWins;
      }
    };
    result = simple_compare(this.weight(), other.weight());
    if (result === tied && (this.type() === (_ref = other.type()) && _ref === 'combo')) {
      res = _.find(_.zip(this.combos(), other.combos()), function(_arg) {
        var l, r;
        l = _arg[0], r = _arg[1];
        return l.compare(r) !== tied;
      });
      result = res ? res[0].compare(res[1]) : tied;
    }
    return result;
  };

  Choice.prototype.setSelections = function(ids) {
    if (this.type() === 'combo') {
      return this.set({
        'combos': ids
      });
    }
  };

  Choice.prototype.selections = function() {
    var combos, selected, simple, simples, statuses, _i, _len, _results;
    if (this.type() === 'combo') {
      simples = this.collection.filter((function(_this) {
        return function(c) {
          return c.type() === 'simple';
        };
      })(this));
      combos = this.get('combos');
      selected = function(simple) {
        return _.contains(combos, simple.get('id'));
      };
      statuses = {};
      _results = [];
      for (_i = 0, _len = simples.length; _i < _len; _i++) {
        simple = simples[_i];
        _results.push([simple, selected(simple)]);
      }
      return _results;
    }
  };

  Choice.prototype.combos = function() {
    var selections;
    if (this.type() === 'combo') {
      selections = this.get('combos').map((function(_this) {
        return function(csc) {
          return _this.collection.get(csc);
        };
      })(this));
      return _.sortBy(selections, function(sc) {
        return sc.position();
      });
    }
  };

  Choice.prototype.moveUp = function() {
    var idx;
    if (this.canMoveUp()) {
      idx = this.position();
    }
    return this.collection.move(idx, idx - 1);
  };

  Choice.prototype.moveDown = function() {
    var idx;
    if (this.canMoveDown()) {
      idx = this.position();
    }
    return this.collection.move(idx, idx + 1);
  };

  return Choice;

})(Backbone.AssociatedModel);

module.exports = Choice;


},{"./../../../../../bower_components/backbone-associations/backbone-associations.js":"isMywK","./../../../../../bower_components/backbone/backbone.js":"KDJVm1","./../../../../../bower_components/underscore/underscore.js":"l0hNr+"}],3:[function(require,module,exports){
var $, AssociatedCollection, Backbone, Choice, Choices, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require("./../../../../../bower_components/backbone/backbone.js");

AssociatedCollection = require('./associated_collection.js.coffee');

Choice = require('./choice.js.coffee');

$ = require("./../../../../../bower_components/jquery/dist/jquery.js");

_ = require("./../../../../../bower_components/underscore/underscore.js");

Choices = (function(_super) {
  __extends(Choices, _super);

  function Choices() {
    return Choices.__super__.constructor.apply(this, arguments);
  }

  Choices.prototype.model = Choice;

  Choices.prototype.positionField = 'position';

  Choices.prototype.initialize = function() {
    this.listenTo(this, 'add remove sort', this.setPositionsFromIndex);
    return this.listenTo(this, 'change:combos', (function(_this) {
      return function() {
        return _this.sort();
      };
    })(this));
  };

  Choices.prototype.comparator = function(left, right) {
    return left.compare(right);
  };

  Choices.prototype.savePositions = function(options) {
    if (options == null) {
      options = {};
    }
    if (this.models.length === 0) {
      return;
    }
    _.defaults(options, {
      attrs: {
        order: _.map(this.filter(function(model) {
          return model.hasChanged;
        }), function(model) {
          return {
            id: model.get('id'),
            position: model.get(this.positionField)
          };
        })
      }
    });
    return this.sync('update', this, options);
  };

  Choices.prototype.setPositionsFromIndex = function() {
    return this.each((function(_this) {
      return function(model, index) {
        return model.set(_this.positionField, index);
      };
    })(this));
  };

  Choices.prototype.simples = function() {
    return this.filter(function(c) {
      return c.type() === 'simple';
    });
  };

  Choices.prototype.move = function(from, to) {
    if (from instanceof Backbone.Model) {
      from = from.get(this.positionField);
    }
    this.models.splice(to, 0, this.models.splice(from, 1)[0]);
    this.setPositionsFromIndex();
    this.sort();
    return this.savePositions({
      error: (function(_this) {
        return function() {
          return alert('sort order could not be saved, please reload this page');
        };
      })(this)
    });
  };

  return Choices;

})(AssociatedCollection);

module.exports = Choices;


},{"./../../../../../bower_components/backbone/backbone.js":"KDJVm1","./../../../../../bower_components/jquery/dist/jquery.js":"d6Ad4U","./../../../../../bower_components/underscore/underscore.js":"l0hNr+","./associated_collection.js.coffee":1,"./choice.js.coffee":2}],4:[function(require,module,exports){
var Backbone, Exercise, Part, Parts,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require("./../../../../../bower_components/backbone/backbone.js");

require("./../../../../../bower_components/backbone-associations/backbone-associations.js");

Part = require('./part.js.coffee');

Parts = require('./parts.js.coffee');

Exercise = (function(_super) {
  __extends(Exercise, _super);

  function Exercise() {
    return Exercise.__super__.constructor.apply(this, arguments);
  }

  Exercise.prototype.urlRoot = '/api/exercises';

  Exercise.prototype.relations = [
    {
      type: Backbone.Many,
      key: 'parts',
      relatedModel: Part,
      collectionType: Parts
    }
  ];

  Exercise.prototype.defaults = {
    number: ''
  };

  return Exercise;

})(Backbone.AssociatedModel);

module.exports = Exercise;


},{"./../../../../../bower_components/backbone-associations/backbone-associations.js":"isMywK","./../../../../../bower_components/backbone/backbone.js":"KDJVm1","./part.js.coffee":5,"./parts.js.coffee":6}],5:[function(require,module,exports){
var Backbone, Part, Questions,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require("./../../../../../bower_components/backbone/backbone.js");

require("./../../../../../bower_components/backbone-associations/backbone-associations.js");

Questions = require('./questions.js.coffee');

Part = (function(_super) {
  __extends(Part, _super);

  function Part() {
    return Part.__super__.constructor.apply(this, arguments);
  }

  Part.prototype.defaults = {
    position: -1,
    credit: -1
  };

  Part.prototype.relations = [
    {
      type: Backbone.Many,
      key: 'questions',
      collectionType: Questions
    }
  ];

  return Part;

})(Backbone.AssociatedModel);

module.exports = Part;


},{"./../../../../../bower_components/backbone-associations/backbone-associations.js":"isMywK","./../../../../../bower_components/backbone/backbone.js":"KDJVm1","./questions.js.coffee":8}],6:[function(require,module,exports){
var AssociatedCollection, Part, Parts,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AssociatedCollection = require('./associated_collection.js.coffee');

Part = require('./part.js.coffee');

Parts = (function(_super) {
  __extends(Parts, _super);

  function Parts() {
    return Parts.__super__.constructor.apply(this, arguments);
  }

  Parts.prototype.model = Part;

  return Parts;

})(AssociatedCollection);

module.exports = Parts;


},{"./associated_collection.js.coffee":1,"./part.js.coffee":5}],7:[function(require,module,exports){
var Backbone, Choices, Question, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Backbone = require("./../../../../../bower_components/backbone/backbone.js");

require("./../../../../../bower_components/backbone-associations/backbone-associations.js");

Choices = require('./choices.js.coffee');

_ = require("./../../../../../bower_components/underscore/underscore.js");

Question = (function(_super) {
  __extends(Question, _super);

  function Question() {
    return Question.__super__.constructor.apply(this, arguments);
  }

  Question.prototype.defaults = {
    type: 'multiple_choice_question'
  };

  Question.prototype.counts = function() {
    var counts;
    counts = this.get('choices').countBy('type');
    return _.extend({}, {
      all: 0,
      none: 0,
      simple: 0,
      combo: 0
    }, counts);
  };

  Question.prototype.canAddCombo = function() {
    var counts, n;
    counts = this.counts();
    n = counts.simple;
    return n >= 2 && counts.combo < (Math.pow(2, n) - (n + 1));
  };

  Question.prototype.canAddAll = function() {
    var counts;
    counts = this.counts();
    return counts.all === 0 && counts.simple >= 2;
  };

  Question.prototype.canAddNone = function() {
    var counts;
    counts = this.counts();
    return counts.simple > 1 && counts.none === 0;
  };

  Question.prototype.relations = [
    {
      type: Backbone.Many,
      key: 'choices',
      collectionType: Choices
    }
  ];

  return Question;

})(Backbone.AssociatedModel);

module.exports = Question;


},{"./../../../../../bower_components/backbone-associations/backbone-associations.js":"isMywK","./../../../../../bower_components/backbone/backbone.js":"KDJVm1","./../../../../../bower_components/underscore/underscore.js":"l0hNr+","./choices.js.coffee":3}],8:[function(require,module,exports){
var AssociatedCollection, Question, Questions,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AssociatedCollection = require('./associated_collection.js.coffee');

Question = require('./question.js.coffee');

Questions = (function(_super) {
  __extends(Questions, _super);

  function Questions() {
    return Questions.__super__.constructor.apply(this, arguments);
  }

  Questions.prototype.model = Question;

  return Questions;

})(AssociatedCollection);

module.exports = Questions;


},{"./associated_collection.js.coffee":1,"./question.js.coffee":7}],9:[function(require,module,exports){
var fauxServer = require("./../../../../../bower_components/backbone-faux-server/backbone-faux-server.js");
var _ = require("./../../../../../bower_components/underscore/underscore.js");

// The deathmatch namespace.
var deathMatch = deathMatch || {};

deathMatch.stub = function() {
    var self = this;

    function updateAttributes(from, to, atts) {
        _.each(atts, function(att) {
            var res = _.result(from, att);
            if (res) {
                to[att] = res;
            }
        });
    };

    self.maxIds = {
        exercise: 1,
        part: 0,
        question: 0,
        choice: 0
    };

    self.exercise = {
        background: "",
        parts: []
    };

    self.find = function(coll, id) {
        id = parseInt(id);
        return _.findWhere(coll, {
            id: id
        });
    };

    self.findPart = function(exerciseId, partId) {
        return self.find(exercise.parts, partId);
    };

    self.findQuestion = function(exerciseId, partId, questionId) {
        var part = self.findPart(exerciseId, partId);
        return self.find(part.questions, questionId);
    };

    self.findChoice = function(exerciseId, partId, questionId, choiceId) {
        var question = self.findQuestion(exerciseId, partId, questionId);
        return self.find(question.choices, choiceId);
    };

    self.update = function(exerciseId, data) {
        self.exercise.background = data.background;
        return self.exercise;
    };

    self.addPart = function(exerciseId, data) {
        self.maxIds.part += 1;
        data.id = self.maxIds.part;
        data.background = "";
        data.position = self.exercise.parts.length;
        data.questions = [];
        self.exercise.parts.push(data);
        return data;
    };

    self.updatePart = function(exerciseId, partId, data) {
        var part = self.findPart(exerciseId, partId);
        updateAttributes(data, part, ['background', 'questions']);
        return part;
    };

    self.removePart = function(exerciseId, partId) {
        var parts = self.exercise.parts;
        var part = self.findPart(exerciseId, partId);
        var index = parts.indexOf(part);
        if (index >= 0) {
            parts.splice(index, 1);
        }
        return {
            success: true
        };
    };

    self.addQuestion = function(exerciseId, partId, data) {
        var part = self.findPart(exerciseId, partId);
        var questions = part.questions;
        self.maxIds.question += 1;
        data.id = self.maxIds.question;
        data.position = questions.length;
        data.stem = "";
        data.choices = [];
        questions.push(data);
        return data;
    };

    self.updateQuestion = function(exerciseId, partId, questionId, data) {
        var part = self.findPart(exerciseId, partId);
        var questions = part.questions;
        var question = self.findQuestion(exerciseId, partId, questionId);
        updateAttributes(data, question, ['stem', 'choices']);
        return question;
    };

    self.removeQuestion = function(exerciseId, partId, questionId) {
        var part = self.findPart(exerciseId, partId);
        var questions = part.questions;
        var question = self.findQuestion(exerciseId, partId, questionId);
        var index = questions.indexOf(question);
        if (index >= 0) {
            questions.splice(index, 1);
        }
        return {
            success: true
        };
    };

    self.updateChoices = function(exerciseId, partId, questionId, data) {
        var part = self.findPart(exerciseId, partId);
        var questions = part.questions;
        var question = self.findQuestion(exerciseId, partId, questionId);
        var choices = question.choices;
        if (data.order) {
            _.each(choices, function(choice) {
                choice.position = data.order[choice.id];
            });
            return {
                success: true
            };
        } else {
            return {
                success: false
            };
        }
    };

    self.addChoice = function(exerciseId, partId, questionId, data) {
        var part = self.findPart(exerciseId, partId);
        var questions = part.questions;
        var question = self.findQuestion(exerciseId, partId, questionId);
        var choices = question.choices;
        self.maxIds.choice += 1;
        data.id = self.maxIds.choice;
        data.position = choices.length;
        data.content = "";
        data.combos = [];
        choices.push(data);
        return data;
    };

    self.updateChoice = function(exerciseId, partId, questionId, choiceId, data) {
        var part = self.findPart(exerciseId, partId);
        var questions = part.questions;
        var question = self.findQuestion(exerciseId, partId, questionId);
        var choices = question.choices;
        var choice = self.findChoice(exerciseId, partId, questionId, choiceId);
        updateAttributes(data, choice, ['position', 'content', 'combos']);
        return choice;
    };

    self.removeChoice = function(exerciseId, partId, questionId, choiceId) {
        var part = self.findPart(exerciseId, partId);
        var questions = part.questions;
        var question = self.findQuestion(exerciseId, partId, questionId);
        var choices = question.choices;
        var choice = self.findChoice(exerciseId, partId, questionId, choiceId);
        var index = choices.indexOf(choice);
        if (index >= 0) {
            choices.splice(index, 1);
        }
        return {
            succes: true
        };
    };

    return {
        exercise: {
            parts: self.exercise.parts,
            update: self.update,
            addPart: self.addPart,
            updatePart: self.updatePart,
            removePart: self.removePart,
            addQuestion: self.addQuestion,
            updateQuestion: self.updateQuestion,
            removeQuestion: self.removeQuestion,
            addChoice: self.addChoice,
            updateChoice: self.updateChoice,
            updateChoices: self.updateChoices,
            removeChoice: self.removeChoice
        }
    };
};

var exercise = deathMatch.stub().exercise;

fauxServer
    .put("/api/exercises/:exerciseId",
        function(context, exerciseId) {
            return exercise.update(exerciseId, context.data);
        })
    .post("/api/exercises/:exerciseId/parts",
        function(context, exerciseId) {
            return exercise.addPart(exerciseId, context.data);
        })
    .put("/api/exercises/:exerciseId/parts/:partId",
        function(context, exerciseId, partId) {
            return exercise.updatePart(exerciseId, partId, context.data);
        })
    .del("/api/exercises/:exerciseId/parts/:partId",
        function(context, exerciseId, partId) {
            return exercise.removePart(exerciseId, partId);
        })
    .post("/api/exercises/:exerciseId/parts/:partId/questions",
        function(context, exerciseId, partId) {
            return exercise.addQuestion(exerciseId, partId, context.data);
        })
    .put("/api/exercises/:exerciseId/parts/:partId/questions/:questionId",
        function(context, exerciseId, partId, questionId) {
            return exercise.updateQuestion(exerciseId, partId, questionId, context.data);
        })
    .del("/api/exercises/:exerciseId/parts/:partId/questions/:questionId",
        function(context, exerciseId, partId, questionId) {
            return exercise.removeQuestion(exerciseId, partId, questionId);
        })
    .put("/api/exercises/:exerciseId/parts/:partId/questions/:questionId/choices",
        function(context, exerciseId, partId, questionId) {
            return exercise.updateChoices(exerciseId, partId, questionId, context.data);
        })
    .post("/api/exercises/:exerciseId/parts/:partId/questions/:questionId/choices",
        function(context, exerciseId, partId, questionId) {
            return exercise.addChoice(exerciseId, partId, questionId, context.data);
        })
    .put("/api/exercises/:exerciseId/parts/:partId/questions/:questionId/choices/:choiceId",
        function(context, exerciseId, partId, questionId, choiceId) {
            return exercise.updateChoice(exerciseId, partId, questionId, choiceId, context.data);
        })
    .del("/api/exercises/:exerciseId/parts/:partId/questions/:questionId/choices/:choiceId",
        function(context, exerciseId, partId, questionId, choiceId) {
            return exercise.removeChoice(exerciseId, partId, questionId, choiceId);
        });

fauxServer.enable();

},{"./../../../../../bower_components/backbone-faux-server/backbone-faux-server.js":"i/emQT","./../../../../../bower_components/underscore/underscore.js":"l0hNr+"}],10:[function(require,module,exports){
var Backbone, ExerciseEditor, ExerciseModel, ExerciseView, Marionette, PartsCollection;

Backbone = require("./../../../../bower_components/backbone/backbone.js");

Backbone.$ = require("./../../../../bower_components/jquery/dist/jquery.js");

Backbone._ = require("./../../../../bower_components/underscore/underscore.js");

Marionette = require("./../../../../bower_components/marionette/lib/backbone.marionette.js");

ExerciseModel = require('../../../common/assets/js/entities/exercise.js.coffee');

ExerciseView = require('./views/exercise.js.coffee');

PartsCollection = require('../../../common/assets/js/entities/parts.js.coffee');

require('../../../common/assets/js/stubs/api.js');

ExerciseEditor = new Marionette.Application;

ExerciseEditor.addRegions({
  exerciseRegion: "#exercise-editor"
});

ExerciseEditor.on("start", function() {
  var exercise, exerciseView;
  exercise = new ExerciseModel({
    id: 1
  });
  exercise.set({
    parts: new PartsCollection
  });
  exerciseView = new ExerciseView({
    model: exercise
  });
  return ExerciseEditor.exerciseRegion.show(exerciseView);
});

ExerciseEditor.start();


},{"../../../common/assets/js/entities/exercise.js.coffee":4,"../../../common/assets/js/entities/parts.js.coffee":6,"../../../common/assets/js/stubs/api.js":9,"./../../../../bower_components/backbone/backbone.js":"KDJVm1","./../../../../bower_components/jquery/dist/jquery.js":"d6Ad4U","./../../../../bower_components/marionette/lib/backbone.marionette.js":"KEBL1D","./../../../../bower_components/underscore/underscore.js":"l0hNr+","./views/exercise.js.coffee":22}],11:[function(require,module,exports){
var Actionable, ActionsView, Marionette, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Marionette = require("./../../../../../bower_components/marionette/lib/backbone.marionette.js");

ActionsView = require('../views/actions.js.coffee');

_ = require("./../../../../../bower_components/underscore/underscore.js");

Actionable = (function(_super) {
  __extends(Actionable, _super);

  function Actionable() {
    return Actionable.__super__.constructor.apply(this, arguments);
  }

  Actionable.prototype.defaults = function() {
    return {
      helpers: {
        number: (function(_this) {
          return function() {
            return _this.view.model.collection.indexOf(_this.view.model) + 1;
          };
        })(this)
      }
    };
  };

  Actionable.prototype.onShow = function() {
    this.actionsView = new ActionsView({
      model: this.view.model,
      helpers: _.extend({}, this.defaults.helpers, this.options.helpers)
    });
    return this.view.actions.show(this.actionsView);
  };

  Actionable.prototype.onRefreshActions = function() {
    var _ref;
    return (_ref = this.actionsView) != null ? _ref.rerender() : void 0;
  };

  return Actionable;

})(Marionette.Behavior);

module.exports = Actionable;


},{"../views/actions.js.coffee":14,"./../../../../../bower_components/marionette/lib/backbone.marionette.js":"KEBL1D","./../../../../../bower_components/underscore/underscore.js":"l0hNr+"}],12:[function(require,module,exports){
var $, ContentEditable, ContentView, Marionette, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Marionette = require("./../../../../../bower_components/marionette/lib/backbone.marionette.js");

_ = require("./../../../../../bower_components/underscore/underscore.js");

$ = require("./../../../../../bower_components/jquery/dist/jquery.js");

ContentView = require('../views/content.js.coffee');

ContentEditable = (function(_super) {
  __extends(ContentEditable, _super);

  function ContentEditable() {
    return ContentEditable.__super__.constructor.apply(this, arguments);
  }

  ContentEditable.prototype.modes = {
    edit: 'mode-edit',
    view: 'mode-view',
    prompt: 'mode-prompt'
  };

  ContentEditable.prototype.mode = function() {
    switch (false) {
      case !this.container().hasClass(this.modes.edit):
        return 'edit';
      case !this.container().hasClass(this.modes.view):
        return 'view';
      default:
        return 'prompt';
    }
  };

  ContentEditable.prototype.setMode = function(content, mode) {
    var _ref;
    this.container().removeClass(_.without(this.modes, this.modes[mode]).join(' ')).addClass(this.modes[mode]);
    return (_ref = this.contentView) != null ? _ref.triggerMethod('mode:changed', content, mode) : void 0;
  };

  ContentEditable.prototype.viewOrPrompt = function(content) {
    var mode, _ref;
    if (content == null) {
      content = (_ref = this.options.loadContent()) != null ? _ref : "";
    }
    mode = content === "" ? 'prompt' : 'view';
    return this.setMode(content, mode);
  };

  ContentEditable.prototype.container = function() {
    return this.options.contentRegion.$el;
  };

  ContentEditable.prototype.onContentEdit = function() {
    return this.editContent();
  };

  ContentEditable.prototype.onContentView = function() {
    return this.cancelEditing();
  };

  ContentEditable.prototype.onContentCancel = function() {
    return this.cancelEditing();
  };

  ContentEditable.prototype.onContentSave = function() {
    return this.saveAndClose();
  };

  ContentEditable.prototype.onShow = function() {
    this.contentView = new ContentView({
      prompts: this.options.prompts
    });
    this.listenTo(this.contentView, 'content:save', this.saveAndClose);
    this.listenTo(this.contentView, 'content:cancel', this.cancelEditing);
    this.listenTo(this.contentView, 'content:edit', this.editContent);
    this.options.contentRegion.show(this.contentView);
    if (this.mode() === 'edit') {
      return this.editContent();
    } else {
      return this.viewOrPrompt();
    }
  };

  ContentEditable.prototype.cancelEditing = function() {
    if (this.mode() === 'edit') {
      return this.viewOrPrompt();
    }
  };

  ContentEditable.prototype.editContent = function() {
    var html;
    html = this.options.loadContent();
    return this.setMode(html, 'edit');
  };

  ContentEditable.prototype.save = function(cb) {
    var _ref;
    if (cb == null) {
      cb = null;
    }
    return $.when(this.options.saveChanges((_ref = this.contentView) != null ? _ref.editorContent() : void 0)).done(function() {
      return typeof cb === "function" ? cb() : void 0;
    }).fail(function(message) {
      return this.showError(message);
    });
  };

  ContentEditable.prototype.saveAndClose = function() {
    var self;
    self = this;
    return this.save(function() {
      return self.viewOrPrompt();
    });
  };

  return ContentEditable;

})(Marionette.Behavior);

module.exports = ContentEditable;


},{"../views/content.js.coffee":20,"./../../../../../bower_components/jquery/dist/jquery.js":"d6Ad4U","./../../../../../bower_components/marionette/lib/backbone.marionette.js":"KEBL1D","./../../../../../bower_components/underscore/underscore.js":"l0hNr+"}],13:[function(require,module,exports){
var Deletable, Marionette,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Marionette = require("./../../../../../bower_components/marionette/lib/backbone.marionette.js");

Deletable = (function(_super) {
  __extends(Deletable, _super);

  function Deletable() {
    return Deletable.__super__.constructor.apply(this, arguments);
  }

  Deletable.prototype.events = function() {
    var eventName, evs;
    eventName = "click .js-delete-" + (this.view.model.constructor.name.toLowerCase()) + "-button";
    evs = {};
    evs[eventName] = 'deleteClicked';
    return evs;
  };

  Deletable.prototype.deleteClicked = function() {
    return this.view.model.destroy();
  };

  return Deletable;

})(Marionette.Behavior);

module.exports = Deletable;


},{"./../../../../../bower_components/marionette/lib/backbone.marionette.js":"KEBL1D"}],14:[function(require,module,exports){
var Actions, Marionette,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Marionette = require("./../../../../../bower_components/marionette/lib/backbone.marionette.js");

Actions = (function(_super) {
  __extends(Actions, _super);

  function Actions() {
    return Actions.__super__.constructor.apply(this, arguments);
  }

  Actions.prototype.initialize = function() {
    this.template = "#" + ("" + (this.model.constructor.name.toLowerCase()) + "-actions-template");
    return this.listenTo(this.model.collection, 'change add remove', this.rerender);
  };

  Actions.prototype.rerender = function() {
    if (!this.isDestroyed) {
      return this.render();
    }
  };

  Actions.prototype.templateHelpers = function() {
    return this.options.helpers;
  };

  return Actions;

})(Marionette.ItemView);

module.exports = Actions;


},{"./../../../../../bower_components/marionette/lib/backbone.marionette.js":"KEBL1D"}],15:[function(require,module,exports){
var Actionable, Choice, ComboChoiceView, Deleteable, Marionette, QuantifierChoiceView, SimpleChoiceView,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Marionette = require("./../../../../../bower_components/marionette/lib/backbone.marionette.js");

SimpleChoiceView = require('./simple_choice.js.coffee');

ComboChoiceView = require('./combo_choice.js.coffee');

QuantifierChoiceView = require('./quantifier_choice.js.coffee');

Actionable = require('../behaviors/actionable.js.coffee');

Deleteable = require('../behaviors/deleteable.js.coffee');

Choice = (function(_super) {
  __extends(Choice, _super);

  function Choice() {
    return Choice.__super__.constructor.apply(this, arguments);
  }

  Choice.prototype.id = function() {
    var choice, part, question;
    part = this.model.collection.owner().collection.owner().get('position');
    question = this.model.collection.owner().get('position');
    choice = this.model.position();
    return "part-" + part + "-question-" + question + "-choice-" + choice + "-container";
  };

  Choice.prototype.tagName = 'li';

  Choice.prototype.className = 'js-choice-container choice-container has-drawer';

  Choice.prototype.template = "#choice-container-template";

  Choice.prototype.triggers = {
    'click .js-move-up-choice-button': 'choice:moveup',
    'click .js-move-down-choice-button': 'choice:movedown'
  };

  Choice.prototype.regions = {
    container: '.js-choice-item',
    actions: '.js-choice-actions-container'
  };

  Choice.prototype.behaviors = function() {
    return {
      Deleteable: {
        behaviorClass: Deleteable
      },
      Actionable: {
        behaviorClass: Actionable,
        helpers: {
          letter: (function(_this) {
            return function() {
              return _this.model.letter();
            };
          })(this),
          canMoveUp: (function(_this) {
            return function() {
              return _this.model.canMoveUp();
            };
          })(this),
          canMoveDown: (function(_this) {
            return function() {
              return _this.model.canMoveDown();
            };
          })(this)
        }
      }
    };
  };

  Choice.prototype.viewClassMap = {
    'simple': SimpleChoiceView,
    'combo': ComboChoiceView,
    'all': QuantifierChoiceView,
    'none': QuantifierChoiceView
  };

  Choice.prototype.onShow = function() {
    var ViewClass;
    ViewClass = this.viewClassMap[this.model.type()];
    return this.container.show(new ViewClass({
      model: this.model
    }));
  };

  Choice.prototype.onChoiceMoveup = function() {
    return this.model.moveUp();
  };

  Choice.prototype.onChoiceMovedown = function() {
    return this.model.moveDown();
  };

  return Choice;

})(Marionette.LayoutView);

module.exports = Choice;


},{"../behaviors/actionable.js.coffee":11,"../behaviors/deleteable.js.coffee":13,"./../../../../../bower_components/marionette/lib/backbone.marionette.js":"KEBL1D","./combo_choice.js.coffee":17,"./quantifier_choice.js.coffee":26,"./simple_choice.js.coffee":29}],16:[function(require,module,exports){
var ChoiceView, Choices, Marionette,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Marionette = require("./../../../../../bower_components/marionette/lib/backbone.marionette.js");

ChoiceView = require('./choice.js.coffee');

Choices = (function(_super) {
  __extends(Choices, _super);

  function Choices() {
    return Choices.__super__.constructor.apply(this, arguments);
  }

  Choices.prototype.tagName = 'ol';

  Choices.prototype.className = 'js-choices-list letters';

  Choices.prototype.childView = ChoiceView;

  Choices.prototype.onChoiceAdd = function(choiceType) {
    return this.collection.create({
      type: choiceType
    }, {
      wait: true
    });
  };

  Choices.prototype.onAddChild = function(child) {
    child.triggerMethod('show');
    return this.triggerMethod('children:changed');
  };

  return Choices;

})(Marionette.CollectionView);

module.exports = Choices;


},{"./../../../../../bower_components/marionette/lib/backbone.marionette.js":"KEBL1D","./choice.js.coffee":15}],17:[function(require,module,exports){
var ComboChoice, ComboChoiceEditor, ComboChoiceViewer, Marionette,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Marionette = require("./../../../../../bower_components/marionette/lib/backbone.marionette.js");

ComboChoiceViewer = require('./combo_choice_viewer.js.coffee');

ComboChoiceEditor = require('./combo_choice_editor.js.coffee');

ComboChoice = (function(_super) {
  __extends(ComboChoice, _super);

  function ComboChoice() {
    return ComboChoice.__super__.constructor.apply(this, arguments);
  }

  ComboChoice.prototype.className = 'js-combo-choice-container';

  ComboChoice.prototype.template = '#combo-choice-container-template';

  ComboChoice.prototype.regions = {
    viewer: '.js-combo-viewer-container',
    editor: '.js-combo-editor-container'
  };

  ComboChoice.prototype.onShow = function() {
    this.viewer.show(new ComboChoiceViewer({
      model: this.model
    }));
    return this.editor.show(new ComboChoiceEditor({
      model: this.model
    }));
  };

  return ComboChoice;

})(Marionette.LayoutView);

module.exports = ComboChoice;


},{"./../../../../../bower_components/marionette/lib/backbone.marionette.js":"KEBL1D","./combo_choice_editor.js.coffee":18,"./combo_choice_viewer.js.coffee":19}],18:[function(require,module,exports){
var ComboChoiceEditor, Marionette,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Marionette = require("./../../../../../bower_components/marionette/lib/backbone.marionette.js");

ComboChoiceEditor = (function(_super) {
  __extends(ComboChoiceEditor, _super);

  function ComboChoiceEditor() {
    return ComboChoiceEditor.__super__.constructor.apply(this, arguments);
  }

  ComboChoiceEditor.prototype.className = 'js-combo-choice-editor-container';

  ComboChoiceEditor.prototype.template = '#combo-choice-editor-template';

  return ComboChoiceEditor;

})(Marionette.ItemView);

module.exports = ComboChoiceEditor;


},{"./../../../../../bower_components/marionette/lib/backbone.marionette.js":"KEBL1D"}],19:[function(require,module,exports){
var ComboChoiceViewer, Marionette, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Marionette = require("./../../../../../bower_components/marionette/lib/backbone.marionette.js");

_ = require("./../../../../../bower_components/underscore/underscore.js");

ComboChoiceViewer = (function(_super) {
  __extends(ComboChoiceViewer, _super);

  function ComboChoiceViewer() {
    return ComboChoiceViewer.__super__.constructor.apply(this, arguments);
  }

  ComboChoiceViewer.prototype.className = 'js-combo-choice-viewer-container';

  ComboChoiceViewer.prototype.template = '#combo-choice-viewer-template';

  ComboChoiceViewer.prototype.serializeData = function() {
    var combos, txt;
    combos = this.model.combos();
    if (combos.length > 0) {
      txt = _.initial(combos).join(', ');
      if (combos.length > 1) {
        txt += ' & ';
      }
      txt += _.last(combos);
      return {
        choiceText: txt
      };
    } else {
      return {
        choiceText: "Invalid selections. Please edit to fix."
      };
    }
  };

  return ComboChoiceViewer;

})(Marionette.ItemView);

module.exports = ComboChoiceViewer;


},{"./../../../../../bower_components/marionette/lib/backbone.marionette.js":"KEBL1D","./../../../../../bower_components/underscore/underscore.js":"l0hNr+"}],20:[function(require,module,exports){
var Content, Editor, Marionette, Prompter, Viewer, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Marionette = require("./../../../../../bower_components/marionette/lib/backbone.marionette.js");

_ = require("./../../../../../bower_components/underscore/underscore.js");

Editor = require('./editor.js.coffee');

Viewer = require('./viewer.js.coffee');

Prompter = require('./prompter.js.coffee');

Content = (function(_super) {
  __extends(Content, _super);

  function Content() {
    return Content.__super__.constructor.apply(this, arguments);
  }

  Content.prototype.template = "#content-template";

  Content.prototype.regions = {
    editor: '.js-editor-container',
    viewer: '.js-viewer-container',
    prompter: '.js-prompter-container'
  };

  Content.prototype.modeViews = function() {
    return {
      edit: this.editorView,
      view: this.viewerView,
      prompt: this.prompterView
    };
  };

  Content.prototype.onShow = function() {
    this.editorView = new Editor();
    this.viewerView = new Viewer();
    this.prompterView = new Prompter(this.options.prompts);
    this.listenTo(this.editorView, 'content:save', function() {
      return this.triggerMethod('content:save');
    });
    this.listenTo(this.editorView, 'content:cancel', function() {
      return this.triggerMethod('content:cancel');
    });
    this.listenTo(this.viewerView, 'content:edit', function() {
      return this.triggerMethod('content:edit');
    });
    this.listenTo(this.prompterView, 'content:edit', function() {
      return this.triggerMethod('content:edit');
    });
    this.editor.show(this.editorView);
    this.viewer.show(this.viewerView);
    return this.prompter.show(this.prompterView);
  };

  Content.prototype.onContentChanged = function(content) {
    return _.each(this.modeViews(), function(view, mode) {
      return view != null ? view.triggerMethod('content:changed', content) : void 0;
    });
  };

  Content.prototype.onModeChanged = function(content, mode) {
    this.triggerMethod('content:changed', content);
    return _.each(this.modeViews(), function(view, mode) {
      return view != null ? view.triggerMethod('display') : void 0;
    });
  };

  Content.prototype.editorContent = function() {
    var _ref;
    return (_ref = this.editorView) != null ? _ref.getContent() : void 0;
  };

  return Content;

})(Marionette.LayoutView);

module.exports = Content;


},{"./../../../../../bower_components/marionette/lib/backbone.marionette.js":"KEBL1D","./../../../../../bower_components/underscore/underscore.js":"l0hNr+","./editor.js.coffee":21,"./prompter.js.coffee":25,"./viewer.js.coffee":30}],21:[function(require,module,exports){
var Editor, Marionette, Quill,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Marionette = require("./../../../../../bower_components/marionette/lib/backbone.marionette.js");

Quill = require('quilljs');

Editor = (function(_super) {
  __extends(Editor, _super);

  function Editor() {
    return Editor.__super__.constructor.apply(this, arguments);
  }

  Editor.prototype.options = {
    theme: 'snow',
    editorSelector: '.ql-editor',
    toolbarSelector: '.ql-toolbar',
    footerSelector: '.ql-footer'
  };

  Editor.prototype.triggers = {
    'click @ui.saveButton': 'content:save',
    'click @ui.cancelButton': 'content:cancel'
  };

  Editor.prototype.ui = {
    saveButton: '.js-editor-save-button',
    cancelButton: '.js-editor-cancel-button'
  };

  Editor.prototype.template = "#editor-template";

  Editor.prototype.onShow = function() {
    if (this.editor == null) {
      this.editor = new Quill(this.$(this.options.editorSelector)[0], {
        theme: this.options.theme
      });
      this.editor.addModule('toolbar', {
        container: this.$(this.options.toolbarSelector)[0]
      });
      return this.editor.addModule('toolbar', {
        container: this.$(this.options.footerSelector)[0]
      });
    }
  };

  Editor.prototype.getContent = function() {
    var _ref;
    return (_ref = this.editor) != null ? _ref.getHTML() : void 0;
  };

  Editor.prototype.onContentChanged = function(html) {
    var _ref;
    return (_ref = this.editor) != null ? _ref.setHTML(html) : void 0;
  };

  Editor.prototype.onDisplay = function() {
    var _ref;
    return (_ref = this.editor) != null ? _ref.focus() : void 0;
  };

  return Editor;

})(Marionette.ItemView);

module.exports = Editor;


},{"./../../../../../bower_components/marionette/lib/backbone.marionette.js":"KEBL1D","quilljs":"aowo0O"}],22:[function(require,module,exports){
var ContentEditable, Exercise, Marionette, PartsView,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Marionette = require("./../../../../../bower_components/marionette/lib/backbone.marionette.js");

PartsView = require('./parts.js.coffee');

ContentEditable = require('../behaviors/content_editable.js.coffee');

Exercise = (function(_super) {
  __extends(Exercise, _super);

  function Exercise() {
    return Exercise.__super__.constructor.apply(this, arguments);
  }

  Exercise.prototype.id = 'exercise-container';

  Exercise.prototype.className = 'has-drawer';

  Exercise.prototype.template = '#exercise-template';

  Exercise.prototype.regions = {
    content: '.js-exercise-background-container',
    parts: '.js-exercise-parts-container'
  };

  Exercise.prototype.triggers = {
    'click .js-add-part-button': 'part:add'
  };

  Exercise.prototype.behaviors = function() {
    var self;
    self = this;
    return {
      ContentEditable: {
        behaviorClass: ContentEditable,
        prompts: {
          add: 'Click here to add background information for the entire exercise.',
          edit: 'Click to edit background information for the entire exercise.'
        },
        contentRegion: self.content,
        loadContent: function() {
          return self.model.background;
        },
        saveChanges: function(content) {
          self.model.background = content;
          return self.model.save();
        }
      }
    };
  };

  Exercise.prototype.onShow = function() {
    this.partsView = new PartsView({
      collection: this.model.get('parts')
    });
    return this.parts.show(this.partsView);
  };

  Exercise.prototype.onPartAdd = function() {
    var _ref;
    return (_ref = this.partsView) != null ? _ref.triggerMethod('part:add') : void 0;
  };

  return Exercise;

})(Marionette.LayoutView);

module.exports = Exercise;


},{"../behaviors/content_editable.js.coffee":12,"./../../../../../bower_components/marionette/lib/backbone.marionette.js":"KEBL1D","./parts.js.coffee":24}],23:[function(require,module,exports){
var Actionable, ContentEditable, Deleteable, Marionette, Part, QuestionsView,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Marionette = require("./../../../../../bower_components/marionette/lib/backbone.marionette.js");

QuestionsView = require('./questions.js.coffee');

ContentEditable = require('../behaviors/content_editable.js.coffee');

Actionable = require('../behaviors/actionable.js.coffee');

Deleteable = require('../behaviors/deleteable.js.coffee');

Part = (function(_super) {
  __extends(Part, _super);

  function Part() {
    return Part.__super__.constructor.apply(this, arguments);
  }

  Part.prototype.id = function() {
    return "part-" + (this.model.get('position')) + "-container";
  };

  Part.prototype.tagName = 'li';

  Part.prototype.className = 'part-container has-drawer';

  Part.prototype.template = '#part-template';

  Part.prototype.regions = {
    content: '.js-part-background-container',
    questions: '.js-part-questions-container',
    actions: '.js-part-actions-container'
  };

  Part.prototype.triggers = {
    'click .js-add-question-button': 'question:add'
  };

  Part.prototype.behaviors = function() {
    var self;
    self = this;
    return {
      Deleteable: {
        behaviorClass: Deleteable
      },
      Actionable: {
        behaviorClass: Actionable
      },
      ContentEditable: {
        behaviorClass: ContentEditable,
        prompts: {
          add: 'Click here to add background information for this part.',
          edit: 'Click to edit background information for this part.'
        },
        contentRegion: self.content,
        loadContent: function() {
          return self.model.background;
        },
        saveChanges: function(content) {
          self.model.background = content;
          return self.model.save();
        }
      }
    };
  };

  Part.prototype.onShow = function() {
    this.questionsView = new QuestionsView({
      collection: this.model.get('questions')
    });
    return this.questions.show(this.questionsView);
  };

  Part.prototype.onQuestionAdd = function() {
    var _ref;
    return (_ref = this.questionsView) != null ? _ref.triggerMethod('question:add') : void 0;
  };

  return Part;

})(Marionette.LayoutView);

module.exports = Part;


},{"../behaviors/actionable.js.coffee":11,"../behaviors/content_editable.js.coffee":12,"../behaviors/deleteable.js.coffee":13,"./../../../../../bower_components/marionette/lib/backbone.marionette.js":"KEBL1D","./questions.js.coffee":28}],24:[function(require,module,exports){
var Marionette, PartView, Parts,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Marionette = require("./../../../../../bower_components/marionette/lib/backbone.marionette.js");

PartView = require('./part.js.coffee');

Parts = (function(_super) {
  __extends(Parts, _super);

  function Parts() {
    return Parts.__super__.constructor.apply(this, arguments);
  }

  Parts.prototype.tagName = 'ol';

  Parts.prototype.childView = PartView;

  Parts.prototype.onChildrenChanged = function() {
    return this.$el.toggleClass('numbered', this.collection.length > 1);
  };

  Parts.prototype.onPartAdd = function() {
    return this.collection.create({}, {
      wait: true
    });
  };

  Parts.prototype.onRemoveChild = function() {
    return this.triggerMethod('children:changed');
  };

  Parts.prototype.onAddChild = function(child) {
    child.triggerMethod('show');
    return this.triggerMethod('children:changed');
  };

  return Parts;

})(Marionette.CollectionView);

module.exports = Parts;


},{"./../../../../../bower_components/marionette/lib/backbone.marionette.js":"KEBL1D","./part.js.coffee":23}],25:[function(require,module,exports){
var Marionette, Prompter,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Marionette = require("./../../../../../bower_components/marionette/lib/backbone.marionette.js");

Prompter = (function(_super) {
  __extends(Prompter, _super);

  function Prompter() {
    return Prompter.__super__.constructor.apply(this, arguments);
  }

  Prompter.prototype.options = {
    add: "Click to add new content.",
    edit: "Click to edit content"
  };

  Prompter.prototype.triggers = {
    'click': 'content:edit'
  };

  Prompter.prototype.template = "#prompter-template";

  Prompter.prototype.onContentChanged = function(content) {
    return this.$el.toggleClass('empty-content', content === '');
  };

  Prompter.prototype.serializeData = function() {
    return {
      prompts: {
        add: this.options.add,
        edit: this.options.edit
      }
    };
  };

  return Prompter;

})(Marionette.ItemView);

module.exports = Prompter;


},{"./../../../../../bower_components/marionette/lib/backbone.marionette.js":"KEBL1D"}],26:[function(require,module,exports){
var Marionette, QuantifierChoice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Marionette = require("./../../../../../bower_components/marionette/lib/backbone.marionette.js");

QuantifierChoice = (function(_super) {
  __extends(QuantifierChoice, _super);

  function QuantifierChoice() {
    return QuantifierChoice.__super__.constructor.apply(this, arguments);
  }

  QuantifierChoice.prototype.className = 'quantifier-choice-container viewer';

  QuantifierChoice.prototype.template = '#quantifier-choice-template';

  return QuantifierChoice;

})(Marionette.ItemView);

module.exports = QuantifierChoice;


},{"./../../../../../bower_components/marionette/lib/backbone.marionette.js":"KEBL1D"}],27:[function(require,module,exports){
var $, Actionable, ChoicesView, ContentEditable, Deleteable, Marionette, Question, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Marionette = require("./../../../../../bower_components/marionette/lib/backbone.marionette.js");

ChoicesView = require('./choices.js.coffee');

ContentEditable = require('../behaviors/content_editable.js.coffee');

Actionable = require('../behaviors/actionable.js.coffee');

Deleteable = require('../behaviors/deleteable.js.coffee');

$ = require("./../../../../../bower_components/jquery/dist/jquery.js");

_ = require("./../../../../../bower_components/underscore/underscore.js");

Question = (function(_super) {
  __extends(Question, _super);

  function Question() {
    return Question.__super__.constructor.apply(this, arguments);
  }

  Question.prototype.id = function() {
    return "part-" + (this.model.collection.owner().get('position')) + "-question-" + (this.model.get('position')) + "-container";
  };

  Question.prototype.initialize = function() {
    return this.listenTo(this.model.get('choices'), 'add remove', (function(_this) {
      return function() {
        return _this.triggerMethod('refresh:actions');
      };
    })(this));
  };

  Question.prototype.tagName = 'li';

  Question.prototype.className = 'question-container has-drawer';

  Question.prototype.template = '#question-template';

  Question.prototype.regions = {
    content: '.js-question-stem-container',
    choices: '.js-question-choices-container',
    actions: '.js-question-actions-container'
  };

  Question.prototype.events = {
    'click .js-add-choice-button': 'OnAddButtonClick',
    'click .js-add-combo-choice-button': 'OnAddButtonClick',
    'click .js-add-all-choice-button': 'OnAddButtonClick',
    'click .js-add-none-choice-button': 'OnAddButtonClick'
  };

  Question.prototype.behaviors = function() {
    return {
      Deleteable: {
        behaviorClass: Deleteable
      },
      Actionable: {
        behaviorClass: Actionable,
        helpers: {
          canAddCombo: (function(_this) {
            return function() {
              return _this.model.canAddCombo();
            };
          })(this),
          canAddAll: (function(_this) {
            return function() {
              return _this.model.canAddAll();
            };
          })(this),
          canAddNone: (function(_this) {
            return function() {
              return _this.model.canAddNone();
            };
          })(this)
        }
      },
      ContentEditable: {
        behaviorClass: ContentEditable,
        prompts: {
          add: 'Click here to add the question stem.',
          edit: 'Click to edit the question stem.'
        },
        contentRegion: this.content,
        loadContent: (function(_this) {
          return function() {
            return _this.model.questionStem;
          };
        })(this),
        saveChanges: (function(_this) {
          return function(content) {
            _this.model.questionStem = content;
            return _this.model.save();
          };
        })(this)
      }
    };
  };

  Question.prototype.onShow = function() {
    this.choicesView = new ChoicesView({
      collection: this.model.get('choices')
    });
    return this.choices.show(this.choicesView);
  };

  Question.prototype.OnAddButtonClick = function(e) {
    e.preventDefault();
    e.stopPropagation();
    return _.each(['simple', 'combo', 'all', 'none'], (function(_this) {
      return function(type) {
        var _ref;
        if ($(e.currentTarget).hasClass("" + type + "-choice")) {
          if ((_ref = _this.choicesView) != null) {
            _ref.triggerMethod('choice:add', type);
          }
          return false;
        }
      };
    })(this));
  };

  return Question;

})(Marionette.LayoutView);

module.exports = Question;


},{"../behaviors/actionable.js.coffee":11,"../behaviors/content_editable.js.coffee":12,"../behaviors/deleteable.js.coffee":13,"./../../../../../bower_components/jquery/dist/jquery.js":"d6Ad4U","./../../../../../bower_components/marionette/lib/backbone.marionette.js":"KEBL1D","./../../../../../bower_components/underscore/underscore.js":"l0hNr+","./choices.js.coffee":16}],28:[function(require,module,exports){
var Marionette, QuestionView, Questions,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Marionette = require("./../../../../../bower_components/marionette/lib/backbone.marionette.js");

QuestionView = require('./question.js.coffee');

Questions = (function(_super) {
  __extends(Questions, _super);

  function Questions() {
    return Questions.__super__.constructor.apply(this, arguments);
  }

  Questions.prototype.tagName = 'ol';

  Questions.prototype.childView = QuestionView;

  Questions.prototype.onQuestionAdd = function() {
    return this.collection.create({
      type: 'multiple_choice_question'
    }, {
      wait: true
    });
  };

  Questions.prototype.onAddChild = function(child) {
    return child.triggerMethod('show');
  };

  return Questions;

})(Marionette.CollectionView);

module.exports = Questions;


},{"./../../../../../bower_components/marionette/lib/backbone.marionette.js":"KEBL1D","./question.js.coffee":27}],29:[function(require,module,exports){
var ContentEditable, Marionette, SimpleChoice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Marionette = require("./../../../../../bower_components/marionette/lib/backbone.marionette.js");

ContentEditable = require('../behaviors/content_editable.js.coffee');

SimpleChoice = (function(_super) {
  __extends(SimpleChoice, _super);

  function SimpleChoice() {
    return SimpleChoice.__super__.constructor.apply(this, arguments);
  }

  SimpleChoice.prototype.className = 'js-simple-choice-container';

  SimpleChoice.prototype.template = '#simple-choice-template';

  SimpleChoice.prototype.regions = {
    content: '.js-content-container'
  };

  SimpleChoice.prototype.behaviors = function() {
    var self;
    self = this;
    return {
      ContentEditable: {
        behaviorClass: ContentEditable,
        prompts: {
          add: 'Click here to add the choice content.',
          edit: 'Click to edit the choice content.'
        },
        contentRegion: self.content,
        loadContent: function() {
          return self.model.content;
        },
        saveChanges: function(content) {
          self.model.content = content;
          return self.model.save();
        }
      }
    };
  };

  return SimpleChoice;

})(Marionette.LayoutView);

module.exports = SimpleChoice;


},{"../behaviors/content_editable.js.coffee":12,"./../../../../../bower_components/marionette/lib/backbone.marionette.js":"KEBL1D"}],30:[function(require,module,exports){
var Marionette, Viewer,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Marionette = require("./../../../../../bower_components/marionette/lib/backbone.marionette.js");

Viewer = (function(_super) {
  __extends(Viewer, _super);

  function Viewer() {
    return Viewer.__super__.constructor.apply(this, arguments);
  }

  Viewer.prototype.template = "#viewer-template";

  Viewer.prototype.triggers = {
    'click': 'content:edit'
  };

  Viewer.prototype.ui = {
    content: '.js-viewer'
  };

  Viewer.prototype.onContentChanged = function(html) {
    return this.ui.content.html(html);
  };

  return Viewer;

})(Marionette.ItemView);

module.exports = Viewer;


},{"./../../../../../bower_components/marionette/lib/backbone.marionette.js":"KEBL1D"}]},{},[10])


//# sourceMappingURL=app.js.map