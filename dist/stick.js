'use strict';

var Stick = (function() {

  // elements
  var stick;
  var stickRoot;
  var stickControl;

  // sizes
  var stickSize;
  var stickRadius;
  var stickRadiusPercent;
  var stickRootPosition;

  // state
  var isStickBusy;

  // callbacks
  var onBusy;
  var onMove;

  function setElements(params) {
    stick = document.querySelector(params.stickQuery);
    stickRoot = document.querySelector(params.stickRootQuery);
    stickControl = document.querySelector(params.stickControlQuery);
  }

  function setInitialValues(params) {
    stickSize = stick.clientHeight;
    stickRadius = stickSize / 2;
    stickRadiusPercent = stickRadius / 100;
    stickRootPosition = stickRoot.getBoundingClientRect();
    onBusy = params.onBusy || function() {};
    onMove = params.onMove || function() {};
  }

  function bindEvents() {
    stickControl.addEventListener('touchstart', stickStart);
    stick.addEventListener('touchmove', stickMove);
    stickControl.addEventListener('touchend', stickEnd);
  }

  function getDistanceToCenter(coordinates) {
    return Math.sqrt((coordinates[0] * coordinates[0]) + (coordinates[1] * coordinates[1]));
  }

  function isInStickCircle(coordinates) {
    return getDistanceToCenter(coordinates) < stickRadius;
  }

  function getStickValidNearestCoordinates(coordinates) {
    var toCenter = getDistanceToCenter(coordinates);
    var x = coordinates[0] / toCenter * stickRadius;
    var y = coordinates[1] / toCenter * stickRadius;
    return [x, y];
  }

  function getStickCoordinates(event) {
    var touches = event.targetTouches[0];
    var pageX = touches.pageX;
    var pageY = touches.pageY;
    var x = pageX - stickRootPosition.left;
    var y = pageY - stickRootPosition.top;
    var coordinates = [x, y];

    if (!isInStickCircle(coordinates)) {
      coordinates = getStickValidNearestCoordinates(coordinates);
    }

    return coordinates;
  }

  function angleInRange(angle, range) {
    var rangeStart = range[0];
    var rangeEnd = range[1];
    return angle > rangeStart && angle <= rangeEnd;
  }

  function getStickDirection(coordinates) {
    var DIRECTIONS = [
      [-135, -45],  // top
      [-45, 45],    // right
      [45, 135],    // bottom
      [135, 180],   // left
      [-180, -135]
    ];
    var angle = Math.atan2(coordinates[1], coordinates[0]) * 180 / Math.PI;
    var direction = DIRECTIONS.find(angleInRange.bind(this, angle));
    var directionIndex = DIRECTIONS.indexOf(direction);
    if (directionIndex > 3) {
      directionIndex = 3;
    }

    var intensity = Math.ceil(getDistanceToCenter(coordinates) / stickRadiusPercent);
    intensity = intensity > 100 ? 100 : intensity;
    return [directionIndex, intensity];
  }

  function updateStickPosition(coordinates) {
    coordinates = coordinates || [0, 0];
    stickControl.style.left = coordinates[0] + 'px';
    stickControl.style.top = coordinates[1] + 'px';
  }

  function stickStart() {
    isStickBusy = true;
    onBusy(true);
  }

  function stickMove(event) {
    if (!isStickBusy) {
      return;
    }

    var coordinates = getStickCoordinates(event);
    var direction = getStickDirection(coordinates);

    onMove(direction);
    updateStickPosition(coordinates);
  }

  function stickEnd() {
    isStickBusy = false;
    onBusy(false);
    updateStickPosition();
  }

  return {

    /**
     * Initializes the stick
     * @param {Object} params
     * @param {String} params.stickQuery
     * @param {String} params.stickRootQuery
     * @param {String} params.stickControlQuery
     * @param {Function} params.onBusy
     * @param {Function} params.onMove
     */
    init: function(params) {
      setElements(params);
      setInitialValues(params);
      bindEvents();
    }

  };

})();
