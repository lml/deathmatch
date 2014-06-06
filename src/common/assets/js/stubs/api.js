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

    self.exercise = {
        background: "",
        parts: []
    };

    self.update = function(exerciseId, data) {
        self.exercise.background = data.background;
        return self.exercise;
    };

    self.addPart = function(exerciseId, data) {
        data.id = self.exercise.parts.length;
        data.background = "";
        data.position = data.id;
        data.questions = [];
        self.exercise.parts.push(data);
        return data;
    };

    self.updatePart = function(exerciseId, partId, data) {
        var part = self.exercise.parts[partId];
        updateAttributes(data, part, ['background', 'questions']);
        return part;
    };

    self.removePart = function(exerciseId, partId) {
        self.exercise.parts.splice(id, 1);
        return {
            success: true
        };
    };

    self.addQuestion = function(exerciseId, partId, data) {
        var questions = self.exercise.parts[partId].questions;
        data.id = questions.length;
        data.position = data.id;
        data.stem = "";
        data.choices = [];
        questions.push(data);
        return data;
    };

    self.updateQuestion = function(exerciseId, partId, questionId, data) {
        var question = self.exercise.parts[partId].questions[questionId];
        updateAttributes(data, question, ['stem', 'choices']);
        return question;
    };

    self.removeQuestion = function(exerciseId, partId, questionId) {
        self.exercise.parts[partId].questions.splice(questionId, 1);
        return {
            success: true
        };
    };

    self.addChoice = function(exerciseId, partId, questionId, data) {
        data.id = self.exercise.parts[partId].questions[questionId].choices.length;
        data.position = data.id;
        data.content = "";
        data.combos = [];
        self.exercise.parts[partId].questions[questionId].choices.push(data);
        return data;
    };

    self.updateChoice = function(exerciseId, partId, questionId, choiceId, data) {
        var choice = self.exercise.parts[partId].questions[questionId].choices[choiceId];
        updateAttributes(data, choice, ['position', 'content', 'combos']);
        return choice;
    };

    self.removeChoice = function(exerciseId, partId, questionId, choiceId) {
        self.exercise[partId].questions[questionId].choices.splice(choiceId, 1);
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
