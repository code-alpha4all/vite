<template>
  <div style="margin: 10px">
    <div><h1 class="text-2xl">Playback</h1></div>

    <basic-chart-output
      v-bind:windowHeight="'700'"
      v-bind:ref="'playback'"
      v-bind:namespace="namespace"
      style="border: 1px solid darkgray;"
    ></basic-chart-output>
  </div>
</template>

<script>
    import basicChartOutput from '@/components/programs/BasicChartNew/basic-chart-output-new';

export default {
  components: {
    basicChartOutput,
  },
  created() {
    console.log("Playback.vue created() starting.");
    console.log("initialState=", initialState);
    this.$store.commit("generalFormModulePlaybackPage/setGeneralForm", initialState);
    this.$store.commit("generalFormModulePlaybackPage/setModuleName", "generalFormModulePlaybackPage");
    this.$store.dispatch("generalFormModulePlaybackPage/getContractListsFromServer");
  },
  mounted(){
    console.log("Playback.vue mounted() starting. this=", this);
    this.$children[0].getData();
  },
  data() {
    return {
      namespace: "generalFormModulePlaybackPage",
    };
  },
  computed: {
    name() {
      return this.$store.state.user.name;
    },
    email() {
      return this.$store.state.user.email;
    },
  },
  methods: {},
};

let initialState = {
  p: [1, -1, 1, 1],
  spreadP: 1,
  unitMove: [50, 50, 50, 50],
  legs: 1,
  sampleContract: ["C2021U", "O2021U", "MW2020U", "KW2020U"],
  stockArray: ["AAPL, Apple Inc.", "IBM, International Business Machines"],
  selected: ["C2022U", "ZCU21"], //["AAPL, Apple Inc."],
  barchartTicker: "ZCU21",
  title: "C2021U",
  mult: [1, 1, 1, 1],
  y1: 15,
  open: "2021-01-25",
  close: "2021-03-26",
  generator: "BasicBarsGenerator",
  program: "BasicCharts",
  study: "basic",
  language: "en",
  addBollinger: false,
  addSMA: false,
  smaLength: 20,
  addRSIPanel: true,
  addMACDPanel: false,
  addATRPanel: false,
  addVolumePanel: false,
  addCCIPanel: false,
  addVolumeProfile: false,
  showTradingPeriod: false,
  aligned: false,
  addProfitLoss: false,
  overwriteShow: false,
  rsiPeriod: 7,
  cciPeriod: 20,
  volumeProfileColumns: 24,
  cciSource: "closes",
  showBullets: true,
  showPlaybackControl: false,
  addHorizontalLine: true,
  intracommodity: false,
  stockGraphType: "line",
  showSeasonals: true,
  seasonals: [5, 15],
  truncate: 1,
  buySell: "buy",
  dataSource: "eod",
  chartParameters: {
    lastChartDate: "2020-12-31",
    balloons: false,
    skipEmptyPeriods: false,
    levels: [
      { from: 400, to: 440, color: "orange", name: "horizontal-bronze-series" },
      { from: 440, to: 500, color: "silver", name: "horizontal-silver-series" },
      { from: 500, to: 550, color: "gold", name: "horizontal-gold-series" },
    ],
    entryType: "stop",
    hiddenFeatures: {
                expiration: true,
                title: true,
                legends: true,
                horizontalScrollbar: true,
                verticalScrollbar: true
            }
  },
  playback: {
    start: "2021-02-25",
    end: "2021-05-06",
    interval: 1,
    breakpoints: [
      { date: "2021-03-01", title: "Title 1", message: "first breakpoint " },
    ],
  },
  search: {},
  instrument: "future",
  user: "A4A-user0",
  password: "M1-K8xQgmR",
};
</script>
