angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('Acelerometro', {
        url: '/Acelerometro',
        cache: false,
        templateUrl: 'templates/Acelerometro.html',
        controller: 'AcelerometroCtrl'
    });

    // Redirecionar para Acelerometro se n�o houver rota correspondente
    $urlRouterProvider.otherwise('/Acelerometro');
});