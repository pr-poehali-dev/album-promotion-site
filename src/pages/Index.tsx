import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

const tracks = [
  { id: 1, title: "Midnight Dreams", duration: "3:42", url: "" },
  { id: 2, title: "Echoes of Tomorrow", duration: "4:15", url: "" },
  { id: 3, title: "Neon Lights", duration: "3:28", url: "" },
  { id: 4, title: "Solitude", duration: "5:01", url: "" },
  { id: 5, title: "Digital Rain", duration: "3:55", url: "" },
  { id: 6, title: "Wavelength", duration: "4:33", url: "" },
  { id: 7, title: "Reflection", duration: "3:17", url: "" },
  { id: 8, title: "Final Chapter", duration: "6:22", url: "" },
];

const streamingPlatforms = [
  { name: "Spotify", icon: "Music", url: "https://spotify.com" },
  { name: "Apple Music", icon: "Music2", url: "https://music.apple.com" },
  { name: "YouTube Music", icon: "Play", url: "https://music.youtube.com" },
  { name: "SoundCloud", icon: "Radio", url: "https://soundcloud.com" },
];

export default function Index() {
  const [currentTrack, setCurrentTrack] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playTrack = (trackId: number) => {
    if (currentTrack === trackId) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      setCurrentTrack(trackId);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play();
    }
  }, [currentTrack, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <audio ref={audioRef} src="" />

      <section className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center fade-in">
          <div className="space-y-6">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
              MIDNIGHT<br />ECHOES
            </h1>
            <p className="text-xl text-gray-400 font-light">
              Новый альбом уже доступен
            </p>
            <div className="flex gap-4 pt-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white px-8"
                onClick={() => {
                  document.getElementById("tracks")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <Icon name="Play" className="mr-2" size={20} />
                Слушать
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black"
                onClick={() => {
                  document.getElementById("streaming")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                На платформах
              </Button>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 blur-3xl group-hover:bg-primary/30 transition-all duration-500" />
            <img
              src="https://cdn.poehali.dev/files/172d875d-4eec-463a-a66d-9f4a3e282a9e.JPG"
              alt="Album Cover"
              className="relative w-full aspect-square object-cover shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section id="tracks" className="px-4 py-20 bg-gradient-to-b from-black to-zinc-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Треки</h2>
          
          <div className="space-y-2">
            {tracks.map((track, index) => (
              <Card
                key={track.id}
                className={`bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800/50 transition-all cursor-pointer ${
                  currentTrack === track.id ? "border-primary" : ""
                }`}
                onClick={() => playTrack(track.id)}
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      size="icon"
                      variant="ghost"
                      className={`${
                        currentTrack === track.id && isPlaying
                          ? "text-primary"
                          : "text-white"
                      }`}
                    >
                      {currentTrack === track.id && isPlaying ? (
                        <Icon name="Pause" size={20} />
                      ) : (
                        <Icon name="Play" size={20} />
                      )}
                    </Button>
                    <div>
                      <p className="font-medium text-lg">
                        {String(index + 1).padStart(2, "0")}. {track.title}
                      </p>
                    </div>
                  </div>
                  <div className="text-gray-400">{track.duration}</div>
                </div>
              </Card>
            ))}
          </div>

          {currentTrack !== null && (
            <Card className="mt-8 bg-zinc-900 border-zinc-800 sticky bottom-4">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-semibold text-lg">
                      {tracks.find((t) => t.id === currentTrack)?.title}
                    </p>
                    <p className="text-sm text-gray-400">Midnight Echoes</p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => playTrack(currentTrack)}
                  >
                    {isPlaying ? (
                      <Icon name="Pause" size={24} />
                    ) : (
                      <Icon name="Play" size={24} />
                    )}
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </section>

      <section id="about" className="px-4 py-20 bg-zinc-900">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Об альбоме</h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  <strong className="text-white">Midnight Echoes</strong> — это
                  музыкальное путешествие сквозь ночные города и внутренние
                  переживания. Альбом исследует темы одиночества, надежды и
                  поиска себя в современном мире.
                </p>
                <p>
                  Восемь треков объединены атмосферным звучанием, где электронные
                  текстуры переплетаются с живыми инструментами, создавая
                  уникальное звуковое пространство.
                </p>
                <p className="text-sm text-gray-400 pt-4">
                  Релиз: Декабрь 2025<br />
                  Продюсер: [Имя продюсера]<br />
                  Лейбл: Independent
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <Card className="bg-zinc-800/50 border-zinc-700 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <Icon name="Music" size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">8</p>
                    <p className="text-sm text-gray-400">Треков</p>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-zinc-800/50 border-zinc-700 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <Icon name="Clock" size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">34:33</p>
                    <p className="text-sm text-gray-400">Длительность</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="streaming" className="px-4 py-20 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Слушайте на платформах</h2>
          <p className="text-gray-400 mb-12">
            Альбом доступен на всех популярных стриминговых сервисах
          </p>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {streamingPlatforms.map((platform) => (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="bg-zinc-900 border-zinc-800 hover:border-primary transition-all p-8 h-full">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon
                        name={platform.icon as any}
                        size={32}
                        className="text-primary"
                      />
                    </div>
                    <p className="font-semibold">{platform.name}</p>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-4 py-12 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto text-center text-gray-500 text-sm">
          <p>© 2025 Midnight Echoes. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}