import { Component, Input, forwardRef } from '@angular/core';
import {JsonValue} from '../../models/bug-report';

@Component({
  imports: [],
  selector: 'app-json-value-component',
  styleUrl: './json-value-component.css',
  templateUrl: './json-value-component.html',
})
export class JsonValueComponent {
  @Input({required: true}) value!: JsonValue;

  isObject(value: JsonValue): value is {[key: string]: JsonValue} {
    return (
      value !== null && typeof value === 'object' && !Array.isArray(value)
    );
  }

  isArray(value: JsonValue): value is JsonValue[] {
    return Array.isArray(value);
  }

  entries(value: {[key: string]: JsonValue}): [string, JsonValue][] {
    return Object.entries(value);
  }

  formatPrimitive(value: string | number | boolean | null): string {
    return value === null ? 'null' : String(value);
  }
}
