/////////////////////////////////////////////////////////////////////////////////////////
//  UBC CPSC 314,  Vsep2019
//  Assignment 3 Template
/////////////////////////////////////////////////////////////////////////////////////////

console.log('hello world');

a = 5;
b = 2.6;
console.log('a=', a, 'b=', b);
myvector = new THREE.Vector3(0, 1, 2);
console.log('myvector =', myvector);

var animation = true;
var meshesLoaded = true;

var meshes = {};
var RESOURCES_LOADED = false;

// SETUP RENDERER & SCENE

var canvas = document.getElementById('canvas');
var camera;
var light;
var ambientLight;
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
var boxGeom;
var dragonBody, dragonBodyFrame, dragonHeadFrame, dragonHead;
var dragonTailLinkFrames = [], dragonTailLinks = [];
var dragonNeckLinkFrames = [], dragonNeckLinks = [];
renderer.setClearColor(0xd0f0d0);     // set background colour
canvas.appendChild(renderer.domElement);

//////////////////////////////////////////////////////////
//  initCamera():   SETUP CAMERA
//////////////////////////////////////////////////////////

function initCamera() {
  // set up M_proj    (internally:  camera.projectionMatrix )
  var cameraFov = 30;     // initial camera vertical field of view, in degrees
  // view angle, aspect ratio, near, far
  camera = new THREE.PerspectiveCamera(cameraFov, 1, 0.1, 1000);

  var width = 10; var height = 5;
  //    camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 0.1, 1000 );

  // set up M_view:   (internally:  camera.matrixWorldInverse )
  camera.position.set(0, 12, 20);
  camera.up = new THREE.Vector3(0, 1, 0);
  camera.lookAt(0, 0, 0);
  scene.add(camera);

  // SETUP ORBIT CONTROLS OF THE CAMERA
  var controls = new THREE.OrbitControls(camera);
  controls.damping = 0.2;
  controls.autoRotate = false;
};

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () {
  window.scrollTo(0, 0);
}

////////////////////////////////////////////////////////////////////////	
// init():  setup up scene
////////////////////////////////////////////////////////////////////////	

function init() {
  console.log('init called');

  initCamera();
  initMotions();
  initLights();
  initObjects();

  window.addEventListener('resize', resize);
  resize();
};

////////////////////////////////////////////////////////////////////////
// initMotions():  setup Motion instances for each object that we wish to animate
////////////////////////////////////////////////////////////////////////

function initMotions() {
  // Do nothing for now
}

/////////////////////////////////////	
// initLights():  SETUP LIGHTS
/////////////////////////////////////	

function initLights() {
  light = new THREE.PointLight(0xffffff);
  light.position.set(0, 4, 2);
  scene.add(light);
  ambientLight = new THREE.AmbientLight(0x606060);
  scene.add(ambientLight);
}

/////////////////////////////////////	
// MATERIALS
/////////////////////////////////////	

var diffuseMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
var diffuseMaterial2 = new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide });
var basicMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
var armadilloMaterial = new THREE.MeshBasicMaterial({ color: 0x7fff7f });

/////////////////////////////////////	
// initObjects():  setup objects in the scene 
/////////////////////////////////////	

function initObjects() {
  worldFrame = new THREE.AxesHelper(5);
  scene.add(worldFrame);

  // Set the dragon body frame
  dragonBodyFrame = new THREE.AxesHelper(1); scene.add(dragonBodyFrame);
  dragonBodyFrame.matrixAutoUpdate = false;
  dragonBodyFrame.matrix.identity();
  dragonBodyFrame.matrix.multiply(new THREE.Matrix4().makeTranslation(0, 0.5, 0));
  dragonBodyFrame.updateMatrixWorld();

  // Body of the dragon
  boxGeom = new THREE.BoxGeometry(1, 1, 1);
  dragonBody = new THREE.Mesh(boxGeom, diffuseMaterial);
  scene.add(dragonBody);
  dragonBody.matrixAutoUpdate = false;
  dragonBody.matrix.copy(dragonBodyFrame.matrix);
  dragonBody.matrix.multiply(new THREE.Matrix4().makeScale(4, 1, 2));
  dragonBodyFrame.updateMatrixWorld();

  initNeckLinks(10, 0.1, 0.05);
  initTailLinks(8, 0.1, 0.05, 0.05);

  // textured floor
  floorTexture = new THREE.TextureLoader().load('images/floor.jpg');
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(1, 1);
  floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
  floorGeometry = new THREE.PlaneBufferGeometry(15, 15);
  floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.position.y = -1.1;
  floor.rotation.x = Math.PI / 2;
  scene.add(floor);
}

/////////////////////////////////////////////////////////////////////////////////////
//  Create a jointed neck
/////////////////////////////////////////////////////////////////////////////////////

