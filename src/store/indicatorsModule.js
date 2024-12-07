export default {
    namespaced: true,
    state: () => ({
            indicators: [{
                    id: "atr",
                    shortName: "ATR",
                    name: "Average True Range",
                    visible: false,
                    condition: "(Outright positions, only.)"
                }, {
                    id: "bb",
                    shortName: "BB",
                    name: "Bollinger Bands",
                    visible: false,
                    period: 20
                }, {
                    id: "cci",
                    shortName: "CCI",
                    name: "Commodity Channel Index",
                    visible: false,
                    period: 20,
                    source: "closes"
                }, {
                    id: "cot",
                    shortName: "COT",
                    name: "Commitment of Traders",
                    visible: false
                }, {
                    id: "macd",
                    shortName: "MACD",
                    name: "Moving Average Convergence/Divergence",
                    visible: false
                }, {
                    id: "rsi",
                    shortName: "RSI",
                    name: "Relative Strength Index",
                    visible: false,
                    period: 7
                }, {
                    id: "sma",
                    shortName: "SMA",
                    name: "Simple Moving Average",
                    visible: false,
                    length: 20
                },{
                    id: "ema",
                    shortName: "EMA",
                    name: "Exponential Moving Average",
                    visible: false,
                    length: 20
                },
                {
                    id: "vol",
                    shortName: "VOL",
                    name: "Volume and Open Interest",
                    visible: false,
                    condition: "(Outright positions, only.)"
                },{
                    id: "vp",
                    shortName: "VP",
                    name: "Volume Profile",
                    visible: false,
                    columns: 24,
                    condition: "(Outright positions, only.)"
                },{
                    id: "p/l",
                    shortName: "P/L",
                    name: "Profit/Loss Calculator",
                    visible: false
                }
            ],
        }),
    getters: {
        sortedIndicators: function (state) {
            return state.indicators.sort((a, b) => (a.shortName > b.shortName) ? 1 : -1);
        },
        selectedIndicators: function (state) {
            // console.log("state.indicators=", JSON.parse(JSON.stringify(state.indicators)));
            let selectedIndicators = state.indicators.filter(x => x.visible);
            // console.log("selectedIndicators=", selectedIndicators);
            return selectedIndicators;
        }
    },
    mutations: {
        set: function (state, {indicator, key, value}){
           // console.log("set() starting. indicator=", indicator, " key=", key, " value=", value);
            state.indicators.find(x => x.id === indicator)[key] = value;
        }
    }
};


