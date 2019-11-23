import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Candidate } from '../models/candidate.model';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  constructor(private http: HttpClient) { }
  baseUrl: string = "http://localhost:3000/candidates";

  getCandidates() {
    return this.http.get<Candidate[]>(this.baseUrl);
  }

  getCandidateById(id: string) {
    return this.http.get<Candidate>(this.baseUrl + '/' + id);
  }

  createCandidate(candidate: Candidate) {
    console.log(candidate);
    return this.http.post(this.baseUrl, candidate);
  }

  updateCandidate(candidate:Candidate) {
    console.log(candidate.firstName);
    return this.http.put(this.baseUrl +'/'+ candidate._id , candidate);
  }

  deleteCandidate(id:string) {
    return this.http.delete(this.baseUrl + "/" + id);
  }
  sortCandidates(attribute: string) {
    return this.http.post(this.baseUrl +'/sort', {attribute: attribute});
  }
}
