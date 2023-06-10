import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyroutesComponent } from './modifyroutes.component';

describe('ModifyroutesComponent', () => {
  let component: ModifyroutesComponent;
  let fixture: ComponentFixture<ModifyroutesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyroutesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyroutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
