/////////////////////////////////////////////////////////////////////////////////////////
//  UBC CPSC 314,  Vsep2019
//  Assignment 3 Template
/////////////////////////////////////////////////////////////////////////////////////////

var animation = true;
var meshesLoaded = false;

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
var leftLegFrame, leftLegBody, rightLegFrame, rightLegBody;
var numNeck, incrWidthNeck, incrLengthNeck, currLengthNeck, currWidthNeck;
var headLength, headWidth, headSnout;
var numTail, incrWidthTail, incrLengthTail, currLengthTail, currWidthTail, currHeightTail;
var dragonNeckLinkFrames = [], dragonNeckLinks = [];
var leftWingFrame, rightWingFrame;
var danceSequence = false, dragonLoopSequence = false, dragonRollSequence = false;
var loopStartTime, loopRadius = 10, loopSpeed = Math.PI / 2;
var rollStartTime, rollRadius = 50, rollSpeed = Math.PI / 6, rollSpan = Math.PI / 6;
var t = 0;
var wingSpeedMax = 4 * Math.PI, wingSpeedIncr = Math.PI / 20, currWingSpeed = Math.PI, currWingAngle = 0, minWingSpeed = Math.PI / 4;
var currNeckAngle = Math.PI / 6, neckAngleIncr = Math.PI / 500, maxNeckAngle = Math.PI / 6;
var currRollAngle = 0, rollAngleIncr = Math.PI / 500;
var currPitchAngle = 0, pitchAngleIncr = Math.PI / 500, maxPitchAngle = Math.PI / 4;
renderer.setClearColor(0x424242);     // set background colour
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

  initCamera();
  initMotions();
  initLights();
  initObjects();
  initFileObjects();

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

  // Left leg frame of the dragon
  leftLegFrame = new THREE.AxesHelper(1); scene.add(leftLegFrame);
  leftLegFrame.matrixAutoUpdate = false;
  leftLegFrame.matrix.copy(dragonBodyFrame.matrix);
  leftLegFrame.matrix.multiply(new THREE.Matrix4().makeTranslation(0, -0.5, 0.5));
  leftLegFrame.matrix.multiply(new THREE.Matrix4().makeRotationZ(-Math.PI/3 + currNeckAngle));
  leftLegFrame.updateMatrixWorld();

  // Left leg of the dragon
  leftLegBody = new THREE.Mesh(boxGeom, diffuseMaterial);
  scene.add(leftLegBody);
  leftLegBody.matrixAutoUpdate = false;
  leftLegBody.matrix.copy(leftLegFrame.matrix);
  leftLegBody.matrix.multiply(new THREE.Matrix4().makeTranslation(0, -1, 0));
  leftLegBody.matrix.multiply(new THREE.Matrix4().makeScale(0.3, 1.5, 0.3));

  // Right leg frame of the dragon
  rightLegFrame = new THREE.AxesHelper(1); scene.add(rightLegFrame);
  rightLegFrame.matrixAutoUpdate = false;
  rightLegFrame.matrix.copy(dragonBodyFrame.matrix);
  rightLegFrame.matrix.multiply(new THREE.Matrix4().makeScale(1, 1, -1));
  rightLegFrame.matrix.multiply(new THREE.Matrix4().makeTranslation(0, -0.5, 0.5));
  rightLegFrame.matrix.multiply(new THREE.Matrix4().makeRotationZ(-Math.PI/3 + currNeckAngle));
  rightLegFrame.updateMatrixWorld();

  // Right leg of the dragon
  rightLegBody = new THREE.Mesh(boxGeom, diffuseMaterial);
  scene.add(rightLegBody);
  rightLegBody.matrixAutoUpdate = false;
  rightLegBody.matrix.copy(rightLegFrame.matrix);
  rightLegBody.matrix.multiply(new THREE.Matrix4().makeTranslation(0, -1, 0));
  rightLegBody.matrix.multiply(new THREE.Matrix4().makeScale(0.3, 1.5, 0.3));

  numNeck = 10; incrWidthNeck = 0.1; incrLengthNeck = 0.05; currLengthNeck = 0.2; currWidthNeck = 1.75;
  headLength = 1; headWidth = 1.5; headSnout = 2;
  initNeckLinks();
  numTail = 8; incrLengthTail = 0.1; incrWidthTail = 0.05; incrHeightTail = 0.05;
  currLengthTail = 0.2; currWidthTail = 0.5; currHeightTail = 0.5; 
  initTailLinks();

  // textured floor
  floorTexture = new THREE.TextureLoader().load('images/floor.jpg');
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(1, 1);
  floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
  floorGeometry = new THREE.PlaneBufferGeometry(15, 15);
  floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.position.y = -10;
  floor.rotation.x = Math.PI / 2;
  floor.scale.x = 3;
  floor.scale.y = 3;
  floor.scale.z = 3;
  scene.add(floor);
}

