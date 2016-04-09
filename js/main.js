var ua = new SIP.UA(UA_CONFIG);

ua.on("registered", function() {
  console.log("registered!");
});

ua.on("invite", function(session) {
  console.log("invited!");
  var mediaSession = new MediaSession(session);
  session.accept({media: mediaSession.getMediaHint()});
  mediaSession.play(SAMPLES.testing);

  var ctracker = new clm.tracker();
  ctracker.init(pModel);
  ctracker.start(mediaSession.getVideo());

  var x = 0;
  var interval = setInterval(function() {
    x++;
    var context = mediaSession.getContext("2d");
    context.clearRect(0, 0, 320, 240);
    context.font = "50px Arial";
    context.fillStyle = "rgb(255, 255, 0)";
    context.fillText("Hello " + x, 20, 80);
    ctracker.draw(mediaSession.canvas);
    mediaSession.sendFrame();
  }, 100);
  session.on("terminated", function() {
    ctracker.stop();
    mediaSession.destroy();
    clearInterval(interval);
  });
  console.log(mediaSession.getAudioTrack());
});
