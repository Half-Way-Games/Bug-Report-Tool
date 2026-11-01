import {Component, HostListener, inject, Input, OnInit, signal} from '@angular/core';
import {CollapsibleCard} from '../../components/collapsible-card/collapsible-card';
import {JsonValueComponent} from '../../components/json-value-component/json-value-component';
import {BugReportDetail, JsonValue} from '../../models/bug-report';
import {BugAPI} from '../../services/bug-api';
import {DatePipe} from '@angular/common';
import {MarkdownComponent} from 'ngx-markdown';
import {Title} from '@angular/platform-browser';

@Component({
  imports: [
    CollapsibleCard, JsonValueComponent, DatePipe, MarkdownComponent
  ],
  selector: 'app-bugs-detail',
  styleUrl: './bugs-detail.css',
  templateUrl: './bugs-detail.html',
})
export class BugsDetail implements OnInit{
  @Input() id!: string;
  private bugApiService = inject(BugAPI);
  protected screenshotOpen = false;

  protected readonly bug = signal<BugReportDetail | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  constructor(private titleService: Title) {}

  async ngOnInit() {
    this.titleService.setTitle(`Bug ${this.id} - Bug Report Tool`);
    try {
      this.loading.set(true);
      this.error.set(null);

      this.bug.set(await this.bugApiService.getBugById(this.id));
    } catch (error) {
      console.error(error);
      this.error.set('Failed to load bug details.');
    } finally {
      this.loading.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  closeScreenshot(): void {
    this.screenshotOpen = false;
  }

  get diagnosticEntries(): [string, JsonValue][] {
    const bug = this.bug();
    return bug ? Object.entries(bug.payloadData) : [];
  }

  get rawPayloadJson(): string {
    const bug = this.bug();
    return bug ? JSON.stringify(bug.rawPayload, null, 2) : '';
  }
}
