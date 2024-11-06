angular.module('app.controllers', [])
.controller('AcelerometroCtrl', function($scope, $state) {
    // Inicializa os valores
    $scope.acceleration = { x: 0, y: 0, z: 0 };
    $scope.velocidade = 0; // em metros por segundo
    $scope.distancia = 0; // em metros

    const threshold = 0.5; // Limite mínimo para considerar movimento significativo
    const deltaT = 0.1; // Intervalo de tempo em segundos (ajustado para 0.1 segundos)
    let lastAcceleration = { x: 0, y: 0, z: 0 };
    let filteredAcceleration = { x: 0, y: 0, z: 0 }; // Valores filtrados para suavizar

    let lastMovementTime = Date.now(); // Armazena o tempo do último movimento
    const movementCooldown = 2000; // Tempo em milissegundos (2 segundos)

    function onSuccess(acceleration) {
        const accX = parseFloat(acceleration.x.toFixed(2));
        const accY = parseFloat(acceleration.y.toFixed(2));
        const accZ = parseFloat(acceleration.z.toFixed(2));

        // Aplica um filtro simples (filtro de média) para suavizar a aceleração
        filteredAcceleration.x = 0.8 * filteredAcceleration.x + 0.2 * accX;
        filteredAcceleration.y = 0.8 * filteredAcceleration.y + 0.2 * accY;
        filteredAcceleration.z = 0.8 * filteredAcceleration.z + 0.2 * accZ;

        const accMagnitude = Math.sqrt(filteredAcceleration.x ** 2 + filteredAcceleration.y ** 2 + filteredAcceleration.z ** 2);

        const deltaAccX = Math.abs(filteredAcceleration.x - lastAcceleration.x);
        const deltaAccY = Math.abs(filteredAcceleration.y - lastAcceleration.y);
        const deltaAccZ = Math.abs(filteredAcceleration.z - lastAcceleration.z);

        // Verifica se há movimento significativo (para reduzir a acumulação)
        if (accMagnitude > threshold && (deltaAccX > threshold || deltaAccY > threshold || deltaAccZ > threshold)) {
            $scope.velocidade += accMagnitude * deltaT; // Calcula a velocidade em m/s
            $scope.distancia += $scope.velocidade * deltaT; // Calcula a distância em metros

            $scope.velocidade = parseFloat($scope.velocidade.toFixed(2));
            $scope.distancia = parseFloat($scope.distancia.toFixed(2));

            // Atualiza o tempo do último movimento
            lastMovementTime = Date.now();
        } else {
            // Verifica se o tempo desde o último movimento é maior que o cooldown
            if (Date.now() - lastMovementTime > movementCooldown) {
                // Reseta velocidade e distância se não houver movimento por um tempo
                $scope.velocidade = 0;
                $scope.distancia = 0;
            }
        }

        lastAcceleration = { x: filteredAcceleration.x, y: filteredAcceleration.y, z: filteredAcceleration.z };
        $scope.acceleration.x = filteredAcceleration.x;
        $scope.acceleration.y = filteredAcceleration.y;
        $scope.acceleration.z = filteredAcceleration.z;
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