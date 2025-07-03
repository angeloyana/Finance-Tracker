import { Preferences } from '@capacitor/preferences';

import type { CurrencyCodes } from '@/data/currencies';

type SettingsType = {
  currencyCode: CurrencyCodes;
};

class Settings {
  private settings: SettingsType;

  constructor() {
    this.settings = {
      currencyCode: 'USD',
    };
  }

  async init(): Promise<void> {
    const { value } = await Preferences.get({ key: 'currencyCode' });
    if (value) this.settings.currencyCode = value as CurrencyCodes;
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
