(function(){

    angular
        .module('app')
        .controller('ShopDetailCtrl', ['$scope','$http','$stateParams', ShopDetailCtrl]);

    ShopDetailCtrl.$inject = ['$scope','$http','$stateParams'];

    function ShopDetailCtrl($scope, $http, $stateParams){

        var vm = this;
        vm.shopId = $stateParams.id;
        vm.shop = {};
        vm.itemEdit = {};
        vm.itemCopy = {};
        vm.mapOptions = {
            zoom : 12,
            center : ''
        };

        vm.initMap = initMap;
        vm.addItem = addItem;
        vm.editItem = editItem;
        vm.deleteItem = deleteItem;
        vm.closeEditForm = closeEditForm;
        vm.saveItem = saveItem;


        getShop();

        function initMap(){
            var mapOptions = {
                    zoom : 12,
                    center : new google.maps.LatLng(53.896483, 27.551135)
                },
                map = new google.maps.Map(document.getElementById('shop-map'), mapOptions);

            vm.map = map;
        }


        function getShop(){
            $http.get('../shops.json')
                .then(function(data){
                   var shops = data.data,
                       i;

                   for( i=0; i<shops.length; i++){
                       if (shops[i].id === vm.shopId){
                           vm.shop = shops[i];
                       }
                   }
                    $http.get('https://maps.googleapis.com/maps/api/geocode/json?address='+ vm.shop.address +'')
                        .then(function(result){
                            marker = new google.maps.Marker({
                                position : {lat : +result.data.results[0].geometry.location.lat , lng : +result.data.results[0].geometry.location.lng},
                                title : vm.shop.name,
                                map : vm.map
                            });
                        });
                })
        }

        function addItem(){
            console.log(vm.newItem);
            if (vm.newItem.img === '' || vm.newItem.img === undefined) {
                vm.newItem.img = 'http://www.imagetext.ru/pics_min/images_3162.gif';
            }
            if (vm.newItem.total === '' || vm.newItem.total === undefined) {
                vm.newItem.total = '-';
            }

            vm.shop.goods.push(vm.newItem);

            vm.newItem = {}
        }

        function editItem(item){
            event.preventDefault();
            $('#edit-item-form').animate({
                right: '15px'
            }, 200);

            vm.editItemIndex = vm.shop.goods.indexOf(item);
            vm.itemCopy = jQuery.extend(true, {}, item);
            vm.itemEdit = vm.itemCopy;
        }

        function deleteItem(){
            var startGoods = vm.shop.goods.slice(0, vm.editItemIndex),
                endGoods = vm.shop.goods.slice(vm.editItemIndex + 1);

            vm.shop.goods = startGoods.concat(endGoods);

            clearForm();
            closeEditForm();
        }

        function closeEditForm(){
            event.preventDefault();
            $('#edit-item-form').animate({
                right: '-300px'
            }, 200)
        }

        function clearForm(){
            vm.itemEdit = {};
        }

        function saveItem(){
            vm.shop.goods[vm.editItemIndex] = vm.itemEdit;
            clearForm();
            closeEditForm();
        }

    }// end controller
})();