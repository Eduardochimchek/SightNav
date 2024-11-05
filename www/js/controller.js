angular.module('app.controllers', [])
.controller('AcelerometroCtrl', function($scope, $state) {
    // Inicializa os valores
    $scope.acceleration = { x: 0, y: 0, z: 0 };
    $scope.velocidade = 0;
    $scope.distancia = 0;

    const threshold = 0.3; // Limite m�nimo para considerar movimento
    const deltaT = 1; // Intervalo de tempo em segundos (ajustado para 1 segundo)
    let lastAcceleration = { x: 0, y: 0, z: 0 }; // Armazena a �ltima acelera��o

    let lastMovementTime = Date.now(); // Armazena o tempo do �ltimo movimento
    const movementCooldown = 2000; // Tempo em milissegundos (2 segundos)

    function onSuccess(acceleration) {
        const accX = parseFloat(acceleration.x.toFixed(2));
        const accY = parseFloat(acceleration.y.toFixed(2));
        const accZ = parseFloat(acceleration.z.toFixed(2));

        const accMagnitude = Math.sqrt(accX ** 2 + accY ** 2 + accZ ** 2);

        const deltaAccX = Math.abs(accX - lastAcceleration.x);
        const deltaAccY = Math.abs(accY - lastAcceleration.y);
        const deltaAccZ = Math.abs(accZ - lastAcceleration.z);

        // Verifica se h� movimento significativo
        if (accMagnitude > threshold && (deltaAccX > threshold || deltaAccY > threshold || deltaAccZ > threshold)) {
            $scope.velocidade += accMagnitude * deltaT;
            $scope.distancia += $scope.velocidade * deltaT;

            $scope.velocidade = parseFloat($scope.velocidade.toFixed(2));
            $scope.distancia = parseFloat($scope.distancia.toFixed(2));

            // Atualiza o tempo do �ltimo movimento
            lastMovementTime = Date.now();
        } else {
            // Verifica se o tempo desde o �ltimo movimento � maior que o cooldown
            if (Date.now() - lastMovementTime > movementCooldown) {
                // Reseta velocidade e dist�ncia se n�o houver movimento por um tempo
                $scope.velocidade = 0;
                $scope.distancia = 0;
            }
        }

        lastAcceleration = { x: accX, y: accY, z: accZ };
        $scope.acceleration.x = accX;
        $scope.acceleration.y = accY;
        $scope.acceleration.z = accZ;
        $scope.$apply();
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