function initNeckLinks(num, incrWidth, incrLength) {
  var currMatrix = new THREE.Matrix4().copy(dragonBodyFrame.matrix);
  currMatrix.multiply(new THREE.Matrix4().makeTranslation(2, 0.5, 0));
  currMatrix.multiply(new THREE.Matrix4().makeRotationZ(Math.PI / 12));

  var currLength = 0.2, currWidth = 1.75, theta = Math.PI / 30;

  for(var i = 0; i < num; i++) {
    var dragonNeckLinkFrame, dragonNeckLink;

    // Create the NeckLink frame
    dragonNeckLinkFrame = new THREE.AxesHelper(1); scene.add(dragonNeckLinkFrame);
    dragonNeckLinkFrame.matrixAutoUpdate = false;
    dragonNeckLinkFrame.matrix.copy(currMatrix);
    dragonNeckLinkFrame.updateMatrixWorld();
    dragonNeckLinkFrames.push(dragonNeckLinkFrame);

    // Create the body block
    dragonNeckLink = new THREE.Mesh(boxGeom, diffuseMaterial);
    scene.add(dragonNeckLink);
    dragonNeckLink.matrixAutoUpdate = false;
    dragonNeckLink.matrix.copy(currMatrix);
    dragonNeckLink.matrix.multiply(new THREE.Matrix4().makeTranslation(currLength / 2, -0.5, 0));
    dragonNeckLink.matrix.multiply(new THREE.Matrix4().makeScale(currLength, 1, currWidth));
    dragonNeckLinks.push(dragonNeckLink);
    dragonNeckLink.updateMatrixWorld();

    // Update currMatrix
    currMatrix.multiply(new THREE.Matrix4().makeTranslation(currLength, 0, 0));
    currMatrix.multiply(new THREE.Matrix4().makeRotationZ(theta));

    // Update currLength, currWidth
    currLength += incrLength; currWidth -= incrWidth;
  }

  var headLength = 1, headWidth = 1.5, headSnout = 2;

  // Create the head of the dragon
  dragonHeadFrame = new THREE.AxesHelper(1); 
  scene.add(dragonHeadFrame);
  dragonHeadFrame.matrixAutoUpdate = false;
  dragonHeadFrame.matrix.copy(currMatrix);
  dragonHeadFrame.updateMatrixWorld();

  dragonHead = new THREE.Mesh(boxGeom, diffuseMaterial);
  scene.add(dragonHead);
  dragonHead.matrixAutoUpdate = false;
  dragonHead.matrix.copy(currMatrix);
  dragonHead.matrix.multiply(new THREE.Matrix4().makeTranslation(headLength / 2, -headSnout / 2, 0));
  dragonHead.matrix.multiply(new THREE.Matrix4().makeScale(headLength, headSnout, headWidth));
  dragonHead.updateMatrixWorld();
}

/////////////////////////////////////////////////////////////////////////////////////
//  Create a jointed tail
/////////////////////////////////////////////////////////////////////////////////////

function initTailLinks(num, incrLength, incrWidth, incrHeight) {
  var currMatrix = new THREE.Matrix4().copy(dragonBodyFrame.matrix);
  currMatrix.multiply(new THREE.Matrix4().makeTranslation(-2, 0.5, 0));
  currMatrix.multiply(new THREE.Matrix4().makeRotationZ(Math.PI / 30));

  var currLength = 0.2, currWidth = 0.5, currHeight = 0.5, theta = Math.PI / 30;

  for(var i = 0; i < num; i++) {
    var dragonTailLinkFrame, dragonTailLink;

    // Create the NeckLink frame
    dragonTailLinkFrame = new THREE.AxesHelper(1); 
    scene.add(dragonTailLinkFrame);
    dragonTailLinkFrame.matrixAutoUpdate = false;
    dragonTailLinkFrame.matrix.copy(currMatrix);
    dragonTailLinkFrame.updateMatrixWorld();
    dragonTailLinkFrames.push(dragonTailLinkFrame);

    // Create the body block
    dragonTailLink = new THREE.Mesh(boxGeom, diffuseMaterial);
    scene.add(dragonTailLink);
    dragonTailLink.matrixAutoUpdate = false;
    dragonTailLink.matrix.copy(currMatrix);
    dragonTailLink.matrix.multiply(new THREE.Matrix4().makeTranslation(-currLength / 2, -currHeight / 2, 0));
    dragonTailLink.matrix.multiply(new THREE.Matrix4().makeScale(currLength, currHeight, currWidth));
    dragonTailLinks.push(dragonTailLink);
    dragonTailLink.updateMatrixWorld();

    // Update currMatrix
    currMatrix.multiply(new THREE.Matrix4().makeTranslation(-currLength, 0, 0));
    currMatrix.multiply(new THREE.Matrix4().makeRotationZ(theta));

    // Update currLength, currWidth
    currLength += incrLength; currWidth -= incrWidth; currHeight -= incrHeight;
  }
}

/////////////////////////////////////////////////////////////////////////////////////
//  create customShader material
/////////////////////////////////////////////////////////////////////////////////////

var customShaderMaterial = new THREE.ShaderMaterial({
  //        uniforms: { textureSampler: {type: 't', value: floorTexture}},
  vertexShader: document.getElementById('customVertexShader').textContent,
  fragmentShader: document.getElementById('customFragmentShader').textContent
});

var ctx = renderer.context;
ctx.getShaderInfoLog = function () { return '' };   // stops shader warnings, seen in some browsers


///////////////////////////////////////////////////////////////////////////////////////
// LISTEN TO KEYBOARD
///////////////////////////////////////////////////////////////////////////////////////

var keyboard = new THREEx.KeyboardState();
function checkKeyboard() {
  if (keyboard.pressed("W"))
    light.position.y += 0.1;
  else if (keyboard.pressed("S"))
    light.position.y -= 0.1;
  else if (keyboard.pressed("A"))
    light.position.x -= 0.1;
  else if (keyboard.pressed("D"))
    light.position.x += 0.1;
  else if (keyboard.pressed(" "))
    animation = !animation;
}

///////////////////////////////////////////////////////////////////////////////////////
// UPDATE CALLBACK:    This is the main animation loop
///////////////////////////////////////////////////////////////////////////////////////

function update() {
  var dt = 0.02;
  checkKeyboard();
  if (animation && meshesLoaded) {
    // advance the motion of all the animated objects
  }

  requestAnimationFrame(update);      // requests the next update call;  this creates a loop
  renderer.render(scene, camera);
}

init();
update();