////////////////////////////////////////////////////////////////////////	
// initFileObjects():    read object data from OBJ files;  see onResourcesLoaded() for instances
////////////////////////////////////////////////////////////////////////	

function initFileObjects() {
  // list of OBJ files that we want to load, and their material
  models = {
    wing: { obj: "obj/wing.obj", mtl: diffuseMaterial, mesh: null }
  };

  var manager = new THREE.LoadingManager();
  manager.onLoad = function () {
    console.log("loaded all resources");
    RESOURCES_LOADED = true;
    onResourcesLoaded();
  }

  var onProgress = function (xhr) {
    if (xhr.lengthComputable) {
      var percentComplete = xhr.loaded / xhr.total * 100;
      console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
  };

  var onError = function (xhr) {
  };

  // Load models;  asynchronous in JS, so wrap code in a fn and pass it the index
  for (var _key in models) {
    console.log('Key:', _key);
    (function (key) {
      var objLoader = new THREE.OBJLoader(manager);
      objLoader.load(models[key].obj, function (object) {
        object.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.material = models[key].mtl;
            child.material.shading = THREE.SmoothShading;
          }
        });
        models[key].mesh = object;
      }, onProgress, onError);
    })(_key);
  }
}

/////////////////////////////////////////////////////////////////////////////////////
// onResourcesLoaded():  once all OBJ files are loaded, this gets called
//                       Object instancing is done here
/////////////////////////////////////////////////////////////////////////////////////

function onResourcesLoaded(){
	
  // Clone models into meshes;   [Michiel:  AFAIK this makes a "shallow" copy of the model,
  //                             i.e., creates references to the geometry, and not full copies ]
  meshes["leftWing"] = models.wing.mesh.clone();
  meshes["rightWing"] = models.wing.mesh.clone();
  

  // Set up coordinate frame for the right wing
  rightWingFrame = new THREE.AxesHelper(1); scene.add(rightWingFrame);
  rightWingFrame.matrixAutoUpdate = false;
  rightWingFrame.matrix.copy(dragonBodyFrame.matrix);
  rightWingFrame.matrix.multiply(new THREE.Matrix4().makeTranslation(1, 0, 1));
  rightWingFrame.matrix.multiply(new THREE.Matrix4().makeRotationX(-Math.PI/12));
  rightWingFrame.updateMatrixWorld();

  // Set up the matrix for the right wing object
  meshes["rightWing"].matrix.copy(rightWingFrame.matrix);
  meshes["rightWing"].matrixAutoUpdate = false;
  meshes["rightWing"].matrix.multiply(new THREE.Matrix4().makeScale(1.5, 1.5, 1.5));
  meshes["rightWing"].matrix.multiply(new THREE.Matrix4().makeRotationX(Math.PI));
  meshes["rightWing"].matrix.multiply(new THREE.Matrix4().makeRotationY(-Math.PI/2));
  meshes["rightWing"].matrix.multiply(new THREE.Matrix4().makeTranslation(-3.3, 0.1, 1.5));
  meshes["rightWing"].updateMatrixWorld();

  // Set up coordinate frame for the left wing
  leftWingFrame = new THREE.AxesHelper(1); scene.add(leftWingFrame);
  leftWingFrame.matrixAutoUpdate = false;
  leftWingFrame.matrix.copy(dragonBodyFrame.matrix);
  leftWingFrame.matrix.multiply(new THREE.Matrix4().makeScale(1, 1, -1));
  leftWingFrame.matrix.multiply(new THREE.Matrix4().makeTranslation(1, 0, 1));
  leftWingFrame.matrix.multiply(new THREE.Matrix4().makeRotationX(-Math.PI/12));
  leftWingFrame.updateMatrixWorld();

  // Set up the matrix for the right wing object
  meshes["leftWing"].matrix.copy(leftWingFrame.matrix);
  meshes["leftWing"].matrixAutoUpdate = false;
  meshes["leftWing"].matrix.multiply(new THREE.Matrix4().makeScale(1.5, 1.5, 1.5));
  meshes["leftWing"].matrix.multiply(new THREE.Matrix4().makeRotationX(Math.PI));
  meshes["leftWing"].matrix.multiply(new THREE.Matrix4().makeRotationY(-Math.PI/2));
  // meshes["rightWing"].multiply(new THREE.Matrix4().);
  meshes["leftWing"].matrix.multiply(new THREE.Matrix4().makeTranslation(-3.3, 0.1, 1.5));
  meshes["leftWing"].updateMatrixWorld();

  // position the object instances and parent them to the scene, i.e., WCS
  scene.add(meshes["leftWing"]);
  scene.add(meshes["rightWing"]);
  
  meshesLoaded = true;
 }


