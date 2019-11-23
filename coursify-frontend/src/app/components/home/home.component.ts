import { Component, OnInit } from '@angular/core';
import { transition, trigger, state, style, animate } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void',
        style({ opacity: 0 })), transition('void <=> *', animate(500))
    ])
  ]
})


export class HomeComponent implements OnInit {

  isContact: boolean = false;
  isHome: boolean = true;
  constructor() { }

  ngOnInit() {
    var setContact = localStorage.getItem("setContact");
    if(setContact != null) {
      if(setContact == "true") {
        this.isHome = true;
        this.isContact = true;
      } else if(setContact == "false"){
        this.isHome = true;
        this.isContact = false;
      }
    }
  }

}
