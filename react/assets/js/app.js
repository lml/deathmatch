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
var Exercise, ExerciseModel, React, exercise;

React = require('react');

Exercise = require('./components/exercise');

ExerciseModel = require('../../../common/assets/js/entities/exercise.js.coffee');

require('../../../common/assets/js/stubs/api.js');

exercise = new ExerciseModel({
  id: 1,
  parts: []
});

React.renderComponent(Exercise({
  "model": exercise
}), document.getElementById('exercise-editor'));


},{"../../../common/assets/js/entities/exercise.js.coffee":4,"../../../common/assets/js/stubs/api.js":9,"./components/exercise":16,"react":"M6d2gk"}],11:[function(require,module,exports){
var ActionButton, React;

React = require('react');

React.Addons = require('react-addons');

ActionButton = React.createClass({
  getDefaultProps: function() {
    return {
      hidden: false,
      actionText: "",
      buttonMainClass: "action",
      buttonTypeClass: "secondary",
      extraButtonClasses: []
    };
  },
  propTypes: {
    hidden: React.PropTypes.bool,
    onAction: React.PropTypes.func.isRequired,
    actionName: React.PropTypes.string.isRequired,
    actionText: React.PropTypes.string.isRequired,
    actionTitle: React.PropTypes.string
  },
  handleAction: function() {
    return this.props.onAction(this.props.actionName);
  },
  render: function() {
    var className, classes, _i, _len, _ref;
    classes = {
      hidden: this.props.hidden
    };
    classes[this.props.buttonMainClass] = true;
    classes[this.props.buttonTypeClass] = true;
    _ref = this.props.extraButtonClasses;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      className = _ref[_i];
      classes[className] = true;
    }
    classes = React.Addons.classSet(classes);
    return React.DOM.button({
      "className": classes,
      "title": this.props.actionTitle,
      "name": this.props.actionName,
      "onClick": this.handleAction
    }, this.props.actionText);
  }
});

module.exports = ActionButton;


},{"react":"M6d2gk","react-addons":"MzV8gO"}],12:[function(require,module,exports){
var ActionDrawer, React;

React = require('react');

ActionDrawer = React.createClass({
  render: function() {
    return React.DOM.div({
      "className": "action-panel drawer"
    }, React.DOM.h4(null, this.props.title), this.props.children);
  }
});

module.exports = ActionDrawer;


},{"react":"M6d2gk"}],13:[function(require,module,exports){
var AllChoice, Button, Choice, ComboChoice, ComboChoiceEditor, ComboChoiceViewer, Content, Drawer, NoneChoice, React, _,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

React = require('react');

React.addons = require('react-addons');

_ = require("./../../../../../bower_components/underscore/underscore.js");

Button = require('./action_button');

Content = require('./content');

Drawer = require('./action_drawer');

ComboChoiceViewer = React.createClass({
  displayName: 'ComboChoiceViewer',
  propTypes: {
    model: React.PropTypes.object.isRequired
  },
  getDefaultProps: function() {
    return {
      onEditComboChoice: function() {
        debugger;
      }
    };
  },
  handleEdit: function() {
    return this.props.onEditComboChoice();
  },
  render: function() {
    var choiceText, combos, txt;
    combos = this.props.model.combos();
    choiceText = combos.length > 1 ? (txt = _.map(_.initial(combos), function(c) {
      return "(" + (c.letter()) + ")";
    }).join(', '), txt += ' & ', txt += "(" + (_.last(combos).letter()) + ")", txt) : "Invalid selections. Please edit to fix.";
    return React.DOM.div({
      "className": "combo-choice-viewer viewer-container hoverable",
      "onClick": this.handleEdit
    }, React.DOM.button({
      "className": "action secondary on-hover",
      "title": "Edit combo choice",
      "onClick": this.handleEdit
    }, "Edit"), React.DOM.div({
      "className": "viewer"
    }, choiceText));
  }
});

ComboChoiceEditor = React.createClass({
  displayName: 'ComboChoiceEditor',
  propTypes: {
    model: React.PropTypes.object.isRequired
  },
  getInitialState: function() {
    return {
      selections: this.props.model.get('combos')
    };
  },
  getDefaultProps: function() {
    return {
      onCancelEdit: function() {
        debugger;
      },
      onSaveChanges: function() {
        debugger;
      }
    };
  },
  handleChange: function() {
    var input, inputs, selections;
    inputs = this.refs.editor.getDOMNode().getElementsByTagName('input');
    selections = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = inputs.length; _i < _len; _i++) {
        input = inputs[_i];
        if (input.checked === true) {
          _results.push(parseInt(input.value));
        }
      }
      return _results;
    })();
    return this.setState({
      selections: selections
    });
  },
  handleClick: function(event) {
    return event.currentTarget.getElementsByTagName('input')[0].checked = true;
  },
  handleSave: function() {
    this.props.model.setSelections(this.state.selections);
    this.props.model.save;
    this.props.onSaveChanges();
    return false;
  },
  handleCancel: function() {
    this.props.onCancelEdit();
    return false;
  },
  render: function() {
    var choice, inputs, renderCheckbox, selections;
    selections = this.state.selections;
    renderCheckbox = (function(_this) {
      return function(choice) {
        var _ref;
        return React.DOM.div({
          "className": 'choice-selector-container',
          "onClick": _this.handleClick
        }, React.DOM.input({
          "type": 'checkbox',
          "onChange": _this.handleChange,
          "value": choice.get('id'),
          "checked": (_ref = choice.id, __indexOf.call(selections, _ref) >= 0)
        }), React.DOM.div({
          "className": "choice-letter"
        }, "(", choice.letter(), ")"), React.DOM.div({
          "className": "choice-content",
          "dangerouslySetInnerHTML": {
            __html: choice.get('content')
          }
        }));
      };
    })(this);
    inputs = (function() {
      var _i, _len, _ref, _results;
      _ref = this.props.model.collection.simples();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        choice = _ref[_i];
        _results.push(renderCheckbox(choice));
      }
      return _results;
    }).call(this);
    return React.DOM.div({
      "className": "combo-choice-editor editor",
      "ref": 'editor'
    }, React.DOM.form({
      "className": "combo-choice-editor-form form",
      "onSubmit": this.handleSave
    }, inputs, React.DOM.div({
      "className": "footer button-panel"
    }, React.DOM.button({
      "className": "action secondary",
      "title": "Cancel editing",
      "onClick": this.handleCancel
    }, "Cancel"), React.DOM.button({
      "type": "submit",
      "className": "action primary",
      "title": "Done editing"
    }, "Done"))));
  }
});

