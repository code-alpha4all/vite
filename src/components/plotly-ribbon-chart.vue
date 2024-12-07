<template>
    <div v-bind:id="namespace+'-plotlyRibbonChart'">
        <div v-bind:id="namespace+'-plotlyRibbonChartInstructions'" style="color: #0755A3; font-size: 1.0rem; font-weight: normal; margin: 2px 4px 0 4px">
            Try clicking and dragging with each mouse button to discover their functionality. Also, try the scroll wheel.
            To use the zoom and rotation buttons below, click the button, then click and drag on the chart.
        </div>
        <Plotly v-show="showPlot" :data="data" :layout="layout" :display-mode-bar="true" :responsive="true" 
                :mode-bar-buttons-to-remove="modeBarButtonsToRemove" 
                v-bind:id="namespace+'-plotlyRibbonChartDiv'"
                style="height: 95vh;"></Plotly>

    </div>
</template>

<script>

    import { hexToRgb, spreadTitle, spreadUnits} from "@/js/main";
    import { Plotly } from 'vue-plotly';
    import $ from "jquery";

    export default {
        components: {
            Plotly
        },
        mounted() {
           console.log("plotly-ribbon-charts.vue mounted() starting.");
            this.runPlotly(this.parsedData);
        },
        props: ['namespace', 'parsedData'],
        data: function () {
            return{
                initialized: false,
                data: [],
                layout: {},
                modeBarButtonsToRemove: ['sendDataToCloud', 'orbitRotation', 'pan3d', 'hoverClosest3d'],
                showPlot: true
            }
        },
        computed: {
            height() {
                return $('#'+this.namespace+'-plotlyRibbonChart').parent().height();
              //  return $("#tt").parent().height();

            },
            symbols(){
                return this.$store.state.user.symbols;
            }
        },
        watch: {
            parsedData: function (parsedData) {
               // console.log("watch parsedData=", parsedData);
                /*  if (typeof parsedData.dataset !== 'undefined') {
                 this.runPlotly(parsedData);
                 } else {
                 this.showPlot = false;
                 }*/
                this.runPlotly(parsedData);
            }
        },
           methods: {
            runPlotly(dataObject) {
                console.log("runPlotly() starting.");
                console.log("dataObject=", JSON.parse(JSON.stringify(dataObject)));

                let generalForm;
                if (dataObject === null || Object.keys(dataObject).length === 0) {
                    console.log("hiding 3-d chart");
                    $('#plotlyDiv').hide();
                    this.showPlot = false;
                } else {
                    this.showPlot = true;
                    let values = dataObject.values;
                    // console.log("values =", values);
                    let names = dataObject.names;
                    // let plotlyData = {};
                    let trace = [];
                    let name = [];
                    let tickvals = [];

                    let numberOfSeries = names.length;
                   // console.log("numberOfSeries =", numberOfSeries);
                    for (let i = 1; i <= numberOfSeries; i++) {
                        let coords = {};
                        let x = [];
                        let y = [];
                        let z = [];
                        for (let j = 0; j < values.length; j++) {
                            let date = values[j].date;

                            let value = values[j][names[numberOfSeries - i]];
                            //console.log("value=", value);
                            if (typeof value !== 'undefined') {
                                z.push([value, value]);
                                y.push(date);
                                x.push([i, i + 0.06]);
                            }
                        }

                        generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                        generalForm.selected = [names[i - 1]];
                        let invertDatesMultiplier = 1;
                        let noLegSwapping = false;
                        let includeUnitMoves = true;
                        let ticker = names[i-1].includes("seasonal") ? names[i-1] : spreadTitle(JSON.parse(JSON.stringify(generalForm)), invertDatesMultiplier, noLegSwapping, this.symbols, includeUnitMoves);
                       // console.log("ticker=", ticker);
                 
                        name[numberOfSeries - i] = ticker;
                        tickvals[i - 1] = i;
                        coords.x = x;
                        coords.y = y;
                        coords.z = z;
                        coords.type = 'surface';
                        coords.showscale = false;

                        let rgbColor = hexToRgb(dataObject.colors[numberOfSeries - i]);
                        coords.colorscale = [[0, rgbColor], [1, rgbColor]];
                        trace.push(coords);
                    }
                  //  console.log("trace =", trace);
                    this.data = trace;

                    let layout = {
                        title: '',
                        showlegend: false,
                        hovermode: false,
                        autosize: true,
                        margin: {
                            l: 20,
                            r: 0,
                            b: 0,
                            t: 0,
                            // pad: 500
                        },
                        scene: {
                            xaxis: {
                                title: '',
                                ticktext: name,
                                tickvals: tickvals,
                                tickfont: {
                                    size: 11
                                }
                            },
                            yaxis: {
                                title: '',
                                tickfont: {
                                    size: 11
                                }
                            },
                            zaxis: {
                                title: {
                                    text: spreadUnits(generalForm.selected[0]),
                                    font: {
                                        family: 'verdana',
                                        size: 11
                                    },
                                    tickfont: {
                                        size: 11
                                    }
                                }
                            },
                            camera: {
                                center: {x: 0, y: 0, z: -0.2},
                                eye: function(){
                                    if(typeof dataObject.eye !== 'undefined'){
                                        return {
                                            x: dataObject.eye[0],
                                            y: dataObject.eye[1],
                                            z: dataObject.eye[2]
                                        }
                                    } else {
                                        return {
                                            x: 0,
                                            y: 0,
                                            z: 0
                                        }
                                    }
                                }
                            },
                        }
                    };
                    this.layout = layout;

                    /*  let config = {
                     // locale: language,
                     displayModeBar: true,
                     showAxisDragHandles: false,
                     modeBarButtonsToRemove: ['sendDataToCloud', 'orbitRotation', 'pan3d', 'hoverClosest3d'],
                     showLink: false,
                     responsive: true,
                     displaylogo: false
                     };
                     
                     Plotly.react('plotlyDiv', data, layout, config);
                     //  console.log("Plotly =", Plotly);
                     
                     /*      let ticks = document.getElementsByClassName('ntick');
                     console.log(" ticks =", ticks);
                     for (let i = 0; i < ticks.length; i += 1) {
                     console.log(ticks[i].getElementsByTagName('text')[0]);
                     ticks[i].getElementsByTagName('text')[0].style.fill = col[i % col.length];
                     } */
                    //    $('#plotlyDiv').show();

                    //   $('#plotlyDiv').on('plotly_relayout', function (/*event*/) {
                    //  let eye = event.target.layout.scene.camera.eye;
                    //  let eyeVector = [eye.x, eye.y, eye.z];
                    // console.log("eye =", eye);
                    // console.log("eyeVector =", eyeVector);
                    // generalForm.eye = eyeVector;
                    // parsedData.eye = eyeVector;

                    //  programVue.$store.commit('generalForm/setEye', eyeVector);
                    //  }); 
                }
               // console.log("runPlotly() done.");

              // console.log("this.$parent.$parent.$parent.$parent.$parent=", this.$parent.$parent.$parent.$parent.$parent);
               this.$parent.$parent.$parent.$parent.$parent.setChartHeight();
            }
        }
    };

</script>
