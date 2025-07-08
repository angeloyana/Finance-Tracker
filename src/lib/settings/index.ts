import { Preferences } from '@capacitor/preferences';

import type { CurrencyCode } from '@/data/currencies';
import type { ThemeMode } from '@/types/common';

type SettingsType = {
  currencyCode: CurrencyCode;
  themeMode: ThemeMode;
};

class Settings {
  private settings: SettingsType;

  constructor() {
    this.settings = {
      currencyCode: 'USD',
      themeMode: 'system',
    };
  }

  async init(): Promise<void> {
    const [{ value: currencyCode }, { value: themeMode }] = await Promise.all([
      Preferences.get({ key: 'currencyCode' }),
      Preferences.get({ key: 'themeMode' }),
    ]);

    if (currencyCode) this.settings.currencyCode = currencyCode as CurrencyCode;
    if (themeMode) this.settings.themeMode = themeMode as ThemeMode;
  }

  async set<T extends keyof SettingsType>(key: T, value: SettingsType[T]): Promise<void> {
    await Preferences.set({ key, value });
    this.settings[key] = value;
  }

  get<T extends keyof SettingsType>(key: T): SettingsType[T] {
    return this.settings[key];
  }
}

export default new Settings();
