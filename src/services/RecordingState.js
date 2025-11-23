// Simple state management for recording status across screens

let recordingState = {
  isRecording: false,
  isPaused: false,
  distance: 0,
  elapsedTime: 0,
  elevationGain: 0,
};

let listeners = [];

export function getRecordingState() {
  return { ...recordingState };
}

export function updateRecordingState(updates) {
  recordingState = { ...recordingState, ...updates };
  listeners.forEach((callback) => callback(recordingState));
}

export function subscribeToRecordingState(callback) {
  listeners.push(callback);
  // Return unsubscribe function
  return () => {
    listeners = listeners.filter((cb) => cb !== callback);
  };
}

export function resetRecordingState() {
  recordingState = {
    isRecording: false,
    isPaused: false,
    distance: 0,
    elapsedTime: 0,
    elevationGain: 0,
  };
  listeners.forEach((callback) => callback(recordingState));
}
