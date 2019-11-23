import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { Admin } from 'src/app/models/admin.model';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { COURSE_ADMIN, CANDIDATE_ADMIN } from 'src/app/guards/roles';
import { Route, Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-administrators',
  templateUrl: './administrators.component.html',
  styleUrls: ['./administrators.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void',
        style({ opacity: 0 })), transition('void <=> *', animate(500))
    ])
  ]
})
export class AdministratorsComponent implements OnInit {

  administrators: Admin[];
  keyForm: FormGroup;
  submitted = false;


  constructor(private router: Router, private adminService: AdminService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.adminService.getAdministrators().subscribe((data: any) => {
      this.administrators = data.administrators;
      console.log(this.administrators)
    });
    this.keyForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      role: ['', [Validators.required]]
    });
  }

  deleteAdministrator(admin: Admin) {
    Swal.fire({
      title: 'Are you sure you want to delete this administrator?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      backdrop: "rgba( 97,137,47, 0.45)",
      background: "rgb(34, 38, 41)",
    }).then((result) => {
      if (result.value) {
        this.adminService.deleteAdministrator(admin._id).subscribe(data => {
          this.administrators = this.administrators.filter(a => a !== admin);
        });
        Swal.fire({
          type: 'success',
          title: `DELETED!`,
          showConfirmButton: false,
          timer: 700,
          backdrop: "rgba( 97,137,47, 0.45)",
          background: "rgb(34, 38, 41)",
        })
      }
    })
  }
  sort(attribute: string) {
    this.adminService.sortAdministrators(attribute).subscribe((data: any) => {
      console.log(data);
      this.administrators = data.administrators;
    }, err => {
      console.log(err.stack);
    })
  }
  onSubmit() {
    this.submitted = true;
    let role = "";
    if (this.keyForm.controls.role.value == COURSE_ADMIN) {
      role = "Course Administrator";
    } else if (this.keyForm.controls.role.value == CANDIDATE_ADMIN) {
      role = "Candidate Administrator";
    }
    let credentials = {
      to: this.keyForm.controls.email.value,
      role: role
    }
    for (var admin of this.administrators) {
      if (admin.email == credentials.to) {
        Swal.fire({
          type: 'error',
          title: 'Admininstrator Exists!',
          text: 'Duplicate OTP Generation!',
          backdrop: "rgba( 97,137,47, 0.45)",
          background: "rgb(34, 38, 41)",
        }).then(result => {
        })
        return;
      }
    }
    console.log(credentials);
    this.adminService.sendEmail(credentials).subscribe((data: any) => {
      console.log(data.message);
      Swal.fire({
        type: 'success',
        title: `Email has been sent!`,
        showConfirmButton: true,
        //134, 194, 50  --> primary Grreen
        backdrop: "rgba( 97,137,47, 0.45)",
        background: "rgb(34, 38, 41)",
      }).then((result) => {

        window.location.reload();
      });
    }, err => {
      console.log(err.stack);
    })
  }
}
