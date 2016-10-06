var container, camera, scene, renderer;

var stats, controls;

//cubemap
var path = "texture/skybox/";
var format = '.jpg';
var urls = [
		path +  'px' + format, path  + 'nx' + format,
		path + 'py' + format, path + 'ny' + format,
		path + 'pz' + format, path + 'nz' + format
];

var cubeTextureLoader = new THREE.CubeTextureLoader();

var reflectionCube = cubeTextureLoader.load( urls );
reflectionCube.format = THREE.RGBFormat;

var refractionCube = cubeTextureLoader.load( urls );
reflectionCube.format = THREE.RGBFormat;
refractionCube.mapping = THREE.CubeRefractionMapping;

//materials
var chrome = new THREE.MeshLambertMaterial( { color: 0xffffff, envMap: reflectionCube } );
var liquid = new THREE.MeshLambertMaterial( { color: 0xffffff, envMap: refractionCube, refractionRatio: 0.85 } );
var shiny = new THREE.MeshStandardMaterial( { color: 'rgb(0,0,0)', envMap: reflectionCube, roughness: 0.1, metalness: 1.0,  opacity:0.3 } );
var matte = new THREE.MeshPhongMaterial( { color: 0x000000, specular: 0x111111, shininess: 1 } );
var plastic = new THREE.MeshPhongMaterial( { color:  'rgb(0,0,255)', specular: 'rgb(255,255,255)', shininess: 250 } );
var basic = new THREE.MeshBasicMaterial({color: 0xffffff});
var wireframe = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});


//render object: Jeep model
var mshJeep;
var jeep = new THREE.Object3D();
var groupJeep = [];

//scene lights: directionalLight
var directionalLight = new THREE.DirectionalLight( 'rgb(255,255,255)', 1 );
directionalLight.position.set( 1, 1, 0 );

//scene lights: AmbientLight
var ambient = new THREE.AmbientLight( 'rgb(255,255,255)', 0.8 );

init();
animate();

function init() {

	container = document.getElementById( 'container' );

	//camera
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 400;

	//scene
	scene = new THREE.Scene();
	//scene.background = new THREE.Color( 0x000000 );
	scene.background = reflectionCube;

	//JSONLoader
	var loader = new THREE.JSONLoader();
	loader.load('models/Jeep.json', function(geoJeep) {
		mshJeep = new THREE.Mesh( geoJeep, chrome );
		mshJeep.scale.set(60,60,60);
		mshJeep.position.set(200,0,0);
		scene.add( mshJeep );

		// //multiple
		// for ( var i = 0; i < 2000; i ++ ) {
		// 	mshJeep = new THREE.Mesh( geoJeep, chrome );
		// 	mshJeep.position.x = Math.random() * 2000 - 600;
		// 	mshJeep.position.y = Math.random() * 2000 - 600;
		// 	mshJeep.position.z = Math.random() * 2000 - 600;
		// 	mshJeep.rotation.x = Math.random() * 2 * Math.PI;
		// 	mshJeep.rotation.y = Math.random() * 2 * Math.PI;
		//   mshJeep.scale.set(20,20,20);
		// 	mshJeep.updateMatrix();
		//
		// 	groupJeep.push( mshJeep );
		//
		// 	scene.add( mshJeep );
		// }
	});



	//OBJLoader
	// var loader = new THREE.OBJLoader();
	// loader.load( 'models/Jeep.obj', function ( object ) {
	//
	// 	var body = object.children[0].clone();
	// 	body.material = chrome;
	//
	// 	var windows = object.children[2].clone();
	// 	windows.material = shiny;
	// 	windows.material.transparent = true;
	//
	// 	var wheels = object.children[1].clone();
	// 	wheels.material = matte;
	//
	// 	jeep.add(body);
	// 	jeep.add(windows);
	// 	jeep.add(wheels);
	// 	jeep.scale.set(50,50,50);
	// 	jeep.position.set(-200,0,0);
	//
	// 	scene.add(jeep);
	// });


	scene.add( directionalLight );
	scene.add( ambient );

	//render settings
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	//window events
	window.addEventListener( 'resize', onWindowResize, false );

	stats = new Stats();
	container.appendChild( stats.dom );

	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.minDistance = 200;
	controls.maxDistance = 600;

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );

}


function animate() {

	requestAnimationFrame( animate );
	stats.update();
	render();

}

function render(){

	mshJeep.rotation.x += 0.005;
  mshJeep.rotation.y += 0.01;
	//
	// jeep.rotation.x += 0.005;
  // jeep.rotation.y += 0.01;

	// for ( var i = 0; i < groupJeep.length; i ++ ) {
	// 	groupJeep[ i ].rotation.x += 0.01;
	// 	groupJeep[ i ].rotation.y += 0.02;
	// }

	renderer.render( scene, camera );

}
