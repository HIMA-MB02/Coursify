import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AdminViewComponent } from './components/admin-view/admin-view.component';
import { CoursesComponent } from './components/courses/courses.component';
import { AddCourseComponent } from './components/add-course/add-course.component';
import { CandidatesComponent } from './components/candidates/candidates.component';
import { AddCandidatesComponent } from './components/add-candidates/add-candidates.component';
import { CandidateViewComponent } from './components/candidate-view/candidate-view.component';
import { EditCourseComponent } from './components/edit-course/edit-course.component';
import { AppGuard } from './guards/app.guard';
import { SiteComponent } from './components/site/site.component';
import { LoginComponent } from './components/login/login.component';
import { CourseDetailsComponent } from './components/course-details/course-details.component';
import { ROOT, COURSE_ADMIN, CANDIDATE_ADMIN } from './guards/roles';
import { AdministratorsComponent } from './components/administrators/administrators.component';
import { RegisterComponent } from './components/register/register.component';
import { AboutComponent } from './components/about/about.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'site',
    pathMatch: 'full'
  },
  {
    path: 'site',
    component: SiteComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      { path: 'login', component: LoginComponent },
      { path: 'about', component: AboutComponent },
      { path: 'register', component: RegisterComponent },
      { path: '**', component: HomeComponent }
    ]

  },
  {
    path: 'admin',
    component: AdminViewComponent,
    children: [
      { path: '', component: CoursesComponent, canActivate: [AppGuard], data: { roles: [ROOT, COURSE_ADMIN] } },
      { path: 'courses', component: CoursesComponent, canActivate: [AppGuard], data: { roles: [ROOT, COURSE_ADMIN] } },
      { path: 'add-course', component: AddCourseComponent, canActivate: [AppGuard], data: { roles: [ROOT, COURSE_ADMIN] } },
      { path: 'edit-course/:id', component: EditCourseComponent, canActivate: [AppGuard], data: { roles: [ROOT, COURSE_ADMIN] } },
      { path: 'course-details/:id', component: CourseDetailsComponent, canActivate: [AppGuard], data: { roles: [ROOT, CANDIDATE_ADMIN] } },
      { path: 'candidates', component: CandidatesComponent, canActivate: [AppGuard], data: { roles: [ROOT, CANDIDATE_ADMIN] } },
      { path: 'add-candidates', component: AddCandidatesComponent, canActivate: [AppGuard], data: { roles: [ROOT, CANDIDATE_ADMIN] } },
      { path: 'candidate-view/:id', component: CandidateViewComponent, canActivate: [AppGuard], data: { roles: [ROOT, CANDIDATE_ADMIN] }, },
      { path: 'administrators', component: AdministratorsComponent, canActivate: [AppGuard], data: { roles: [ROOT] } },
      { path: '**', component: CoursesComponent, canActivate: [AppGuard], data: { roles: [ROOT] } }
    ]
  },
  {
    path: '**',
    redirectTo: 'site',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
