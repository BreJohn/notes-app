import { Component } from "@angular/core";
import { NotesService } from "../services/notes.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.less"],
})
export class AppComponent {
  constructor(private notesService: NotesService) {}
  ngOnInit() {
    this.notesService.getNotes();
    this.notesService.getAllNotes();
  }
}
