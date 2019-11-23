import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/services/course.service';
import { Course } from 'src/app/models/course.model';
import { Candidate } from 'src/app/models/candidate.model';
import { CandidateService } from 'src/app/services/candidate.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void',
        style({ opacity: 0 })), transition('void <=> *', animate(500))
    ])
  ]
})
export class CourseDetailsComponent implements OnInit {

  candidates: Candidate[];
  courseID: string;
  course: Course;
  constructor(private candidateService: CandidateService,private route: ActivatedRoute, private courseService: CourseService, private router: Router) {
    this.route.params.subscribe(params => {
      this.courseID = params['id'];
    });
  }

  ngOnInit() {
    //Get the Course from CourseID supplied
    this.courseService.getCourseById(this.courseID).subscribe(data => {
      this.course = data;
      //Get List of Candidates associated to this course
      this.courseService.getCandidates(this.course).subscribe((data: any) => {
        console.log(data.candidates);
        this.candidates = data.candidates;
      }, err => {
        console.log(err.stack);
      });
    }, err => {
      console.log(err);
    });
  }

  deleteCandidate(candidate: Candidate): void {
    this.candidateService.deleteCandidate(candidate._id).subscribe(
      data => {
        this.candidates = this.candidates.filter(u => u !== candidate);
      }
    );
  }

  viewCandidates(candidate: Candidate): void {
    localStorage.setItem("courseDetails", this.courseID);
    this.router.navigate(['/admin/candidate-view', candidate._id]);
  }

  sort(attribute: string) {
    console.log(attribute);
    this.candidateService.sortCandidates(attribute).subscribe((data: any) => {
      console.log(data.candidates)
      this.candidates = data.candidates;
    }, err => {
      console.log(err.stack);
    })
  }

}
