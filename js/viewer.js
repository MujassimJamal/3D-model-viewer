import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";

function main() {
  const canvas = document.querySelector("#c");

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

  function loadModel(name) {
    var loader = new STLLoader();
    var path = "../models/" + name;
    loader.load(path, function (geometry) {
      const material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        intensity: 2,
        flatShading: true,

      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.geometry.center();
      scene.add(mesh);

      fitCameraToModel(camera, mesh, 2);
    });
  }
  loadModel("Abutments_0.1.stl");

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

main();
