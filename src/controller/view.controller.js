;
(function() {
    'use strict'

    angular
        .module('myApp.controller.viewCtrl', [])
        .controller('ViewOneCtrl', ViewOneCtrl)
        .controller('ViewTwoCtrl', ViewTwoCtrl)


    function ViewOneCtrl(ViewOneService) {
        var vm = this
        vm.title = ViewOneService.title
    }

    function ViewTwoCtrl(ViewTwoService, $state) {
        var vm = this
        vm.title = ViewTwoService.getTitle()
        vm.goback = goback

        function goback() {
            $state.go('view1')
        }
    }
})()
