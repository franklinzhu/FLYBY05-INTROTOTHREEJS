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
var shiny = new THREE.MeshStandardMaterial( { color: 'rgb(0,0,255)', envMap: reflectionCube, roughness: 0.1, metalness: 1.0 } );
var matte = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, shininess: 1 } );
var plastic = new THREE.MeshPhongMaterial( { color:  'rgb(0,0,255)', specular: 'rgb(255,255,255)', shininess: 250 } );
var basic = new THREE.MeshBasicMaterial({color: 0xffffff});
var wireframe = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});

//render object: box
var geoBox = new THREE.BoxGeometry( 100, 100, 100 );
var mshBox = new THREE.Mesh( geoBox, plastic );

//scene lights: directionalLight
var directionalLight = new THREE.DirectionalLight( 'rgb(255,255,255)', 1 );
directionalLight.position.set( 1, 1, 0 );

//scene lights: AmbientLight
var ambient = new THREE.AmbientLight( 'rgb(255,255,255)', 0.6 );

init();
animate();

function init() {

	container = document.getElementById( 'container' );

	//camera
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 400;

	//scene
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x000000 );
	//scene.background = reflectionCube;
	scene.add( mshBox );
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

	mshBox.rotation.x += 0.005;
	mshBox.rotation.y += 0.01;

	renderer.render( scene, camera );

}
