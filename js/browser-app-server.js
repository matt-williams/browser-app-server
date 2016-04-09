window.AudioContext = window.AudioContext || window.webkitAudioContext;

var AUDIO_CONTEXT = new AudioContext();

function Sample(url) {
  this.buffer = null;
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';
  var otherThis = this;
  request.onload = function() {
    AUDIO_CONTEXT.decodeAudioData(request.response, function(buffer) {
      otherThis.buffer = buffer;
    });
  }
  request.send();
}

SAMPLES = {
  testing: new Sample("test.ogg")
};

MediaSession = function(session) {
  this.session = session;
  this.div = document.createElement("div");
  var h1 = document.createElement("h1");
  h1.innerHTML = session.remoteIdentity.uri;
  this.div.appendChild(h1);
  this.video = document.createElement("video");
  this.video.width = 320;
  this.video.height = 240;
  this.video.muted = true;
  this.video.autoplay = true;
  this.div.appendChild(this.video);
  this.canvas = document.createElement("canvas");
  this.canvas.width = 320;
  this.canvas.height = 240;
  this.div.appendChild(this.canvas);
  document.body.appendChild(this.div);

  this.output = AUDIO_CONTEXT.createMediaStreamDestination();
  this.canvasStream = this.canvas.captureStream(0);
  this.output.stream.addTrack(this.canvasStream.getVideoTracks()[0]);
  this.mediaHint = {
    stream: this.output.stream,
    render: {
      remote: this.video
    }
  };
}

MediaSession.prototype.getVideo = function() {
  return this.video;
}

MediaSession.prototype.getAudioTrack = function() {
  return this.session.mediaHandler.getRemoteStreams()[0].getAudioTracks()[0];
}

MediaSession.prototype.play = function(sample) {
  if (this.bufferSource) {
    this.bufferSource.stop();
    this.bufferSource.disconnect();
    this.bufferSource = null;
  }
  this.bufferSource = AUDIO_CONTEXT.createBufferSource();
  this.bufferSource.buffer = sample.buffer;
  this.bufferSource.connect(this.output);
  this.bufferSource.start();
}

MediaSession.prototype.stopPlaying = function() {
  if (this.bufferSource) {
    this.bufferSource.stop();
    this.bufferSource.disconnect();
    this.bufferSource = null;
  }
}

MediaSession.prototype.getContext = function(type) {
  return this.canvas.getContext(type);
}

MediaSession.prototype.sendFrame = function() {
  this.canvasStream.getVideoTracks()[0].requestFrame();
}

MediaSession.prototype.getMediaHint = function() {
  return this.mediaHint;
}

MediaSession.prototype.destroy = function() {
  this.stopPlaying();
  document.body.removeChild(this.div);
}
