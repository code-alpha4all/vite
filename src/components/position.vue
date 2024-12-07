<template>
    <span>
    <b-form-select style="border: 0px solid gray; width: auto; border-radius: 0px"
                       size="sm"
                       v-bind:style="{color: $store.state.siteData.legColors[index], borderLeft: program === 'TradeMaps'? '0px solid gray' : '0px solid gray'}"
                       v-model="position" :options="options"></b-form-select>

        <!-- <span v-if="($store.state[this.namespace].legs !== 1 || ($store.state[this.namespace].study == 'calculator' && $store.state[this.namespace].generator=='SeasonalsGenerator')||
              $store.state[this.namespace].generator=='PercentProfitableMapGenerator' || $store.state[this.namespace].generator=='PercentProfitableMapGenerator')">
            <select v-model.number="position"
                    v-bind:size="1" 
                    v-bind:style="{color: $store.state.browserSideOnly.legColors[index], borderTop: '1px solid gray'}">
                <option v-bind:value="1">{{aLangKeys[language]['long']}}</option>
                <option v-bind:value="-1">{{aLangKeys[language]['short']}}</option>
            </select>
        </span> -->
    </span>
</template>

<script>
    module.exports = {
        props: ['namespace', 'index'],
        computed: {
            position: {
                get() {
                    return this.$store.state[this.namespace].p[this.index];
                },
                set(position) {
                    let newArray = this.$store.state[this.namespace].p.slice(0);
                    newArray[this.index] = position;
                    this.$store.commit(this.namespace + '/setP', newArray);

                    this.$store.dispatch(this.namespace + '/checkPositions', this.index);
                }
            },
            program(){
                return this.$store.state[this.namespace].program;
            },
            options() {
                return  [
                    {value: 1, text: 'long'},
                    {value: -1, text:'short'}
                ]
            },
        }
    }
</script>
