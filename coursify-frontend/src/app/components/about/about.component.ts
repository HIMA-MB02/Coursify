import { Component, OnInit } from '@angular/core';
import { transition, trigger, state, style, animate } from '@angular/animations';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void',
        style({ opacity: 0 })), transition('void <=> *', animate(500))
    ])
  ]
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
