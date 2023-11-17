import * as THREE from "three";
import { STLLoader } from "three/addons/loaders/STLLoader";
import { TrackballControls } from "three/addons/controls/TrackballControls";


export function loadSTLModel(modelName) {
  const canvas = document.querySelector("#c");

  
  var path = "models/" + modelName;
  // Some css customization stuff
  var abutmentBtn = document.querySelector("#abutment");
  var maxillaBtn = document.querySelector("#maxilla");
  if (modelName === "Abutments_0.1.stl") {
    abutmentBtn.style.cssText = "position: absolute; top:150px; left:50px; width: 60px; height: 60px; -moz-box-shadow: 0 0 5px #fff; -webkit-box-shadow: 0 0 5px #fff; box-shadow: 0px 0px 5px #fff;"
    maxillaBtn.style.cssText = "position: absolute; top:240px; left:50px; width: 60px; height: 60px;";
  } else if (modelName === "Maxilla_0.1.stl") {
    maxillaBtn.style.cssText = "position: absolute; top:240px; left:50px; width: 60px; height: 60px; -moz-box-shadow: 0 0 5px #fff; -webkit-box-shadow: 0 0 5px #fff; box-shadow: 0px 0px 5px #fff;"
    abutmentBtn.style.cssText = "position: absolute; top:150px; left:50px; width: 60px; height: 60px;";
  } else {
    path = modelName;
    abutmentBtn.style.cssText = "position: absolute; top:150px; left:50px; width: 60px; height: 60px;";
    maxillaBtn.style.cssText = "position: absolute; top:240px; left:50px; width: 60px; height: 60px;";
  }

  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, -120, 8);

  const controls = new TrackballControls(camera, renderer.domElement);
  controls.rotateSpeed = 5;
  controls.update();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x2a2b2e);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(-1, 2, 4);
  camera.add(light);
  scene.add(camera);

  const aLight = new THREE.AmbientLight(0xffffff, 0.3);
  aLight.position.set(0, 1, 0);
  camera.add(aLight);
  scene.add(camera);


  var loader = new STLLoader();
  loader.load(path, function (geometry) {
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      emissiveIntensity: 2,
      flatShading: true,

    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.geometry.center();
    scene.add(mesh);

    fitCameraToModel(camera, mesh, 1.7);
  });

  THREE.DefaultLoadingManager.onStart = function ( url, itemsLoaded, itemsTotal ) {
    // console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    alert("Loading the model... Please wait for a few seconds.");
  };
  
  THREE.DefaultLoadingManager.onLoad = function ( ) {
    console.log( 'Loading Complete!');
  };
  
  THREE.DefaultLoadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
    console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );

  };
  
  THREE.DefaultLoadingManager.onError = function ( url ) {
    console.log( 'There was an error loading ' + url );
    // alert("Error loading the model");
  };

  function fitCameraToModel(camera, model, zoomOutFactor) {
    const boundingBox = new THREE.Box3().setFromObject(model);
    const center = boundingBox.getCenter(new THREE.Vector3());
    const size = boundingBox.getSize(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    const distance = Math.abs(maxDim / (2 * Math.tan(fov / 2))) * zoomOutFactor;

    // Set camera position and target
    camera.position.copy(center);
    camera.position.z += distance;
    camera.up.set(0, 1, 0);
    camera.lookAt(center);
  }

  // Responsive
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }
  renderer.render(scene, camera);

  // Movement
  function render(time) {
    time *= 0.001;

    // Resolution
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      controls.update();
    }

    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    controls.update();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
  requestAnimationFrame(render);
}

loadSTLModel("Abutments_0.1.stl");