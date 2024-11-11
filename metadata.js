function getVideoMetadata(result) {
  const metadata = JSON.parse(result);
  const track = metadata.media.track.find((m) => m["@type"] == "Video");

  return {
    duration: parseFloat(track.Duration),
    framerate: parseFloat(track.FrameRate),
    framecount: parseInt(track.FrameCount),
    aspect: parseFloat(track.DisplayAspectRatio),
    height: parseInt(track.Height),
    width: parseInt(track.Width),
    loaded: true,
  };
}
