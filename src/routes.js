;(function(){

})()
'use strict'

angular.module('myApp')
    .config(routerConfig)

function routerConfig($httpProvider, $urlRouterProvider, $stateProvider) {
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {}
    }
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache'
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache'

    $httpProvider.defaults.timeout = 10000
    $httpProvider.defaults.headers.post = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    $urlRouterProvider
        .when('', '/')
        .when('/', '/view1')
        .otherwise('/404')

    $stateProvider
        .state('view1', {
            name: 'view1',
            url: '/view1',
            views: {
                '': {
                    templateUrl: 'view1.html',
                    controller: 'ViewOneCtrl',
                    controllerAs: 'vm'
                }
            },
            data: {
                title: 'viewone'
            }
        })
        .state('view2', {
            name: 'view2',
            url: '/view2',
            views: {
                '': {
                    templateUrl: 'view2.html',
                    controller: 'ViewTwoCtrl',
                    controllerAs: 'vm'
                }
            },
            data: {
                title: 'viewtwo'
            }
        })

}
