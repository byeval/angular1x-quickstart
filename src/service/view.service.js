;
(function() {
    'use strict';

    angular.module('myApp.service.viewService', [])
        .factory('ViewOneService', ViewOneService)
        .factory('ViewTwoService', ViewTwoService)

    function ViewOneService() {
        return {
            title: 'Hello World'
        }
    }

    function ViewTwoService() {
        var service = {
            getTitle: getTitle
        }

        return service

        function getTitle() {
            return 'Hello angin! I\'m view2.'
        }
    }
})()
