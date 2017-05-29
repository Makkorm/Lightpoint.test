(function(){

    angular
        .module('app',['ui.router'])
        .config(uiRouterConfig);

    uiRouterConfig.$inject = ['$urlRouterProvider','$stateProvider'];

    function uiRouterConfig($urlRouterProvider, $stateProvider){
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('main', {
                url : '/',
                templateUrl : 'templates/main.html'
            })
            .state('shop', {
                url: '/shop/:id',
                templateUrl: 'templates/shop.detail.html',
                controller: 'ShopDetailCtrl',
                controllerAs : 'shopDetail'
            })

    }

})();