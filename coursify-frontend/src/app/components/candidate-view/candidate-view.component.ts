import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Candidate } from 'src/app/models/candidate.model';
import { CandidateService } from 'src/app/services/candidate.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Course } from 'src/app/models/course.model';
import { CourseService } from 'src/app/services/course.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-candidate-view',
  templateUrl: './candidate-view.component.html',
  styleUrls: ['./candidate-view.component.css']
})
export class CandidateViewComponent implements OnInit {

  courses: Course[];
  viewForm: FormGroup;
  submitted: boolean = false;
  data: Object;
  candidate: Candidate;
  courseOptions: Course[] = new Array<Course>();
  candidateID: string;
  selectedCourseID: string;


  constructor(private courseService: CourseService, private formBuilder: FormBuilder,
    private candidateService: CandidateService,
    private router: Router,
    private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.candidateID = params['id'];
    });
    console.log(this.candidateID);
  }

  ngOnInit() {
    if (this.candidateID != null) {
      if (!this.candidateID) {
        alert('Invalid Action');
        this.router.navigate(['admin-view']);
        return;
      }
      this.viewForm = this.formBuilder.group({
        _id: [this.candidateID],
        firstName: [{ value: '', disabled: true }, Validators.required],
        lastName: [{ value: '', disabled: true }, Validators.required],
        age: ['', Validators.required],
        courses: ['']
      });
      this.courseService.getCourses().subscribe(
        (data: any) => {
          console.log(data);
          var temp = new Course();
          temp.courseName = "Select Course";
          this.courseOptions = data.courses.filter(item => (item.isActive == true));
          this.courseOptions.push(temp);

          console.log(this.courseOptions);
        }, err => {
          console.log(err.stack);
        }
      );
      this.candidateService.getCandidateById(this.candidateID).subscribe(data => {
        this.viewForm.setValue(data);
        this.courses = data.courses;
      });
    }
    else {
      this.router.navigate(['/home']);
    }
  }

  deleteCandidateCourse(course: Course) {
    this.courses = this.courses.filter(item => item._id != course._id);
  }
  onSubmit() {
    this.submitted = true;
    // if(this.viewForm.invalid) {
    //   return;
    // }
    this.candidate = new Candidate();
    this.candidate = this.viewForm.getRawValue();
    this.candidate.courses = this.courses;
    this.candidateService.updateCandidate(this.candidate).subscribe(data => {
      //ADDED COURSE MESSAGE (---SWAL2---)
      Swal.fire({
        type: 'success',
        title: `${this.viewForm.controls.firstName.value} ${this.viewForm.controls.lastName.value}<br />UPDATED!`,
        showConfirmButton: false,
        timer: 700,
        backdrop: "rgba( 97,137,47, 0.45)",
        background: "rgb(34, 38, 41)",
      })
      //alert(this.viewForm.controls.firstName.value + '  record is updated successfully..!');
      this.router.navigate(['admin/candidates']);
    }, error => {
      console.log(error.stack);
    });
  }


  addCourseToCandidate() {
    if (this.courses.find(course => course._id == this.selectedCourseID) == null && (this.courses.length < 3))
      this.courses.push(this.courseOptions.find(course => course._id == this.selectedCourseID));
    else if (this.courses.length >= 3) {
      //ADDED COURSE MESSAGE (---SWAL2---)
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: 'Candidate can subscribe to a maximum of three courses!',
        backdrop: "rgba( 97,137,47, 0.45)",
        background: "rgb(34, 38, 41)",
      })
    } else {
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: 'Candidate has already subscribed to this course!',
        backdrop: "rgba( 97,137,47, 0.45)",
        background: "rgb(34, 38, 41)",
      })
    }
  }

  routeCancel() {
    let courseID = localStorage.getItem("courseDetails");
    if (courseID != null) {
      localStorage.removeItem("courseDetails");
      this.router.navigate(['admin/course-details', courseID]);
    } else {
      this.router.navigate(['/admin/candidates']);
    }


  }
}
