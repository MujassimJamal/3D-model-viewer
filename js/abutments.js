import * as THREE from "three";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";

function main() {
  const canvas = document.querySelector("#c");

  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

  const fov = 75;
  const aspect = 2;
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 5, 10);

  const controls = new TrackballControls(camera, renderer.domElement);
  controls.update();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x2a2b2e);

  const color = 0xffffff;
  const intensity = 2;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  camera.add(light);
  scene.add(camera);

  // center
  const radiusTop = 0.6;
  const radiusBottom = 0.6;
  const height = 2.6;
  const radialSegments = 6;

  const geometry = new THREE.CylinderGeometry(
    radiusTop,
    radiusBottom,
    height,
    radialSegments
  );

  // bottom
  const radiusTop1 = 0.45;
  const radiusBottom1 = 1.05;
  const height1 = 2.6;
  const radialSegments1 = 50;
  const geometry1 = new THREE.CylinderGeometry(
    radiusTop1,
    radiusBottom1,
    height1,
    radialSegments1
  );

  // root
  const radiusTop2 = 0.23;
  const radiusBottom2 = 0.23;
  const height2 = 2.8;
  const radialSegments2 = 50;
  const geometry2 = new THREE.CylinderGeometry(
    radiusTop2,
    radiusBottom2,
    height2,
    radialSegments2
  );

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

  function makeInstance(geometry, color, x = null, y = null, z = null) {
    const material = new THREE.MeshPhongMaterial({
      color,
      flatShading: true
    });

    const meshObj = new THREE.Mesh(geometry, material);
    scene.add(meshObj);

    if (x !== null) {
      meshObj.position.x = x;
    }

    if (z !== null) {
      meshObj.position.z = z;
    }

    if (y !== null) {
      meshObj.position.y += y;
    }

    return meshObj;
  }

  const meshObjs = [
    makeInstance(geometry, 0xffffff, 0),
    makeInstance(geometry1, 0xffffff, 0),
    makeInstance(geometry2, 0xffffff, 0, 2.2),

    makeInstance(geometry, 0xffffff, -4, -0.6, 2),
    makeInstance(geometry1, 0xffffff, -4, -0.6, 2),
    makeInstance(geometry2, 0xffffff, -4, 1.6, 2),

    makeInstance(geometry, 0xffffff, 5, 0.4),
    makeInstance(geometry1, 0xffffff, 5, 0.4),
    makeInstance(geometry2, 0xffffff, 5, 2.6)
  ];

  function render(time) {
    time *= 0.001;

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

    renderer.render(scene, camera);

    requestAnimationFrame(render);
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
