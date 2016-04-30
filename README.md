# Touch Stick

Touch stick game controller for Web on pure JavaScript.
Watch the demo and usage example for more details.

Usage
-----------------------

```html
<div class="stick" id="stick">
  <div class="stick__root" id="stickRoot">
    <div class="stick__control" id="stickControl"></div>
  </div>
</div>
```

```js
Stick.init({
  stickQuery: '#stick',
  stickRootQuery: '#stickRoot',
  stickControlQuery: '#stickControl',
  onBusy: function(isBusy) {
    console.log('control is busy: ', isBusy);
  },
  onMove: function(state) {
    console.log('direction (1/2/3/4): ', state[0]);
    console.log('intensity (1-100): ', state[1]);
  }
});
```
