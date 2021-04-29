import { Injectable } from '@angular/core';
import { MeshBasicMaterial, BoxBufferGeometry, PlaneBufferGeometry, SphereBufferGeometry, PCFSoftShadowMap, CullFaceFrontBack, PerspectiveCamera, TextureLoader, RepeatWrapping, AmbientLight, DirectionalLight, TextGeometry, MeshStandardMaterial, DoubleSide, Mesh, Scene, WebGLRenderer, Fog, OrbitControls, Vector3, Group, FontLoader } from 'three-full';

import * as _ from 'lodash'

@Injectable({
  providedIn: 'root'
})

export class ThreeService {

  private _renderer: WebGLRenderer;
  private _scene: Scene;
  private _camera: PerspectiveCamera;
  private _controls: OrbitControls;

  constructor() { 
    this._scene = new Scene();
    this._camera = new PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 10000);
    this._renderer = new WebGLRenderer({ antialias: true });
    this._controls = new OrbitControls(this._camera, this._renderer.domElement);
  }

  public makeNewspaper = (width, height, depth, img) => {
    const texture = new TextureLoader().load(img)
    const geometry = new BoxBufferGeometry(width, height, depth)
    const material = new MeshBasicMaterial({
      map: texture,
      color: 0xffffff,
      side: DoubleSide
    })
    const mesh1 = new Mesh(geometry, material);
    mesh1.castShadow = true; 
    mesh1.position.y = height / 2;
    this._scene.add(mesh1)
  }

  public makeSky = (img) => {
    const texture = new TextureLoader().load(img)
    texture.wrapS = texture.wrapT = RepeatWrapping
    texture.repeat.set(5, 5);

    const geometry = new SphereBufferGeometry(4000, 32, 15)
    const material = new MeshBasicMaterial({
      map: texture,
      color: 0xffffff,
      side: DoubleSide
    })

    const mesh1 = new Mesh(geometry, material)
    this._scene.add(mesh1)
  }

  public makeFloor= (img) => {
    const texture = new TextureLoader().load(img)
    texture.wrapS = texture.wrapT = RepeatWrapping
    texture.repeat.set(10, 10);

    const geometry = new PlaneBufferGeometry(4000, 4000)
    const material = new MeshStandardMaterial({
      map: texture,
      color: 0xffffff,
      side: DoubleSide
    })

    const mesh1 = new Mesh(geometry, material);
    mesh1.receiveShadow = true;
    mesh1.rotation.x = -Math.PI / 2
    this._scene.add(mesh1)
  }

  public makePhrase = (phrase, Roboto) => {
    // console.log(phrase.default);

    const font = new FontLoader().parse(Roboto.default)

    const data = phrase.default;
    const size = _.size(data)

    data.forEach((p, index) => {
      console.log(p, index, size, font)
      const startAngle = 2 * index * Math.PI /size
      const title = _.get(p, 'title')
      const vote = _.toString(_.get(p, 'votes'), 0)

      const orginP = new Vector3(250, 0, 0)
      orginP.applyAxisAngle ( new Vector3(0, 1, 0), startAngle )

      const group = new Group();
      const text1 = new TextGeometry(title, {
        font: font,
        size: 30,
        height: 4
      });
      
      const material1 = new MeshStandardMaterial({
        color: 0xffffff,
        side: DoubleSide
      });
      const text2 = new TextGeometry(vote, {
        font: font,
        size: 30,
        height: 4
      });
      const material2 = new MeshStandardMaterial({
        color: 0xffff00,
        side: DoubleSide
      });

      const mesh1 = new Mesh(text1, material1)
      mesh1.position.set(50, 0, 0)
      const mesh2 = new Mesh(text2, material2)
      mesh1.castShadow = true; 
      mesh2.castShadow = true; 

      group.add(mesh1)
      group.add(mesh2)

      group.scale.x = 2
      group.scale.y = 3
      group.scale.z = 2
      group.rotation.y = startAngle
      group.position.copy(orginP)
      this._scene.add(group)
    });
  }

  public init3D() {
    const animate = () => {
      requestAnimationFrame(animate);
      this._renderer.render(this._scene, this._camera);
    }

    const onWindowResize = () => {
      this._camera.aspect = window.innerWidth / window.innerHeight;
      this._camera.updateProjectionMatrix();
      this._renderer.setSize(window.innerWidth, window.innerHeight);
    }

    return new Promise<void>((resolve, reject) => {

      // this._scene.fog = new Fog(0xeeeeee, 300, 900);
      this._camera.position.set(700, 200, -500);

      this._renderer.setSize(window.innerWidth, window.innerHeight);
      this._renderer.setClearColor(0xeeeeee, 1);
      this._renderer.shadowMap.enabled = true;
      this._renderer.shadowMap.type = PCFSoftShadowMap;
      this._renderer.shadowMapCullFace = CullFaceFrontBack;

      const webGlElement = window.document.getElementById("webGL");

      this._scene.add(new AmbientLight(0xffffff, 0.3));
      const light = new DirectionalLight()
      light.castShadow = true;
      light.shadow.camera.top = 5000;
      light.shadow.camera.bottom = - 5000;
      light.shadow.camera.left = - 5000;
      light.shadow.camera.right = 5000;
      light.shadow.mapSize.width = 5000; // default
      light.shadow.mapSize.height = 5000; // default
      light.shadow.camera.far = 10000;
      light.position.set(1000, 1000, 1000)
      this._scene.add(light)
      this._controls.maxPolarAngle = 0.9 * Math.PI / 2
      this._controls.maxDistance = 10000
      this._controls.enablePan = false
      this._controls.update();

      if (webGlElement === null) {
        console.error("Error")
      } else {
        webGlElement.appendChild(this._renderer.domElement);
      }

      window.addEventListener('resize', onWindowResize, false);
      
      animate();
      resolve();
    })
  }
}
