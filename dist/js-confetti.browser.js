var JSConfetti=function(){"use strict";function t(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function e(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function i(t,i,n){return i&&e(t.prototype,i),n&&e(t,n),t}function n(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(t)))return;var i=[],n=!0,o=!1,a=void 0;try{for(var s,r=t[Symbol.iterator]();!(n=(s=r.next()).done)&&(i.push(s.value),!e||i.length!==e);n=!0);}catch(t){o=!0,a=t}finally{try{n||null==r.return||r.return()}finally{if(o)throw a}}return i}(t,e)||a(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function o(t){return function(t){if(Array.isArray(t))return s(t)}(t)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||a(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function a(t,e){if(t){if("string"==typeof t)return s(t,e);var i=Object.prototype.toString.call(t).slice(8,-1);return"Object"===i&&t.constructor&&(i=t.constructor.name),"Map"===i||"Set"===i?Array.from(t):"Arguments"===i||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i)?s(t,e):void 0}}function s(t,e){(null==e||e>t.length)&&(e=t.length);for(var i=0,n=new Array(e);i<e;i++)n[i]=t[i];return n}function r(t,e){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,n=Math.random()*(e-t)+t;return Math.floor(n*Math.pow(10,i))/Math.pow(10,i)}var h=["#fcf403","#62fc03","#f4fc03","#03e7fc","#03fca5","#a503fc","#fc03ad","#fc03c2"];function c(t){return o(t).sort((function(){return.5-Math.random()}))[0]}function u(t){return Math.log(t)/Math.log(1920)}var l=new Map,f=function(){function e(i){t(this,e);var n=i.initialPosition,o=i.direction,a=i.confettiRadius,s=i.confettiColors,h=i.emojis,f=i.emojiSize,d=i.canvasWidth,m=r(.9,1.7,3)*u(d);this.confettiSpeed={x:m,y:m},this.finalConfettiSpeedX=r(.2,.6,3),this.rotationSpeed=h.length?.01:r(.03,.07,3)*u(d),this.dragForceCoefficient=r(5e-4,9e-4,6),this.radius={x:a,y:a},this.initialRadius=a,this.rotationAngle="left"===o?r(0,.2,3):r(-.2,0,3),this.emojiSize=f,this.emojiRotationAngle=r(0,2*Math.PI),this.radiusYUpdateDirection="down";var v="left"===o?r(82,15)*Math.PI/180:r(-15,-82)*Math.PI/180;this.absCos=Math.abs(Math.cos(v)),this.absSin=Math.abs(Math.sin(v));var p=r(-150,0),y={x:n.x+("left"===o?-p:p)*this.absCos,y:n.y-p*this.absSin};this.currentPosition=Object.assign({},y),this.initialPosition=Object.assign({},y),this.color=h.length?null:c(s),this.emoji=h.length?c(h):null,this.canvas=l.get("".concat(this.emoji,":").concat(f)),this.emoji&&!this.canvas&&(this.canvas=function(t,e){var i=document.createElement("canvas");i.width=2*e,i.height=2*e;var n=i.getContext("2d");return n.font="".concat(e,"px serif"),n.textAlign="center",n.fillText(t,e,e),n.save(),i}(this.emoji,f),l.set("".concat(this.emoji,":").concat(f),this.canvas)),this.createdAt=(new Date).getTime(),this.direction=o}return i(e,[{key:"draw",value:function(t){var e=this.currentPosition,i=this.radius,n=this.color,o=this.emoji,a=this.rotationAngle,s=this.emojiRotationAngle;this.emojiSize;var r=this.canvas,h=window.devicePixelRatio;n?(t.fillStyle=n,t.beginPath(),t.ellipse(e.x*h,e.y*h,i.x*h,i.y*h,a,0,2*Math.PI),t.fill()):o&&(t.save(),t.translate(h*e.x,h*e.y),t.rotate(s),t.drawImage(r,0,0),t.restore())}},{key:"updatePosition",value:function(t,e){var i=this.confettiSpeed,n=this.dragForceCoefficient,o=this.finalConfettiSpeedX,a=this.radiusYUpdateDirection,s=this.rotationSpeed,r=this.createdAt,h=this.direction,c=e-r;i.x>o&&(this.confettiSpeed.x-=n*t),this.currentPosition.x+=i.x*("left"===h?-this.absCos:this.absCos)*t,this.currentPosition.y=this.initialPosition.y-i.y*this.absSin*c+.00125*Math.pow(c,2)/2,this.rotationSpeed-=this.emoji?1e-4:1e-5*t,this.rotationSpeed<0&&(this.rotationSpeed=0),this.emoji?this.emojiRotationAngle+=this.rotationSpeed*t%(2*Math.PI):"down"===a?(this.radius.y-=t*s,this.radius.y<=0&&(this.radius.y=0,this.radiusYUpdateDirection="up")):(this.radius.y+=t*s,this.radius.y>=this.initialRadius&&(this.radius.y=this.initialRadius,this.radiusYUpdateDirection="down"))}},{key:"getIsVisibleOnCanvas",value:function(t){return this.currentPosition.y<t+100}}]),e}();function d(t){var e=document.createElement("canvas"),i=screen.width>screen.height?screen.height:screen.width;return e.style.position="fixed",e.style.width="".concat(i,"px"),e.style.height="".concat(i,"px"),e.style.bottom="0",t&&"right"===t?e.style.right="0":e.style.left="0",e.style.zIndex="1000",e.style.pointerEvents="none",document.body.appendChild(e),e}var m=function(){function e(i){var n=this;t(this,e),this.canvasContext=i,this.shapes=[],this.promise=new Promise((function(t){return n.resolvePromise=t}))}return i(e,[{key:"getBatchCompletePromise",value:function(){return this.promise}},{key:"addShapes",value:function(){var t;(t=this.shapes).push.apply(t,arguments)}},{key:"complete",value:function(){var t;return!this.shapes.length&&(null===(t=this.resolvePromise)||void 0===t||t.call(this),!0)}},{key:"processShapes",value:function(t,e,i){var n=this,o=t.timeDelta,a=t.currentTime;this.shapes=this.shapes.filter((function(t){return t.updatePosition(o,a),t.draw(n.canvasContext),!i||t.getIsVisibleOnCanvas(e)}))}}]),e}(),v=function(){function e(){t(this,e),this.activeConfettiBatches=[];var i=n([d("right"),d("left")],2),o=i[0],a=i[1];this.canvasLeft=o,this.canvasRight=a,this.canvasLeftContext=this.canvasLeft.getContext("2d"),this.canvasRightContext=this.canvasRight.getContext("2d"),this.requestAnimationFrameRequested=!1,this.lastUpdated=(new Date).getTime(),this.iterationIndex=0,this.loop=this.loop.bind(this),requestAnimationFrame(this.loop)}return i(e,[{key:"loop",value:function(){var t,e,i,n,o,a;this.requestAnimationFrameRequested=!1,t=[this.canvasLeft,this.canvasRight],e=window.devicePixelRatio,i=getComputedStyle(t[0]),n=parseInt(i.getPropertyValue("width")),o=parseInt(i.getPropertyValue("height")),a=Math.min(n,o),t.forEach((function(t){t.setAttribute("width",(a*e).toString()),t.setAttribute("height",(a*e).toString())}));var s=(new Date).getTime(),r=s-this.lastUpdated,h=this.canvasLeft.offsetHeight,c=this.iterationIndex%10==0;this.activeConfettiBatches=this.activeConfettiBatches.filter((function(t){return t.processShapes({timeDelta:r,currentTime:s},h,c),!c||!t.complete()})),this.iterationIndex++,this.queueAnimationFrameIfNeeded(s)}},{key:"queueAnimationFrameIfNeeded",value:function(t){this.requestAnimationFrameRequested||this.activeConfettiBatches.length<1||(this.requestAnimationFrameRequested=!0,this.lastUpdated=t||(new Date).getTime(),requestAnimationFrame(this.loop))}},{key:"addConfetti",value:function(){for(var t=function(t){var e=t.confettiRadius,i=void 0===e?6:e,n=t.confettiNumber,o=void 0===n?t.confettiesNumber||(t.emojis?40:250):n,a=t.confettiColors,s=void 0===a?h:a,r=t.emojis,c=void 0===r?t.emojies||[]:r,u=t.emojiSize,l=void 0===u?80:u;return t.emojies&&console.error("emojies argument is deprecated, please use emojis instead"),t.confettiesNumber&&console.error("confettiesNumber argument is deprecated, please use confettiNumber instead"),{confettiRadius:i,confettiNumber:o,confettiColors:s,emojis:c,emojiSize:l}}(arguments.length>0&&void 0!==arguments[0]?arguments[0]:{}),e=t.confettiRadius,i=t.confettiNumber,n=t.confettiColors,o=t.emojis,a=t.emojiSize,s=this.canvasLeft.getBoundingClientRect(),r=s.width,c=5*s.height/7,u={x:0,y:c},l={x:r,y:c},d=new m(this.canvasLeftContext),v=new m(this.canvasRightContext),p=0;p<i/2;p++){var y=new f({initialPosition:u,direction:"right",confettiRadius:e,confettiColors:n,confettiNumber:i,emojis:o,emojiSize:a,canvasWidth:r}),g=new f({initialPosition:l,direction:"left",confettiRadius:e,confettiColors:n,confettiNumber:i,emojis:o,emojiSize:a,canvasWidth:r});v.addShapes(y),d.addShapes(g)}return this.activeConfettiBatches.push(v,d),this.queueAnimationFrameIfNeeded(),Promise.all([v.getBatchCompletePromise(),d.getBatchCompletePromise()])}},{key:"clearCanvas",value:function(){this.activeConfettiBatches=[]}},{key:"destroyCanvas",value:function(){this.canvasLeft.remove(),this.canvasRight.remove()}}]),e}();return v}();
