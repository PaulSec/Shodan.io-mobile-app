angular.module('starter.services', [])

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }, 
    clear: function() {
      $window.localStorage.clear();
    }
  }
}])

.factory('Shodan', function($http, $localstorage) {
    var search_results = {"matches": [], "total": 0};
    var pageHosts = 1;
    var pageQueries = 1;
    var searchTerms = "";
    var numberQueryResults = 0;

    return {
        search: function(term, callback) {
            $http.get('https://api.shodan.io/shodan/host/search?query=' + term + '&key=' + $localstorage.get('api_key') + '&minify=true', {timeout: 25000}).then(function(resp) {
                pageHosts = 1;
                searchTerms = term;
                if (typeof resp.data !== 'object') {
                    callback(null);
                }
                search_results = resp.data;
                console.log(resp.data);
                callback(resp.data.matches.slice(0, 10));
            }, function(err) {
                console.log('sleep for 10 seconds');
                sleepFor(7000);
                $http.get('https://api.shodan.io/shodan/host/search?query=' + term + '&key=' + $localstorage.get('api_key') + '&minify=true', {timeout: 25000}).then(function(resp) {
                    pageHosts = 1;
                    searchTerms = term;
                    if (typeof resp.data !== 'object') {
                        callback(null);
                    }
                    search_results = resp.data;
                    callback(resp.data.matches.slice(0, 10));
                }, function(err) {
                    console.log('sleep for 10 seconds');
                    sleepFor(7000);                    
                    $http.get('https://api.shodan.io/shodan/host/search?query=' + term + '&key=' + $localstorage.get('api_key') + '&minify=true', {timeout: 25000}).then(function(resp) {
                        pageHosts = 1;
                        searchTerms = term;
                        if (typeof resp.data !== 'object') {
                            callback(null);
                        }
                        search_results = resp.data;
                        callback(resp.data.matches.slice(0, 10));
                    }, function(err) {
                        console.error('ERR', err);
                        callback(null);
                    });
                });
            });
        },
        getHostResult: function(host, callback) {
            $http.get('https://api.shodan.io/shodan/host/' + host + '?key=' + $localstorage.get('api_key')).then(function(resp) {
                if (typeof resp.data !== 'object') {
                    callback(null);
                }
                callback(resp.data);
            }, function(err) {
                console.error('ERR', err);
                callback(null);
            });
        },
        getProfile: function(callback) {
            $http.get('https://api.shodan.io/account/profile?key=' + $localstorage.get('api_key') + '&minify=true').then(function (resp) {
                if (typeof resp.data !== 'object') {
                    callback(null);
                } else {
                    resp.data['api_key'] = $localstorage.get('api_key');
                    callback(resp.data);    
                }
            }, function(err) {
                console.error('ERR', err);
                callback(null);
            });
        },
        gethostResults: function() {
            return search_results.total;
        },
        getQueryResults: function() {
            return numberQueryResults;
        },
        getSearchTerms: function() {
            return searchTerms;
        },
        getPageQuery: function() {
            return pageQueries;
        },
        getPageHost: function() {
            return pageHosts;
        },        
        getPopularQueries: function(callback) {
            $http.get('https://api.shodan.io/shodan/query?key=' + $localstorage.get('api_key') + '&order=desc&sort=timestamp').then(function(resp) {
                if (typeof resp.data !== 'object') {
                    callback(null);
                }
                numberQueryResults = resp.data.total;
                callback(resp.data.matches);
            });
        },
        loadMoreHostResults: function(callback) {
            pageHosts = pageHosts + 1;
            callback(search_results.matches.slice(10 * pageHosts, 10 * (pageHosts + 1)));
        },        
        loadMoreQueryResults: function(callback) {
            pageQueries = pageQueries + 1;
            $http.get('https://api.shodan.io/shodan/query?key=' + $localstorage.get('api_key') + '&order=desc&sort=timestamp&page=' + pageQueries).then(function(resp) {
                if (typeof resp.data !== 'object') {
                    callback(null);
                }
                callback(resp.data.matches);
            }, function(err) {
                pageQueries = pageQueries - 1;
                console.error('ERR', err);
                callback(null);
            });
        }
    }
});

function sleepFor( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
}