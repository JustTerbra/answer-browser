import { useCallback, useMemo } from 'react';
import { useSettingsStore } from '../store/settingsStore';

export const useSound = (soundFile: string) => {
  const { enableSoundCues } = useSettingsStore();

  // useMemo ensures the Audio object is not recreated on every render
  const audio = useMemo(() => new Audio(soundFile), [soundFile]);

  const play = useCallback(() => {
    if (enableSoundCues) {
      audio.currentTime = 0; // Rewind to the start
      audio.play().catch(error => {
        // Autoplay was prevented.
        console.warn("Sound playback was prevented by the browser.", error);
      });
    }
  }, [audio, enableSoundCues]);

  return { play };
};
