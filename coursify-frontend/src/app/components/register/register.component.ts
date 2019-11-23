import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ROOT, COURSE_ADMIN, CANDIDATE_ADMIN } from '../../guards/roles';
import { transition, trigger, state, style, animate } from '@angular/animations';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void',
        style({ opacity: 0 })), transition('void <=> *', animate(500))
    ])
  ]
})
export class RegisterComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
    private router: Router, private adminService: AdminService) { }

  addForm: FormGroup;
  ngOnInit() {
    this.addForm = this.formBuilder.group({
      _id: [],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      secretKey: ['', [Validators.required]],
      role: ['', [Validators.required]]
    });
  }

  onSubmit() {
    console.log(this.addForm.getRawValue());
    if (this.addForm.invalid) {
      return;
    }
    if (this.addForm.controls.password.value === this.addForm.controls.confirmPassword.value) {
      let result = {
        "firstName": this.addForm.controls.firstName.value,
        "lastName": this.addForm.controls.lastName.value,
        "email": this.addForm.controls.email.value,
        "password": this.addForm.controls.password.value,
        "role": this.addForm.controls.role.value,
        "secretKey": this.addForm.controls.secretKey.value
      }
      this.adminService.registerAdmin(result).subscribe((data: any) => {
        Swal.fire({
          type: 'success',
          title: `${data.msg}`,
          showConfirmButton: false,
          timer: 900,
          //134, 194, 50  --> primary Grreen
          backdrop: "rgba( 97,137,47, 0.45)",
          background: "rgb(34, 38, 41)",
        });
      })

    } else {
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: 'Passwords do not match!!',
        backdrop: "rgba( 97,137,47, 0.45)",
        background: "rgb(34, 38, 41)",
      }).then(result => {
        return;
      })
    }
    Swal.fire({
      type: 'success',
      title: `Registeration Successful!`,
      showConfirmButton: false,
      timer: 900,
      //134, 194, 50  --> primary Grreen
      backdrop: "rgba( 97,137,47, 0.45)",
      background: "rgb(34, 38, 41)",
    });

    this.router.navigate(['site/login'])

  }

}
