import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JsonValueComponent } from './json-value-component';

describe('JsonValueComponent', () => {
  let component: JsonValueComponent;
  let fixture: ComponentFixture<JsonValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonValueComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JsonValueComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
