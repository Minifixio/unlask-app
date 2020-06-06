import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SetEditionPage } from './set-edition.page';

describe('SetEditionPage', () => {
  let component: SetEditionPage;
  let fixture: ComponentFixture<SetEditionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetEditionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SetEditionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
