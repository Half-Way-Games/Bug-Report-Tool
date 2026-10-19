import { NgOptimizedImage } from "@angular/common";
import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {LucideLayoutDashboard, LucideBug, LucideArrowRightFromLine, LucideArrowLeftFromLine} from '@lucide/angular';

@Component({
  imports: [RouterLink, RouterLinkActive, RouterOutlet, NgOptimizedImage, LucideLayoutDashboard, LucideBug, LucideArrowRightFromLine, LucideArrowLeftFromLine],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  sidebarCollapsed = false

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
