var fauxServer = require("backbone-faux-server");
var _ = require("underscore");

// The deathmatch namespace.
var deathMatch = deathMatch || {};

deathMatch.stub = function() {
    var self = this;

    self.exercise = {
        parts: [{
            background: "",
            questions: [{
                questionStem: "",
                questionType: "",
                questionContent: {
                    simpleChoices: [{
                        choiceContent: ""
                    }],
                    comboChoices: [{
                        simpleChoiceIds: []
                    }]
                }
            }]
        }]
    };

    self.update = function(exerciseId, data) {
        self.exercise.background = data.background;
        return data;
    };

    self.addPart = function(exerciseId, data) {
        data.id = self.exercise.parts.length - 1;
        self.exercise.parts.push(data);
        return data;
    };

    self.updatePart = function(partId, data) {
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

    self.addQuestion = function(exerciseId, partId, questionStem) {
        self.parts[partId].questions.push({
            questionStem: questionStem,
            questionType: "multipleChoice",
            questionContent: {
                choices: []
            }
        });
    };

    self.updateQuestion = function(partId, questionId, questionStem) {
        self.exercise.parts[partId].questions[questionId].questionStem = questionStem;
    };

    self.removeQuestion = function(exerciseId, partId, questionId) {
        self.exercise.parts[partId].questions.splice(questionId, 1);
    };

    self.addSimpleChoice = function(exerciseId, partId, questionId, choiceContent) {
        self.parts[partId].questions[questionId].choices.push({
            choiceContent: choiceContent
        });
    };

    self.updateSimpleChoice = function(partId, questionId, choiceId, choiceContent) {
        self.exercise.parts[partId].questions[questionId].choices[choiceId].choiceContent = choiceContent;
    };

    self.removeSimpleChoice = function(exerciseId, partId, questionId, choiceId) {
        self.exercise[partId].questions[questionId].choices.splice(choiceId, 1);
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
