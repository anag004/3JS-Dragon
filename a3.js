/////////////////////////////////////////////////////////////////////////////////////////
//  UBC CPSC 314,  Vsep2019
//  Assignment 3 Template
/////////////////////////////////////////////////////////////////////////////////////////

console.log('hello world');

a=5;  
b=2.6;
console.log('a=',a,'b=',b);
myvector = new THREE.Vector3(0,1,2);
console.log('myvector =',myvector);

var animation = true;
var meshesLoaded = false;

var myboxMotion = new Motion(myboxSetMatrices);     
var handMotion = new Motion(handSetMatrices);     
var link1, link2, link3, link4, link5;
var linkFrame1, linkFrame2, linkFrame3, linkFrame4, linkFrame5;
var meshes = {};  
var RESOURCES_LOADED = false;

// SETUP RENDERER & SCENE

var canvas = document.getElementById('canvas');
var camera;
var light;
var ambientLight;
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xd0f0d0);     // set background colour
canvas.appendChild(renderer.domElement);

//////////////////////////////////////////////////////////
//  initCamera():   SETUP CAMERA
//////////////////////////////////////////////////////////

function initCamera() {
    // set up M_proj    (internally:  camera.projectionMatrix )
    var cameraFov = 30;     // initial camera vertical field of view, in degrees
      // view angle, aspect ratio, near, far
    camera = new THREE.PerspectiveCamera(cameraFov,1,0.1,1000); 

    var width = 10;  var height = 5;
//    camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 0.1, 1000 );

    // set up M_view:   (internally:  camera.matrixWorldInverse )
    camera.position.set(0,12,20);
    camera.up = new THREE.Vector3(0,1,0);
    camera.lookAt(0,0,0);
    scene.add(camera);

      // SETUP ORBIT CONTROLS OF THE CAMERA
    var controls = new THREE.OrbitControls(camera);
    controls.damping = 0.2;
    controls.autoRotate = false;
};

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
}

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () {
     window.scrollTo(0,0);
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
    initHand();
    initFileObjects();

    window.addEventListener('resize',resize);
    resize();
};

////////////////////////////////////////////////////////////////////////
// initMotions():  setup Motion instances for each object that we wish to animate
////////////////////////////////////////////////////////////////////////

function initMotions() {

      // keyframes for the mybox animated motion:   name, time, [x, y, z]
    myboxMotion.addKeyFrame(new Keyframe('rest pose',0.0, [0,1.9,0]));
    myboxMotion.addKeyFrame(new Keyframe('rest pose',1.0, [1,1.9,0]));
    myboxMotion.addKeyFrame(new Keyframe('rest pose',2.0, [1,6,0]));
    myboxMotion.addKeyFrame(new Keyframe('rest pose',3.0, [0,6,0]));
    myboxMotion.addKeyFrame(new Keyframe('rest pose',4.0, [0,1.9,0]));

      // basic interpolation test
    myboxMotion.currTime = 0.1;
    console.log('kf',myboxMotion.currTime,'=',myboxMotion.getAvars());    // interpolate for t=0.1
    myboxMotion.currTime = 2.9;
    console.log('kf',myboxMotion.currTime,'=',myboxMotion.getAvars());    // interpolate for t=2.9

      // keyframes for hand:    name, time, [x, y, theta1, theta2, theta3, theta4, theta5]
    handMotion.addKeyFrame(new Keyframe('straight',         0.0, [2, 3,    0, 0, 0, 0, 0]));
    handMotion.addKeyFrame(new Keyframe('right finger curl',1.0, [2, 5,   20, -120, -120, 0,0]));
    handMotion.addKeyFrame(new Keyframe('straight',         2.0, [2, 3,    0, 0, 0, 0, 0]));
    handMotion.addKeyFrame(new Keyframe('left finger curl', 3.0, [2, 3,   -20, 0, 0, -90,-90]));
    handMotion.addKeyFrame(new Keyframe('straight',         4.0, [2, 3,    0, 0, 0, 0, 0]));
    handMotion.addKeyFrame(new Keyframe('both fingers curl', 4.5, [2, 3,   20, -120, -120, -90,-90]));
    handMotion.addKeyFrame(new Keyframe('straight',         6.0, [2, 3,    0, 0, 0, 0, 0]));
}

