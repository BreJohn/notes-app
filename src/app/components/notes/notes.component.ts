import { Component, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { FilterProperties } from 'src/app/interfaces/filterProperties';
import { Note } from "src/app/model/Note";
import { NotesService } from "../../services/notes.service";

@Component({
  selector: "notes",
  templateUrl: "./notes.component.html",
  styleUrls: ["./notes.component.less"],
})
export class NotesComponent {
  allNotes: MatTableDataSource<Note>;
  noteHeaders: string[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private notesService: NotesService) {}
  ngOnInit() {
    this.notesService.getAllNotes().subscribe((result: any) => {
      this.allNotes = new MatTableDataSource<Note>(result.notes);
      this.noteHeaders = Object.keys(result.notes[0]);
      this.initTableSettings();
    });
  }

  initTableSettings() {
    this.allNotes.paginator = this.paginator;
    this.sort.active = "date";
    this.sort.direction = "desc";
    this.allNotes.sort = this.sort;
  }

  applyFilter(filterProperties: FilterProperties) {
    this.allNotes.filter = filterProperties.filter;
    this.allNotes.filterPredicate = (data: Note, filter: string) => filterProperties.filterPredicate(data,filter);  
  }


}
