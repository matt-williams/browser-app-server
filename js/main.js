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

  var interval = setInterval(function() {
    ctracker.track(mediaSession.getVideo());
    display.render();
    mediaSession.sendFrame();
  }, 100);

  session.on("terminated", function() {
    clearInterval(interval);
    mediaSession.getRecording(function(blob) {
      console.log(blob);
    });
    mediaSession.destroy();
  });
});
