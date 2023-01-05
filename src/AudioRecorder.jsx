import { useState, useRef } from "react";

const mimeType = "audio/webm";

const AudioRecorder = () => {
	const [permission, setPermission] = useState(false);

	const [stream, setStream] = useState(null);

	const [audio, setAudio] = useState(null);

	const [audioChunks, setAudioChunks] = useState([]);

	const mediaRecorder = useRef(null);

	const [recordingStatus, setRecordingStatus] = useState("inactive");

	const getMicrophonePermission = async () => {
		if ("MediaRecorder" in window) {
			try {
				const streamData = await navigator.mediaDevices.getUserMedia({
					audio: true,
					video: false,
				});
				setPermission(true);
				setStream(streamData);
			} catch {
				alert(
					"You denied access to the microphone so this demo will not work."
				);
			}
		} else {
			alert("The MediaRecorder API is not supported in your browser.");
		}
	};

	const recordAudio = async () => {
		setRecordingStatus("recording");
		const media = new MediaRecorder(stream, { type: mimeType });

		mediaRecorder.current = media;

		mediaRecorder.current.start();

		let localAudioChunks = [];

		mediaRecorder.current.ondataavailable = (event) => {
			if (typeof event.data === "undefined") return;
			if (event.data.size === 0) return;
			localAudioChunks.push(event.data);
		};

		setAudioChunks(localAudioChunks);
	};

	const stop = () => {
		setRecordingStatus("inactive");
		mediaRecorder.current.stop();

		mediaRecorder.current.onstop = () => {
			const audioBlob = new Blob(audioChunks, { type: mimeType });
			const audioUrl = URL.createObjectURL(audioBlob);

			setAudio(audioUrl);

			setAudioChunks([]);
		};
	};

	return (
		<div>
			<h2>Audio Recorder</h2>
			<main>
				<div className="audio-controls">
					{!permission && (
						<button onClick={getMicrophonePermission} type="button">
							Get Microphone
						</button>
					)}
					{permission && recordingStatus == "inactive" && (
						<button onClick={recordAudio} type="button">
							Record
						</button>
					)}
					{recordingStatus === "recording" && (
						<button onClick={stop} type="button">
							Stop
						</button>
					)}
				</div>
				{audio && (
					<div className="audio-container">
						<audio src={audio} controls></audio>
						<a download href={audio}>
							Download Recording
						</a>
					</div>
				)}
			</main>
		</div>
	);
};

export default AudioRecorder;
