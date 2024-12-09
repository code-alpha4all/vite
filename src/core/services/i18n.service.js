import.meta.env.BASE_URL;

const i18nService = {
  test: (function(){ 
    console.log("testing");
    console.log('i18nService starting. import.meta.env.BASE_URL + "media/svg/flags/226-united-states.svg"=', import.meta.env.BASE_URL + "media/svg/flags/226-united-states.svg");
  })(),
  defaultLanguage: "en",

  languages: [
    {
      lang: "en",
      name: "English",
      flag: import.meta.env.BASE_URL + "media/svg/flags/226-united-states.svg"
    },
    {
      lang: "es",
      name: "Español",
      flag: import.meta.env.BASE_URL + "media/svg/flags/128-spain.svg"
    },
    {
      lang: "de",
      name: "Deutsch",
      flag: import.meta.env.BASE_URL + "media/svg/flags/162-germany.svg"
    },
    {
      lang: "it",
      name: "Italiano",
      flag: import.meta.env.BASE_URL + "media/svg/flags/013-italy.svg"
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
