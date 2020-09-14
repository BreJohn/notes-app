import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "../components/app.component";

import { SocketIoModule, SocketIoConfig } from "ngx-socket-io";
import { HttpClientModule } from "@angular/common/http";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "./material.module";
import { NotesComponent } from "../components/notes/notes.component";
import { CommonModule } from "@angular/common";
import { FiltersComponent } from '../components/filters/filters.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from '../components/home/home.component';
import { NewNoteComponent } from '../components/new-note/new-note.component';

const config: SocketIoConfig = { url: "http://localhost:3000", options: {} };

@NgModule({
  declarations: [AppComponent, NotesComponent, FiltersComponent, HomeComponent, NewNoteComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    NoopAnimationsModule,
    MaterialModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  entryComponents: [NotesComponent, HomeComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
