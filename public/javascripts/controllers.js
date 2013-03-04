function IndexCtrl($scope, $http) {
  $http.get('/api/runs').
    success(function(data, status, headers, config) {
      $scope.runs = data.runs;
    });
}
 
function AddRunCtrl($scope, $http, $location) {
  $scope.form = {};
  $scope.submitRun = function () {
    $http.post('/api/run', $scope.form).
      success(function(data) {
        $location.path('/');
      });
  };
}
 
function EditRunCtrl($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $http.get('/api/run/' + $routeParams.id).
    success(function(data) {
      $scope.form = data.run;
    });
    
  $scope.editRun = function () {
    $http.put('/api/run/' + $routeParams.id, $scope.form).
      success(function(data) {
        $location.url('/readRun/' + $routeParams.id);
      });
  };
}
 
function DeleteRunCtrl($scope, $http, $location, $routeParams) {
  $http.get('/api/run/' + $routeParams.id).
    success(function(data) {
      $scope.run = data.run;
    });
    
  $scope.deleteRun = function () {
    $http.delete('/api/run/' + $routeParams.id).
      success(function(data) {
        $location.url('/');
      });
  };
  
  $scope.home = function () {
    $location.url('/');
  };
}