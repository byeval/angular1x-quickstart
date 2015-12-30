'use strict'

angular
    .module('myApp', [
        'ngAnimate',
        'ngSanitize',
        'ui.router',
        'myApp.controller',
        'myApp.service'
    ])
    .run(
        ['$rootScope', '$state', '$stateParams',
            function($rootScope, $state, $stateParams) {
                var ie = /msie (\d+\.\d+)/i.test(navigator.userAgent) ? (document.documentMode || +RegExp['\x241']) : undefined
                if (ie && ie < 10) {
                    window.location = "/sorry-for-old-ie.html"
                }

                $rootScope.$state = $state
                $rootScope.$stateParams = $stateParams
            }
        ])
