/*
** Standard Global Variables
*/
var container;

/*
* WORLD
*/
var scene;
var camera;
var wMap;
var hMap;

var renderer;
var controls;
var keyboard;
var clock;

/*
** Custom Global Variables
*/
var heightOffset;
var cube;
var stats;

init();
animate();

/*
** FUNDAMENTALS FUNCTIONS
*/
function init()
{
	keyboard = new THREEx.KeyboardState();
	clock = new THREE.Clock();
	scene = new THREE.Scene();
	wMap = 100;
	hMap = 100;
	heightOffset = 200;

	/*
	** CAMERA
	*/
	var SCREEN_WIDTH = window.innerWidth;
	var SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 45;
	var ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
	var NEAR = 0.1;
	var FAR = 20000;

	camera = new THREE.PerspectiveCamera(
		VIEW_ANGLE,
		ASPECT,
		NEAR,
		FAR
	);

	scene.add(camera);
	camera.position.set(0, 850 + heightOffset, 200);
	camera.lookAt(scene.position);
	
	/*
	** RENDERER
	*/
	if ( Detector.webgl )
		renderer = new THREE.WebGLRenderer({
			antialias:true
		});
	else
		renderer = new THREE.CanvasRenderer(); 
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	container = document.getElementById( 'container' );
	container.appendChild( renderer.domElement );
	
	/*
	** EVENTS
	*/
	THREEx.WindowResize(renderer, camera);
	THREEx.FullScreen.bindKey
	({
		charCode : 'm'.charCodeAt(0)
	});
	
	/*
	** CONTROLS
	*/
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.center.set(0,800 + heightOffset,0);
	/*
	** STATS RENDER
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );
	*/
	
	/*
	** LIGHT
	*/
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,1000,0);
	scene.add(light);
	
	/*
	** FLOOR
	*/
	var floorTexture = new THREE.ImageUtils.loadTexture( 'images/ground.png' );
	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
	floorTexture.repeat.set( 10, 10 );
	var floorMaterial = new THREE.MeshBasicMaterial({
		map: floorTexture,
		side: THREE.DoubleSide
	});
	var floorGeometry = new THREE.PlaneGeometry(wMap, hMap, 10, 10);
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.position.y = 800 + heightOffset;
	floor.rotation.x = Math.PI / 2;
	scene.add(floor);
	
	/*
	** SET UP SKYBOX (CUBE INSIDE BACKGROUND)
	*/
	var axes = new THREE.AxisHelper(100);
	scene.add( axes );

	var imagePrefix = "images/sky-";
	var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
	var imageSuffix = ".png";
	var skyGeometry = new THREE.BoxGeometry( 10000, 10000, 10000 );	
	
	var materialArray = [];
	for (var i = 0; i < 6; i++)
		materialArray.push( new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
			side: THREE.BackSide
		}));
	var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
	var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
	scene.add( skyBox );
}

/*
** LOOP FOR REDRAW THE SCENE 60 TIMES PER SECONDS
*/
function animate()
{
	requestAnimationFrame( animate );
	render();
	update();
}

function update()
{
	if ( keyboard.pressed("z") )
	{
		/*
		** Key Events
		**/
	}

	controls.update();
	stats.update();
}

function render()
{
	renderer.render( scene, camera );
}
