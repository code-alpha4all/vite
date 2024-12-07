<template>
  <div>
    <div>
    <span style="color: darkblue; padding: 3px 3px 3px 13px">
    used={{ used }}</span>MB

    <span style="color: darkblue; padding: 3px">
    total={{ total }}</span>MB

    <div id="memory-monitor-div" style="height: 200px; width: 100%;"></div>
  </div>
  </div>
</template>

<script>


import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export default {
  series: {}, // <-- non-reactive property
  mounted() {
    console.log("memory-monitor.vue mounted() starting.");
    this.createChart();    
  },
  data(){
    return{
        used: null,
        total: null
    };
  },
  computed: {
    showMemoryChart: {
      get(){
                    return this.$store.state.user.showMemoryChart;
                },
                set(showMemoryChart){
                    this.$store.commit("user/setShowMemoryChart", showMemoryChart);
                }
    }
  },
  watch: {
    showMemoryChart(showMemoryChart) {
                console.log("watch: showMemoryChart=", showMemoryChart);
                let that = this;
                if (showMemoryChart) {
                  setTimeout(function(){
                    console.log("AAAAAAAAAAAAAA");
                    that.createChart();
                  }, 1000);
           
                }
            },
  },
  methods: {
     addData() {
  var lastDataItem = this.$options.series.dataItems[this.$options.series.dataItems.length - 1];

  var lastValue = lastDataItem.get("valueY");
  var newValue = this.used;
  var lastDate = new Date(lastDataItem.get("valueX"));
  var time = am5.time.add(new Date(lastDate), "second", 1).getTime();
 // this.$options.series.data.removeIndex(0);
  this.$options.series.data.push({
    date: time,
    value: newValue
  })

  var newDataItem = this.$options.series.dataItems[this.$options.series.dataItems.length - 1];
  newDataItem.animate({
    key: "valueYWorking",
    to: newValue,
    from: lastValue,
    duration: 600,
    easing: am5.ease.linear
  }); 

},
    generateChartData() {
  var chartData = [];
  var firstDate = new Date();
  firstDate.setDate(firstDate.getDate() - 1000);
  firstDate.setHours(0, 0, 0, 0);

  for (var i = 0; i < 1; i++) {
    var newDate = new Date(firstDate);
    newDate.setSeconds(newDate.getSeconds() + i);


    chartData.push({
      date: newDate.getTime(),
      value: this.used
    });
  }
  return chartData;
},
     updateMemoryUsage() {
      if (performance && performance.memory) {
        this.used = Math.trunc(performance.memory.usedJSHeapSize / (1024 * 1024));
        this.total = Math.trunc(performance.memory.totalJSHeapSize / (1024 * 1024));
      } else {
       // memoryMonitor.textContent = "Memory information not available";
      }
    },
    createChart(){
      console.log("createChart() starting.");
      const memMonitorDiv = document.getElementById("mem-monitor-div");
      console.log("memMonitorDiv=", memMonitorDiv);
     // if(memMonitorDiv !== null){
      let that = this;
    setInterval(that.updateMemoryUsage, 1000); // Update every 1 second
    
    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    var root = am5.Root.new("memory-monitor-div");


// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
  am5themes_Animated.new(root)
]);


// Generate random data



var data = this.generateChartData();
console.log("data=", data);

// Create chart
// https://www.amcharts.com/docs/v5/charts/xy-chart/
var chart = root.container.children.push(am5xy.XYChart.new(root, {
  focusable: true,
  panX: true,
  panY: true,
  wheelX: "panX",
  wheelY: "zoomX",
  pinchZoomX:true,
  paddingLeft: 0
}));



// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
  maxDeviation: 0.5,
  groupData: false,
  extraMax:0.1, // this adds some space in front
  extraMin:-0.1,  // this removes some space form th beginning so that the line would not be cut off
  baseInterval: {
    timeUnit: "second",
    count: 1
  },
  renderer: am5xy.AxisRendererX.new(root, {
    minorGridEnabled: true,
    minGridDistance: 50
  }),
  tooltip: am5.Tooltip.new(root, {})
}));

var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  renderer: am5xy.AxisRendererY.new(root, {})
}));


// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
 this.$options.series = chart.series.push(am5xy.LineSeries.new(root, {
  name: "Series 1",
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "value",
  valueXField: "date",
  tooltip: am5.Tooltip.new(root, {
    pointerOrientation: "horizontal",
    labelText: "{valueY}"
  })
}));

this.$options.series.data.setAll(data);

// Update data every second
setInterval(function () {
  that.addData();
}, 1000)





// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
chart.appear(1000, 100);
    }

  }
//}
};
</script>
