import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { NgbPaginationModule, NgbModalModule } from "@ng-bootstrap/ng-bootstrap"
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { ArticulosFamiliaComponent } from './components/articulos-familia/articulos-familia.component';
import { MenuComponent } from './components/menu/menu.component';
import { ArticulosComponent } from './components/articulos/articulos.component';
import { ModalDialogComponent } from './components/modal-dialog/modal-dialog.component';
import { MyInterceptor } from './shared/my-interceptor/my-interceptor.component';


@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    ArticulosFamiliaComponent,
    MenuComponent,
    ArticulosComponent,
    ModalDialogComponent,
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    NgbPaginationModule,
    NgbModalModule,
    RouterModule.forRoot([
      {path: '', redirectTo: '/inicio', pathMatch: 'full'},
      {path: 'inicio', component: InicioComponent},
      {path: 'articulosfamilias', component: ArticulosFamiliaComponent},
      {path: 'articulos', component: ArticulosComponent},
    ])
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: "/"},
    { provide: HTTP_INTERCEPTORS, useClass: MyInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ModalDialogComponent,]  
})

export class AppModule { }
