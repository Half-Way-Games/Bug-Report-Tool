import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CollapsibleCard } from './collapsible-card';

describe('CollapsibleCard', () => {
  let component: CollapsibleCard;
  let fixture: ComponentFixture<CollapsibleCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollapsibleCard],
    }).compileComponents();

    fixture = TestBed.createComponent(CollapsibleCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
