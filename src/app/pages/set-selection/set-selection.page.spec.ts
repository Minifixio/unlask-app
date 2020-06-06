import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SetSelectionPage } from './set-selection.page';

describe('SetSelectionPage', () => {
  let component: SetSelectionPage;
  let fixture: ComponentFixture<SetSelectionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetSelectionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SetSelectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
