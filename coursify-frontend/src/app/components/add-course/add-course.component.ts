import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/models/course.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CourseService } from 'src/app/services/course.service';
import { Router } from '@angular/router';
import { transition, trigger, state, style, animate } from '@angular/animations';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void',
        style({ opacity: 0 })), transition('void <=> *', animate(500))
    ])
  ]
})
export class AddCourseComponent implements OnInit {

  tempCourse: Course;
  courses: Course[];
  addForm: FormGroup;
  submitted: boolean = false;

  constructor(private formBuilder: FormBuilder, private courseService: CourseService, private router: Router) { }

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      _id: [],
      courseName: ['', [Validators.required]],
      domainName: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      trainerName: ['', [Validators.required]],
      isActive: ['', [Validators.required]]
    });
  }

  onSubmit() {
    console.log("Hiam");
    this.submitted = true;
    // if (this.addForm.invalid) {
    //   return;
    // }
    this.tempCourse = new Course();
    this.tempCourse.courseName = this.addForm.controls.courseName.value;
    this.tempCourse.domainName = this.addForm.controls.domainName.value;
    this.tempCourse.startDate = this.addForm.controls.startDate.value;
    this.tempCourse.trainerName = this.addForm.controls.trainerName.value;
    if (this.addForm.controls.isActive.value == 'true') {
      this.tempCourse.isActive = true;
    } else {
      this.tempCourse.isActive = false;
    }

    console.log(this.tempCourse);
    console.log('true');
    this.courseService.createCourse(this.tempCourse).subscribe(
      data => {
        //ADDED COURSE MESSAGE (---SWAL2---)
        Swal.fire({
          type: 'success',
          title: 'Course Added Successfully!',
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
