import { useState } from "react";

const VideoRecorder = () => {
	const [permission, setPermission] = useState(false);
	const [stream, setStream] = useState(null);

	const getCameraPermission = async () => {
		if ("MediaRecorder" in window) {
			try {
				const streamData = await navigator.mediaDevices.getUserMedia({
					audio: true,
					video: true,
				});
				setPermission(true);
				setStream(streamData);
			} catch {
				alert(
					"You denied access to the camera and microphone, so this demo will not work."
				);
			}
		} else {
			alert("The MediaRecorder API is not supported in your browser.");
		}
	};

	return (
		<div>
			<h2>Video Recorder</h2>
			<main>
				<div className="controls">
					{!permission && (
						<button onClick={getCameraPermission} type="button">
							Get Camera
						</button>
					)}
					{permission && (
						<button onClick={getCameraPermission} type="button">
							Record
						</button>
					)}
				</div>
			</main>
		</div>
	);
};

export default VideoRecorder;
