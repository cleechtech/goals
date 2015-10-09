var app = angular.module('slideshow', ['ngAnimate', 'firebase']);

app.constant('ENDPOINT_URI', 'https://connorsgoals.firebaseio.com/');

app.controller('MainCtrl', function ($scope, $location, RemoteSlide) {
    var LEFT_ARROW = 37,
        RIGHT_ARROW = 39;

    function isCurrentSlideIndex(index) {
        return $scope.remoteSlide.currentIndex === index;
    }

    function prevSlide() {
        $scope.remoteSlide.direction = 'left';
        $scope.remoteSlide.currentIndex = ($scope.remoteSlide.currentIndex > 0)
            ? --$scope.remoteSlide.currentIndex : $scope.slides.length - 1;
    }

    function nextSlide() {
        $scope.remoteSlide.direction = 'right';
        $scope.remoteSlide.currentIndex = ($scope.remoteSlide.currentIndex < $scope.slides.length - 1)
            ? ++$scope.remoteSlide.currentIndex : 0;
    }

    function onKeyUp(keyCode) {
        if (keyCode === LEFT_ARROW) {
            console.log('left arrow')
            prevSlide();
        } else if (keyCode === RIGHT_ARROW) {
            console.log('right arrow')
            nextSlide();
        }
    }

    function getDirection() {
        return $scope.remoteSlide.direction;
    }

    $scope.slides = [
        {id: 'slide00', title: 'Save $19,000 for Hack Reactor', subtitle: 'Make enough money to pay for a three month intensive javascript programming course'},
        {id: 'slide01', title: 'Move to San Francisco', subtitle: 'Afford expensive rent'},
        {id: 'slide02', title: 'Become a published author', subtitle: 'Start writing'},
        {id: 'slide03', title: 'Race across the Pacific Ocean', subtitle: 'on a sailboat'},
        {id: 'slide04', title: 'Do business in Cape Town', subtitle: 'Surf and visit friends'},
        {id: 'slide05', title: 'Build a tech company', subtitle: 'Make something that helps people'},
        {id: 'slide06', title: 'Brew beer', subtitle: 'Keep it crafty'},
        {id: 'slide07', title: 'Make it to Vegas', subtitle: 'Build a team I can count on. Have fun. Enjoy the ride!'}
    ];

    $scope.remoteSlide = {
        currentIndex: 0,
        direction: 'left'
    };

    $scope.onKeyUp = onKeyUp;
    $scope.isCurrentSlideIndex = isCurrentSlideIndex;
    $scope.getDirection = getDirection;

    RemoteSlide().$bindTo($scope, 'remoteSlide');
});

app.factory('RemoteSlide', function($firebase, ENDPOINT_URI) {
    return function() {
        // create a reference to the current slide index
        var ref = new Firebase(ENDPOINT_URI);

        // return it as a synchronized object
        return $firebase(ref).$asObject();
    }
});

app.animation('.slide-animation', function ($window) {
    return {
        enter: function (element, done) {
            var scope = element.scope();

            var startPoint = $window.innerWidth;
            if(scope.getDirection() !== 'right') {
                startPoint = -startPoint;
            }
            TweenMax.fromTo(element, 0.5, {left: startPoint}, {left:0, onComplete: done });
        },

        leave: function (element, done) {
            var scope = element.scope();

            var endPoint = $window.innerWidth;
            if(scope.getDirection() === 'right') {
                endPoint = -endPoint;
            }

            TweenMax.to(element, 0.5, { left: endPoint, onComplete: done });
        }
    };
});