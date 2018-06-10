// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
/*
var renderer = new THREE.WebGLRenderer({canvas: document.getElementById('canvas'), antialias: true});
renderer.setClearColor(0x00ff00);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

var camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 3000);

var scene = new THREE.scene();

var geometry = new THREE.BoxGeometry(100, 100, 100);
var material = new THREE.MeshBasicMaterial();
var mesh = new THREE.Mesh(geometry, material);
mesh.position.set(0, 0, -1000);

scene.add(mesh);

renderer.render(scene, camera);
*/
/*
var renderer = new THREE.WebGLRenderer({canvas: document.getElementById('canvas'), antialias: true});
	renderer.setClearColor(0xf9f8ed);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	//CAMERA
	var camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 3000);
	// var camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 0.1, 3000);

	//SCENE
	var scene = new THREE.Scene();

	//OBJECT
	var geometry = new THREE.CubeGeometry(100, 100, 100);
	var material = new THREE.MeshLambertMaterial({color: 0x6a9c78});
	var mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(0, 0, -1000);

	scene.add(mesh);

	//RENDER LOOP
	
	requestAnimationFrame(render);

	function render() {
		mesh.rotation.x += 0.01;
		mesh.rotation.y += 0.01;
		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}
*/

var size_map;
var div_map;
var robot;

var container;
var camera, scene, renderer;
var plane;

var mouse, raycaster, isShiftDown = false;

var cubeGeometry = new THREE.BoxGeometry( 50, 50, 50 );
var cubeMaterial = new THREE.MeshLambertMaterial( { color: 0x6a9c78, overdraw: 0.5 } );

var objects = [];
var camX = 0;
var camY = 2000;
var camZ = 0;

init();
render();

function init() {

	size_map = 1000;
	div_map = 20;

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set( camX, camY, camZ );
	camera.lookAt( new THREE.Vector3() );

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xf9f8ed );

	// Grid

	var gridHelper = new THREE.GridHelper( size_map, div_map, 0xDBDACE, 0xDBDACE );
	scene.add( gridHelper );

	///
	
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();

	var geometry = new THREE.PlaneBufferGeometry( 1000, 1000 );
	geometry.rotateX( - Math.PI / 2 );

	plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { visible: false } ) );
	scene.add( plane );

	objects.push( plane );

	var material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
	
	
	// loading manager
	var loadingManager = new THREE.LoadingManager( function() {
		scene.add( robot );
	} );
	// Collada
	var loader = new THREE.ColladaLoader( loadingManager );
	loader.load( './chappieLvl0.dae', function ( collada ) {

		robot = collada.scene;

	} );
	// Lights

	var ambientLight = new THREE.AmbientLight( 0x606060 );
	scene.add( ambientLight );

	var directionalLight = new THREE.DirectionalLight( 0xffffff );
	directionalLight.position.x = Math.random() - 0.5;
	directionalLight.position.y = Math.random() - 0.5;
	directionalLight.position.z = Math.random() - 0.5;
	directionalLight.position.normalize();
	scene.add( directionalLight );

	var directionalLight = new THREE.DirectionalLight( 0x808080 );
	directionalLight.position.x = Math.random() - 0.5;
	directionalLight.position.y = Math.random() - 0.5;
	directionalLight.position.z = Math.random() - 0.5;
	directionalLight.position.normalize();
	scene.add( directionalLight );

	renderer = new THREE.CanvasRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild(renderer.domElement);
/*
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'keydown', onDocumentKeyDown, false );
	document.addEventListener( 'keyup', onDocumentKeyUp, false );

	//
*/
	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

	render();

}
/*
	function onDocumentMouseDown( event ) {

		event.preventDefault();

		mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

		raycaster.setFromCamera( mouse, camera );

		var intersects = raycaster.intersectObjects( objects );

		if ( intersects.length > 0 ) {

			var intersect = intersects[ 0 ];

			if ( isShiftDown ) {

				if ( intersect.object != plane ) {

					scene.remove( intersect.object );

					objects.splice( objects.indexOf( intersect.object ), 1 );

				}

			} else {

				var voxel = new THREE.Mesh( cubeGeometry, cubeMaterial );
				voxel.position.copy( intersect.point ).add( intersect.face.normal );
				voxel.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
				scene.add( voxel );

				objects.push( voxel );

			}

			render();

		}

	}
	function onDocumentKeyDown( event ) {
		
		switch( event.keyCode ) {
			
			case 16: isShiftDown = true; break;
			
		}
		
	}
	
	function onDocumentKeyUp( event ) {
		
		switch( event.keyCode ) {
			
			case 16: isShiftDown = false; break;
			
		}
	}
	
	function save() {
		
		window.open( renderer.domElement.toDataURL('image/png'), 'mywindow' );
		return false;
		
	}
	*/

	function render() {

		renderer.render( scene, camera );
		requestAnimationFrame(render);
	}
	