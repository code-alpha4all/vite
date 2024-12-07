<template>
    <div  style="border: 0px solid gray; padding: 0px; margin: -17px 0 3px 0">

        <div class="card" style="width: 97.5%; border: 1px solid darkgray; font-size: 1.0rem; text-align: left; margin: 5px 0 14px 5px; padding: 0px; color: rgb(7, 85, 163);">
            <div class="card-body">
                <p class="card-text">The box below contains the specs for the current tab. <b>To share,</b> click the <b>Copy</b> button and paste the results into an email. 
                    The recipient should clear the box, paste the specs in, and press one of the other buttons.</p>
            </div>
        </div>

        <div style="text-align: center">
            <b-button size="sm" style="background-color: darkblue; color: white; font-size: 1.0rem; margin-right: 8px" @click="copy">
                Copy
            </b-button>

            <b-button size="sm" style="background-color: darkblue; color: white; font-size: 1.0rem; margin-right: 8px" @click="updateState">
                Update Tab
            </b-button>

            <b-button size="sm" style="background-color: darkblue; color: white; font-size: 1.0rem;" @click="createNewTab">
                Create Tab
            </b-button> 
        </div>

         <b-row align-h="center">
            <b-form-textarea        
                id="json"
                v-model="jsonString"
                rows="30"
                style=" width: 92%; margin-top: 5px; border: 1px solid gray; line-height: 1.15em; font-size: 0.88rem; color: rgb(7, 85, 163);"
                spellcheck="false"></b-form-textarea>  
        </b-row>  
    </div>
</template>

<script>

    function prettyPrintArray(json) {
        if (typeof json === 'string') {
            json = JSON.parse(json);
        }
        let output = JSON.stringify(json, function (k, v) {
            if (v instanceof Array)
                return JSON.stringify(v);
            return v;
        }, 2).replace(/\\/g, '')
                .replace(/"\[/g, '[')
                .replace(/\]"/g, ']')
                .replace(/"\{/g, '{')
                .replace(/\}"/g, '}');

        return output;
    }

    export default {
        mounted() {
             console.log("state-editor.vue mounted() starting. this.namespace=", this.namespace);
             this.localState = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
        },
        props: ["namespace"],
        data() {
            return {
                localState: {},
            };
        },
        computed: {
            /*  json() {
             // console.log("get() json");
             if (this.namespace !== null) {
             let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
             // delete generalForm.browserSideOnly;
             // delete generalForm.playback;
             //  delete generalForm.chartParameters.levels;
             // delete generalForm.eye;
             delete generalForm.password;
             return generalForm;
             } else {
             return "";
             }
             },*/
            jsonString: {
                get() {
                    // console.log("get() jsonString");
                    if (this.namespace !== null) {
                        let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                        delete generalForm.browserSideOnly;
                        delete generalForm.playback;
                        delete generalForm.chartParameters.levels;
                        // delete generalForm.chartParameters.annotationData;
                        delete generalForm.password;
                        return prettyPrintArray(generalForm);
                        // console.log("generalForm.chartParameters.annotationData=", generalForm.chartParameters.annotationData);
                        // return JSON.stringify(generalForm, undefined, 4);
                    } else {
                        return "";
                    }
                },
                set(jsonString) {
                    console.log("set() jsonString");
                    this.localState = JSON.parse(jsonString);
                    delete this.localState.moduleName;
                    console.log("this.localState=", JSON.parse(JSON.stringify(this.localState)));
                }}
        },
        methods: {
            updateState() {
                console.log("updateState() starting.");
                this.$store.commit(this.namespace + '/setGeneralForm', this.localState);
                this.$store.dispatch(this.namespace + '/getContractListsFromServer');
            },
            createNewTab() {
                console.log("createNewTab() starting. this.localState=", JSON.parse(JSON.stringify(this.localState)));
                this.$store.dispatch('newTabWithInitialState', JSON.parse(JSON.stringify(this.localState)));

            },
            copy() {
                console.log("copy() starting.");
                /* Get the text field */
                let copyText = document.getElementById("json");

                /* Select the text field */
                copyText.select();
                copyText.setSelectionRange(0, 99999); /* For mobile devices */

                /* Copy the text inside the text field */
                navigator.clipboard.writeText(copyText.value);

                /* Alert the copied text */
                // alert("Copied the text: " + copyText.value);
            }
        }
    };
</script>