/////////////////////////////////////////////////////////////////////////////////////
// Modify the wing angle
/////////////////////////////////////////////////////////////////////////////////////

function modifyWingAngle(angle){  
  if (!meshesLoaded || angle > Math.PI / 4 || angle < -Math.PI / 4) {
    return;
  }
  // Set up coordinate frame for the right wing
  rightWingFrame.matrix.copy(dragonBodyFrame.matrix);
  rightWingFrame.matrix.multiply(new THREE.Matrix4().makeTranslation(1, 0, 1));
  rightWingFrame.matrix.multiply(new THREE.Matrix4().makeRotationX(angle));
  rightWingFrame.updateMatrixWorld();

  // Set up the matrix for the right wing object
  meshes["rightWing"].matrix.copy(rightWingFrame.matrix);
  meshes["rightWing"].matrix.multiply(new THREE.Matrix4().makeScale(1.5, 1.5, 1.5));
  meshes["rightWing"].matrix.multiply(new THREE.Matrix4().makeRotationX(Math.PI));
  meshes["rightWing"].matrix.multiply(new THREE.Matrix4().makeRotationY(-Math.PI/2));
  meshes["rightWing"].matrix.multiply(new THREE.Matrix4().makeTranslation(-3.3, 0.1, 1.5));
  meshes["rightWing"].updateMatrixWorld();

  // Set up coordinate frame for the left wing
  leftWingFrame.matrix.copy(dragonBodyFrame.matrix);
  leftWingFrame.matrix.multiply(new THREE.Matrix4().makeScale(1, 1, -1));
  leftWingFrame.matrix.multiply(new THREE.Matrix4().makeTranslation(1, 0, 1));
  leftWingFrame.matrix.multiply(new THREE.Matrix4().makeRotationX(angle));
  leftWingFrame.updateMatrixWorld();

  // Set up the matrix for the right wing object
  meshes["leftWing"].matrix.copy(leftWingFrame.matrix);
  meshes["leftWing"].matrix.multiply(new THREE.Matrix4().makeScale(1.5, 1.5, 1.5));
  meshes["leftWing"].matrix.multiply(new THREE.Matrix4().makeRotationX(Math.PI));
  meshes["leftWing"].matrix.multiply(new THREE.Matrix4().makeRotationY(-Math.PI/2));
  meshes["leftWing"].matrix.multiply(new THREE.Matrix4().makeTranslation(-3.3, 0.1, 1.5));
  meshes["leftWing"].updateMatrixWorld();
}

 
 

/////////////////////////////////////////////////////////////////////////////////////
//  Create a jointed neck
/////////////////////////////////////////////////////////////////////////////////////

