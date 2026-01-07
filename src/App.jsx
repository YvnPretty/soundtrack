import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import {
    Play, Pause, SkipBack, SkipForward,
    Volume2, VolumeX, Music, Plus,
    Trash2, ListMusic, Disc, Heart,
    Video, Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');

  :root {
    --primary: #6366f1;
    --primary-glow: rgba(99, 102, 241, 0.4);
    --bg-dark: #020617;
    --text-main: #f8fafc;
    --text-muted: #94a3b8;
    --glass-border: rgba(255, 255, 255, 0.08);
    --accent: #f43f5e;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Outfit', sans-serif;
  }

  body {
    background-color: var(--bg-dark);
    background-image: 
      radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 40%),
      radial-gradient(circle at 80% 80%, rgba(244, 63, 94, 0.1) 0%, transparent 40%),
      radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 1) 0%, rgba(2, 6, 23, 1) 100%);
    color: var(--text-main);
    min-height: 100vh;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const Header = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  .icon-box {
    padding: 0.75rem;
    background: rgba(99, 102, 241, 0.2);
    border: 1px solid rgba(99, 102, 241, 0.3);
    border-radius: 16px;
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #818cf8;
  }

  h1 {
    font-size: 1.75rem;
    font-weight: 800;
    letter-spacing: -0.05em;
    background: linear-gradient(to right, #fff, #94a3b8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const GlassButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(99, 102, 241, 0.5);
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.2);
  }
`;

const MainGrid = styled.main`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 2rem;
  width: 100%;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const PlayerCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 32px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
  overflow: hidden;
`;

const MediaContainer = styled.div`
  aspect-ratio: 16/9;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.03);
  overflow: hidden;
  
  video {
    width: 100%;
    height: 100%;
    object-fit: contain;
    z-index: 1;
  }

  .audio-placeholder {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    background: rgba(0,0,0,0.2);
    pointer-events: none;
  }

  .visualizer-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: 0 1rem;
    gap: 4px;
    pointer-events: none;
    z-index: 5;
    opacity: ${props => props.isVideo ? 0.5 : 1};
  }
`;

const VisualizerBar = styled.div`
  flex: 1;
  background: linear-gradient(to top, #6366f1, #f43f5e, #fbbf24);
  border-radius: 4px 4px 0 0;
  transition: height 0.05s ease;
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.6);
  opacity: 0.9;
  filter: brightness(1.2);
`;

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const ProgressBar = styled.input`
  width: 100%;
  height: 4px;
  appearance: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  cursor: pointer;
  outline: none;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    background: #818cf8;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(99, 102, 241, 0.8);
  }
`;

const ControlButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;

  .play-pause {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #6366f1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    border: none;
    cursor: pointer;
    box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4);
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.05);
      background: #818cf8;
    }
  }

  .nav-btn {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
      color: white;
    }
  }
`;

const PlaylistCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 32px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-height: 700px;
`;

const MediaItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem;
  border-radius: 16px;
  cursor: pointer;
  background: ${props => props.active ? 'rgba(99, 102, 241, 0.1)' : 'transparent'};
  border: 1px solid ${props => props.active ? 'rgba(99, 102, 241, 0.2)' : 'transparent'};
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  .icon-type {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: ${props => props.isVideo ? 'rgba(244, 63, 94, 0.1)' : 'rgba(99, 102, 241, 0.1)'};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.isVideo ? '#f43f5e' : '#818cf8'};
  }

  .info {
    flex: 1;
    min-width: 0;
    h4 {
      font-size: 0.9rem;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: ${props => props.active ? '#818cf8' : 'white'};
    }
    p {
      font-size: 0.7rem;
      color: rgba(255, 255, 255, 0.4);
    }
  }
`;

