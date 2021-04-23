
import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import clsx from 'clsx';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { formatTimeToString } from '../../util/formatTimeToString';

import { PlayerContext } from '../../contexts/PlayerContext';

export function Player() {

    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);

    const {
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        hasNext,
        hasPrevious,
        isLooping,
        isShuffling,
        togglePlay,
        setPlayingState,
        playNext,
        playPrevious,
        toggleLoop,
        toggleShuffle,
        clearPlayerState,
    } = useContext(PlayerContext);

    const episode = episodeList[currentEpisodeIndex];

    useEffect(() => {

        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }


    }, [isPlaying])

    const setupProgressListener = () => {
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener("timeupdate", () => {
            setProgress(Math.floor(audioRef.current.currentTime))
        })
    }

    const handleSeek = (amount: number) => {
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    const handleEpisodeEnded = () => {
        if (hasNext) {
            playNext()
        } else {
            clearPlayerState()
        }
    }

    return (
        <div className={clsx(styles.playerContainer, 'd-flex', 'flex-column', 'align-items-center', 'justify-content-between')}>
            <header>
                <img src="/images/playing.svg" alt="Tocando agora" />
                <div>
                    <strong>Tocando agora</strong>
                    {episode && <>
                        <strong>{episode.title}</strong>
                        <span>{episode.members}</span>
                    </>}
                </div>

            </header>

            {!episode &&
                <div className={clsx(styles.emptyPlayer, 'd-flex', 'align-items-center', 'justify-content-center')}>
                    <strong>Selecione um podcast</strong>
                </div>
            }

            {episode && <div className={styles.currentEpisodeMetaImage}>
                <Image width={592} height={592} src={episode.thumbnail} objectFit="cover" />
            </div>}

            <footer className={clsx(!episode ? styles.empty : '', 'align-self-stretch')}>
                <div className={clsx(styles.progress, 'd-flex', 'align-items-center')}>

                    <span>{formatTimeToString(progress)}</span>

                    <div className={clsx(styles.slider)} >
                        {!episode && <div className={clsx(styles.emptySlider)} />}
                        {episode && <Slider
                            max={episode.duration}
                            value={progress}
                            trackStyle={{ backgroundColor: 'var(--green-500)' }}
                            railStyle={{ backgroundColor: 'var(--purple-300)' }}
                            handleStyle={{ borderColor: 'var(--green-500)', borderWidth: 4, width: 16, height: 16, marginTop: '-6px' }}
                            onChange={handleSeek}
                        />}
                    </div>

                    <span>{formatTimeToString(episode?.duration ?? 0)}</span>

                </div>

                <div className={clsx(styles.buttons, 'd-flex', 'align-items-center', 'justify-content-center')}>
                    <button type="button" disabled={!episode || episodeList.length === 1} onClick={toggleShuffle} className={isShuffling ? styles.isActive : ''}>
                        <img src="/images/shuffle.svg" alt="Embaralhar" />
                    </button>
                    <button type="button" disabled={!episode || !hasPrevious} onClick={playPrevious} >
                        <img src="/images/play-previous.svg" alt="Tocar anterior" />
                    </button>
                    <button type="button" className={clsx(styles.playButtons)} disabled={!episode} onClick={togglePlay}>

                        {!isPlaying && <img src="/images/play.svg" alt="Tocar" />}
                        {isPlaying && <img src="/images/pause.svg" alt="Pausar" />}

                    </button>
                    <button type="button" disabled={!episode || !hasNext} onClick={playNext}>
                        <img src="/images/play-next.svg" alt="Tocar próxima" />
                    </button>
                    <button type="button" disabled={!episode} onClick={toggleLoop} className={isLooping ? styles.isActive : ''}>
                        <img src="/images/repeat.svg" alt="Repetir" />
                    </button>
                </div>

            </footer>

            {episode && (
                <audio
                    ref={audioRef}
                    src={episode.url}
                    autoPlay
                    loop={isLooping}
                    onEnded={handleEpisodeEnded}
                    onPlay={() => setPlayingState(true)}
                    onPause={() => setPlayingState(false)}
                    onLoadedMetadata={setupProgressListener}
                />
            )}
        </div>
    )
}