function initNeckLinks() {
  var currMatrix = new THREE.Matrix4().copy(dragonBodyFrame.matrix);
  currMatrix.multiply(new THREE.Matrix4().makeTranslation(2, 0.5, 0));
  currMatrix.multiply(new THREE.Matrix4().makeRotationZ(Math.PI / 12));

  var currLength = currLengthNeck;
  var currWidth = currWidthNeck;

  for (var i = 0; i < numNeck; i++) {
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
    currMatrix.multiply(new THREE.Matrix4().makeRotationZ(Math.PI / 30));

    

    // Update currLength, currWidth
    currLength += incrLengthNeck; currWidth -= incrWidthNeck;
  }

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
//  Modify the angle of the neck
/////////////////////////////////////////////////////////////////////////////////////

function modifyNeckLinks(angle) {
  if (angle > Math.PI / 2 || angle < - Math.PI / 2) {
    return;
  }
  var theta = angle / numNeck;
  var currMatrix = new THREE.Matrix4().copy(dragonBodyFrame.matrix);
  currMatrix.multiply(new THREE.Matrix4().makeTranslation(2, 0.5, 0));
  currMatrix.multiply(new THREE.Matrix4().makeRotationZ(Math.PI / 12));

  var currLength = currLengthNeck;
  var currWidth = currWidthNeck;

  for (var i = 0; i < numNeck; i++) {
    var dragonNeckLinkFrame, dragonNeckLink;

    // Create the NeckLink frame
    dragonNeckLinkFrame = dragonNeckLinkFrames[i]; 
    dragonNeckLinkFrame.matrixAutoUpdate = false;
    dragonNeckLinkFrame.matrix.copy(currMatrix);
    dragonNeckLinkFrame.updateMatrixWorld();
    dragonNeckLinkFrames[i] = dragonNeckLinkFrame;

    // Create the body block
    dragonNeckLink = dragonNeckLinks[i];
    dragonNeckLink.matrixAutoUpdate = false;
    dragonNeckLink.matrix.copy(currMatrix);
    dragonNeckLink.matrix.multiply(new THREE.Matrix4().makeTranslation(currLength / 2, -0.5, 0));
    dragonNeckLink.matrix.multiply(new THREE.Matrix4().makeScale(currLength, 1, currWidth));
    dragonNeckLinks[i] = dragonNeckLink;
    dragonNeckLink.updateMatrixWorld();

    // Update currMatrix
    currMatrix.multiply(new THREE.Matrix4().makeTranslation(currLength, 0, 0));
    currMatrix.multiply(new THREE.Matrix4().makeRotationZ(theta));

    

    // Update currLength, currWidth
    currLength += incrLengthNeck; currWidth -= incrWidthNeck;
  }

  // Create the head of the dragon
  dragonHeadFrame.matrixAutoUpdate = false;
  dragonHeadFrame.matrix.copy(currMatrix);
  dragonHeadFrame.updateMatrixWorld();

  dragonHead.matrixAutoUpdate = false;
  dragonHead.matrix.copy(currMatrix);
  dragonHead.matrix.multiply(new THREE.Matrix4().makeTranslation(headLength / 2, -headSnout / 2, 0));
  dragonHead.matrix.multiply(new THREE.Matrix4().makeScale(headLength, headSnout, headWidth));
  dragonHead.updateMatrixWorld();
}

/////////////////////////////////////////////////////////////////////////////////////
//  Create a jointed tail
/////////////////////////////////////////////////////////////////////////////////////

function initTailLinks() {
  var currMatrix = new THREE.Matrix4().copy(dragonBodyFrame.matrix);
  currMatrix.multiply(new THREE.Matrix4().makeTranslation(-2, 0.5, 0));
  currMatrix.multiply(new THREE.Matrix4().makeRotationZ(Math.PI / 30));

  var currLength = currLengthTail, currWidth = currWidthTail, currHeight = currHeightTail, theta = Math.PI / 30;

  for (var i = 0; i < numTail; i++) {
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
    currLength += incrLengthTail; currWidth -= incrWidthTail; currHeight -= incrHeightTail;
  }
}

/////////////////////////////////////////////////////////////////////////////////////
//  Modify the joint angle for the tails
/////////////////////////////////////////////////////////////////////////////////////

function modifyTailLinks(angle) {
  var theta = angle / numNeck;
  if (angle > Math.PI || angle < -Math.PI) {
    return;
  }
  var currMatrix = new THREE.Matrix4().copy(dragonBodyFrame.matrix);
  currMatrix.multiply(new THREE.Matrix4().makeTranslation(-2, 0.5, 0));
  currMatrix.multiply(new THREE.Matrix4().makeRotationZ(theta));

  var currLength = currLengthTail, currWidth = currWidthTail, currHeight = currHeightTail;

  for (var i = 0; i < numTail; i++) {
    var dragonTailLinkFrame, dragonTailLink;

    // Create the NeckLink frame
    dragonTailLinkFrame = dragonTailLinkFrames[i];
    dragonTailLinkFrame.matrixAutoUpdate = false;
    dragonTailLinkFrame.matrix.copy(currMatrix);
    dragonTailLinkFrame.updateMatrixWorld();
    dragonTailLinkFrames[i] = dragonTailLinkFrame;

    // Create the body block
    dragonTailLink = dragonTailLinks[i];
    dragonTailLink.matrixAutoUpdate = false;
    dragonTailLink.matrix.copy(currMatrix);
    dragonTailLink.matrix.multiply(new THREE.Matrix4().makeTranslation(-currLength / 2, -currHeight / 2, 0));
    dragonTailLink.matrix.multiply(new THREE.Matrix4().makeScale(currLength, currHeight, currWidth));
    dragonTailLinks[i] = dragonTailLink;
    dragonTailLink.updateMatrixWorld();

    // Update currMatrix
    currMatrix.multiply(new THREE.Matrix4().makeTranslation(-currLength, 0, 0));
    currMatrix.multiply(new THREE.Matrix4().makeRotationZ(theta));

    // Update currLength, currWidth
    currLength += incrLengthTail; currWidth -= incrWidthTail; currHeight -= incrHeightTail;
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
  if (!danceSequence && animation && meshesLoaded) {
    if (keyboard.pressed("R")) {
        danceSequence = true;
        dragonRollSequence = true;
        rollStartTime = t;
    } else if (keyboard.pressed("L")) {
      danceSequence = true;
      dragonLoopSequence = true;
      loopStartTime = t;
    } else if (keyboard.pressed("S")) {
      if (currWingSpeed > minWingSpeed + wingSpeedIncr) {
        currWingSpeed -= wingSpeedIncr;
      }
      if (currNeckAngle < maxNeckAngle - neckAngleIncr) {
        currNeckAngle += neckAngleIncr;
      } 
    } else if (keyboard.pressed("W")) {
      if (currWingSpeed < wingSpeedMax - wingSpeedIncr) {
        currWingSpeed += wingSpeedIncr;
      }
      if (currNeckAngle > neckAngleIncr) {
        currNeckAngle -= neckAngleIncr;
      }
    }
    if (keyboard.pressed("A")) {
      currRollAngle -= rollAngleIncr;
    } else if (keyboard.pressed("D")) {
      currRollAngle += rollAngleIncr;
    }

    if (keyboard.pressed("H")) {
      if (currPitchAngle < maxPitchAngle - pitchAngleIncr) {
        currPitchAngle += pitchAngleIncr;
      }
      if (currNeckAngle > neckAngleIncr) {
        currNeckAngle -= neckAngleIncr;
      }
    } else if (keyboard.pressed("J")) {
      if (currPitchAngle > -maxPitchAngle + pitchAngleIncr) {
        currPitchAngle -= pitchAngleIncr;
      }
      if (currNeckAngle < maxNeckAngle - neckAngleIncr) {
        currNeckAngle += neckAngleIncr;
      }
    }
  }
} 

///////////////////////////////////////////////////////////////////////////////////////
// The dragon does a loop de loop
///////////////////////////////////////////////////////////////////////////////////////

function dragonLoop() {
  var etime = t - loopStartTime;
  var theta = loopSpeed * etime;
  var wingSpeed = Math.PI , wingAngle;
  if (!dragonLoopSequence) {
    return;
  } else if (theta >= 2 * Math.PI) {
    danceSequence = false;
    dragonLoopSequence = false;
    return;
  } else {
    wingAngle = Math.PI / 4 * Math.sin(wingSpeed * etime);
    dragonBodyFrame.matrix.identity();
    dragonBodyFrame.matrix.multiply(new THREE.Matrix4().makeTranslation(loopRadius * Math.sin(theta), loopRadius * (1 - Math.cos(theta)), 0));
    dragonBodyFrame.matrix.multiply(new THREE.Matrix4().makeRotationZ(theta));
    dragonBodyFrame.updateMatrixWorld();

    dragonBody.matrix.copy(dragonBodyFrame.matrix);
    dragonBody.matrix.multiply(new THREE.Matrix4().makeScale(4, 1, 2));
    dragonBodyFrame.updateMatrixWorld();

    updateLegs(Math.PI / 3 * Math.sin(theta / 2));
    modifyNeckLinks(Math.PI / 3 * Math.sin(theta / 2));
    modifyTailLinks(- Math.PI / 3 * Math.sin(theta / 2));
    modifyWingAngle(wingAngle);
  }
}

///////////////////////////////////////////////////////////////////////////////////////
// The dragon does a roll
///////////////////////////////////////////////////////////////////////////////////////

function dragonRoll() {
  var etime = t - rollStartTime;
  var theta = rollSpeed * etime - rollSpan;
  var wingSpeed = 2 * Math.PI , wingAngle;
  var comp = (theta + rollSpan) / (2 * rollSpan);
  if (!dragonRollSequence) {
    return;
  } else if (theta >= rollSpan) {
    danceSequence = false;
    dragonRollSequence = false;
    return;
  } else {
    wingAngle = Math.PI / 4 * Math.sin(wingSpeed * etime);
    dragonBodyFrame.matrix.identity();
    dragonBodyFrame.matrix.multiply(new THREE.Matrix4().makeTranslation(rollRadius * Math.sin(theta), -rollRadius * (1 - Math.cos(theta)) + rollRadius / 10, 0));
    dragonBodyFrame.matrix.multiply(new THREE.Matrix4().makeRotationZ(theta));
    dragonBodyFrame.matrix.multiply(new THREE.Matrix4().makeRotationX(2 * Math.PI * comp));
    dragonBodyFrame.updateMatrixWorld();

    dragonBody.matrix.copy(dragonBodyFrame.matrix);
    dragonBody.matrix.multiply(new THREE.Matrix4().makeScale(4, 1, 2));
    dragonBodyFrame.updateMatrixWorld();

    updateLegs(Math.PI / 6 * Math.cos(comp * Math.PI));
    modifyNeckLinks(Math.PI / 6 * Math.cos(comp * Math.PI));
    modifyTailLinks(- Math.PI / 3 * Math.cos(comp * Math.PI));
    modifyWingAngle(wingAngle);
  }
}

function updateLegs(theta) {
  // Left leg frame of the dragon
  leftLegFrame.matrix.copy(dragonBodyFrame.matrix);
  leftLegFrame.matrix.multiply(new THREE.Matrix4().makeTranslation(0, -0.5, 0.5));
  leftLegFrame.matrix.multiply(new THREE.Matrix4().makeRotationZ(-Math.PI/3 + theta));
  leftLegFrame.updateMatrixWorld();

  // Left leg of the dragon
  leftLegBody.matrix.copy(leftLegFrame.matrix);
  leftLegBody.matrix.multiply(new THREE.Matrix4().makeTranslation(0, -0.5, 0));
  leftLegBody.matrix.multiply(new THREE.Matrix4().makeScale(0.3, 1.5, 0.3));

  // Right leg frame of the dragon
  rightLegFrame.matrix.copy(dragonBodyFrame.matrix);
  rightLegFrame.matrix.multiply(new THREE.Matrix4().makeScale(1, 1, -1));
  rightLegFrame.matrix.multiply(new THREE.Matrix4().makeTranslation(0, -0.5, 0.5));
  rightLegFrame.matrix.multiply(new THREE.Matrix4().makeRotationZ(-Math.PI/3 + theta));
  rightLegFrame.updateMatrixWorld();

  // Right leg of the dragon
  rightLegBody.matrix.copy(rightLegFrame.matrix);
  rightLegBody.matrix.multiply(new THREE.Matrix4().makeTranslation(0, -0.5, 0));
  rightLegBody.matrix.multiply(new THREE.Matrix4().makeScale(0.3, 1.5, 0.3));
}

///////////////////////////////////////////////////////////////////////////////////////
// UPDATE CALLBACK:    This is the main animation loop
///////////////////////////////////////////////////////////////////////////////////////

function update() {
  var dt = 0.02;
  checkKeyboard();
  if (animation && meshesLoaded) {
    t += dt;
    dragonRoll();
    dragonLoop();
    if (!danceSequence) {
      currWingAngle += dt * currWingSpeed;
    
      dragonBodyFrame.matrix.identity();
      dragonBodyFrame.matrix.multiply(new THREE.Matrix4().makeRotationZ(currPitchAngle));
      dragonBodyFrame.matrix.multiply(new THREE.Matrix4().makeRotationX(currRollAngle));
      dragonBodyFrame.updateMatrixWorld();
  
      dragonBody.matrix.copy(dragonBodyFrame.matrix);
      dragonBody.matrix.multiply(new THREE.Matrix4().makeScale(4, 1, 2));
      dragonBodyFrame.updateMatrixWorld();  

      updateLegs(currNeckAngle);
      updateLegs(currNeckAngle);

      modifyWingAngle(Math.PI / 4 * Math.cos(currWingAngle));
      modifyNeckLinks(currNeckAngle);
      modifyTailLinks(currNeckAngle);
    }
  }
  requestAnimationFrame(update);      // requests the next update call;  this creates a loop
  renderer.render(scene, camera);
}

init();
update();

