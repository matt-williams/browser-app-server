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

  var display = new Display(mediaSession.getContext("webgl"), 320, 240);
  display.speak(62);

  function doTracking() {
    ctracker.track(mediaSession.getVideo());
    requestAnimationFrame(doTracking);
  }
  requestAnimationFrame(doTracking);

  var interval = setInterval(function() {
    var context = mediaSession.scratchCanvas.getContext("2d");
    context.drawImage(mediaSession.video, 0, 0, 320, 240);
    ctracker.draw(mediaSession.scratchCanvas);
    var parameters = ctracker.getCurrentParameters();
    display.lookAt(parameters[3] - 40, parameters[2] - 90);
    display.render();
    mediaSession.sendFrame();
  }, 100);

  session.on("terminated", function() {
    cancelAnimationFrame(doTracking);
    clearInterval(interval);
    mediaSession.finished();
  });
});
