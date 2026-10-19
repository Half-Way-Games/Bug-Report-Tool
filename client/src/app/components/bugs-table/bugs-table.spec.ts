import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BugsTable } from './bugs-table';

describe('BugsTable', () => {
  let component: BugsTable;
  let fixture: ComponentFixture<BugsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BugsTable],
    }).compileComponents();

    fixture = TestBed.createComponent(BugsTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
