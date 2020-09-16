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
  private $newNote: Observable<INotesResponse> = this.socket.fromEvent(
    "new note"
  );
  private endpoint = "http://localhost:3000/api/notes";
  constructor(private socket: Socket, private _httpClient: HttpClient) {}

  public getFirstNotes(): Observable<INotesResponse> {
    return this._httpClient.get<INotesResponse>(this.endpoint);
  }

  public getNewNote(): Observable<INotesResponse> {
    return this.$newNote;
  }

  public newNote(request: NoteRequest): Observable<string> {
    return this._httpClient.post(this.endpoint, request, {
      responseType: "text",
    });
  }
}
