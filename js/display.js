Display = function(context, width, height) {
  this.scene = new THREE.Scene();

  this.camera = new THREE.PerspectiveCamera(75, width / height, 1, 10000);
  this.camera.position.z = 400;

  var geometry = new THREE.BoxGeometry(200, 200, 200);
  var material = new THREE.MeshBasicMaterial({color: 0xff0000});

  this.mesh = new THREE.Mesh(geometry, material);
  this.scene.add(this.mesh);

  this.renderer = new THREE.WebGLRenderer({context: context});
  this.renderer.setSize(width, height);
}

Display.prototype.render = function() {
  this.mesh.rotation.x += 0.01;
  this.mesh.rotation.y += 0.02;
  this.renderer.render(this.scene, this.camera);
}
