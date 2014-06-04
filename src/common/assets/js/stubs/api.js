var fauxServer = require("backbone-faux-server");
var _ = require("underscore");

// The deathmatch namespace.
var deathMatch = deathMatch || {};

deathMatch.stub = function() {
    var self = this;

    self.exercise = {
        parts: []
    };

    self.update = function(exerciseId, data) {
        self.exercise.background = data.background;
        return self.exercise;
    };

    self.addPart = function(exerciseId, data) {
        data.id = self.exercise.parts.length;
        data.position = data.id;
        data.questions = [];
        self.exercise.parts.push(data);
        return data;
    };

    self.updatePart = function(exerciseId, partId, data) {
        var updated = _.extend(self.exercise.parts[partId], data);
        self.exercise.parts[partId] = updated;
        return updated;
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
        data.simple_choices = [];
        data.combo_choices = [];
        questions.push(data);
        return data;
    };

    self.updateQuestion = function(exerciseId, partId, questionId, data) {
        var question = self.exercise.parts[partId].questions[questionId];
        question.stem = data.stem;
        return question;
    };

    self.removeQuestion = function(exerciseId, partId, questionId) {
        self.exercise.parts[partId].questions.splice(questionId, 1);
        return {
            success: true
        };
    };

    self.addSimpleChoice = function(exerciseId, partId, questionId, data) {
        data.id = self.exercise.parts[partId].questions[questionId].simple_choices.length;
        data.position = data.id;
        self.exercise.parts[partId].questions[questionId].simple_choices.push(data);
        return data;
    };

    self.updateSimpleChoice = function(exerciseId, partId, questionId, choiceId, data) {
        var simple = self.exercise.parts[partId].questions[questionId].simple_choices[choiceId];
        simple.content = data.content;
        return simple;
    };

    self.removeSimpleChoice = function(exerciseId, partId, questionId, choiceId) {
        self.exercise[partId].questions[questionId].simple_choices.splice(choiceId, 1);
        return {
            succes: true
        };
    };

    self.addComboChoice = function(exerciseId, partId, questionId, data) {
        data.id = self.exercise.parts[partId].questions[questionId].combo_choices.length;
        self.exercise.parts[partId].questions[questionId].combo_choices.push(data);
        return data;
    };

    self.updateComboChoice = function(exerciseId, partId, questionId, choiceId, data) {
        var combo = self.exercise.parts[partId].questions[questionId].combo_choices[choiceId];
        combo.combo_simple_choices = data.combo_simple_choices;
        return combo;
    };

    self.removeComboChoice = function(exerciseId, partId, questionId, choiceId) {
        self.exercise[partId].questions[questionId].combo_choices.splice(choiceId, 1);
        return {
            success: true
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
            addSimpleChoice: self.addSimpleChoice,
            updateSimpleChoice: self.updateSimpleChoice,
            removeSimpleChoice: self.removeSimpleChoice
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
    .post("/api/exercises/:exerciseId/parts/:partId/questions/:questionId/simpleChoices",
        function(context, exerciseId, partId, questionId) {
            return exercise.addQuestion(exerciseId, partId, questionId, context.data);
        })
    .put("/api/exercises/:exerciseId/parts/:partId/questions/:questionId/simplechoices/choiceId",
        function(context, exerciseId, partId, questionId, choiceId) {
            return exercise.updateQuestion(exerciseId, partId, questionId, choiceId, context.data);
        })
    .del("/api/exercises/:exerciseId/parts/:partId/questions/:questionId/simplechoices/choiceId",
        function(context, exerciseId, partId, questionId, choiceId) {
            return exercise.removeChoice(exerciseId, partId, questionId, choiceId);
        });

fauxServer.enable();
