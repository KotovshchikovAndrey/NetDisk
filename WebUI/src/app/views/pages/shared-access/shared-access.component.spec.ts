import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedAccessComponent } from './shared-access.component';

describe('SharedAccessComponent', () => {
  let component: SharedAccessComponent;
  let fixture: ComponentFixture<SharedAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedAccessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SharedAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
