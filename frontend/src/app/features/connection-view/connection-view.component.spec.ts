import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionViewComponent } from './connection-view.component';

describe('ConnectionViewComponent', () => {
  let component: ConnectionViewComponent;
  let fixture: ComponentFixture<ConnectionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectionViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConnectionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
