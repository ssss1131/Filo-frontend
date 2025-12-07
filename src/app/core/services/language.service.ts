import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly LANGUAGE_KEY = 'preferred-language';
  private readonly AVAILABLE_LANGUAGES = ['en', 'ru'];

  constructor(private translate: TranslateService) {
    this.initializeLanguage();
  }

  private initializeLanguage(): void {
    const savedLanguage = localStorage.getItem(this.LANGUAGE_KEY);
    const browserLang = this.translate.getBrowserLang() || 'en';
    const defaultLang = this.AVAILABLE_LANGUAGES.includes(savedLanguage!)
      ? savedLanguage!
      : this.AVAILABLE_LANGUAGES.includes(browserLang)
        ? browserLang
        : 'en';

    this.translate.use(defaultLang);
  }

  setLanguage(lang: string): void {
    if (this.AVAILABLE_LANGUAGES.includes(lang)) {
      this.translate.use(lang);
      localStorage.setItem(this.LANGUAGE_KEY, lang);
    }
  }

  getCurrentLanguage(): string {
    return this.translate.currentLang || 'en';
  }

  getAvailableLanguages(): string[] {
    return [...this.AVAILABLE_LANGUAGES];
  }
}
