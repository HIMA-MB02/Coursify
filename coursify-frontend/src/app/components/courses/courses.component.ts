import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/models/course.model';
import { Router } from '@angular/router';
import { CourseService } from 'src/app/services/course.service';
import { transition, trigger, state, style, animate } from '@angular/animations';
import { Candidate } from 'src/app/models/candidate.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void',
        style({ opacity: 0 })), transition('void <=> *', animate(500))
    ])
  ]
})
export class CoursesComponent implements OnInit {

  candidates: Candidate[];
  courses: Course[];
  constructor(private router: Router, private courseService: CourseService) { }

  ngOnInit() {
    let attribute = {};
    this.courseService.getCourses().subscribe(
      (data: any) => {
        this.courses = data.courses;
        console.log(data.message);
      }, err => {
        console.log(err.stack);
      }
    )

  }
  editCourse(_id: string) {
    this.router.navigate(['/admin/edit-course', _id]);
  }

  deleteCourse(course: Course): void {
    Swal.fire({
      title: 'Are you sure you want to delete this course?',
      text: "This will also unlink all the subscribed candidates to the course!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      backdrop: "rgba( 97,137,47, 0.45)",
      background: "rgb(34, 38, 41)",
    }).then((result) => {
      if (result.value) {
        this.courseService.deleteCourse(course._id).subscribe(
          data => {
            this.courses = this.courses.filter(u => u !== course);
          }
        );
        Swal.fire({
          type: 'success',
          title: 'Course DELETED!',
          showConfirmButton: false,
          timer: 700,
          backdrop: "rgba( 97,137,47, 0.45)",
          background: "rgb(34, 38, 41)"
        }
        )
      }
    })
  }

  sort(attribute: string) {
    this.courseService.sortCourse(attribute).subscribe((data: any) => {
      console.log(data);
      this.courses = data.courses;
    }, err => {
      console.log(err.stack);
    })
  }

  expandCourse(course: Course) {
    this.router.navigate(['/admin/course-details', course._id]);
  }
}
