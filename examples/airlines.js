// Generated by CoffeeScript 1.9.1
(function() {
  var h2o, h2ojs, path, test;

  path = require('path');

  h2ojs = require('./../h2o.js');

  test = require('tape');

  h2o = h2ojs.connect();


  /*
  
  Flight Delay Prediction (Binary Classification)
  -----------------------------------------------
  Use historical on-time performance data to predict whether the departure of a scheduled flight will be delayed.
  
  - Split airlines dataset into train and validation sets.
  - Build GBM and GLM models using the train and validation sets.
  - Preict on a test set and print prediction performance metrics.
   */

  test('airlines example', function(t) {
    var airlines, gbmModel, gbmPrediction, glmModel, glmPrediction, ignoredColumns, random, responseColumn, testFrame, trainingFrame, validationFrame;
    airlines = h2o.importFrame({
      path: path.join(__dirname, 'data', 'AirlinesTrain.csv.zip')
    });
    random = h2o.map(airlines, function(a) {
      return random(a, -1);
    });
    trainingFrame = h2o.filter(airlines, random, function(a) {
      return a <= 0.8;
    });
    validationFrame = h2o.filter(airlines, random, function(a) {
      return a > 0.8;
    });
    ignoredColumns = ['IsDepDelayed_REC', 'fYear', 'DepTime', 'ArrTime'];
    responseColumn = 'IsDepDelayed';
    gbmModel = h2o.createModel('gbm', {
      training_frame: trainingFrame,
      validation_frame: validationFrame,
      ignored_columns: ignoredColumns,
      response_column: responseColumn,
      ntrees: 100,
      max_depth: 3,
      learn_rate: 0.01,
      loss: 'bernoulli'
    });
    glmModel = h2o.createModel('glm', {
      training_frame: trainingFrame,
      validation_frame: validationFrame,
      ignored_columns: ignoredColumns,
      response_column: responseColumn
    });
    testFrame = h2o.importFrame({
      path: path.join(__dirname, 'data', 'AirlinesTest.csv.zip')
    });
    gbmPrediction = h2o.createPrediction({
      model: gbmModel,
      frame: testFrame
    });
    glmPrediction = h2o.createPrediction({
      model: glmModel,
      frame: testFrame
    });
    return h2o.resolve(gbmPrediction, glmPrediction, function(error, gbmPrediction, glmPrediction) {
      if (error) {
        return t.end(error);
      } else {
        h2o.dump(gbmPrediction);
        h2o.dump(glmPrediction);
        return h2o.removeAll(function() {
          return t.end();
        });
      }
    });
  });

}).call(this);
