import { Component, OnInit } from '@angular/core';
import { transition, trigger, state, style, animate, group } from '@angular/animations';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { CANDIDATE_ADMIN, ROOT, COURSE_ADMIN } from '../../guards/roles';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void',
        style({ opacity: 0 })), transition('void <=> *', animate(500))
    ])
  ]
})

export class AdminViewComponent implements OnInit {

  isCourse: boolean = false;
  currentAdmin;
  isCandidate: boolean = false;
  isRoot: boolean = false;
  constructor(private router: Router, private adminService: AdminService) {

  }

  ngOnInit() {
    this.currentAdmin = JSON.parse(localStorage.getItem('admin')).admin;
    console.log(this.currentAdmin);
    switch (this.currentAdmin.role) {
      case ROOT:
        this.currentAdmin.role = "ROOT"
        break;
      case COURSE_ADMIN:
        this.currentAdmin.role = "COURSE"
        break;
      case CANDIDATE_ADMIN:
        this.currentAdmin.role = "CANDIDATE"
        break;
      default:
        this.currentAdmin.role = "UNAUTHORIZED"
        break;
    }
    switch (localStorage.getItem('adminRole')) {
      case ROOT:
        this.isRoot = true
        break;
      case COURSE_ADMIN:
        this.isCourse = true
        break;
      case CANDIDATE_ADMIN:
        this.isCandidate = true
        break;
      default:
        break;
    }
  }

  setCourses(): void {
    this.router.navigate(['admin/courses']);
  }
  setCandidates(): void {
    this.router.navigate(['admin/candidates']);
  }
  logOutUser(): void {
    Swal.fire({
      type: 'error',
      title: 'Log Out?',
      text: 'Leaving so soon?',
      confirmButtonText: 'Yes, log me out!',
      backdrop: "rgba( 97,137,47, 0.45)",
      background: "rgb(34, 38, 41)",
    }).then(result => {
      this.adminService.logOut();
      this.router.navigate(['/home']);
    });
  }
  setAdministrators(): void {
    this.router.navigate(['admin/administrators']);
  }
}