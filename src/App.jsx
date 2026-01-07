import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import {
    Play, Pause, SkipBack, SkipForward,
    Volume2, VolumeX, Music, Plus,
    Trash2, ListMusic, Disc, Heart
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

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
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
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at center, rgba(99, 102, 241, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const VisualizerContainer = styled.div`
  aspect-ratio: 16/9;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 24px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.03);
  overflow: hidden;
  padding: 0 1rem;
  gap: 4px;
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
  gap: 1.5rem;
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
  gap: 2.5rem;

  .play-pause {
    width: 64px;
    height: 64px;
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

const SongItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 16px;
  cursor: pointer;
  background: ${props => props.active ? 'rgba(99, 102, 241, 0.1)' : 'transparent'};
  border: 1px solid ${props => props.active ? 'rgba(99, 102, 241, 0.2)' : 'transparent'};
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  .song-info {
    flex: 1;
    min-width: 0;
    h4 {
      font-size: 0.95rem;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: ${props => props.active ? '#818cf8' : 'white'};
    }
    p {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.4);
    }
  }
`;

function App() {
    const [songs, setSongs] = useState([]);
    const [currentSongIndex, setCurrentSongIndex] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [visualizerData, setVisualizerData] = useState(new Array(32).fill(0));

    const audioRef = useRef(null);
    const fileInputRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceRef = useRef(null);
    const animationFrameRef = useRef(null);

    const currentSong = currentSongIndex !== null ? songs[currentSongIndex] : null;

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    useEffect(() => {
        if (isPlaying && currentSong) {
            audioRef.current.play().catch(e => console.log("Playback failed", e));
            setupVisualizer();
        } else if (audioRef.current) {
            audioRef.current.pause();
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        }
    }, [isPlaying, currentSongIndex]);

    const setupVisualizer = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            analyserRef.current = audioContextRef.current.createAnalyser();
            sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
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
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        const newSongs = files.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            name: file.name.replace(/\.[^/.]+$/, ""),
            url: URL.createObjectURL(file)
        }));
        setSongs(prev => [...prev, ...newSongs]);
        if (currentSongIndex === null) setCurrentSongIndex(0);
    };

    const togglePlay = () => {
        if (songs.length === 0) return;
        if (audioContextRef.current?.state === 'suspended') {
            audioContextRef.current.resume();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        const current = audioRef.current.currentTime;
        const dur = audioRef.current.duration;
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
                            <Music size={24} />
                        </div>
                        <h1>WAVES</h1>
                    </Logo>
                    <GlassButton
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => fileInputRef.current.click()}
                    >
                        <Plus size={20} />
                        Agregar Música
                    </GlassButton>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        multiple
                        accept="audio/*"
                        style={{ display: 'none' }}
                    />
                </Header>

                <MainGrid>
                    <PlayerCard>
                        <VisualizerContainer>
                            {visualizerData.map((height, i) => (
                                <VisualizerBar key={i} style={{ height: `${Math.max(5, height)}%` }} />
                            ))}
                            {!currentSong && (
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', opacity: 0.2 }}>
                                    <Music size={64} />
                                </div>
                            )}
                        </VisualizerContainer>

                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                                {currentSong?.name || "No hay canción"}
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
                                {currentSong ? "Reproduciendo ahora" : "Selecciona una canción para comenzar"}
                            </p>
                        </div>

                        <Controls>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(duration)}</span>
                            </div>
                            <ProgressBar
                                type="range"
                                min="0"
                                max="100"
                                value={progress}
                                onChange={(e) => {
                                    const newTime = (e.target.value / 100) * audioRef.current.duration;
                                    audioRef.current.currentTime = newTime;
                                }}
                            />
                            <ControlButtons>
                                <button className="nav-btn" onClick={() => setCurrentSongIndex(prev => (prev - 1 + songs.length) % songs.length)}>
                                    <SkipBack size={32} fill="currentColor" />
                                </button>
                                <button className="play-pause" onClick={togglePlay}>
                                    {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" style={{ marginLeft: '4px' }} />}
                                </button>
                                <button className="nav-btn" onClick={() => setCurrentSongIndex(prev => (prev + 1) % songs.length)}>
                                    <SkipForward size={32} fill="currentColor" />
                                </button>
                            </ControlButtons>
                        </Controls>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
                            <Volume2 size={18} color="rgba(255,255,255,0.4)" />
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
                            <h3 style={{ fontSize: '1.2rem' }}>Tu Lista</h3>
                        </div>
                        <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {songs.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.2)' }}>
                                    <Disc size={48} style={{ marginBottom: '1rem' }} />
                                    <p>Lista vacía</p>
                                </div>
                            ) : (
                                songs.map((song, index) => (
                                    <SongItem
                                        key={song.id}
                                        active={currentSongIndex === index}
                                        onClick={() => {
                                            setCurrentSongIndex(index);
                                            setIsPlaying(true);
                                        }}
                                    >
                                        <div className="song-info">
                                            <h4>{song.name}</h4>
                                            <p>Archivo local</p>
                                        </div>
                                        <Trash2
                                            size={16}
                                            color="rgba(255,255,255,0.2)"
                                            style={{ cursor: 'pointer' }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const newSongs = songs.filter(s => s.id !== song.id);
                                                setSongs(newSongs);
                                                if (index === currentSongIndex) {
                                                    setIsPlaying(false);
                                                    setCurrentSongIndex(newSongs.length > 0 ? 0 : null);
                                                }
                                            }}
                                        />
                                    </SongItem>
                                ))
                            )}
                        </div>
                    </PlaylistCard>
                </MainGrid>

                <audio
                    ref={audioRef}
                    src={currentSong?.url}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => setCurrentSongIndex(prev => (prev + 1) % songs.length)}
                    crossOrigin="anonymous"
                />
            </Container>
        </>
    );
}

export default App;
