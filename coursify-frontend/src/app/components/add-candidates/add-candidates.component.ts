import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CandidateService } from 'src/app/services/candidate.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Candidate } from 'src/app/models/candidate.model';
import { CourseService } from 'src/app/services/course.service';
import { Course } from 'src/app/models/course.model';
import { transition, trigger, state, style, animate } from '@angular/animations';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-candidates',
  templateUrl: './add-candidates.component.html',
  styleUrls: ['./add-candidates.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void',
        style({ opacity: 0 })), transition('void <=> *', animate(500))
    ])
  ]
})
export class AddCandidatesComponent implements OnInit {

  courses: Course[] = [];
  addForm: FormGroup;
  submitted: boolean = false;
  data: Object;
  candidate: Candidate;
  courseOptions: Course[];
  candidateID: number;
  selectedCourseID: string;

  constructor(private courseService: CourseService, private router: Router, private candidateService: CandidateService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      _id: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      age: ['', [Validators.required]],
      course: ['', [Validators.required]]
    });
    this.courseService.getCourses().subscribe(
      (data: any) => {
        let temp = new Course();
        temp.courseName = "Select Course";
        this.courseOptions = data.courses.filter(item => (item.isActive == true));
        this.courseOptions.push(temp);
      }, err => {
        console.log(err.stack);
      }
    );
  }


  onSubmit() {
    this.submitted = true;
    // if (this.addForm.invalid) {
    //   return;
    // }
    this.candidate = new Candidate();
    this.candidate.firstName = this.addForm.controls.firstName.value;
    this.candidate.lastName = this.addForm.controls.lastName.value;
    this.candidate.age = this.addForm.controls.age.value;
    this.candidate.courses = this.courses;
    console.log(this.candidate)
    this.candidateService.createCandidate(this.candidate).subscribe(
      data => {
        alert('Record Added Successfuly!');
        this.router.navigate(['/admin/candidates']);
      }, err => {
        console.log(err.stack);
      });

  }

  addCourseToCandidate() {
    console.log(this.selectedCourseID);
    if (this.courses.find(course => course._id === this.selectedCourseID) == null && this.courses.length <= 3)
      this.courses.push(this.courseOptions.find(course => course._id === this.selectedCourseID));
    else if(this.courses.length >=3) {
       //ADDED COURSE MESSAGE (---SWAL2---)
       Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: 'Candidate can subscribe to a maximum of three courses!',
        backdrop: "rgba( 97,137,47, 0.45)",
        background: "rgb(34, 38, 41)",
      })
    }else {
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: 'Candidate has already subscribed to this course!',
        backdrop: "rgba( 97,137,47, 0.45)",
        background: "rgb(34, 38, 41)",
      })
    }
  }


  deleteCandidateCourse(course: Course) {
    this.courses = this.courses.filter(item => item._id != course._id);
  }
}
