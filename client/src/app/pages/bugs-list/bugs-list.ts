import { Component, inject, OnInit, signal } from '@angular/core';
import {BugAPI} from '../../services/bug-api';
import {BugReportListItem} from '../../models/bug-report';
import { DatePipe } from "@angular/common";
import { RouterLink } from "@angular/router";
import {Title} from '@angular/platform-browser';

@Component({
  imports: [DatePipe, RouterLink],
  selector: 'app-bugs-list',
  styleUrl: './bugs-list.css',
  templateUrl: './bugs-list.html',
})
export class BugsList implements OnInit{
  private bugApiService = inject(BugAPI);
  protected readonly bugs = signal<BugReportListItem[]>([]);
  protected readonly error = signal<string | null>(null);

  constructor(private titleService: Title) {
    this.titleService.setTitle('Bugs List - Bug Report Tool');
  }

  async ngOnInit() {
    try {
      this.bugs.set(await this.bugApiService.getBugsList());
    } catch (error) {
      console.error(error);
      this.error.set('Failed to load bugs list.');
    }
  }
}
