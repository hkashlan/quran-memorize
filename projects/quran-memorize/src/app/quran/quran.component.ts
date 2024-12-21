import { Component, computed, effect, ElementRef, inject, input, linkedSignal, signal, ViewChild } from '@angular/core';
import { Note, QuranWrapper, Recitation } from './quran';
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
import quran from '../../../quran.json';

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
  @ViewChild('quranPage') textContainer!: ElementRef;
  private router = inject(Router);
  pageNumber = input.required<number>();
  pageNumberString = computed(() => pageNumber(this.pageNumber()));
  nextPage = computed(() => pageNumber(+this.pageNumber() + 1));
  prevPage = computed(() => pageNumber(+this.pageNumber() - 1));
  fontSize: number = 0; // Font size (calculated dynamically)
  lineHeight: number = 1.50; // Line height (calculated dynamically)
  pageHeight: number = 0; // Full height (100vh)
  pageWidth: number = 0; // 70% of height
  // lineHeight: number = 1.5; // Line height multiplier
  maxLines: number = 15; // Maximum number of lines

  quran: QuranWrapper = quran;

  page = computed(() => this.quran.data.surahs.map((s) => s.ayahs.filter((a) => a.page === +[this.pageNumber() - 1])).flat());
  goToPageNumber: number = 0;

  recordingStartTime!: number;
  recitation: Recitation = {
    audioUrl: '',
    notes: [],
  };

  tempNote: Omit<Note, 'note'> | undefined;
  floatingInputStyle: any = { top: '0px', left: '0px' }; // Position style for floating input
  audioQuranRecorder = new AudioQuranRecorder();
  totalLines = signal(0);

  constructor() {
    effect(() => {
      this.pageNumber();
      setTimeout(() => {
        this.updateDimensions();
      }, 0);
    });

  }

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

  updateDimensions(): void {
    this.pageWidth = this.pageHeight * 0.7; // Width is 70% of height
    this.pageHeight = window.innerHeight; // Full viewport height
    this.lineHeight = this.pageHeight / 15; // Divide height into 15 lines
    this.fontSize = this.lineHeight * 0.47; // Font size as 75% of line height
    this.fitTextToPage();
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

  fitTextToPage(): void {
    this.pageHeight = window.innerHeight; // Full viewport height
    this.lineHeight = Math.floor( this.pageHeight / 15); // Divide height into 15 lines
    const container = this.textContainer.nativeElement as HTMLElement;
    let increaseBY = 6;
    const halfLineHeight = this.lineHeight /2;
    container.classList.add('fitting');

    for (let index = 0; index < 24; index++) {
      if(container.scrollHeight > container.clientHeight +  halfLineHeight) {
        this.fontSize -= increaseBY;
      } else {
        this.fontSize += increaseBY;
      }
      increaseBY *= 0.7;
      container.style.fontSize  = this.fontSize + 'px';
    }
    let j = 0;
    while(container.scrollHeight > container.clientHeight + halfLineHeight ) {
      this.fontSize -= increaseBY;
      container.style.fontSize  = this.fontSize + 'px';
      console.log('j = ', j, 'fontSize = ', container.style.fontSize);
    }

    setTimeout(() => {
      let i = 0;
      const ttt = this.lineHeight / 10000;
      console.log('ttt' , ttt);
      while(container.scrollHeight > container.clientHeight + halfLineHeight ) {
        this.fontSize -= ttt;
        container.style.fontSize  = this.fontSize + 'px';
        i++;
      }
      container.classList.remove('fitting');

    }, 100);

    (window as any)['tt'] = container;

    const contentHeight = container.offsetHeight; // Total height of the content div
    const computedStyle = window.getComputedStyle(container);
    const lineHeight = parseFloat(computedStyle.lineHeight); // Line height of the text

    this.totalLines.set(Math.ceil(contentHeight / lineHeight));
  // const maxFontSize = 50; // Upper limit for font size
    // const minFontSize = 10; // Lower limit for font size

    // while (this.fontSize > minFontSize) {
    //   container.style.fontSize = `${this.fontSize}px`;
    //   // container.style.lineHeight = `${this.fontSize * this.lineHeight}px`;

    //   const totalHeight = container.scrollHeight;
    //   const lineCount = Math.ceil(totalHeight / (this.fontSize * this.lineHeight));

    //   if (lineCount <= this.maxLines && container.offsetWidth <= this.pageWidth) {
    //     break;
    //   }

    //   this.fontSize -= 0.1; // Decrease font size if text overflows
    // }

    // // Optional: Ensure font size does not exceed the upper limit
    // this.fontSize = Math.min(this.fontSize, maxFontSize);
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
