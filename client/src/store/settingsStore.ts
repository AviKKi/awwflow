import { create } from "zustand";

// Zustand store for secrets
interface SettingsStore {
  openAiApiKey: string;
  setOpenAiApiKey: (key: string) => void;
}

const getStoredApiKey = () => localStorage.getItem("openAiApiKey") || "";

export const useSettingsStore = create<SettingsStore>((set) => ({
  openAiApiKey: getStoredApiKey(),
  setOpenAiApiKey: (key) => {
    localStorage.setItem("openAiApiKey", key);
    set({ openAiApiKey: key });
  },
}));
