angular.module('app.controllers', [])
.controller('AcelerometroCtrl', function($scope, $state) {
    // Inicializa os valores
    $scope.acceleration = { x: 0, y: 0, z: 0 };
    $scope.velocidade = 0;
    $scope.distancia = 0;
    $scope.userPosition = { lat: null, lng: null };
    $scope.nodoMaisProximo = null;

    const threshold = 0.3;
    const deltaT = 0.1;
    let lastMovementTime = Date.now();
    const movementCooldown = 2000;

    
    const nos = [
        { id: "1", lat: -28.702479, lng: -49.405792 },
        { id: "2", lat: -28.702647, lng: -49.405653 },
        { id: "3", lat: -28.703194, lng: -49.405870 },
        { id: "4", lat: -28.703361, lng: -49.406033 },
        { id: "5", lat: -28.703282, lng: -49.406154 },
        { id: "7", lat: -28.703458, lng: -49.405900 },
        { id: "8", lat: -28.703761, lng: -49.406072 },
        { id: "9", lat: -28.70256070440003, lng: -49.405887386295234 },
        { id: "10", lat: -28.702893648237755, lng: -49.40630658700558 },
        { id: "11", lat: -28.70292423234848, lng: -49.406690142885886 },
        { id: "12", lat: -28.703190666630892, lng: -49.40655335022747 },
        { id: "13", lat: -28.703414178872382, lng: -49.406319030866186 },
        { id: "14", lat: -28.703388834570102, lng: -49.40555038530369 },
        { id: "15", lat: -28.703972701000232, lng: -49.40584302545029 },
        { id: "16", lat: -28.704307944912074, lng: -49.40566186338986 },
        { id: "17", lat: -28.704614425497500, lng: -49.40569600032280 },
        { id: "18", lat: -28.703663283742387, lng: -49.40652981921881 },
        { id: "19", lat: -28.703884, lng: -49.406100 },
        { id: "20", lat: -28.704584, lng: -49.406314 },
        { id: "B17", lat: -28.703573477498356, lng: -49.40646826283265 },
        { id: "B24", lat: -28.704641, lng: -49.406177 }
    ];

    function updateArrow() {
        const accX = $scope.acceleration.x;
        const accY = $scope.acceleration.y;

        const arrow = document.getElementById('arrow3d');
        if (arrow) {
            arrow.style.transform = `rotateX(${accY * 10}deg) rotateY(${accX * 10}deg)`;
        }
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

        $scope.acceleration = { x: accX, y: accY, z: accZ };
        updateArrow();
        $scope.$apply();
    }

    function onError() {
        console.error('Erro ao obter os dados do acelerômetro');
    }

    navigator.accelerometer.watchAcceleration(onSuccess, onError, { frequency: 100 });

    // Função para verificar o GPS e redirecionar para as configurações se estiver desativado
    function checkGPSAndRedirect() {
        cordova.plugins.diagnostic.isLocationEnabled(function(enabled) {
            if (!enabled) {
                console.log("GPS desativado. Redirecionando para as configurações.");
                cordova.plugins.diagnostic.switchToLocationSettings();
            } else {
                console.log("GPS ativado.");
            }
        }, function(error) {
            console.error("Erro ao verificar a localização: ", error);
        });
    }

    // GPS - Captura posição do usuário
    function updateGPSPosition() {
        checkLocationPermission();

        navigator.geolocation.getCurrentPosition(
            function(position) {
                $scope.userPosition.lat = position.coords.latitude;
                $scope.userPosition.lng = position.coords.longitude;
                console.log("Localização atual:", $scope.userPosition);

                const nearestNode = getNearestNode($scope.userPosition.lat, $scope.userPosition.lng);
                $scope.nodoMaisProximo = nearestNode;
                console.log("Nó mais próximo:", nearestNode);
                $scope.$apply();
            },
            function(error) {
                console.error("Erro ao obter localização GPS:", error);
                checkGPSAndRedirect(); // Chama a função para verificar o GPS e redirecionar caso necessário
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }

    // Função para encontrar o nó mais próximo
    function getNearestNode(userLat, userLng) {
        let nearest = null;
        let minDist = Infinity;

        nos.forEach(node => {
            const dLat = userLat - node.lat;
            const dLng = userLng - node.lng;
            const dist = Math.sqrt(dLat * dLat + dLng * dLng);
            if (dist < minDist) {
                minDist = dist;
                nearest = node;
            }
        });

        return nearest;
    }

    // Função para verificar e solicitar permissão de localização
    function checkAndRequestLocationPermission() {
        // Verifica se a permissão de localização já foi concedida
        cordova.plugins.permissions.checkPermission(cordova.plugins.permissions.ACCESS_FINE_LOCATION, function(status) {
            if (!status.hasPermission) {
                // Se não tiver permissão, solicita
                cordova.plugins.permissions.requestPermission(cordova.plugins.permissions.ACCESS_FINE_LOCATION, function(result) {
                    if (result.hasPermission) {
                        console.log("Permissão de localização concedida.");
                        // Agora você pode acessar a geolocalização
                        updateGPSPosition();
                    } else {
                        console.log("Permissão de localização negada.");
                    }
                }, function(error) {
                    console.error("Erro ao solicitar permissão de localização:", error);
                });
            } else {
                // Caso já tenha permissão, apenas chama a função para capturar a localização
                updateGPSPosition();
            }
        });
    }

    // Atualiza GPS a cada 10 segundos
    setInterval(checkAndRequestLocationPermission, 10000);

    // Voltar ao menu
    $scope.returnMenu = function() {
        $state.go("mainmenu");
    };
});
