const MESSGAES = {
    UNKNOWN_ERROR: 'Oops, this website is under construction, please come back later.',
    DELIVERY_STATUS: {
        CREATED: 'Your order has been received',
        PREPARING: 'Your order is being prepared',
        READY: 'Your order is ready and will be shipped shortly',
        IN_DELIVERY: 'Your order has been shipped and shall reach you soon',
        DELIVERED: 'Thank you for ordering Ohm. Your order has been delivered',
        REFUSED: 'We are sad that this order has been refused.',
        NOT_FOUND: 'Sorry for the inconvenience. We are trying to locate your order and will soon update you its status',
    },
};

angular
    .module("ohm-delivery", [])
    .controller("tracking", function($scope, $http) {
        $scope.reset = function() {
            $scope.ohm = null;
            $scope.comment = '';
            $scope.trackingStatus = '';
            $scope.errorMessage = '';
            $scope.userSelectedTrackingStatus = '';
            $scope.deliveryStatus = '';
            $scope.loadingStatus = false;
        };

        $scope.changeSelectedStatus = function(status) {
            $scope.userSelectedTrackingStatus = status;
            if (status === 'DELIVERED') {
                $scope.comment = '';
            }
        }

        $scope.statusChange = status => {
            $scope.trackingStatus = status;
            $scope.deliveryStatus = getDeliveryStatus(status);
            // initialize the userSelectStatus, as user can mark the ohm delivered or refused
            if(status === 'IN_DELIVERY') {
                $scope.userSelectedTrackingStatus = 'DELIVERED';
            }
        };

        $scope.onDelivery = function() {
            $http.put(`/ohms/${$scope.trackingId}/status`, {
                status: $scope.userSelectedTrackingStatus,
                comment: $scope.comment
            })
            .then(({ data }) =>  {
                $scope.statusChange(data.status);
                $scope.userSelectedTrackingStatus = '';
                $scope.errorMessage = '';
            }, (error) => {
                const { data: { message: errorMessage } } = error;
                $scope.errorMessage = errorMessage || MESSGAES.UNKNOWN_ERROR
            });
        };

        $scope.submitTrackingId = function() {
            $scope.loadingStatus = true;
            $http.get(`/ohms/${this.trackingId}`)
            .then(({ data }) =>  {
                $scope.ohm = data;
                $scope.statusChange(data.status);
                $scope.loadingStatus = false;
            }, (error) => {
                const { data: { message: errorMessage } } = error;
                $scope.errorMessage = errorMessage || MESSGAES.UNKNOWN_ERROR
                $scope.loadingStatus = false;
                $scope.trackingStatus = '';
            });
        };
        $scope.reset();
    });

function getDeliveryStatus(status) {
    return MESSGAES.DELIVERY_STATUS?.[status] || MESSGAES.DELIVERY_STATUS.NOT_FOUND;
}
