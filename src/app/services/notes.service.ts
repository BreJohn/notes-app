import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { HttpClient } from "@angular/common/http";
import { NoteRequest } from "../model/NoteRequest";
import { merge, Observable } from "rxjs";
import { scan } from "rxjs/operators";
import { INotesResponse } from "../model/Note";

@Injectable({
  providedIn: "root",
})
export class NotesService {
  private $newNote = this.socket.fromEvent("new note");
  private endpoint = "http://localhost:3000/api/notes";
  constructor(private socket: Socket, private _httpClient: HttpClient) {}

  public getFirstNotes(): Observable<INotesResponse> {
    return this._httpClient.get<INotesResponse>(this.endpoint);
  }

  public getAllNotes(): Observable<INotesResponse> {
    return merge(this.getFirstNotes(), this.$newNote).pipe(
      scan((prev: INotesResponse, curr: INotesResponse) => {
        return { ...prev, notes: prev.notes.concat(curr.notes[0]) };
      })
    );
  }

  public newNote(request: NoteRequest): Observable<string> {
    return this._httpClient.post(this.endpoint, request, {
      responseType: "text",
    });
  }
}
