import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { AdminViewComponent } from './components/admin-view/admin-view.component';
import { CoursesComponent } from './components/courses/courses.component';
import { AddCourseComponent } from './components/add-course/add-course.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { CandidatesComponent } from './components/candidates/candidates.component';
import { AddCandidatesComponent } from './components/add-candidates/add-candidates.component';
import { CandidateViewComponent } from './components/candidate-view/candidate-view.component';
import { EditCourseComponent } from './components/edit-course/edit-course.component';
import { SiteComponent } from './components/site/site.component';
import { CourseDetailsComponent } from './components/course-details/course-details.component';
import { AdministratorsComponent } from './components/administrators/administrators.component';
import { RegisterComponent } from './components/register/register.component';
import { AboutComponent } from './components/about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    AdminViewComponent,
    CoursesComponent,
    AddCourseComponent,
    CandidatesComponent,
    AddCandidatesComponent,
    CandidateViewComponent,
    EditCourseComponent,
    SiteComponent,
    CourseDetailsComponent,
    AdministratorsComponent,
    RegisterComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,   // for HttpClient service
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
