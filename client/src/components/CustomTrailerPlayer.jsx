import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipBack, SkipForward } from 'lucide-react';
import { dummyTrailers } from '../assets/assets';

const formatTime = (time) => {
  if (isNaN(time)) return '00:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const CustomTrailerPlayer = () => {
  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    setDuration(0);
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [currentTrailer]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setProgress(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const rect = e.target.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = percent * duration;
    setProgress(videoRef.current.currentTime);
  };

  const handleVolumeChange = (e) => {
    const value = Number(e.target.value);
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value;
      setIsMuted(value === 0);
    }
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const handleFullScreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const skip = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
      setProgress(videoRef.current.currentTime);
    }
  };

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20">
      <p className="text-gray-300 font-medium text-lg max-w-[960px] mx-auto">Trailers</p>
      <div ref={containerRef} className="relative mt-6 max-w-3xl mx-auto bg-black rounded-lg overflow-hidden shadow-lg">
        <video
          ref={videoRef}
          src={currentTrailer.videoUrl}
          poster={currentTrailer.image}
          className="w-full h-[320px] md:h-[540px] bg-black"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onClick={handlePlayPause}
          volume={volume}
          muted={isMuted}
          controls={false}
        />
        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3 flex flex-col gap-2">
          {/* Progress Bar */}
          <div className="relative w-full h-2 bg-gray-700 rounded-full cursor-pointer" onClick={handleSeek}>
            <div className="absolute top-0 left-0 h-2 bg-blue-600 rounded-full" style={{ width: `${(progress / duration) * 100 || 0}%` }} />
          </div>
          {/* Controls Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button onClick={handlePlayPause} className="text-white hover:text-blue-400">
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </button>
              <button onClick={() => skip(-10)} className="text-white hover:text-blue-400">
                <SkipBack className="h-5 w-5" />
              </button>
              <button onClick={() => skip(10)} className="text-white hover:text-blue-400">
                <SkipForward className="h-5 w-5" />
              </button>
              <button onClick={handleMute} className="text-white hover:text-blue-400">
                {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-24 accent-blue-600"
              />
              <span className="text-xs text-white ml-2">{formatTime(progress)} / {formatTime(duration)}</span>
            </div>
            <button onClick={handleFullScreen} className="text-white hover:text-blue-400">
              {isFullScreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
      {/* Thumbnails */}
      <div className="group grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-8 max-w-3xl mx-auto">
        {dummyTrailers.map((trailer) => (
          <div
            key={trailer.image}
            className={`relative cursor-pointer transition-transform duration-300 rounded-lg overflow-hidden ${currentTrailer === trailer ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => setCurrentTrailer(trailer)}
          >
            <img src={trailer.image} alt="trailer" className="w-full h-32 md:h-40 object-cover brightness-75" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Play className="w-8 h-8 text-white opacity-80" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomTrailerPlayer;