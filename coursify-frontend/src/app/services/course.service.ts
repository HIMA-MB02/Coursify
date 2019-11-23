import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private http: HttpClient) { }
  baseUrl: string = "http://localhost:3000/courses";

  getCourses() {
    return this.http.get<Course[]>(this.baseUrl);
  }

  getCourseById(id: string) {
    return this.http.get<Course>(this.baseUrl + '/' + id);
  }

  createCourse(course: Course) {
    console.log(course);
    return this.http.post(this.baseUrl, course);
  }

  updateCourse(course:Course) {
    console.log(course._id);
    return this.http.put(this.baseUrl +'/'+ course._id , course);
  }

  deleteCourse(id:string) {
    return this.http.delete(this.baseUrl + "/" + id);
  }

  sortCourse(attribute: string) {
    return this.http.post(this.baseUrl +'/sort', {attribute: attribute});
  }

  getCandidates(course: Course){
    return this.http.post(this.baseUrl + '/getCandidates', {course: course});
  }
}
