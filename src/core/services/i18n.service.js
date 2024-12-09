const i18nService = {
  defaultLanguage: "en",

  languages: [
    {
      lang: "en",
      name: "English",
      flag: process.env.BASE_URL + "media/svg/flags/226-united-states.svg"
    },
    {
      lang: "es",
      name: "Español",
      flag: process.env.BASE_URL + "media/svg/flags/128-spain.svg"
    },
    {
      lang: "de",
      name: "Deutsch",
      flag: process.env.BASE_URL + "media/svg/flags/162-germany.svg"
    },
    {
      lang: "it",
      name: "Italiano",
      flag: process.env.BASE_URL + "media/svg/flags/013-italy.svg"
    }
  ].sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1),

  /**
   * Keep the active language in the localStorage
   * @param lang
   */
  setActiveLanguage(lang) {
    console.log("setActiveLanguage() starting.");
    localStorage.setItem("language", lang);
  },

  /**
   * Get the current active language
   * @returns {string | string}
   */
  getActiveLanguage() {
   // console.log("localStorage=", localStorage);
    return localStorage.getItem("language") || this.defaultLanguage;
  }
};

export default i18nService;
