import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BbiComponent } from './bbi.component';

describe('BbiComponent', () => {
  let component: BbiComponent;
  let fixture: ComponentFixture<BbiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BbiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BbiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
