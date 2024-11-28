angular.module('app.controllers', [])
.controller('AcelerometroCtrl', function($scope, $state) {
    // Inicializa os valores
    $scope.acceleration = { x: 0, y: 0, z: 0 };
    $scope.velocidade = 0;
    $scope.distancia = 0;

    const threshold = 0.3;
    const deltaT = 0.1;
    let lastAcceleration = { x: 0, y: 0, z: 0 };
    let lastMovementTime = Date.now();
    const movementCooldown = 2000;

    function updateArrow() {
        const accX = $scope.acceleration.x;
        const accY = $scope.acceleration.y;
        const accZ = $scope.acceleration.z;

        // Atualiza a rotação da seta com base nos valores de aceleração
        const arrow = document.getElementById('arrow3d');
        arrow.style.transform = `rotateX(${accY * 10}deg) rotateY(${accX * 10}deg)`;
    }

    function onSuccess(acceleration) {
        const accX = parseFloat(acceleration.x.toFixed(2));
        const accY = parseFloat(acceleration.y.toFixed(2));
        const accZ = parseFloat(acceleration.z.toFixed(2));

        const accMagnitude = Math.sqrt(accX ** 2 + accY ** 2 + accZ ** 2) - 9.8;

        if (accMagnitude > threshold) {
            $scope.velocidade += accMagnitude * deltaT;
            $scope.distancia += $scope.velocidade * deltaT;
            $scope.velocidade = parseFloat($scope.velocidade.toFixed(2));
            $scope.distancia = parseFloat($scope.distancia.toFixed(2));
            lastMovementTime = Date.now();
        } else {
            if (Date.now() - lastMovementTime > movementCooldown) {
                $scope.velocidade = 0;
                $scope.distancia = 0;
            }
        }

        $scope.acceleration.x = accX;
        $scope.acceleration.y = accY;
        $scope.acceleration.z = accZ;
        
        updateArrow(); // Atualiza a seta com a nova aceleração
        $scope.$apply();
    }

    function onError() {
        console.error('Erro ao obter os dados do acelerômetro');
    }

    // Inicializa a captura de dados do acelerômetro
    navigator.accelerometer.watchAcceleration(onSuccess, onError, { frequency: 100 });

    // Função de voltar ao menu
    $scope.returnMenu = function() {
        $state.go("mainmenu");
    };
});