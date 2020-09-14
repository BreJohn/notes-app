import { Component, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { truncate } from 'fs';
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
  filterPredicate: (note: Note, filter: string) => boolean;
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
    this.sort.active = "date";
    this.sort.direction = "desc";
    this.allNotes.sort = this.sort;
    this.allNotes.filterPredicate = this.filterPredicate;
  }

  applyFilterProperties(filterProperties: FilterProperties) {
    this.filterPredicate = (data: Note, filter: string) => filterProperties.filterPredicate(data,filter); 
    if (filterProperties.filter === null || filterProperties.filter === undefined) {
      return 
    }
    this.allNotes.filter = filterProperties.filter;
    console.log(this.allNotes.filteredData); 
  }


}
