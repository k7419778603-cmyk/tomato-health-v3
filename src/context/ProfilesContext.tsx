import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { defaultProfiles } from "../data/defaults";
import type { Profile } from "../types";
import { safeRandomId } from "../utils/id";

const PROFILES_KEY = "tomato.health.profiles.v1";
const ACTIVE_KEY = "tomato.health.activeProfileId.v1";

type ProfilesContextValue = {
  profiles: Profile[];
  activeProfileId: string;
  activeProfile: Profile;
  setActiveProfileId: (id: string) => void;
  saveProfile: (profile: Omit<Profile, "id" | "updatedAt">) => void;
  updateActiveProfile: (profile: Omit<Profile, "id" | "updatedAt">) => void;
};

const ProfilesContext = createContext<ProfilesContextValue | null>(null);

const hydrateProfile = (input: Partial<Profile>): Profile => ({
  id: input.id ?? safeRandomId(),
  name: input.name ?? "未命名",
  gender: input.gender ?? "其他",
  age: input.age ?? 30,
  chronicType: input.chronicType ?? "高血压",
  coreMetric: input.coreMetric ?? "待填写",
  focusArea: input.focusArea ?? "日常稳态管理",
  goal: input.goal ?? "建立可持续生活节奏",
  statusTags: input.statusTags ?? [],
  checkupAlert: input.checkupAlert ?? "none",
  updatedAt: input.updatedAt ?? new Date().toISOString(),
});

const readProfiles = (): Profile[] => {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    if (!raw) return defaultProfiles;
    const parsed = JSON.parse(raw) as Partial<Profile>[];
    if (parsed.length === 0) return defaultProfiles;
    return parsed.map(hydrateProfile);
  } catch {
    // localStorage 被禁用/不可用时，保证页面可渲染
    return defaultProfiles;
  }
};

export const ProfilesProvider = ({ children }: { children: ReactNode }) => {
  const [profiles, setProfiles] = useState<Profile[]>(readProfiles);
  const [activeProfileId, setActiveProfileIdState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_KEY);
      return saved ?? readProfiles()[0].id;
    } catch {
      return readProfiles()[0].id;
    }
  });

  const persist = (nextProfiles: Profile[], nextActiveId: string) => {
    setProfiles(nextProfiles);
    setActiveProfileIdState(nextActiveId);
    try {
      localStorage.setItem(PROFILES_KEY, JSON.stringify(nextProfiles));
      localStorage.setItem(ACTIVE_KEY, nextActiveId);
    } catch {
      // localStorage 不可用时，允许继续在内存中工作
    }
  };

  const setActiveProfileId = (id: string) => {
    setActiveProfileIdState(id);
    try {
      localStorage.setItem(ACTIVE_KEY, id);
    } catch {
      // ignore
    }
  };

  const saveProfile = (profile: Omit<Profile, "id" | "updatedAt">) => {
    if (profiles.length >= 5) return;
    const next: Profile = { ...profile, id: safeRandomId(), updatedAt: new Date().toISOString() };
    persist([...profiles, next], next.id);
  };

  const updateActiveProfile = (profile: Omit<Profile, "id" | "updatedAt">) => {
    const nextProfiles = profiles.map((item) =>
      item.id === activeProfileId ? { ...item, ...profile, updatedAt: new Date().toISOString() } : item
    );
    persist(nextProfiles, activeProfileId);
  };

  const activeProfile = useMemo(
    () => profiles.find((item) => item.id === activeProfileId) ?? profiles[0],
    [profiles, activeProfileId]
  );

  return (
    <ProfilesContext.Provider
      value={{ profiles, activeProfileId, activeProfile, setActiveProfileId, saveProfile, updateActiveProfile }}
    >
      {children}
    </ProfilesContext.Provider>
  );
};

export const useProfiles = () => {
  const context = useContext(ProfilesContext);
  if (!context) throw new Error("useProfiles must be used within ProfilesProvider");
  return context;
};
