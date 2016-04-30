window.addEventListener('load', function() {

  var circle = document.querySelector('.circle');
  var circleLabel = document.querySelector('.circle__label');
  var directions = ['top', 'right', 'bottom', 'left'];
  var lastDirectionName;

  function getDirectionNode(directionName) {
    return document.querySelector('.circle__direction._' + directionName);
  }

  function resetLastDirectionHighlight() {
    var lastDirectionNode = getDirectionNode(lastDirectionName);
    lastDirectionNode.style.backgroundColor = '';
  }

  Stick.init({
    stickQuery: '#stick',
    stickRootQuery: '#stickRoot',
    stickControlQuery: '#stickControl',
    onBusy: function(isBusy) {
      // toggle circle visibility
      circle.classList.toggle('_visible', isBusy);

      if (!isBusy) {
        resetLastDirectionHighlight();
        circleLabel.textContent = 0;
      }
    },
    onMove: function(state) {
      var directionCode = state[0];
      var intensity = state[1];

      var directionName = directions[directionCode];
      var directionNode = getDirectionNode(directionName);

      if (lastDirectionName && directionName != lastDirectionName) {
        resetLastDirectionHighlight();
      }
      lastDirectionName = directionName;

      // highlight direction
      let opacity = intensity / 100;
      directionNode.style.backgroundColor = 'rgba(255, 100, 0, ' + opacity;

      // highlight intensity
      circleLabel.textContent = intensity;
    }
  });

});
