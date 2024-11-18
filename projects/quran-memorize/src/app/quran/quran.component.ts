import { Component, computed, inject, input, linkedSignal } from '@angular/core';
import { Note, quranPages, Recitation } from './quran';
import { CommonModule, DecimalPipe } from '@angular/common';
import { AudioQuranRecorder } from './audio';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
// import quran from '../../../quran.json';

const pageNumber = (page: number) => ('00' + page).slice(-3);

@Component({
  selector: 'app-quran',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatToolbarModule,
    MatMenuModule,
    MatFormFieldModule,
  ],
  templateUrl: './quran.component.html',
  styleUrl: './quran.component.scss',
})
export class QuranComponent {
  private router = inject(Router);
  pageNumber = input.required<number>();
  pageNumberString = computed(() => pageNumber(this.pageNumber()));
  nextPage = computed(() => pageNumber(+this.pageNumber() + 1));
  prevPage = computed(() => pageNumber(+this.pageNumber() - 1));

  page = computed(() => quranPages[this.pageNumber() - 1]);
  goToPageNumber: number = 0;

  recordingStartTime!: number;
  recitation: Recitation = {
    audioUrl: '',
    notes: [],
  };

  tempNote: Omit<Note, 'note'> | undefined;
  floatingInputStyle: any = { top: '0px', left: '0px' }; // Position style for floating input
  audioQuranRecorder = new AudioQuranRecorder();

  saveNote(note: string) {
    if (this.tempNote) {
      // Save the note along with position, timestamp, and selected word
      // const position = window.getSelection()?.getRangeAt(0).startOffset || 0;
      this.recitation.notes.push({
        ...this.tempNote,
        note: note,
      });

      this.tempNote = undefined;
    }
  }

  getCaretPosition(event: MouseEvent, line: number) {
    const range = window.getSelection()?.getRangeAt(0);
    if (range) {
      // const position = range.startOffset;
      this.tempNote = {
        lineNumber: line,
        pageNumber: this.pageNumber(),
        word: range.startOffset,
        timestamp: this.audioQuranRecorder.audioContext.currentTime - 3,
      };
      this.floatingInputStyle = {
        top: `${event.clientY + 10}px`, // Position it a little below the click
        left: `${event.clientX + 10}px`, // Position it a little to the right of the click
      };
    }
  }

  showNote(note: Note) {
    this.goToPage(note.pageNumber);
    this.audioQuranRecorder.playFromPosition(note.timestamp);
  }

  goToPage(page: number) {
    if (page) {
      this.router.navigate(['/page/' + pageNumber(page)]);
    }
  }
}
