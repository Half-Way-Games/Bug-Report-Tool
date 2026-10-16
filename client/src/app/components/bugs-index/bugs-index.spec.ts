import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BugsIndex } from './bugs-index';

describe('BugsIndex', () => {
  let component: BugsIndex;
  let fixture: ComponentFixture<BugsIndex>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BugsIndex],
    }).compileComponents();

    fixture = TestBed.createComponent(BugsIndex);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
