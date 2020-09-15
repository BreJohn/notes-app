import { Component, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { FilterProperties } from "src/app/interfaces/filterProperties";
import { INote } from "src/app/model/Note";
import { NotesService } from "../../services/notes.service";
import { Subscription } from "rxjs";

import * as moment from "moment";
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
  firstTime = true;
  filter: string;
  filterProperties: FilterProperties;
  subscription = new Subscription();

  constructor(private notesService: NotesService) {}
  ngOnInit() {
    this.subscription = this.notesService.getAllNotes().subscribe((result) => {
      this.allNotes = new MatTableDataSource<INote>(result.notes);
      this.applyFilterIfExist();

      console.log(this.allNotes);
      if (this.firstTime) {
        console.log(result);
        this.noteHeaders = Object.keys(result.notes[0]);
        this.initTableSettings();
        return;
      }
      this.firstTime = false;
      console.log(result);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  applyFilterIfExist() {
    if (this.filterProperties.filter) {
      this.allNotes.filterPredicate = this.filterProperties.filterPredicate;
      this.allNotes.filter = this.filterProperties.filter;
    }
  }
  initTableSettings() {
    this.allNotes.sortingDataAccessor = (item, property): string | number => {
      switch (property) {
        case "date":
          return moment(item.date).format();
        default:
          return item[property];
      }
    };
    this.sort.active = "date";
    this.sort.direction = "desc";
    this.allNotes.sort = this.sort;
    this.allNotes.filterPredicate = this.filterPredicate;
  }

  applyFilterProperties(filterProperties: FilterProperties) {
    this.filterProperties = filterProperties;
    this.filterPredicate = filterProperties.filterPredicate;
    if (
      filterProperties.filter === null ||
      filterProperties.filter === undefined
    ) {
      return;
    }
    this.allNotes.filter = filterProperties.filter;
  }
}
