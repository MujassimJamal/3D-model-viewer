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
    abutmentBtn.style.cssText += "-moz-box-shadow: 0 0 5px #fff; -webkit-box-shadow: 0 0 5px #fff; box-shadow: 0px 0px 5px #fff;"
    maxillaBtn.style.cssText = "position: absolute; top:240px; left:50px; width: 60px; height: 60px;";
  } else if (modelName === "Maxilla_0.1.stl") {
    maxillaBtn.style.cssText += "-moz-box-shadow: 0 0 5px #fff; -webkit-box-shadow: 0 0 5px #fff; box-shadow: 0px 0px 5px #fff;"
    abutmentBtn.style.cssText = "position: absolute; top:150px; left:50px; width: 60px; height: 60px;";
  } else {
    path = modelName;
    abutmentBtn.style.cssText = "position: absolute; top:150px; left:50px; width: 60px; height: 60px;";
    maxillaBtn.style.cssText = "position: absolute; top:240px; left:50px; width: 60px; height: 60px;";
  }

  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, -120, 8);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x2a2b2e);

  const dirLight = new THREE.DirectionalLight(0xffffff, 2);
  dirLight.position.set(-1, 2, 4);
  camera.add(dirLight);
  scene.add(camera);

  const ambLight = new THREE.AmbientLight(0xffffff, 0.3);
  ambLight.position.set(0, 1, 0);
  scene.add(ambLight);

  const controls = new TrackballControls(camera, renderer.domElement);
  controls.rotateSpeed = 3;
  controls.update();

  var loader = new STLLoader();
  loader.load(path, function (geometry) {
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      emissiveIntensity: 2,

    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.geometry.center();
    scene.add(mesh);

    fitCameraToModel(camera, mesh, 1.7);
  });

  THREE.DefaultLoadingManager.onStart = function (url, itemsLoaded, itemsTotal) {
    var spinnerDiv = " <div class='h-100 w-100 d-flex align-items-center justify-content-center' style='position: absolute;' id='spinnerParent'><div style='position: absolute;' class='spinner-border text-primary' role='status' id='spinnerChild'></div></div>";
    document.body.insertAdjacentHTML('afterbegin', spinnerDiv);
  };

  THREE.DefaultLoadingManager.onLoad = function () {
    var spinnerParent = document.getElementById("spinnerParent");
    if (spinnerParent) {
      document.body.removeChild(spinnerParent);
    }
    console.log('Loading Complete!');
  };

  THREE.DefaultLoadingManager.onProgress = function (url, itemsLoaded, itemsTotal) { };

  THREE.DefaultLoadingManager.onError = function (url) {
    alert("There was an error loading the model.");
  };

  function fitCameraToModel(camera, model, zoomOutFactor) {
    const boundingBox = new THREE.Box3().setFromObject(model);
    const center = boundingBox.getCenter(new THREE.Vector3());
    const size = boundingBox.getSize(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    const distance = Math.abs(maxDim / (2 * Math.tan(fov / 2))) * zoomOutFactor;

    camera.position.copy(center);
    camera.position.z += distance;
    camera.up.set(0, 1, 0);
    camera.lookAt(center);

    camera.updateProjectionMatrix();
    controls.update();
  }

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }

    controls.update();
    return needResize;
  }

  function render() {
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

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

// Default model on startup
loadSTLModel("Abutments_0.1.stl");