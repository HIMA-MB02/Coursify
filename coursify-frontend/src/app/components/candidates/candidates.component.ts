import { Component, OnInit } from '@angular/core';
import { transition, trigger, state, style, animate } from '@angular/animations';
import { Candidate } from 'src/app/models/candidate.model';
import { Router } from '@angular/router';
import { CandidateService } from 'src/app/services/candidate.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-candidates',
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void',
        style({ opacity: 0 })), transition('void <=> *', animate(500))
    ])
  ]
})
export class CandidatesComponent implements OnInit {

  candidates: Candidate[];
  constructor(private router: Router, private candidateService: CandidateService) { }

  ngOnInit() {

    this.candidateService.getCandidates().subscribe(
      (data: any) => {
        this.candidates = data.candidates;
      }, err => {
        console.log(err.stack);
      }
    )


  }
  deleteCandidate(candidate: Candidate): void {
    Swal.fire({
      title: 'Are you sure you want to delete this candidate?',
      text: "This will also unlink the candidate from all subscribed courses!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!', 
      backdrop: "rgba( 97,137,47, 0.45)",
      background: "rgb(34, 38, 41)",
    }).then((result) => {
      if (result.value) {
        this.candidateService.deleteCandidate(candidate._id).subscribe(
          data => {
            this.candidates = this.candidates.filter(u => u !== candidate);
          }
        );
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

  viewCandidates(candidate: Candidate): void {
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
