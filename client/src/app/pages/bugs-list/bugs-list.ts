import { Component, inject, OnInit, signal } from '@angular/core';
import {BugAPI} from '../../services/bug-api';
import {BugReportListItem} from '../../models/bug-report';
import { DatePipe } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  imports: [DatePipe, RouterLink],
  selector: 'app-bugs-list',
  styleUrl: './bugs-list.css',
  templateUrl: './bugs-list.html',
})
export class BugsList implements OnInit{
  private bugApiService = inject(BugAPI);
  protected readonly bugs = signal<BugReportListItem[]>([]);


  async ngOnInit() {
    this.bugs.set(await this.bugApiService.getBugsList());
  }
}
