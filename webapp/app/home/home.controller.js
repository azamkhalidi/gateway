(function() {
    'use strict';

    angular
        .module('gatewayApp')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', 'Principal', 'LoginService', '$state', 'Auth', '$rootScope'];

    function HomeController ($scope, Principal, LoginService, $state, Auth, $rootScope) {
        var vm = this;

        vm.account = null;
        vm.isAuthenticated = null;
        vm.login = login;
        vm.register = register;
        $scope.$on('authenticationSuccess', function() {
            getAccount();
        });

        getAccount();

        function getAccount() {
            Principal.identity().then(function(account) {
                vm.account = account;
                vm.isAuthenticated = Principal.isAuthenticated;
            });
        }
        function register () {
            $state.go('register');
        }


      //////////////////////////
      function login (event) {
          event.preventDefault();
          Auth.login({
              username: vm.username,
              password: vm.password,
              rememberMe: vm.rememberMe
          }).then(function () {
              vm.authenticationError = false;
              // if ($state.current.name === 'register' || $state.current.name === 'activate' ||
              //     $state.current.name === 'finishReset' || $state.current.name === 'requestReset') {
              //     $state.go('home');
              // }

              $rootScope.$broadcast('authenticationSuccess');

              // previousState was set in the authExpiredInterceptor before being redirected to login modal.
              // since login is succesful, go to stored previousState and clear previousState
              if (Auth.getPreviousState()) {
                  var previousState = Auth.getPreviousState();
                  Auth.resetPreviousState();
                  $state.go(previousState.name, previousState.params);
              }
          }).catch(function () {
              vm.authenticationError = true;
          });
      }

    }
})();
