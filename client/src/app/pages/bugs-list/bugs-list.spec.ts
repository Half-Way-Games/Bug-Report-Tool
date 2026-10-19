import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BugsList } from './bugs-list';

describe('BugsList', () => {
  let component: BugsList;
  let fixture: ComponentFixture<BugsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BugsList],
    }).compileComponents();

    fixture = TestBed.createComponent(BugsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
