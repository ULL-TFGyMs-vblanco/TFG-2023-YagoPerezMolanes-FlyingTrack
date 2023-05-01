import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>Current Position</h1>
    <p>Latitude: {{ latitude }}</p>
    <p>Longitude: {{ longitude }}</p>
  `
})
export class AppComponent implements OnInit {

  latitude: number | any;
  longitude: number | any;

  constructor() {}

  ngOnInit() {
  }

}

