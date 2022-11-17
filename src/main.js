import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  AmbientLight,
  AnimationMixer,
  Clock,
  Mesh,
  MeshStandardMaterial,
  CylinderGeometry,
  Color,
  PCFSoftShadowMap,
  DirectionalLight,
  SphereGeometry,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader";

import "./core/styles/globals.css";

function main() {
  const renderer = new WebGLRenderer({ antialias: true });
  const scene = new Scene();
  const aspectRatio = window.innerWidth / window.innerHeight;
  const camera = new PerspectiveCamera(75, aspectRatio, 0.1, 1000);
  const element = document.body;
  const controls = new OrbitControls(camera, renderer.domElement);
  const loader = new GLTFLoader();
  const clock = new Clock();
  const directionalLight = new DirectionalLight(0xfefefe, 1);
  const ambientLight = new AmbientLight(0xfefefe, 1);

  // Sphere
  const geometry = new SphereGeometry(0.5, 32, 32);
  const material = new MeshStandardMaterial({ color: 0xff0000 });
  const sphere = new Mesh(geometry, material);
  sphere.castShadow = true;

  /**
   * @type {AnimationMixer}
   */
  let mixer;

  // floor
  const floorGeometry = new CylinderGeometry(4, 4, 0.25, 100, 1);
  const floorMaterial = new MeshStandardMaterial({ color: 0x252525 });
  const floor = new Mesh(floorGeometry, floorMaterial);

  loader.load("/models/cat/scene.gltf", (gltf) => {
    gltf.scene.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    gltf.scene.scale.set(3, 3, 3);
    gltf.scene.castShadow = true;
    console.log(gltf.scene);
    scene.add(gltf.scene);
    mixer = new AnimationMixer(gltf.scene);
    gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
  });

  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    if (mixer) mixer.update(delta);
    controls.update();

    renderer.render(scene, camera);
  }

  directionalLight.position.set(0, 5, 0);
  directionalLight.castShadow = true;

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.setSize(window.innerWidth, window.innerHeight);

  sphere.position.set(0, 1, 0);

  // floor.rotateX(-Math.PI / 2);
  floor.position.set(0, -0.125, 0);
  floor.receiveShadow = true;

  camera.position.set(0, 3, 6);
  camera.lookAt(0, 0, 0);

  scene.background = new Color(0x5a88d5);

  scene.add(directionalLight);
  scene.add(floor);
  scene.add(ambientLight);
  // scene.add(sphere);

  element.appendChild(renderer.domElement);

  animate();
}

main();
