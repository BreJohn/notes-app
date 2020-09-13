import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Note } from "src/app/model/Note";
import * as moment from "moment";
import { FilterProperties } from "src/app/interfaces/filterProperties";
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: "filters",
  templateUrl: "./filters.component.html",
  styleUrls: ["./filters.component.less"],
})
export class FiltersComponent {
  @Input() notes: MatTableDataSource<Note>;
  @Output() onFilterChange = new EventEmitter<FilterProperties>();
  filterForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group(
      {
        Title: [null, null],
        Body: [null, null],
        UserName: [null, null],
        From: [null, null],
        To: [null, null],
        LastHour: [null, null]
      }
    )

  }

  onInputKeyUp(event: Event, inputId: string) {
    const filterPredicate = (note: Note, filter: string) => {
      switch (inputId) {
        case "dateFrom": {
          if (filter === 'invalid date') {
            return true;
          }
          if (!moment(note.date).isValid()) {
            return false;
          }
          const transformedFilter = moment(filter).startOf("day").format();
          const transformedInput = moment(note.date).startOf("day").format();
          return moment(transformedFilter).isSameOrBefore(transformedInput);
        }
        case "dateTo": {
          if (filter === 'invalid date') {
            return true;
          }
          if (!moment(note.date).isValid()) {
            return false;
          }
          const transformedFilter = moment(filter).startOf("day").format();
          const transformedInput = moment(note.date).startOf("day").format();
          return moment(transformedFilter).isSameOrAfter(transformedInput);
        }
        case "lastHour": {
        }
        default: {
          return note[inputId].toLowerCase().indexOf(filter) !== -1;
        }
      }
    };

    const filterValue = (event.target as HTMLInputElement).value;
    const transformedValue =
      inputId !== "dateFrom" && inputId !== "dateTo"
        ? filterValue
        : moment(filterValue).format();
    const filter = transformedValue.trim().toLowerCase();
    this.onFilterChange.emit({ filter, filterPredicate });
  }
}
