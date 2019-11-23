import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void',
        style({ opacity: 0 })), transition('void <=> *', animate(500))
    ])
  ]
})
export class SiteComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  setHome() {
    localStorage.setItem('setContact', 'false');
    this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/site/home']);
    });
  }
  setContact() {
    if (localStorage.getItem('setContact') == 'false') {
      localStorage.setItem('setContact', 'true');
    } else if (localStorage.getItem('setContact') == 'true') {
      localStorage.setItem('setContact', 'false');
    }
    this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/site/home']);
    });
  }

}