///////////////////////////////////////////////////////////////////////////////////////
// myboxSetMatrices(avars)
///////////////////////////////////////////////////////////////////////////////////////

function myboxSetMatrices(avars) {
    mybox.matrixAutoUpdate = false;     // tell three.js not to over-write our updates
    mybox.matrix.identity();              
    mybox.matrix.multiply(new THREE.Matrix4().makeTranslation(avars[0], avars[1], avars[2]));  
    mybox.matrix.multiply(new THREE.Matrix4().makeRotationY(-Math.PI/2));
    mybox.matrix.multiply(new THREE.Matrix4().makeScale(1.0,1.0,1.0));
    mybox.updateMatrixWorld();  
}

///////////////////////////////////////////////////////////////////////////////////////
// handSetMatrices(avars)
///////////////////////////////////////////////////////////////////////////////////////

function handSetMatrices(avars) {
    var deg2rad = Math.PI/180;

    var xPosition = avars[0];
    var yPosition = avars[1];
    var theta1 = avars[2]*deg2rad;
    var theta2 = avars[3]*deg2rad;
    var theta3 = avars[4]*deg2rad;
    var theta4 = avars[5]*deg2rad;
    var theta5 = avars[6]*deg2rad;

      ////////////// link1
    linkFrame1.matrix.identity(); 
    linkFrame1.matrix.multiply(new THREE.Matrix4().makeTranslation(xPosition,yPosition,0));   
    linkFrame1.matrix.multiply(new THREE.Matrix4().makeRotationZ(theta1));    
      // Frame 1 has been established
    link1.matrix.copy(linkFrame1.matrix);
    link1.matrix.multiply(new THREE.Matrix4().makeTranslation(2,0,0));   
    link1.matrix.multiply(new THREE.Matrix4().makeScale(8,1,4));    

      ////////////// link2
    linkFrame2.matrix.copy(linkFrame1.matrix);      // start with parent frame
    linkFrame2.matrix.multiply(new THREE.Matrix4().makeTranslation(6,0,2.5));
    linkFrame2.matrix.multiply(new THREE.Matrix4().makeRotationZ(theta2));    
      // Frame 2 has been established
    link2.matrix.copy(linkFrame2.matrix);
    link2.matrix.multiply(new THREE.Matrix4().makeTranslation(2,0,0));   
    link2.matrix.multiply(new THREE.Matrix4().makeScale(4,1,1));    

      ///////////////  link3
    linkFrame3.matrix.copy(linkFrame2.matrix);
    linkFrame3.matrix.multiply(new THREE.Matrix4().makeTranslation(4,0,0));
    linkFrame3.matrix.multiply(new THREE.Matrix4().makeRotationZ(theta3));    
      // Frame 3 has been established
    link3.matrix.copy(linkFrame3.matrix);
    link3.matrix.multiply(new THREE.Matrix4().makeTranslation(2,0,0));   
    link3.matrix.multiply(new THREE.Matrix4().makeScale(4,1,1));    

      /////////////// link4
    linkFrame4.matrix.copy(linkFrame1.matrix);
    linkFrame4.matrix.multiply(new THREE.Matrix4().makeTranslation(6,0,-2.5));
    linkFrame4.matrix.multiply(new THREE.Matrix4().makeRotationZ(theta4));    
    
      // Frame 4 has been established
    link4.matrix.copy(linkFrame4.matrix);
    link4.matrix.multiply(new THREE.Matrix4().makeTranslation(2,0,0));   
    link4.matrix.multiply(new THREE.Matrix4().makeScale(4,1,1));    

      // link5
    linkFrame5.matrix.copy(linkFrame4.matrix);
    linkFrame5.matrix.multiply(new THREE.Matrix4().makeTranslation(4,0,0));
    linkFrame5.matrix.multiply(new THREE.Matrix4().makeRotationZ(theta5));    
      // Frame 5 has been established
    link5.matrix.copy(linkFrame5.matrix);
    link5.matrix.multiply(new THREE.Matrix4().makeTranslation(2,0,0));   
    link5.matrix.multiply(new THREE.Matrix4().makeScale(4,1,1));    

    link1.updateMatrixWorld();
    link2.updateMatrixWorld();
    link3.updateMatrixWorld();
    link4.updateMatrixWorld();
    link5.updateMatrixWorld();

    linkFrame1.updateMatrixWorld();
    linkFrame2.updateMatrixWorld();
    linkFrame3.updateMatrixWorld();
    linkFrame4.updateMatrixWorld();
    linkFrame5.updateMatrixWorld();
}