ComboChoice = React.createClass({
  displayName: 'ComboChoice',
  propTypes: {
    model: React.PropTypes.object.isRequired
  },
  getInitialState: function() {
    var combos, mode;
    combos = this.props.model.get('combos');
    mode = (combos != null) && combos.length > 1 ? 'view' : 'edit';
    return {
      mode: mode
    };
  },
  onEdit: function() {
    return this.setState({
      mode: 'edit'
    });
  },
  onCancelEdit: function() {
    return this.setState({
      mode: 'view'
    });
  },
  render: function() {
    if (this.state.mode === 'edit') {
      return ComboChoiceEditor({
        "model": this.props.model,
        "onSaveChanges": this.onCancelEdit,
        "onCancelEdit": this.onCancelEdit
      });
    } else {
      return ComboChoiceViewer({
        "model": this.props.model,
        "onEditComboChoice": this.onEdit
      });
    }
  }
});

AllChoice = React.createClass({
  displayName: 'AllChoice',
  render: function() {
    return React.DOM.div({
      "className": "quantifier-choice-container viewer"
    }, React.DOM.span({
      "className": "all-choice"
    }, " All of the above "));
  }
});

NoneChoice = React.createClass({
  displayName: 'NoneChoice',
  render: function() {
    return React.DOM.div({
      "className": "quantifier-choice-container viewer"
    }, React.DOM.span({
      "className": "none-choice"
    }, " None of the above "));
  }
});

