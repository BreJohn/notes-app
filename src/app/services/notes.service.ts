import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { HttpClient } from "@angular/common/http";
import { NoteRequest } from '../model/NoteRequest';

@Injectable({
  providedIn: "root",
})
export class NotesService {
  $newNote = this.socket.fromEvent("new note");
  endpoint = "http://localhost:3000/api/notes";
  constructor(private socket: Socket, private _httpClient: HttpClient) {

  }

  getNotes() {
    this.$newNote.subscribe((note) => {
      console.log(note);
    });
  }

  getAllNotes() {
    return this._httpClient.get(this.endpoint);
  }

  newNote(request: NoteRequest) {
    return this._httpClient.post(
      this.endpoint,
      request
      );
  }
}
