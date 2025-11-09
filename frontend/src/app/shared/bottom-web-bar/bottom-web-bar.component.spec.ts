import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomWebBarComponent } from './bottom-web-bar.component';

describe('BottomWebBarComponent', () => {
  let component: BottomWebBarComponent;
  let fixture: ComponentFixture<BottomWebBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BottomWebBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BottomWebBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
