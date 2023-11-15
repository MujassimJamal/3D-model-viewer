import * as THREE from "three";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";

function main() {
  const canvas = document.querySelector("#c");

  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

  const fov = 75;
  const aspect = 2;
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 30;

  const controls = new TrackballControls(camera, renderer.domElement);
  controls.update();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x2a2b2e);

  // const light = new THREE.DirectionalLight(0xffffff, 2);
  // light.position.set(-1, 2, 4);
  // camera.add(light);
  // scene.add(camera);

  var loader = new STLLoader();
  loader.load("../models/", function (geometry) {
    const material = new THREE.MeshBasicMaterial(0xffffff, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    renderer.render(scene, camera);
  });

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

    // cubes.forEach((cube, ndx) => {
    //   const speed = 1 + ndx * 0.1;
    //   const rot = time * speed;
    //   cube.rotation.x = time;
    //   cube.rotation.y = time;
    // });
    requestAnimationFrame(render);

    renderer.render(scene, camera);
  }

  requestAnimationFrame(render);

  // Convert into stl
  // var exporter = new STLExporter();
  // var str = exporter.parse(scene); // Export the scene
  // var blob = new Blob([str], { type: "text/plain" }); // Generate Blob from the string
  // var link = document.createElement("a");
  // link.style.display = "none";
  // document.body.appendChild(link);
  // link.href = URL.createObjectURL(blob);
  // link.download = "Test.stl";
  // link.click();
}

main();
