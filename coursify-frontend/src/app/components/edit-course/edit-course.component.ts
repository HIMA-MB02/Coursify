import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CourseService } from 'src/app/services/course.service';
import { Course } from 'src/app/models/course.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css']
})
export class EditCourseComponent implements OnInit {

  addForm: FormGroup;
  submitted: boolean = false;
  tempCourse: Course;
  courseID: string;

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private courseService: CourseService, private router: Router) {
    this.route.params.subscribe(params => {
      this.courseID = params['id'];
      console.log(this.courseID);
    });
  }

  ngOnInit() {
    if (this.courseID != null) {

      if (!this.courseID) {
        alert('Invalid Action');
        this.router.navigate(['admin-view']);
        return;
      }
      this.addForm = this.formBuilder.group({
        _id: [this.courseID],
        courseName: ['', [Validators.required]],
        domainName: ['', [Validators.required]],
        startDate: ['', [Validators.required]],
        trainerName: ['', [Validators.required]],
        isActive: ['', [Validators.required]]
      });
      this.courseService.getCourseById(this.courseID).subscribe(data => {
        this.addForm.setValue(data);
      })
    } else {
      this.router.navigate(['/home']);
    }
  }

  onSubmit() {
    console.log("Hiam");
    this.submitted = true;
    // if (this.addForm.invalid) {
    //   return;
    // }
    this.tempCourse = new Course();
    this.tempCourse = this.addForm.getRawValue();

    if (this.addForm.controls.isActive.value == 'true') {
      this.tempCourse.isActive = true;
    } else {
      this.tempCourse.isActive = false;
    }
    console.log(this.tempCourse)
    this.courseService.updateCourse(this.tempCourse).subscribe(
      data => {
        //SAVED COURSE MESSAGE (---SWAL2---)
        Swal.fire({
          type: 'success',
          title: 'Course Updated!',
          showConfirmButton: false,
          timer: 700,
          backdrop: "rgba( 97,137,47, 0.45)",
          background: "rgb(34, 38, 41)",
        })
        this.router.navigate(['/admin']);
      }, err => {
        console.log(err.stack);
      });

  }


}
