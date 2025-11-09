import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopWebBarComponent } from './top-web-bar.component';

describe('TopWebBarComponent', () => {
  let component: TopWebBarComponent;
  let fixture: ComponentFixture<TopWebBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopWebBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TopWebBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
