function sortNumber(a, b) {
    return a.port - b.port;
}

angular.module('starter.controllers', ['ngCordova'])

.controller('DashCtrl', function($scope, $ionicModal, $ionicLoading, $state, $http, $localstorage, Shodan) {
    if ($localstorage.get('api_key', 'none') === 'none') {
        $state.go('login');
    }

    Shodan.getPopularQueries(function(popularQueries) {
        $scope.popularQueries = popularQueries.slice(0, 5);
    });

    $scope.formData = {};
    $scope.formData.search = Shodan.getSearchTerms();

    $scope.search = function(item, event) {
        if ($scope.formData.search == '') {
            return;
        } else {
            $state.go('tab.results', {
                'searchTerms': $scope.formData.search
            });
        }
    }
})

.controller('ResultsSearchCtrl', function($scope, $stateParams, $ionicLoading, $cordovaToast, $ionicHistory, Shodan) {
    $scope.loadingIndicator = $ionicLoading.show({
        content: 'Loading Data',
        animation: 'fade-in',
        showBackdrop: false,
        maxWidth: 200,
        showDelay: 500
    });

    Shodan.search($stateParams.searchTerms, function(results) {
        $ionicLoading.hide();
        if (results !== null) {
            $scope.search = $stateParams.searchTerms;
            $scope.results = results;
            $scope.numberResults = Shodan.gethostResults();
            console.log($scope.numberResults);
        } else {
            // $cordovaToast.showLongBottom('An error occured, try again.').then(function(success) {
            //     $ionicHistory.goBack();
            // }, function(error) {});
        }
    });

    $scope.moreDataCanBeLoaded = function() {
        return Shodan.gethostResults() > 0 && Shodan.getPageHost() < 9 && Shodan.getPageHost() * 10 < Shodan.gethostResults();
    }

    $scope.loadMore = function() {
        if (!$scope.moreDataCanBeLoaded()) {
            return;
        }
        Shodan.loadMoreHostResults(function(items) {
            if (items) {
                Array.prototype.push.apply($scope.results, items);
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }
        });
    };

    $scope.$on('$stateChangeSuccess', function() {
        $scope.loadMore();
    });
})

.controller('IntroductionCtrl', function($scope, $state, $ionicSlideBoxDelegate, $localstorage) {
    // if the user has already done the intro
    if ($localstorage.get('intro', 'none') !== 'none') {
        $state.go('tab.dash');
    }


    // Called to navigate to the main app
    $scope.startApp = function() {
        // we say that the intro has been done
        $localstorage.set('intro', 'done');
        $state.go('tab.dash');
    };
    $scope.next = function() {
        console.log('next');
        $ionicSlideBoxDelegate.next();
    };
    $scope.previous = function() {
        console.log('previous');
        $ionicSlideBoxDelegate.previous();
    };

    // Called each time the slide changes
    $scope.slideChanged = function(index) {
        $scope.slideIndex = index;
    };
})


.controller('MatchCtrl', function($scope, $stateParams, $ionicLoading, Shodan, $cordovaToast, $cordovaClipboard) {
    $scope.loadingIndicator = $ionicLoading.show({
        content: 'Loading Data',
        animation: 'fade-in',
        showBackdrop: false,
        maxWidth: 200,
        showDelay: 500
    });

    $scope.doNotDisplayMap = true;

    var ip = $stateParams.resultId;
    Shodan.getHostResult(ip, function(match) {
        if (match != null) {
            $scope.match = match;
            $ionicLoading.hide();

            $scope.map = {
                center: {
                    latitude: match.latitude,
                    longitude: match.longitude
                },
                zoom: 8
            };
            $scope.marker = {
                id: 0,
                coords: {
                    latitude: match.latitude,
                    longitude: match.longitude
                },
                options: {},
                events: {}
            };
            $scope.doNotDisplayMap = false;

            $scope.groups = [];
            match.data = match.data.sort(sortNumber);
            for (var i = 0; i < match.data.length; i++) {
                $scope.groups[i] = {
                    name: match.data[i].port,
                    items: []
                };
                $scope.groups[i].items.push(match.data[i].data);
            }
        }
    });

    $scope.toggleGroup = function(group) {
        if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = group;
        }
    };

    $scope.isGroupShown = function(group) {
        return $scope.shownGroup === group;
    };

    $scope.copyToClipboard = function(str) {
        $cordovaClipboard.copy(str).then(function () {
            // $cordovaToast.showShortBottom(str+' copied to the clipboard.').then(function(success) {
            // }, function(error) {});
        }, function () {
        // error
        });
    };

})

.controller('AccountCtrl', function($scope, $state, $localstorage, $cordovaToast, Shodan) {
    Shodan.getProfile(function(data) {
        data.created = Date.parse(data.created)
        $scope.user = data;
    });

    $scope.disconnect = function(item, event) {
        $localstorage.clear();
        // $cordovaToast.showLongBottom('Disconnected successfuly.').then(function(success) {
        // }, function(error) {});
        $state.go('intro');
    }
})

.controller('QueriesCtrl', function($scope, Shodan) {
    Shodan.getPopularQueries(function(popularQueries) {
        $scope.popularQueries = popularQueries;
    });

    $scope.$broadcast('scroll.infiniteScrollComplete');

    $scope.moreDataCanBeLoaded = function() {
        return Shodan.getQueryResults() > 0 && Shodan.getQueryResults() > Shodan.getPageQuery() * 10;
    }

    $scope.loadMore = function() {
        if (!$scope.moreDataCanBeLoaded()) {
            return;
        } else {
            Shodan.loadMoreQueryResults(function(items) {
                if (items != null) {
                    Array.prototype.push.apply($scope.popularQueries, items);
                }
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }
    };

    $scope.$on('$stateChangeSuccess', function() {
        $scope.loadMore();
    });
})

.controller('IntroCtrl', function($scope, $state, $localstorage, $cordovaToast, $cordovaBarcodeScanner, Shodan) {
    $scope.formData = {};
    $scope.formData.search = '';

    $scope.search = function(item, event) {
        $localstorage.set('api_key', $scope.formData.search);
        Shodan.getProfile(function(res) {
            if (res == null) {
                // $cordovaToast.showLongBottom('Make sure your API is correct and try again.').then(function(success) {}, function(error) {});
            } else {
                // $cordovaToast.showLongBottom('Logged in successfuly.').then(function(success) {
                // }, function (error) {
                // });
                $state.go('tab.dash');
            }
        })
    }

    $scope.scanBarcode = function() {
        $cordovaBarcodeScanner.scan().then(function(imageData) {
            $scope.formData.search = imageData.text;
        }, function(error) {
            // $cordovaToast.showLongBottom('An error occured while scanning the QR code.').then(function(success) {}, function(error) {});
        });
    };
})

.controller('InformationCtrl', function($scope) {});