Choice = React.createClass({
  displayName: 'Choice',
  propTypes: {
    model: React.PropTypes.object.isRequired
  },
  getStateFromModel: function() {
    return {
      content: this.props.model.get('content')
    };
  },
  getInitialState: function() {
    return this.getStateFromModel();
  },
  refreshState: function() {
    return this.setState(this.getStateFromModel());
  },
  componentDidMount: function() {
    return this.props.model.on('change', this.refreshState, this);
  },
  componentWillUnmount: function() {
    return this.props.model.off('change', this.refreshState, this);
  },
  onSaveContent: function(content) {
    this.props.model.set({
      content: content
    });
    return this.props.model.save();
  },
  onDeleteChoice: function() {
    return this.props.model.destroy({
      wait: true
    });
  },
  onMoveChoiceUp: function() {
    return this.props.model.moveUp();
  },
  onMoveChoiceDown: function() {
    return this.props.model.moveDown();
  },
  render: function() {
    var choiceTitle, content, contentNode;
    content = this.state.content;
    choiceTitle = "Choice (" + (this.props.model.letter()) + ")";
    contentNode = (function() {
      switch (this.props.model.type()) {
        case 'simple':
          return Content({
            "prompt_add": "Click to add choice content.",
            "prompt_edit": "Click to edit choice.",
            "content": content,
            "onSaveContent": this.onSaveContent
          });
        case 'combo':
          return ComboChoice({
            "model": this.props.model
          });
        case 'all':
          return AllChoice(null);
        case 'none':
          return NoneChoice(null);
        default:
          return console.log('Invalid choice type');
      }
    }).call(this);
    return React.DOM.li({
      "className": "choice-container has-drawer"
    }, contentNode, Drawer({
      "title": choiceTitle
    }, Button({
      "hidden": !this.props.model.canMoveUp(),
      "actionTitle": "Move choice up",
      "actionText": "Move up",
      "actionName": "MoveUp",
      "onAction": this.onMoveChoiceUp
    }), Button({
      "hidden": !this.props.model.canMoveDown(),
      "actionTitle": "Move choice down",
      "actionText": "Move down",
      "actionName": "MoveDown",
      "onAction": this.onMoveChoiceDown
    }), Button({
      "actionTitle": "Delete this choice",
      "actionText": "Delete choice",
      "actionName": "DeleteChoice",
      "onAction": this.onDeleteChoice
    })));
  }
});

