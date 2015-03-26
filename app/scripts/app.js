'use strict';

/**
 * @ngdoc overview
 * @name pmsApp
 * @description
 * # pmsApp
 *
 * Main module of the application.
 */
angular
  .module('pmsApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "views/Main.html",
        controller: "MainController"
      })
      .otherwise({
        redirectTo: "/"
      });
  });

/**
 * Google Analystics
 */
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-60605331-2', 'auto');
ga('send', 'pageview');

/**
 * Screen Control
 */
//buttons size calculate for title width
(function(hb){
  screen.$buttonsWidth = hb.eq(0).width() + hb.eq(1).width() + 20;
})($(".header > div"));

//Menu toggle event
(function(menu, btn){
  screen.$menu = {
    isOpen: false,
    backable: function() {
      return !/\/gate\.html$/.test(document.referrer);
    },
    back: function() {
      if(screen.$menu.backable())
        history.back();
    },
    open: function() {
      btn.trigger("click");
    }
  };

  btn.click(function(){
    screen.$menu.isOpen = !screen.$menu.isOpen;
    if(screen.$menu.isOpen) {
      menu.addClass("show");
    }
    else {
      menu.removeClass("show");
    }
  })
})($(".menu"), $(".header .btn-menu"));
