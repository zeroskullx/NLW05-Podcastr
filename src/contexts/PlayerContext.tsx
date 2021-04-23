import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
    // id: string;
    // publishedAt: string;
    // durationAsString: string;
    // description: string;
}

interface PlayerContextData {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
    isLooping: boolean;
    isShuffling: boolean;

    play: (episode: Episode) => void;
    togglePlay: () => void;
    setPlayingState: (state: boolean) => void;
    setIsPlaying: Dispatch<SetStateAction<boolean>>;
    playList: (list: Episode[], index: number) => void;
    playNext: () => void;
    playPrevious: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    clearPlayerState: () => void;
}
export const PlayerContext = createContext({} as PlayerContextData);

interface PlayerProviderProps {
    children: ReactNode;
}

export function PlayerProvider({ children }: PlayerProviderProps) {

    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);

    const play = (episode: Episode) => {
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
    }

    const playList = (list: Episode[], index: number) => {
        setEpisodeList(list)
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

    const togglePlay = () => {
        setIsPlaying(!isPlaying)
    }

    const toggleLoop = () => {
        setIsLooping(!isLooping)
    }

    const toggleShuffle = () => {
        setIsShuffling(!isShuffling)
    }

    const setPlayingState = (state: boolean) => {
        setIsPlaying(state);
    }

    const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;
    const playNext = () => {
        if (isShuffling) {
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
            setCurrentEpisodeIndex(nextRandomEpisodeIndex)
        } else if (hasNext) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1);
        }
    }

    const hasPrevious = currentEpisodeIndex > 0;
    const playPrevious = () => {
        if (hasPrevious) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1);
        }
    }

    const clearPlayerState = () => {
        setEpisodeList([]);
        setCurrentEpisodeIndex(0);
    }

    return (
        <PlayerContext.Provider value={{
            episodeList,
            currentEpisodeIndex,
            isPlaying,
            hasNext,
            hasPrevious,
            isLooping,
            isShuffling,

            play,
            togglePlay,
            setPlayingState,
            setIsPlaying,
            playList,
            playNext,
            playPrevious,
            toggleLoop,
            toggleShuffle,
            clearPlayerState,
        }}>
            {children}
        </PlayerContext.Provider>
    )
}

export const usePlayer = () => {
    return useContext(PlayerContext);
}