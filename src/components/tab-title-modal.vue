<template>
    <span>

        <b-modal id="tab-title-modal" variant="primary" ok-only header-bg-variant="primary"
                 header-text-variant="'light'" title="Tab Title">

            <p style="font-size: 14px">How would you like the tab title to be generated?</p>

            <b-form-group v-slot="{ ariaDescribedby }">
                <b-form-radio-group
                    id="radio-group-2"
                    v-model="tabTitleMode"
                    :aria-describedby="ariaDescribedby"
                    name="radio-sub-component"
                    style="font-size: 24px"
                    >
                    <b-form-radio :aria-describedby="ariaDescribedby" size="lg" value="auto">automatically</b-form-radio>
                    <b-form-radio :aria-describedby="ariaDescribedby" size="lg" value="manual">name it yourself</b-form-radio>

                </b-form-radio-group>
            </b-form-group>

            <b-form-input
                v-bind:disabled="tabTitleMode === 'auto'"
                v-model="tabTitle"
                size="lg"
                placeholder="Enter tab title."
                style="height: 15px; font-weight: normal; border: 1px solid gray; margin-right: -2px; width: 80%"
                ></b-form-input>

        </b-modal>


    </span>
</template>


<script>

    import VueInputAutowidth from 'vue-input-autowidth'
    import Vue from 'vue';

    Vue.use(VueInputAutowidth);

    export default {
        mounted() {
          /*  this.$root.$on('bv::modal::hide', (bvEvent, modalId) => {
                console.log('Modal is about to be hidden', bvEvent, modalId);
                this.selectedIndicator = "";
                this.selectedPanel = "";
            });*/
        },
        props: ['namespace'],
        computed: {
            tabTitle: {
                get() {
                    return this.tabTitleMode === "auto" ? this.$store.state[this.namespace].tabTitle : this.$store.state[this.namespace].manualTabTitle;
                },
                set(tabTitle){
                    this.$store.commit(this.namespace + '/setManualTabTitle', tabTitle);
                }
            },
            tabTitleMode: {
                get() {
                    return this.$store.state[this.namespace].tabTitleMode;
                },
                set(tabTitleMode) {
                    this.$store.commit(this.namespace + '/setTabTitleMode', tabTitleMode);
                }
            },
        }
    }
</script>
