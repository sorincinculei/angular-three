import { Component, OnInit } from '@angular/core';

import { ThreeService } from './service/three.service'
import * as phrase from '../assets/data/data.json';
import * as font from '../assets/data/bold.json';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  constructor(private threeService: ThreeService) { }

  ngOnInit() {
    const init = async () => {
      const floortexture = '../assets/textures/grunge-wall-texture.jpeg';
      const skytexture = '../assets/textures/background.jpeg';
      const makeNewspaper = '../assets/textures/whatsapp_map.jpeg';

      const width = 400
      const height = 400
      const depth = 12

      await this.threeService.init3D();
      this.threeService.makePhrase(phrase, font);
      this.threeService.makeFloor(floortexture);
      this.threeService.makeSky(skytexture);
      this.threeService.makeNewspaper(width, height, depth, makeNewspaper);
    }
    
    init()
  }

}
