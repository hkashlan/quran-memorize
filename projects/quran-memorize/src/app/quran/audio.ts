export class AudioQuranRecorder {
  audioBuffer!: AudioBuffer;
  audioUrl: string = '';
  currentAudioSource: AudioBufferSourceNode | null = null; // Track the current audio source
  audioContext!: AudioContext;
  mediaRecorder: MediaRecorder | null = null;
  audioChunks: any[] = [];
  isRecording = false;

  async startRecording() {
    this.audioContext = new AudioContext();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(stream);
    this.mediaRecorder.start();
    this.audioChunks = [];
    // this.recordingStartTime = this.audioContext.currentTime;

    this.mediaRecorder.ondataavailable = (event: any) => {
      this.audioChunks.push(event.data);
    };
  }

  toggleRecording() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
    this.isRecording = !this.isRecording;
  }

  async stopRecording() {
    this.mediaRecorder!.stop();
    this.mediaRecorder!.onstop = async () => {
      const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
      this.audioUrl = URL.createObjectURL(audioBlob);
      const arrayBuffer = await audioBlob.arrayBuffer();
      this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    };
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
