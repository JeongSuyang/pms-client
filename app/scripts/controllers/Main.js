angular.module("pmsApp")
  .controller("MainController", function($scope){

    //Loaded ev ent!
    $scope.$on('$viewContentLoaded', function(){
      if(screen.$menu.backable())
        $(".header > .btn-back").show();

      if(window.ceiApp) {
        window.ceiApp.init();
        window.ceiApp.sync(123);
      }

      $.cei.calendar();
    });
  });