/////////////////////////////////////	
// initLights():  SETUP LIGHTS
/////////////////////////////////////	

function initLights() {
    light = new THREE.PointLight(0xffffff);
    light.position.set(0,4,2);
    scene.add(light);
    ambientLight = new THREE.AmbientLight(0x606060);
    scene.add(ambientLight);
}

/////////////////////////////////////	
// MATERIALS
/////////////////////////////////////	

var diffuseMaterial = new THREE.MeshLambertMaterial( {color: 0xffffff} );
var diffuseMaterial2 = new THREE.MeshLambertMaterial( {color: 0xffffff, side: THREE.DoubleSide } );
var basicMaterial = new THREE.MeshBasicMaterial( {color: 0xff0000} );
var armadilloMaterial = new THREE.MeshBasicMaterial( {color: 0x7fff7f} );

/////////////////////////////////////	
// initObjects():  setup objects in the scene
/////////////////////////////////////	

function initObjects() {
    worldFrame = new THREE.AxesHelper(5) ;
    scene.add(worldFrame);

    // mybox 
    myboxGeometry = new THREE.BoxGeometry( 1, 1, 1 );    // width, height, depth
    mybox = new THREE.Mesh( myboxGeometry, diffuseMaterial );
    scene.add( mybox );

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

    // sphere, located at light position
    sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);    // radius, segments, segments
    sphere = new THREE.Mesh(sphereGeometry, basicMaterial);
    sphere.position.set(0,4,2);
    sphere.position.set(light.position.x, light.position.y, light.position.z);
    scene.add(sphere);

    // box
    boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );    // width, height, depth
    box = new THREE.Mesh( boxGeometry, diffuseMaterial );
    box.position.set(-4, 0, 0);
    scene.add( box );

    // multi-colored cube      [https://stemkoski.github.io/Three.js/HelloWorld.html] 
    var cubeMaterialArray = [];    // order to add materials: x+,x-,y+,y-,z+,z-
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xff3333 } ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xff8800 } ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xffff33 } ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x33ff33 } ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x3333ff } ) );
    cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x8833ff } ) );
      // Cube parameters: width (x), height (y), depth (z), 
      //        (optional) segments along x, segments along y, segments along z
    var mccGeometry = new THREE.BoxGeometry( 1.5, 1.5, 1.5, 1, 1, 1 );
    mcc = new THREE.Mesh( mccGeometry, cubeMaterialArray );
    mcc.position.set(0,0,0);
    scene.add( mcc );	

    // cylinder
    // parameters:  radiusAtTop, radiusAtBottom, height, radialSegments, heightSegments
    cylinderGeometry = new THREE.CylinderGeometry( 0.30, 0.30, 0.80, 20, 4 );
    cylinder = new THREE.Mesh( cylinderGeometry, diffuseMaterial);
    cylinder.position.set(2, 0, 0);
    scene.add( cylinder );

    // cone:   parameters --  radiusTop, radiusBot, height, radialSegments, heightSegments
    coneGeometry = new THREE.CylinderGeometry( 0.0, 0.30, 0.80, 20, 4 );
    cone = new THREE.Mesh( coneGeometry, diffuseMaterial);
    cone.position.set(4, 0, 0);
    scene.add( cone);

    // torus:   parameters -- radius, diameter, radialSegments, torusSegments
    torusGeometry = new THREE.TorusGeometry( 1.2, 0.4, 10, 20 );
    torus = new THREE.Mesh( torusGeometry, diffuseMaterial);

    torus.rotation.set(0,0,0);     // rotation about x,y,z axes
    torus.scale.set(1,2,3);
    torus.position.set(6, 0, 0);   // translation

    scene.add( torus );

    // custom object
    var geom = new THREE.Geometry(); 
    var v0 = new THREE.Vector3(0,0,0);
    var v1 = new THREE.Vector3(3,0,0);
    var v2 = new THREE.Vector3(0,3,0);
    var v3 = new THREE.Vector3(3,3,0);
    geom.vertices.push(v0);
    geom.vertices.push(v1);
    geom.vertices.push(v2);
    geom.vertices.push(v3);
    geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
    geom.faces.push( new THREE.Face3( 1, 3, 2 ) );
    geom.computeFaceNormals();
    customObject = new THREE.Mesh( geom, diffuseMaterial2 );
    customObject.position.set(0, 0, -2);
    scene.add(customObject);
}

