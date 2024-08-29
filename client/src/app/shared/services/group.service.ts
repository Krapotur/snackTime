import {inject, Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Group} from "../interfaces";

@Injectable({
  providedIn: "root"
})

export class GroupService {
  private http = inject(HttpClient)

  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>('/api/groups')
  }

}
