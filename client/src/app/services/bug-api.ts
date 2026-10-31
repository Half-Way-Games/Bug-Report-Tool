import {inject, Service } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {BugReportDetail, BugReportListItem} from '../models/bug-report';
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

  async getBugById(id: string): Promise<BugReportDetail | null>{
    try {
      const response = await lastValueFrom(
        this.http.get<{ bug: BugReportDetail }>(`${this.apiUrl}/${id}`)
      );

      return response.bug;
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 404) {
        return null;
      }

      throw error;
    }
  }
}
