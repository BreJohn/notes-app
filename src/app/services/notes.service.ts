import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class NotesService {
  $newNote = this.socket.fromEvent("new note");

  constructor(private socket: Socket, private _httpClient: HttpClient) {}

  getNotes() {
    this.$newNote.subscribe((note) => {
      console.log(note);
    });
  }

  getAllNotes() {
    return this._httpClient.get("http://localhost:3000/api/notes");
  }
}
