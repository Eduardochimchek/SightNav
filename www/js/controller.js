angular.module('app.controllers', [])
.controller('AcelerometroCtrl', function($scope, $state) {
    // Inicializa os valores
    $scope.acceleration = { x: 0, y: 0, z: 0 };
    $scope.velocidade = 0; // em metros por segundo
    $scope.distancia = 0; // em metros

    const threshold = 0.3; // Limite mínimo mais alto para ignorar pequenas vibrações
    const deltaT = 0.1; // Intervalo de tempo em segundos
    let lastAcceleration = { x: 0, y: 0, z: 0 };

    let lastMovementTime = Date.now(); // Armazena o tempo do último movimento
    const movementCooldown = 2000; // Tempo em milissegundos (2 segundos)

    function onSuccess(acceleration) {
        const accX = parseFloat(acceleration.x.toFixed(2));
        const accY = parseFloat(acceleration.y.toFixed(2));
        const accZ = parseFloat(acceleration.z.toFixed(2));

        // Calcula magnitude da aceleração, aplicando filtro de valor mínimo
        const accMagnitude = Math.sqrt(accX ** 2 + accY ** 2 + accZ ** 2) - 9.8; // Remove a gravidade

        // Verifica se o movimento é significativo
        if (accMagnitude > threshold) {
            // Calcula a nova velocidade e distância
            $scope.velocidade += accMagnitude * deltaT;
            $scope.distancia += $scope.velocidade * deltaT;

            // Arredonda os valores para exibição
            $scope.velocidade = parseFloat($scope.velocidade.toFixed(2));
            $scope.distancia = parseFloat($scope.distancia.toFixed(2));

            // Atualiza o tempo do último movimento
            lastMovementTime = Date.now();
        } else {
            // Zera a velocidade e distância se o movimento parou por mais do que o cooldown
            if (Date.now() - lastMovementTime > movementCooldown) {
                $scope.velocidade = 0;
                $scope.distancia = 0; // Zera a distância quando não há movimento
            }
        }

        // Atualiza os valores de aceleração para exibição
        $scope.acceleration.x = accX;
        $scope.acceleration.y = accY;
        $scope.acceleration.z = accZ;
        $scope.$apply();
    }

    function onError() {
        console.error('Erro ao obter dados do acelerômetro.');
    }

    // Define as opções do acelerômetro
    const options = { frequency: 100 }; // Frequência ajustada para 10 vezes por segundo

    // Inicia a captura dos dados do acelerômetro
    navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
    
    // Função para retornar ao menu
    $scope.returnMenu = function() {
        $state.go('home'); // Altere para o nome da sua página inicial
    };
});