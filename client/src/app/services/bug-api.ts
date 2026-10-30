import {inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BugReportListItem} from '../models/bug-report';
import { lastValueFrom } from "rxjs";

@Service()
export class BugAPI {
  private http = inject(HttpClient);
  private apiUrl = '/api/bugs';

  async getBugsList(){
      const response = await lastValueFrom(
        this.http.get<{ bugs: BugReportListItem[] }>(this.apiUrl)
      );

      return response.bugs;
  }
}
