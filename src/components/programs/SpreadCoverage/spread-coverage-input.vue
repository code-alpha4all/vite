<template>
    <div style="width: fit-content; background-color: white;">
        <div>
            <b-sidebar id="sidebar-help" title="Help" shadow right>
                <p style="padding: 4px">
                    Metti qui le istruzioni.
                </p>
            </b-sidebar>
        </div>
        <table v-if="namespace !== 'undefined'" style="text-align: left; margin: 2px 3px 1px 0px;"> 
            <tr>
                <td style="vertical-align: top;">
                    <table>
                        <tr>
                            <td style="vertical-align: top; padding: 1px 0 0 0">  
                        <commodity-box v-bind:namespace="namespace">
                            <template v-slot:contract-aligner>
                                <contract-aligner v-bind:namespace="namespace" v-bind:title="'Aligner'"></contract-aligner>     
                            </template>
                            <template v-slot:y1>
                                <y1 v-bind:namespace="namespace"></y1>
                            </template>                   
                        </commodity-box>
                </td>
            </tr>
        </table>
        </td>
        </tr>
        </table>                   
    </div>
</template>

<script>

    import commodityBox from '@/components/commodity-box';
    import contractAligner from '@/components/contract-aligner';
    import y1 from '@/components/y1.vue';
    
    export default {
        components: {
            commodityBox,
            contractAligner,
            y1
        },
        mounted() {
            console.log("calculator-input.vue mounted() starting. this.namespace=", this.namespace);
        },
        props: ['namespace']
    };

</script>
