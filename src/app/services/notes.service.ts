import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { HttpClient } from "@angular/common/http";
import { NoteRequest } from "../model/NoteRequest";
import { merge } from "rxjs";
import { filter, scan } from "rxjs/operators";
import { FilterProperties } from "../interfaces/filterProperties";

@Injectable({
  providedIn: "root",
})
export class NotesService {
  $newNote = this.socket.fromEvent("new note");
  endpoint = "http://localhost:3000/api/notes";
  constructor(private socket: Socket, private _httpClient: HttpClient) {}

  getNotes() {
    this.$newNote.subscribe((note) => {
      console.log(note);
    });
  }

  getAllNotes() {
    return merge(this._httpClient.get(this.endpoint), this.$newNote).pipe(
      scan((prev: any, curr: any) => {
        return { ...prev, notes: prev.notes.concat(curr.notes[0]) };
      })
    );
  }

  newNote(request: NoteRequest) {
    return this._httpClient.post(this.endpoint, request);
  }
}
