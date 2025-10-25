document.addEventListener("DOMContentLoaded", () => {
  let mediaRecorder;
  let audioChunks = [];

  const startBtn = document.getElementById("startRecording");
  const stopBtn = document.getElementById("stopRecording");
  const input = document.getElementById("voiceMSG");

  document
    .getElementById("startRecording")
    .addEventListener("click", async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorder.start();
      console.log("Recording started");
    });

  document.getElementById("stopRecording").addEventListener("click", () => {
    mediaRecorder.addEventListener("stop", () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      const file = new File([audioBlob], "recorded_message.wav", {
        type: "audio/wav",
      });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;

      audioChunks = [];
      console.log("Recording stopped and file attached to form");
    });

    mediaRecorder.stop();
  });
});