/////////////////////////////////////////////////////////////////////////////////////
//  initHand():  define all geometry associated with the hand
/////////////////////////////////////////////////////////////////////////////////////

function initHand() {
    handMaterial = new THREE.MeshLambertMaterial( {color: 0xffffff} );
    boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );    // width, height, depth

    link1 = new THREE.Mesh( boxGeometry, handMaterial );  scene.add( link1 );
    linkFrame1   = new THREE.AxesHelper(1) ;   scene.add(linkFrame1);
    link2 = new THREE.Mesh( boxGeometry, handMaterial );  scene.add( link2 );
    linkFrame2   = new THREE.AxesHelper(1) ;   scene.add(linkFrame2);
    link3 = new THREE.Mesh( boxGeometry, handMaterial );  scene.add( link3 );
    linkFrame3   = new THREE.AxesHelper(1) ;   scene.add(linkFrame3);
    link4 = new THREE.Mesh( boxGeometry, handMaterial );  scene.add( link4 );
    linkFrame4   = new THREE.AxesHelper(1) ;   scene.add(linkFrame4);
    link5 = new THREE.Mesh( boxGeometry, handMaterial );  scene.add( link5 );
    linkFrame5   = new THREE.AxesHelper(1) ;   scene.add(linkFrame5);

    link1.matrixAutoUpdate = false;  
    link2.matrixAutoUpdate = false;  
    link3.matrixAutoUpdate = false;  
    link4.matrixAutoUpdate = false;  
    link5.matrixAutoUpdate = false;
    linkFrame1.matrixAutoUpdate = false;  
    linkFrame2.matrixAutoUpdate = false;  
    linkFrame3.matrixAutoUpdate = false;  
    linkFrame4.matrixAutoUpdate = false;  
    linkFrame5.matrixAutoUpdate = false;
}

/////////////////////////////////////////////////////////////////////////////////////
//  create customShader material
/////////////////////////////////////////////////////////////////////////////////////

var customShaderMaterial = new THREE.ShaderMaterial( {
//        uniforms: { textureSampler: {type: 't', value: floorTexture}},
	vertexShader: document.getElementById( 'customVertexShader' ).textContent,
	fragmentShader: document.getElementById( 'customFragmentShader' ).textContent
} );

var ctx = renderer.context;
ctx.getShaderInfoLog = function () { return '' };   // stops shader warnings, seen in some browsers

////////////////////////////////////////////////////////////////////////	
// initFileObjects():    read object data from OBJ files;  see onResourcesLoaded() for instances
////////////////////////////////////////////////////////////////////////	

