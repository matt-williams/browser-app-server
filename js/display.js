Display = function(context, width, height) {
  window.display = this;
  this.scene = new THREE.Scene();

  this.camera = new THREE.PerspectiveCamera(75, width / height, 1, 10000);
  this.camera.position.y = 13;
  this.camera.position.z = 5;

  // TODO: Do loading once and then .clone() - don't do this yet because it slows down REPL for modelling
  var modelLoader = new THREE.JSONLoader();
  var textureLoader = new THREE.TextureLoader();
  var otherThis = this;
  modelLoader.load('res/body.json', function (geometry) {
    console.log("Loaded body.json");
    textureLoader.load('res/body.jpg', function (texture) {
      console.log("Loaded body.jpg");
      otherThis.body = new THREE.SkinnedMesh(
        geometry,
        new THREE.MeshBasicMaterial({map: texture, skinning: true})
      );
      otherThis.scene.add(otherThis.body);
    });
  });
  modelLoader.load('res/eyes.json', function (geometry) {
    console.log("Loaded eyes.json");
    textureLoader.load('res/eyes.jpg', function (texture) {
      console.log("Loaded eyes.jpg");
      otherThis.eyes = new THREE.SkinnedMesh(
        geometry,
        new THREE.MeshBasicMaterial({map: texture, skinning: true})
      );
      otherThis.scene.add(otherThis.eyes);
    });
  });
  modelLoader.load('res/teeth.json', function (geometry) {
    console.log("Loaded teeth.json");
    textureLoader.load('res/teeth.jpg', function (texture) {
      console.log("Loaded teeth.jpg");
      otherThis.teeth = new THREE.SkinnedMesh(
        geometry,
        new THREE.MeshBasicMaterial({map: texture, skinning: true})
      );
      otherThis.scene.add(otherThis.teeth);
    });
  });
  modelLoader.load('res/hair.json', function (geometry) {
    console.log("Loaded hair.json");
    textureLoader.load('res/hair.jpg', function (texture) {
      console.log("Loaded hair.jpg");
      otherThis.hair = new THREE.SkinnedMesh(
        geometry,
        new THREE.MeshBasicMaterial({map: texture, skinning: true})
      );
      otherThis.scene.add(otherThis.hair);
    });
  });
  modelLoader.load('res/shirt.json', function (geometry) {
    console.log("Loaded shirt.json");
    textureLoader.load('res/shirt.jpg', function (texture) {
      console.log("Loaded shirt.jpg");
      otherThis.shirt = new THREE.SkinnedMesh(
        geometry,
        new THREE.MeshBasicMaterial({map: texture, skinning: true})
      );
      otherThis.scene.add(otherThis.shirt);
    });
  });
  textureLoader.load('res/background.jpg', function (texture) {
    console.log("Loaded background.jpg");
    otherThis.background = new THREE.Mesh(
      new THREE.PlaneGeometry(32, 24),
      new THREE.MeshBasicMaterial({map: texture})
    );
    otherThis.background.position.y = 13;
    otherThis.background.position.z = -10;
    otherThis.scene.add(otherThis.background);
  });

  this.renderer = new THREE.WebGLRenderer({context: context});
  this.renderer.setClearColor(0x1f5f5f);
  this.renderer.setSize(width, height);
  this.tick = 0;
  this.speakTicks = 0;
  this.surprisal = 0;
  this.lookAtX = 0;
  this.lookAtY = 0;
}

Display.prototype.boneRotate = function(name, x, y, z, xDelta, yDelta, zDelta) {
  // TODO: Set up a shared skelton so all this synchronization isn't required
  if (this.body) {
    var bone = this.body.getObjectByName(name);
    if (x !== undefined) {
      bone.rotation.x = x;
    } else {
      bone.rotation.x += xDelta;
    }
    if (y !== undefined) {
      bone.rotation.y = y;
    } else {
      bone.rotation.y += yDelta;
    }
    if (z !== undefined) {
      bone.rotation.z = z;
    } else {
      bone.rotation.z += zDelta;
    }
    this.body.geometry.verticesNeedUpdate = true;
    this.body.geometry.normalsNeedUpdate = true;
    if (this.eyes) {
      var bone2 = this.eyes.getObjectByName(name);
      bone2.rotation.x = bone.rotation.x;
      bone2.rotation.y = bone.rotation.y;
      bone2.rotation.z = bone.rotation.z;
      this.eyes.geometry.verticesNeedUpdate = true;
      this.eyes.geometry.normalsNeedUpdate = true;
    }
    if (this.teeth) {
      var bone2 = this.teeth.getObjectByName(name);
      bone2.rotation.x = bone.rotation.x;
      bone2.rotation.y = bone.rotation.y;
      bone2.rotation.z = bone.rotation.z;
      this.teeth.geometry.verticesNeedUpdate = true;
      this.teeth.geometry.normalsNeedUpdate = true;
    }
    if (this.hair) {
      var bone2 = this.hair.getObjectByName(name);
      bone2.rotation.x = bone.rotation.x;
      bone2.rotation.y = bone.rotation.y;
      bone2.rotation.z = bone.rotation.z;
      this.hair.geometry.verticesNeedUpdate = true;
      this.hair.geometry.normalsNeedUpdate = true;
    }
    if (this.shirt) {
      var bone2 = this.shirt.getObjectByName(name);
      bone2.rotation.x = bone.rotation.x;
      bone2.rotation.y = bone.rotation.y;
      bone2.rotation.z = bone.rotation.z;
      this.shirt.geometry.verticesNeedUpdate = true;
      this.shirt.geometry.normalsNeedUpdate = true;
    }
  }
}

Display.prototype.render = function() {
  this.tick++;
  this.boneRotate("upper_arm.L", 0, 0, -0.5);
  this.boneRotate("upper_arm.R", 0, 0, 0.5);
  if (this.speakTicks > 0) {
    this.speakTicks--;
    this.boneRotate("jaw", Math.sin(this.tick * 2) * 0.1 + 0.1, 0, 0);
  } else {
    this.boneRotate("jaw", this.surprisal * 0.5, 0, 0);
  }
  //this.boneRotate("chest", undefined, undefined, undefined, 0.1, 0, 0);
  this.boneRotate("eye.L", 0, 0, 0);
  this.boneRotate("eye.R", 0, 0, 0);
  this.boneRotate("neck", Math.atan2(this.lookAtX, 300), Math.atan2(this.lookAtY, 300), 0);
  this.renderer.render(this.scene, this.camera);
}

Display.prototype.speak = function(speakTicks) {
  this.speakTicks = speakTicks;
}

Display.prototype.setSurprisal = function(surprisal) {
  this.surprisal = surprisal;
}

Display.prototype.lookAt = function(x, y) {
  this.lookAtX = x;
  this.lookAtY = y;
}