module.exports = Choice;


},{"./../../../../../bower_components/underscore/underscore.js":"l0hNr+","./action_button":11,"./action_drawer":12,"./content":15,"react":"M6d2gk","react-addons":"MzV8gO"}],14:[function(require,module,exports){
var Choice, ChoiceList, React;

React = require('react');

React.Addons = require('react-addons');

Choice = require('./choice');

ChoiceList = React.createClass({
  displayName: 'ChoiceList',
  propTypes: {
    collection: React.PropTypes.object.isRequired
  },
  render: function() {
    var choices;
    choices = this.props.collection.map(function(model) {
      return Choice({
        "key": model.id,
        "model": model
      });
    });
    return React.DOM.ol({
      "className": "letters"
    }, choices);
  }
});

module.exports = ChoiceList;


},{"./choice":13,"react":"M6d2gk","react-addons":"MzV8gO"}],15:[function(require,module,exports){
var Content, Editor, Quill, React, Viewer;

React = require('react');

React.addons = require('react-addons');

Quill = require('quilljs');

Viewer = React.createClass({
  displayName: 'ContentViewer',
  propTypes: {
    content: React.PropTypes.string
  },
  getDefaultProps: function() {
    return {
      onEditContent: function() {
        debugger;
      }
    };
  },
  handleEdit: function() {
    return this.props.onEditContent();
  },
  render: function() {
    if ((this.props.content != null) && this.props.content !== "") {
      return React.DOM.div({
        "className": "viewer-container hoverable",
        "onClick": this.handleEdit
      }, React.DOM.button({
        "className": "action secondary on-hover",
        "title": this.props.prompt_edit,
        "onClick": this.handleEdit
      }, "Edit"), React.DOM.div({
        "className": "viewer",
        "dangerouslySetInnerHTML": {
          __html: this.props.content
        }
      }));
    } else {
      return React.DOM.div({
        "className": "prompter-container",
        "onClick": this.handleEdit
      }, React.DOM.div({
        "className": "empty-content"
      }, React.DOM.span({
        "className": "prompt-add-tip"
      }, this.props.prompt_add)));
    }
  }
});

Editor = React.createClass({
  displayName: 'ContentEditor',
  getInitialState: function() {
    return {
      objects: {
        editor: null
      }
    };
  },
  propTypes: {
    content: React.PropTypes.string
  },
  getDefaultProps: function() {
    return {
      onSaveContent: function() {
        debugger;
      },
      onCancelEdit: function() {
        debugger;
      },
      content: '',
      theme: 'snow'
    };
  },
  focus: function() {
    return this.state.objects.editor.focus();
  },
  initializeEditor: function() {
    var editor;
    editor = new Quill(this.refs.editor.getDOMNode(), {
      theme: this.props.theme
    });
    editor.addModule('toolbar', {
      container: this.refs.toolbar.getDOMNode()
    });
    editor.addModule('toolbar', {
      container: this.refs.footer.getDOMNode()
    });
    editor.setHTML(this.props.content);
    return this.state.objects.editor = editor;
  },
  componentDidMount: function() {
    return this.initializeEditor();
  },
  componentDidUpdate: function() {
    return this.initializeEditor();
  },
  componentWillReceiveProps: function(newprops) {
    return this.state.objects.editor.setHTML(newprops.content);
  },
  handleSave: function() {
    return this.props.onSaveContent(this.state.objects.editor.getHTML());
  },
  handleCancel: function() {
    return this.props.onCancelEdit(this.state.objects.editor.getHTML());
  },
  render: function() {
    return React.DOM.div({
      "className": "editor-container"
    }, React.DOM.div({
      "className": "ql-box"
    }, React.DOM.div({
      "className": "ql-toolbar",
      "ref": "toolbar"
    }, React.DOM.span({
      "className": "ql-format-group"
    }, React.DOM.span({
      "title": "Bold",
      "className": "ql-format-button ql-bold"
    }), React.DOM.span({
      "className": "ql-format-separator"
    }), React.DOM.span({
      "title": "Italic",
      "className": "ql-format-button ql-italic"
    }), React.DOM.span({
      "className": "ql-format-separator"
    }), React.DOM.span({
      "title": "Underline",
      "className": "ql-format-button ql-underline"
    }), React.DOM.span({
      "className": "ql-format-separator"
    }), React.DOM.span({
      "title": "Strikethrough",
      "className": "ql-format-button ql-strike"
    })), React.DOM.span({
      "className": "ql-format-group"
    }, React.DOM.span({
      "title": "List",
      "className": "ql-format-button ql-list"
    }), React.DOM.span({
      "className": "ql-format-separator"
    }), React.DOM.span({
      "title": "Bullet",
      "className": "ql-format-button ql-bullet"
    }), React.DOM.span({
      "className": "ql-format-separator"
    }), React.DOM.select({
      "title": "Text Alignment",
      "defaultValue": "left",
      "className": "ql-align"
    }, React.DOM.option({
      "value": "left",
      "label": "Left"
    }), React.DOM.option({
      "value": "center",
      "label": "Center"
    }), React.DOM.option({
      "value": "right",
      "label": "Right"
    }), React.DOM.option({
      "value": "justify",
      "label": "Justify"
    }))), React.DOM.span({
      "className": "ql-format-group"
    }, React.DOM.span({
      "title": "Link",
      "className": "ql-format-button ql-link"
    }))), React.DOM.div({
      "className": "ql-editor",
      "ref": "editor"
    }), React.DOM.div({
      "className": "ql-footer",
      "ref": "footer"
    }, React.DOM.button({
      "className": "action secondary",
      "onClick": this.handleCancel
    }, "Cancel"), React.DOM.button({
      "className": "action primary",
      "onClick": this.handleSave
    }, "Save"))));
  }
});

Content = React.createClass({
  displayName: 'ContentContainer',
  propTypes: {
    content: React.PropTypes.string
  },
  getInitialState: function() {
    return {
      mode: 'view'
    };
  },
  onEditContent: function() {
    this.setState({
      mode: 'edit'
    });
    return this.refs.editor.focus();
  },
  onCancelEdit: function() {
    return this.setState({
      mode: 'view'
    });
  },
  onSaveContent: function(content) {
    this.setState({
      mode: 'view'
    });
    return this.props.onSaveContent(content);
  },
  render: function() {
    var classes, hasContent;
    hasContent = (this.props.content != null) && this.props.content !== "";
    classes = React.addons.classSet({
      'content-container': true,
      'mode-edit': this.state.mode === 'edit',
      'mode-view': this.state.mode === 'view' && hasContent,
      'mode-prompt': this.state.mode === 'view' && !hasContent
    });
    return React.DOM.div({
      "className": classes
    }, Editor({
      "ref": "editor",
      "content": this.props.content,
      "onCancelEdit": this.onCancelEdit,
      "onSaveContent": this.onSaveContent
    }), Viewer({
      "content": this.props.content,
      "prompt_add": this.props.prompt_add,
      "prompt_edit": this.props.prompt_edit,
      "onEditContent": this.onEditContent
    }));
  }
});

module.exports = Content;


},{"quilljs":"aowo0O","react":"M6d2gk","react-addons":"MzV8gO"}],16:[function(require,module,exports){
var Button, Content, Drawer, Exercise, PartList, React;

React = require('react');

React.Addons = require('react-addons');

Button = require('./action_button');

Content = require('./content');

Drawer = require('./action_drawer');

PartList = require('./part_list');

Exercise = React.createClass({
  displayName: 'Exercise',
  propTypes: {
    model: React.PropTypes.object.isRequired
  },
  getStateFromModel: function() {
    return {
      content: this.props.model.get('background'),
      parts: this.props.model.get('parts')
    };
  },
  getInitialState: function() {
    return this.getStateFromModel();
  },
  refreshState: function() {
    return this.setState(this.getStateFromModel());
  },
  componentDidMount: function() {
    this.props.model.on('change', this.refreshState, this);
    return this.state.parts.on('add remove change', this.refreshState, this);
  },
  componentWillUnmount: function() {
    this.props.model.off('change', this.refreshState, this);
    return this.state.parts.off('add remove change', this.refreshState, this);
  },
  onSaveBackground: function(content) {
    this.props.model.set({
      background: content
    });
    return this.props.model.save();
  },
  onAddPart: function() {
    return this.state.parts.create({}, {
      wait: true
    });
  },
  render: function() {
    var content;
    content = this.state.content;
    return React.DOM.div({
      "className": "exercise-container has-drawer"
    }, Content({
      "prompt_add": "Click to add background information for the entire exercise.",
      "prompt_edit": "Click to edit the background information for the entire exercise.",
      "content": content,
      "onSaveContent": this.onSaveBackground
    }), PartList({
      "collection": this.state.parts
    }), Drawer({
      "title": "Exercise"
    }, Button({
      "actionTitle": "Add a new part",
      "actionText": "Add part",
      "actionName": "AddPart",
      "onAction": this.onAddPart
    })));
  }
});

module.exports = Exercise;


},{"./action_button":11,"./action_drawer":12,"./content":15,"./part_list":18,"react":"M6d2gk","react-addons":"MzV8gO"}],17:[function(require,module,exports){
var Button, Content, Drawer, Part, QuestionList, React;

React = require('react');

React.addons = require('react-addons');

Button = require('./action_button');

Content = require('./content');

Drawer = require('./action_drawer');

QuestionList = require('./question_list');

Part = React.createClass({
  displayName: 'Part',
  propTypes: {
    model: React.PropTypes.object.isRequired
  },
  getStateFromModel: function() {
    return {
      content: this.props.model.get('background'),
      questions: this.props.model.get('questions')
    };
  },
  getInitialState: function() {
    return this.getStateFromModel();
  },
  refreshState: function() {
    return this.setState(this.getStateFromModel());
  },
  componentDidMount: function() {
    this.props.model.on('change', this.refreshState, this);
    return this.state.questions.on('add remove change', this.refreshState, this);
  },
  componentWillUnmount: function() {
    this.props.model.off('change', this.refreshState, this);
    return this.state.questions.off('add remove change', this.refreshState, this);
  },
  onSaveBackground: function(content) {
    this.props.model.set({
      background: content
    });
    return this.props.model.save();
  },
  onDeletePart: function() {
    return this.props.model.destroy({
      wait: true
    });
  },
  onAddQuestion: function() {
    return this.state.questions.create({}, {
      wait: true
    });
  },
  render: function() {
    var content, partIndex, partTitle;
    content = this.state.content;
    partIndex = this.props.model.collection.indexOf(this.props.model) + 1;
    partTitle = "Part " + partIndex;
    return React.DOM.li({
      "className": "part-container has-drawer"
    }, Content({
      "prompt_add": "Click to add background information for this part.",
      "prompt_edit": "Click to edit the background information for this part.",
      "content": content,
      "onSaveContent": this.onSaveBackground
    }), QuestionList({
      "collection": this.state.questions
    }), Drawer({
      "title": partTitle
    }, Button({
      "actionTitle": "Add a new question",
      "actionText": "Add question",
      "actionName": "AddQuestion",
      "onAction": this.onAddQuestion
    }), Button({
      "actionTitle": "Delete this part",
      "actionText": "Delete part",
      "actionName": "DeletePart",
      "onAction": this.onDeletePart
    })));
  }
});

module.exports = Part;


},{"./action_button":11,"./action_drawer":12,"./content":15,"./question_list":20,"react":"M6d2gk","react-addons":"MzV8gO"}],18:[function(require,module,exports){
var Part, PartList, React;

React = require('react');

React.Addons = require('react-addons');

Part = require('./part');

PartList = React.createClass({
  displayName: 'PartList',
  propTypes: {
    collection: React.PropTypes.object.isRequired
  },
  render: function() {
    var classes, parts;
    parts = this.props.collection.map(function(model) {
      return Part({
        "key": model.id,
        "model": model
      });
    });
    classes = React.Addons.classSet({
      numbered: parts.length > 1
    });
    return React.DOM.ol({
      "className": classes
    }, parts);
  }
});

module.exports = PartList;


},{"./part":17,"react":"M6d2gk","react-addons":"MzV8gO"}],19:[function(require,module,exports){
var Button, ChoiceList, Content, Drawer, Question, React;

React = require('react');

React.addons = require('react-addons');

Button = require('./action_button');

ChoiceList = require('./choice_list');

Content = require('./content');

Drawer = require('./action_drawer');

Question = React.createClass({
  displayName: 'Question',
  propTypes: {
    model: React.PropTypes.object.isRequired
  },
  getStateFromModel: function() {
    return {
      content: this.props.model.get('stem'),
      choices: this.props.model.get('choices')
    };
  },
  getInitialState: function() {
    return this.getStateFromModel();
  },
  refreshState: function() {
    return this.setState(this.getStateFromModel());
  },
  componentDidMount: function() {
    this.props.model.on('change', this.refreshState, this);
    return this.state.choices.on('add remove change', this.refreshState, this);
  },
  componentWillUnmount: function() {
    this.props.model.off('change', this.refreshState, this);
    return this.state.choices.off('add remove change', this.refreshState, this);
  },
  onSaveStem: function(content) {
    this.props.model.set({
      stem: content
    });
    return this.props.model.save();
  },
  onDeleteQuestion: function() {
    return this.props.model.destroy({
      wait: true
    });
  },
  onAddChoice: function(choiceType) {
    return this.state.choices.create({
      type: choiceType
    }, {
      wait: true
    });
  },
  render: function() {
    var content, questionIndex, questionTitle;
    content = this.state.content;
    questionIndex = this.props.model.collection.indexOf(this.props.model) + 1;
    questionTitle = "Question " + questionIndex;
    return React.DOM.div({
      "className": "question-container has-drawer"
    }, Content({
      "prompt_add": "Click to add the question stem.",
      "prompt_edit": "Click to edit the question stem.",
      "content": content,
      "onSaveContent": this.onSaveStem
    }), ChoiceList({
      "collection": this.state.choices
    }), Drawer({
      "title": questionTitle
    }, Button({
      "hidden": false,
      "actionTitle": "Add a new choice",
      "actionText": "Add choice",
      "actionName": "simple",
      "onAction": this.onAddChoice
    }), Button({
      "hidden": !this.props.model.canAddCombo(),
      "actionTitle": "Add a new combo choice",
      "actionText": "Add '(a) & (b)' choice",
      "actionName": "combo",
      "onAction": this.onAddChoice
    }), Button({
      "hidden": !this.props.model.canAddAll(),
      "actionTitle": "Add a new choice",
      "actionText": "Add 'All of the above' choice",
      "actionName": "all",
      "onAction": this.onAddChoice
    }), Button({
      "hidden": !this.props.model.canAddNone(),
      "actionTitle": "Add a new choice",
      "actionText": "Add 'None of the above' choice",
      "actionName": "none",
      "onAction": this.onAddChoice
    }), Button({
      "actionTitle": "Delete this question",
      "actionText": "Delete question",
      "actionName": "DeleteQuestion",
      "onAction": this.onDeleteQuestion
    })));
  }
});

module.exports = Question;


},{"./action_button":11,"./action_drawer":12,"./choice_list":14,"./content":15,"react":"M6d2gk","react-addons":"MzV8gO"}],20:[function(require,module,exports){
var Question, QuestionList, React;

React = require('react');

React.Addons = require('react-addons');

Question = require('./question');

QuestionList = React.createClass({
  displayName: 'QuestionList',
  propTypes: {
    collection: React.PropTypes.object.isRequired
  },
  render: function() {
    var questions;
    questions = this.props.collection.map(function(model) {
      return Question({
        "key": model.id,
        "model": model
      });
    });
    return React.DOM.ol(null, questions);
  }
});

module.exports = QuestionList;


},{"./question":19,"react":"M6d2gk","react-addons":"MzV8gO"}]},{},[10])


//# sourceMappingURL=app.js.map