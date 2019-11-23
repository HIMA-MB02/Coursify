import { Course } from './course.model';

export class Candidate {
    _id: string;
    firstName: string;
    lastName: string;
    age: number;
    courses: Course[];
}