var fauxServer = require("backbone-faux-server");
var _ = require("underscore");

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