function initFileObjects() {
        // list of OBJ files that we want to load, and their material
    models = {     
//	bunny:     {obj:"obj/bunny.obj", mtl: diffuseMaterial, mesh: null},
//	horse:     {obj:"obj/horse.obj", mtl: diffuseMaterial, mesh: null },
//	minicooper:{obj:"obj/minicooper.obj", mtl: diffuseMaterial, mesh: null },
//	trex:      { obj:"obj/trex.obj", mtl: normalShaderMaterial, mesh: null },
	teapot:    {obj:"obj/teapot.obj", mtl: customShaderMaterial, mesh: null	},
	armadillo: {obj:"obj/armadillo.obj", mtl: customShaderMaterial, mesh: null },
	dragon:    {obj:"obj/dragon.obj", mtl: customShaderMaterial, mesh: null }
    };

    var manager = new THREE.LoadingManager();
    manager.onLoad = function () {
	console.log("loaded all resources");
	RESOURCES_LOADED = true;
	onResourcesLoaded();
    }
    var onProgress = function ( xhr ) {
	if ( xhr.lengthComputable ) {
	    var percentComplete = xhr.loaded / xhr.total * 100;
	    console.log( Math.round(percentComplete, 2) + '% downloaded' );
	}
    };
    var onError = function ( xhr ) {
    };

    // Load models;  asynchronous in JS, so wrap code in a fn and pass it the index
    for( var _key in models ){
	console.log('Key:', _key);
	(function(key){
	    var objLoader = new THREE.OBJLoader( manager );
	    objLoader.load( models[key].obj, function ( object ) {
		object.traverse( function ( child ) {
		    if ( child instanceof THREE.Mesh ) {
			child.material = models[key].mtl;
			child.material.shading = THREE.SmoothShading;
		    }	} );
		models[key].mesh = object;
//		scene.add( object );
	    }, onProgress, onError );
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
    meshes["armadillo1"] = models.armadillo.mesh.clone();
    meshes["armadillo2"] = models.armadillo.mesh.clone();
    meshes["dragon1"] = models.dragon.mesh.clone();
    meshes["dragon2"] = models.dragon.mesh.clone();
    meshes["teapot1"] = models.teapot.mesh.clone();
    
    // position the object instances and parent them to the scene, i.e., WCS
    
    meshes["armadillo1"].position.set(-6, 1.5, 2);
    meshes["armadillo1"].rotation.set(0,-Math.PI/2,0);
    meshes["armadillo1"].scale.set(1,1,1);
    scene.add(meshes["armadillo1"]);

    meshes["armadillo2"].position.set(-3, 1.5, 2);
    meshes["armadillo2"].rotation.set(0,-Math.PI/2,0);
    meshes["armadillo2"].scale.set(1,1,1);
    scene.add(meshes["armadillo2"]);

    meshes["dragon1"].position.set(-5, 0.2, 4);
    meshes["dragon1"].rotation.set(0, Math.PI, 0);
    meshes["dragon1"].scale.set(0.3,0.3,0.3);
    scene.add(meshes["dragon1"]);

    meshes["dragon2"].position.set(5, 5, 5);
    meshes["dragon2"].rotation.set(0, 0, Math.PI);
    meshes["dragon2"].scale.set(0.1,0.1,0.1);
    scene.add(meshes["dragon2"]);

    meshes["teapot1"].position.set(3, 0, 3);
    meshes["teapot1"].scale.set(0.5, 0.5, 0.5);
    scene.add(meshes["teapot1"]);

    meshesLoaded = true;
}


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
    var dt=0.02;
    checkKeyboard();
    if (animation && meshesLoaded) {
	  // advance the motion of all the animated objects
	myboxMotion.timestep(dt);
	handMotion.timestep(dt);
        if (meshesLoaded) 
	    meshes["armadillo1"].position.x += 0.1;
    }

    sphere.position.set(light.position.x, light.position.y, light.position.z);
    requestAnimationFrame(update);      // requests the next update call;  this creates a loop
    renderer.render(scene, camera);
}

init();
update();

