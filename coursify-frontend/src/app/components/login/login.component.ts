import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { CANDIDATE_ADMIN } from '../../guards/roles';
import { transition, trigger, state, style, animate } from '@angular/animations';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void',
        style({ opacity: 0 })), transition('void <=> *', animate(500))
    ])
  ]
})
export class LoginComponent implements OnInit {

  // Instance Variables-
  // Bydefault public in Typescript
  loginForm: FormGroup;
  submitted: boolean = false;
  invalidLogin: boolean = false;


  // Constructor Dependency Injection
  constructor(private formBuilder: FormBuilder,
    private router: Router, private adminService: AdminService) { }
  // initialising default values to textboxes
  // and configuring validations
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

    // applying multiple validations
    // password: ['', [Validators.required,
    // Validators.min(18)]],  
  }

  // this code will be executed on click of login btn
  onSubmit() {
    //Clear localstorage of home component data
    localStorage.removeItem("setContact");
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    let admin = { email: this.loginForm.controls.email.value, password: this.loginForm.controls.password.value }

    this.adminService.login(admin).subscribe(data => {
      console.log(data);
      if (localStorage.getItem("adminRole") == CANDIDATE_ADMIN) {
        this.router.navigate(['/admin/candidates']);
      } else {
        //LOGGED-IN MESSAGE (---SWAL2---)
        Swal.fire({
          type: 'success',
          title: 'Successfully LoggedIn',
          showConfirmButton: false,
          timer: 900,
          //134, 194, 50  --> primary Grreen
          backdrop: "rgba( 97,137,47, 0.45)",
          background: "rgb(34, 38, 41)",
        })
        this.router.navigate(['/admin']);
      }

    },
      err => {
        alert('User not found');
        console.log(err.stack);
        this.router.navigate(['/login']);
      })

  } // end of onSubmit() function

}
