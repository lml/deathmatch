var fauxServer = require("backbone-faux-server");

// The deathmatch namespace.
var deathMatch = deathMatch || {};

deathMatch.stub = function () {
    var self = this;

    self.exercise = {
        parts: [{
            background: "",
            questions: [{
              questionStem: "",
              questionType: "",
              questionContent: {
                simpleChoices: [{
                  choiceContent: "",
                }],
                comboChoices: [{
                  simpleChoiceIds: []
                }]
              }
            }]
        }]
    };

    self.addPart = function (exerciseId, background) {
        self.exercise.parts.push({background: background});
    };

    self.updatePart = function(partId, background) {
        self.exercise.parts[partId].background = background;
    };

    self.removePart = function (exerciseId, partId) {
        del self.exercise.parts[id];
    };

    self.addQuestion = function (exerciseId, partId, questionStem) {
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

    self.removeQuestion = function (exerciseId, partId, questionId) {
        del self.exercise.parts[partId].questions[questionId];
    };

    self.addSimpleChoice = function (exerciseId, partId, questionId, choiceContent) {
        self.parts[partId].questions[questionId].choices.push({choiceContent: choiceContent});
    };

    self.updateSimpleChoice = function(partId, questionId, choiceId, choiceContent) {
        self.exercise.parts[partId].questions[questionId].choices[choiceId].choiceContent = choiceContent;
    };

    self.removeSimpleChoice = function (exerciseId, partId, questionId, choiceId) {
        del self.exercise[partId].questions[questionId].choices[choiceId];
    };

    return {
        exercise: {
            parts: self.exercise.parts,
            addPart: self.addPart,
            updatePart: self.updatePart,
            removePart: self.removePart,
            addQuestion: self.addQuestion,
            updateQuestion: self.updateQuestion,
            removeQuestion: self.removeQuestion,
            addChoice: self.addChoice,
            updateChoice: self.updateChoice,
            removeChoice: self.removeChoice
        };
    };
};

var exercise = deathMatch.stub();

fauxServer
    .post("api/exercises/:exerciseId/parts",
        function (context, exerciseId) {
            exercise.addPart(exerciseId, context.background);
        })
    .put("api/exercises/:exerciseId/parts/:partId",
        function (context, exerciseId, partId) {
            exercise.updatePart(exerciseId, partId, context.background);
        })
    .del("api/exercises/:exerciseId/parts/:partId",
        function (context, exerciseId, partId) {
            exercise.removePart(exerciseId, partId);
        })
    .post("api/exercises/:exerciseId/parts/:partId/questions",
        function (context, exerciseId, partId){
            exercise.addQuestion(exerciseId, partId, context.questionStem);
        })
    .put("api/exercises/:exerciseId/parts/:partId/questions/:questionId",
        function (context, exerciseId, partId, questionId){
            exercise.updateQuestion(exerciseId, partId, questionId, context.questionStem)
        })
    .del("api/exercises/:exerciseId/parts/:partId/questions/:questionId",
        function (context, exerciseId, partId, questionId) {
            exercise.removeQuestion(exerciseId, partId, questionId);
        })
    .post("api/exercises/:exerciseId/parts/:partId/questions/:questionId/simpleChoices",
        function (context, exerciseId, partId, questionId){
            exercise.addQuestion(exerciseId, partId, questionId, context.choiceContent);
        })
    .put("api/exercises/:exerciseId/parts/:partId/questions/:questionId/simplechoices/choiceId",
        function (context, exerciseId, partId, questionId, choiceId){
            exercise.updateQuestion(exerciseId, partId, questionId, choiceId, context.choiceContent)
        })
    .del("api/exercises/:exerciseId/parts/:partId/questions/:questionId/simplechoices/choiceId",
        function (context, exerciseId, partId, questionId, choiceId) {
            exercise.removeChoice(exerciseId, partId, questionId, choiceId);
        });
