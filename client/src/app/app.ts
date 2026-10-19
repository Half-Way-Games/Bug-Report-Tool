import { NgOptimizedImage } from "@angular/common";
import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {LucideLayoutDashboard, LucideBug} from '@lucide/angular';

@Component({
  imports: [RouterLink, RouterLinkActive, RouterOutlet, NgOptimizedImage, LucideLayoutDashboard, LucideBug],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {

}
