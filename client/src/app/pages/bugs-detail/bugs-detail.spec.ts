import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BugsDetail } from './bugs-detail';

describe('BugsDetail', () => {
  let component: BugsDetail;
  let fixture: ComponentFixture<BugsDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BugsDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(BugsDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
