import { Observable } from 'rxjs';
import { Dog, Food } from './model';
import { cold } from 'jest-marbles';
import { calli, fay, lucky, wastl } from './dogs';
import { chicken, minerals, turkey, veggies } from './foods';

export function getAllDogs(): Observable<Dog> {
    return cold('--f--c----lw|', {f: fay, c: calli, l: lucky, w: wastl})
}

export function getMealSources(): Observable<Food> {
    return cold('-t---m---v--c|', {t: turkey, m: minerals, v: veggies, c: chicken})

}
