(function(){

    angular
        .module('app')
        .controller('MainCtrl', ['$scope','$http','$timeout', MainCtrl]);

    MainCtrl.$inject = ['$scope','$http','$timeout'];

    function MainCtrl($scope, $http, $timeout){

        var vm = this;

        vm.shops = [];
        vm.map = [];
        vm.adresses = [];
        vm.location = [];
        vm.shopCopy = {};
        vm.isEdit = false;
        vm.markers = [];

        vm.initMap = initMap;
        vm.checkData = checkData;
        vm.editMode = editMode;
        vm.stopEdit = stopEdit;
        vm.saveShop = saveShop;
        vm.deleteShop = deleteShop;


        $http.get('../shops.json')
            .then(function(data){
                var location = [],
                    marker,
                    data = data.data;

                vm.shops = data;

                for (var i=0; i<data.length; i++){
                    (function(i){
                        $http.get('https://maps.googleapis.com/maps/api/geocode/json?address='+ data[i].address +'')
                            .then(function(result){
                                vm.location.push(result.data.results[0].geometry.location);
                                if (vm.markers.length != vm.shops.length) {
                                    marker = new google.maps.Marker({
                                        position : {lat : +result.data.results[0].geometry.location.lat , lng : +result.data.results[0].geometry.location.lng},
                                        title : data[i].name,
                                        map : vm.map
                                    });
                                    vm.shops[i].location = result.data.results[0].geometry.location;
                                    vm.markers.push(marker);
                                } else {
                                    marker = vm.markers[i];
                                }
                            });
                    })(i);
                }

            });

        function initMap(){
            var mapOptions = {
                    zoom : 12,
                    center : new google.maps.LatLng(53.896483, 27.551135)
                },
                map = new google.maps.Map(document.getElementById('map'), mapOptions);

             vm.map = map;
        }

        function checkData(){
            if (vm.newShop.phone === '' || vm.newShop.phone === undefined) {
                vm.newShop.phone = '-';
            }
            if (vm.newShop.time === '' || vm.newShop.time === undefined) {
                vm.newShop.time = 'не указано'
            }
            if (vm.newShop.imgSrc=== '' || vm.newShop.imgSrc === undefined) {
                vm.newShop.imgSrc = 'http://www.imagetext.ru/pics_min/images_3162.gif';
            }

            getLatLng(vm.newShop);
            vm.newShop.id = generateId();
            vm.shops.push(vm.newShop);
            closeForm();
            console.log(vm.shops);
        }

        function closeForm(){
            var closeButton = $('#closeForm');

            $timeout(function(){
                closeButton.click();
                clearForm();
            }, 100)
        }

        function clearForm(){
            vm.newShop = {};
        }

        function getLatLng(newShop){
            $http.get('https://maps.googleapis.com/maps/api/geocode/json?address='+ newShop.address +'')
                .then(function(result){
                    newShop.location = result.data.results[0].geometry.location;
                    marker = new google.maps.Marker({
                        position : {lat : +result.data.results[0].geometry.location.lat , lng : +result.data.results[0].geometry.location.lng},
                        title : newShop.name,
                        map : vm.map
                    });
                });

        }

        function editMode(shop){
            event.preventDefault();
            console.log('s')
            vm.isEdit = true;
            vm.editShopIndex = vm.shops.indexOf(shop);
            vm.shopCopy = jQuery.extend(true, {}, shop);

            vm.newShop = vm.shopCopy;
        }

        function stopEdit(){
            clearForm();
        }

        function saveShop(){
            vm.shops[vm.editShopIndex] = vm.newShop;
            clearForm();
            closeForm();
        }

        function deleteShop(){
            var startShops = vm.shops.slice(0, vm.editShopIndex),
                endShops = vm.shops.slice(vm.editShopIndex + 1);

            vm.shops = startShops.concat(endShops);

            clearForm();
            closeForm();
        }

        function generateId(){
            var lastId = vm.shops[vm.shops.length-1].id;

            return parseInt(lastId) + 1;
        }

    }// end controller

})();