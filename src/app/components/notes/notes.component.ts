import { Component, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { FilterProperties } from 'src/app/interfaces/filterProperties';
import { INote } from "src/app/model/Note";
import { NotesService } from "../../services/notes.service";

@Component({
  selector: "notes",
  templateUrl: "./notes.component.html",
  styleUrls: ["./notes.component.less"],
})
export class NotesComponent {
  allNotes: MatTableDataSource<INote>;
  noteHeaders: string[];
  filterPredicate: (note: INote, filter: string) => boolean;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private notesService: NotesService) {}
  ngOnInit() {
    this.notesService.getAllNotes().subscribe((result: any) => {
      this.allNotes = new MatTableDataSource<INote>(result.notes);
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
    this.filterPredicate = (data: INote, filter: string) => filterProperties.filterPredicate(data,filter); 
    if (filterProperties.filter === null || filterProperties.filter === undefined) {
      return 
    }
    this.allNotes.filter = filterProperties.filter;
    console.log(this.allNotes.filteredData); 
  }


}
