<template>
<div>
  <ul class="navi navi-hover py-4" style="margin: 0px 0 0 -15px">
    <template v-for="(item, i) in languages" :key="i">
      <li
        class="navi-item"
        :class="{ 'navi-item-active': isActiveLanguage(item.lang) }"
      >
        <a
          href="#"
          class="navi-link"
          v-bind:data-lang="item.lang"
          v-on:click="selectedLanguage"
        >
          <span class="symbol symbol-20 mr-3">
            <img :src="item.flag" alt="" />
          </span>
          <span class="navi-text">{{ item.name }}</span>
        </a>
      </li>
    </template>
  </ul>
</div>
</template>

<script>
import i18nService from "@/core/services/i18n.service.js";

export default {
  name: "KTDropdownLanguage",
  data() {
    return {
      languages: i18nService.languages
    };
  },
  methods: {
    selectedLanguage(e) {
     // console.log("selectedLanguage(0 starting. e=", e);
      const el = e.target.closest(".navi-link");
      const lang = el.getAttribute("data-lang");

      i18nService.setActiveLanguage(lang);

      this.$emit("language-changed", this.languages.find(val => {
          return val.lang === lang;
        })
      );

      window.location.reload();
    },
    isActiveLanguage(current) {
     // console.log("current=", current);
      return this.activeLanguage === current;
    }
  },
  computed: {
    activeLanguage() {
      return i18nService.getActiveLanguage();
    }
  }
};
</script>
