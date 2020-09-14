import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NoteRequest } from 'src/app/model/NoteRequest';
import { NotesService } from 'src/app/services/notes.service';

@Component({
  selector: "new-note",
  templateUrl: "./new-note.component.html",
  styleUrls: ["./new-note.component.less"],
})
export class NewNoteComponent implements OnInit {
  createNoteForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private noteService: NotesService
    ) {
    this.createNoteForm = this.fb.group({
      title: [null, [Validators.minLength(5), Validators.required]],
      body: [null, [Validators.minLength(10), Validators.required]],
      userName: [null, [Validators.minLength(5), Validators.required]],
    });
  }

  ngOnInit(): void {}
  
  createRequest(): NoteRequest {
    const { title, body, userName } = this.createNoteForm.controls;
    const request = new NoteRequest(
      {
      title: title.value,
      body: body.value,
      userName: userName.value
    }
    )
    return request;
  }

  submitNote() {
    const request = this.createRequest();
    this.noteService.newNote(request).subscribe(
      res => console.log(res)
    )
  }
}