function App() {
    const [mediaList, setMediaList] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [visualizerData, setVisualizerData] = useState(new Array(32).fill(0));

    const mediaRef = useRef(null);
    const fileInputRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceRef = useRef(null);
    const animationFrameRef = useRef(null);

    const currentMedia = currentIndex !== null ? mediaList[currentIndex] : null;

    useEffect(() => {
        if (mediaRef.current) {
            mediaRef.current.volume = volume;
        }
    }, [volume]);

    useEffect(() => {
        if (isPlaying && currentMedia) {
            mediaRef.current.play().catch(e => console.log("Playback failed", e));
            setupVisualizer();
        } else if (mediaRef.current) {
            mediaRef.current.pause();
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        }
    }, [isPlaying, currentIndex, currentMedia]);

    const setupVisualizer = () => {
        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
                analyserRef.current = audioContextRef.current.createAnalyser();
                sourceRef.current = audioContextRef.current.createMediaElementSource(mediaRef.current);
                sourceRef.current.connect(analyserRef.current);
                analyserRef.current.connect(audioContextRef.current.destination);
                analyserRef.current.fftSize = 64;
            }

            const bufferLength = analyserRef.current.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const updateVisualizer = () => {
                if (!isPlaying) return;
                analyserRef.current.getByteFrequencyData(dataArray);
                const normalizedData = Array.from(dataArray.slice(0, 32)).map(val => (val / 255) * 100);
                setVisualizerData(normalizedData);
                animationFrameRef.current = requestAnimationFrame(updateVisualizer);
            };

            updateVisualizer();
        } catch (e) {
            console.error("Visualizer setup failed", e);
        }
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        const newMedia = files.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            name: file.name.replace(/\.[^/.]+$/, ""),
            url: URL.createObjectURL(file),
            type: file.type.startsWith('video') ? 'video' : 'audio'
        }));
        setMediaList(prev => [...prev, ...newMedia]);
        if (currentIndex === null) setCurrentIndex(0);
    };

    const togglePlay = () => {
        if (mediaList.length === 0) return;
        if (audioContextRef.current?.state === 'suspended') {
            audioContextRef.current.resume();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (!mediaRef.current) return;
        const current = mediaRef.current.currentTime;
        const dur = mediaRef.current.duration;
        setCurrentTime(current);
        setDuration(dur || 0);
        setProgress((current / dur) * 100 || 0);
    };

    const formatTime = (time) => {
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <>
            <GlobalStyle />
            <Container>
                <Header>
                    <Logo>
                        <div className="icon-box">
                            <Video size={24} />
                        </div>
                        <h1>WAVES</h1>
                    </Logo>
                    <GlassButton
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => fileInputRef.current.click()}
                    >
                        <Plus size={20} />
                        Agregar Media
                    </GlassButton>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        multiple
                        accept="audio/*,video/*"
                        style={{ display: 'none' }}
                    />
                </Header>

                <MainGrid>
                    <PlayerCard>
                        <MediaContainer isVideo={currentMedia?.type === 'video'}>
                            <video
                                ref={mediaRef}
                                src={currentMedia?.url}
                                onTimeUpdate={handleTimeUpdate}
                                onEnded={() => setCurrentIndex(prev => (prev + 1) % mediaList.length)}
                                crossOrigin="anonymous"
                                playsInline
                                style={{ display: currentMedia ? 'block' : 'none' }}
                            />

                            {!currentMedia && (
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', opacity: 0.2 }}>
                                    <Video size={64} />
                                </div>
                            )}

                            {currentMedia?.type === 'audio' && (
                                <div className="audio-placeholder">
                                    <Disc size={120} color="rgba(255,255,255,0.1)" className={isPlaying ? 'animate-spin' : ''} />
                                </div>
                            )}

                            <div className="visualizer-overlay" isVideo={currentMedia?.type === 'video'}>
                                {visualizerData.map((height, i) => (
                                    <VisualizerBar key={i} style={{ height: `${Math.max(5, height)}%` }} />
                                ))}
                            </div>
                        </MediaContainer>

                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.4rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {currentMedia?.name || "No hay archivo"}
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                                {currentMedia ? `Reproduciendo ${currentMedia.type}` : "Selecciona un archivo para comenzar"}
                            </p>
                        </div>

                        <Controls>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(duration)}</span>
                            </div>
                            <ProgressBar
                                type="range"
                                min="0"
                                max="100"
                                value={progress}
                                onChange={(e) => {
                                    const newTime = (e.target.value / 100) * mediaRef.current.duration;
                                    mediaRef.current.currentTime = newTime;
                                }}
                            />
                            <ControlButtons>
                                <button className="nav-btn" onClick={() => setCurrentIndex(prev => (prev - 1 + mediaList.length) % mediaList.length)}>
                                    <SkipBack size={28} fill="currentColor" />
                                </button>
                                <button className="play-pause" onClick={togglePlay}>
                                    {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" style={{ marginLeft: '4px' }} />}
                                </button>
                                <button className="nav-btn" onClick={() => setCurrentIndex(prev => (prev + 1) % mediaList.length)}>
                                    <SkipForward size={28} fill="currentColor" />
                                </button>
                            </ControlButtons>
                        </Controls>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
                            <Volume2 size={16} color="rgba(255,255,255,0.4)" />
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                style={{ width: '100px', height: '4px', appearance: 'none', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}
                            />
                        </div>
                    </PlayerCard>

                    <PlaylistCard>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <ListMusic size={20} color="#818cf8" />
                            <h3 style={{ fontSize: '1.2rem' }}>Tu Biblioteca</h3>
                        </div>
                        <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {mediaList.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.2)' }}>
                                    <Video size={48} style={{ marginBottom: '1rem' }} />
                                    <p>Biblioteca vacía</p>
                                </div>
                            ) : (
                                mediaList.map((item, index) => (
                                    <MediaItem
                                        key={item.id}
                                        active={currentIndex === index}
                                        isVideo={item.type === 'video'}
                                        onClick={() => {
                                            setCurrentIndex(index);
                                            setIsPlaying(true);
                                        }}
                                    >
                                        <div className="icon-type">
                                            {item.type === 'video' ? <Video size={18} /> : <Music size={18} />}
                                        </div>
                                        <div className="info">
                                            <h4>{item.name}</h4>
                                            <p>{item.type === 'video' ? 'Video local' : 'Audio local'}</p>
                                        </div>
                                        <Trash2
                                            size={14}
                                            color="rgba(255,255,255,0.2)"
                                            style={{ cursor: 'pointer' }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const newList = mediaList.filter(m => m.id !== item.id);
                                                setMediaList(newList);
                                                if (index === currentIndex) {
                                                    setIsPlaying(false);
                                                    setCurrentIndex(newList.length > 0 ? 0 : null);
                                                }
                                            }}
                                        />
                                    </MediaItem>
                                ))
                            )}
                        </div>
                    </PlaylistCard>
                </MainGrid>
            </Container>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 10s linear infinite;
        }
      `}} />
        </>
    );
}

export default App;
