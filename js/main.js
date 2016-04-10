SAMPLES = {
  testing: new Sample("test.ogg")
};

var ua = new SIP.UA(UA_CONFIG);

ua.on("registered", function() {
  console.log("registered!");
});

ua.on("invite", function(session) {
  console.log("invited!");
  var mediaSession = new MediaSession(session);
  mediaSession.play(SAMPLES.testing);
  session.accept({media: mediaSession.getMediaHint()});
  mediaSession.record();

  var ctracker = new clm.tracker();
  ctracker.init(pModel);
  var ec = new emotionClassifier();
  ec.init(emotionModel);

  var display = new Display(mediaSession.getContext("webgl"), 320, 240);
  display.speak(62);

  function doTracking() {
    ctracker.track(mediaSession.getVideo());
    requestAnimationFrame(doTracking);
  }
  requestAnimationFrame(doTracking);

  var interval = setInterval(function() {
    if (Math.random() < 0.02) {
      display.blink(4);
    }
    var context = mediaSession.scratchCanvas.getContext("2d");
    context.drawImage(mediaSession.video, 0, 0, 320, 240);
    ctracker.draw(mediaSession.scratchCanvas);
    var parameters = ctracker.getCurrentParameters();
    var er = ec.meanPredict(parameters);
    display.setSurprisal(0);
    if (er) {
      emotion = 0;
      maxEmotion = 0;
      for (var i = 0;i < er.length;i++) {
        if (er[i].value > maxEmotion) {
          emotion = i;
          maxEmotion = er[i].value;
        }
      }
      if (maxEmotion > 0.4) {
        var EMOTIONS = ["angry", "sad", "surprised", "happy"];
        var context = mediaSession.scratchCanvas.getContext("2d");
        context.font = "50px sans-serif";
        context.fillStyle = "#f00";
        context.fillText(EMOTIONS[emotion], 10, 220);
        if (emotion <= 2) {
          display.setSurprisal(maxEmotion);
        }
      }
    }
    var convergence = ctracker.getConvergence();
    if (convergence < 999999) {
      display.lookAt(parameters[2] - 90, parameters[3] - 20);
    }
    display.render();
    mediaSession.sendFrame();
  }, 100);

  session.on("terminated", function() {
    cancelAnimationFrame(doTracking);
    clearInterval(interval);
    mediaSession.finished();
  });
});
