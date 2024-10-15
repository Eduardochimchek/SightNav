angular.module('app.controllers', [])
.controller('AcelerometroCtrl', function($scope, $state) {
    $scope.acceleration = {
        x: 0,
        y: 0,
        z: 0
    };

    const arrow = document.getElementById('arrow');

    function onSuccess(acceleration) {
        $scope.acceleration.x = acceleration.x.toFixed(2);
        $scope.acceleration.y = acceleration.y.toFixed(2);
        $scope.acceleration.z = acceleration.z.toFixed(2);
        $scope.$apply(); // Atualiza o scope
        
        // Calcula a rota��o em graus
        const rotationX = acceleration.y * 10; // Ajuste a escala conforme necess�rio
        const rotationY = -acceleration.x * 10; // Ajuste a escala conforme necess�rio
        const rotationZ = acceleration.z * 10; // Ajuste a escala conforme necess�rio
        
        // Aplica a rota��o
        arrow.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg) rotateZ(${rotationZ}deg)`;
    }

    function onError() {
        console.error('Erro ao obter dados do aceler�metro.');
    }

    // Define as op��es do aceler�metro
    const options = { frequency: 1000 }; // 1 segundo

    // Inicia a captura dos dados do aceler�metro
    navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
    
    // Fun��o para retornar ao menu
    $scope.returnMenu = function() {
        $state.go('home'); // Altere para o nome da sua p�gina inicial
    };
});