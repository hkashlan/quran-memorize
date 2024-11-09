import { Component, computed, input } from '@angular/core';
import { quranPages } from './quran';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-quran',
  imports: [CommonModule],
  templateUrl: './quran.component.html',
  styleUrl: './quran.component.scss'
})
export class QuranComponent {
  pageNumber = input.required<number>();
  page  = computed(() => quranPages[this.pageNumber() - 1 ]);
  // @ViewChild('textContainer') textContainer!: ElementRef;
  isRecording = false;
  mediaRecorder: any;
  audioChunks: any[] = [];
  audioContext!: AudioContext;
  recordingStartTime!: number;
  audioBuffer!: AudioBuffer;
  audioUrl: string = '';
  characterData: { position: number; timestamp: number; notes: string }[] = [];
  currentAudioSource: AudioBufferSourceNode | null = null; // Track the current audio source

  selectedWord: string = '';
  selectedTimestamp: number | null = null;
  noteText: string = '';
  floatingInputStyle: any = { top: '0px', left: '0px' };  // Position style for floating input



  toggleRecording() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
    this.isRecording = !this.isRecording;
  }

  async startRecording() {
    this.audioContext = new AudioContext();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(stream);
    this.mediaRecorder.start();
    this.audioChunks = [];
    this.recordingStartTime = this.audioContext.currentTime;

    this.mediaRecorder.ondataavailable = (event: any) => {
      this.audioChunks.push(event.data);
    };
  }

  async stopRecording() {
    this.mediaRecorder.stop();
    this.mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
      this.audioUrl = URL.createObjectURL(audioBlob);
      const arrayBuffer = await audioBlob.arrayBuffer();
      this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      console.log('Audio recording saved at URL:', this.audioUrl);
    };
  }

  saveNote(notes: string) {
    if (this.selectedTimestamp !== null && this.selectedWord) {
      // Save the note along with position, timestamp, and selected word
      const position = window.getSelection()?.getRangeAt(0).startOffset || 0;
      this.characterData.push({
        position,
        timestamp: this.selectedTimestamp,
        notes: notes
      });

      // Clear selection and note text
      this.selectedWord = '';
      this.selectedTimestamp = null;
      this.noteText = '';
    }
  }

  getCaretPosition(event: MouseEvent) {
    const range = window.getSelection()?.getRangeAt(0);
    if (range) {
      const position = range.startOffset;
      const timestamp = this.audioContext.currentTime - this.recordingStartTime - 3;
      const word = 'sdf';
      this.selectedWord = word;
      this.selectedTimestamp = timestamp;
      this.noteText = '';  // Clear note text field for a new entry
      this.floatingInputStyle = {
        top: `${event.clientY + 10}px`,  // Position it a little below the click
        left: `${event.clientX + 10}px`  // Position it a little to the right of the click
      };
      console.log(`Selected word "${word}" at position ${position}, time ${timestamp}`);
    }
  }

  playFromPosition(timestamp: number) {
    if (this.audioBuffer) {
      // Stop the current audio source if one is playing
      if (this.currentAudioSource) {
        this.currentAudioSource.stop();
      }

      // Create a new audio source
      const source = this.audioContext.createBufferSource();
      source.buffer = this.audioBuffer;
      source.connect(this.audioContext.destination);

      // Set the current audio source and play for 6 seconds
      this.currentAudioSource = source;
      source.start(0, timestamp);
      source.stop(this.audioContext.currentTime + 6);

      // Clear current audio source after playback finishes
      source.onended = () => {
        this.currentAudioSource = null;
      };
    } else {
      console.warn('Audio buffer is not available.');
    }
  }
}
