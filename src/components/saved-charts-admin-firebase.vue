<template>
    <div style="border: 1px solid darkgray; height: 100%; width: 100%; padding: 15px;">

        <a id="downloadAnchorElem" style="display:none"></a>

        selectedCharts:{{selectedCharts}}
        <table style="width: 100%;">
            <tr>
                <td style="width: 100%;">
                    database<b-form-select v-model="database" :options="databaseOptions" 
                                   style="border: 1px solid gray; width: 100%;"></b-form-select>
            user<b-form-select v-model="email" :options="emails" 
                               style="border: 1px solid gray; width: 100%;"></b-form-select>

            <div v-if="savedCharts !== null && typeof savedCharts !== 'undefined'">
                charts<b-form-select multiple v-model="selectedCharts" :options="savedCharts.map(x => x.saveName)" 
                                     v-bind:select-size="Object.values(savedCharts).length" 
                                     style="border: 1px solid gray; width: 100%;"></b-form-select> 
            </div>
            </td>
            </tr>
        </table>
    </div>
</template>

<script>

import * as fb from '../firebase';

export default {
    mounted() {
        console.log("saved-charts-admin.vue mounted() starting.");
        this.users = this.firestoreUsers;
    },
    props: ['namespace'],
    data: function () {
        return {
            database: "firestore",
            databaseOptions: [
                {value: 'firestore', text: 'firestore'}
            ],
            user: null,
            users: [],
            email: "danscarr9@gmail.com",
            savedCharts: [],
            layout: [],
            selectedCharts: []
        }
    },
    firestore: {
        firestoreUsers: fb.db.collection('users'),
    },
    computed: {
        emails: {
            get() {
                return this.users.map(user => user.email);
            },
            set(emails) {
                emails.forEach(email => {
                    console.log("email=", email);
                    this.users.push({email: email});

                });
            }
        }
    },
    watch: {
        email: {
            // call it upon creation too
            immediate: true,
            handler(email) {
                console.log("watching email=", email);
                if (email !== "") {
                    this.$bind('savedCharts', fb.db.collection('saved-charts').doc(email).collection('charts'));
                    this.$bind('layout', fb.db.collection('saved-charts').doc(email).collection('layout').doc('layout-document'));
                }
            }
        }
    },
    methods: {
        saveChart(generalForm) {
            console.log("saveChart() starting.");
            // let json = JSON.stringify(generalForm, null, 1);
            console.log("generalForm=", generalForm);
            let key = generalForm.saveName.replace(/\./g, 'Period').replace(/\//g, 'ForwardSlash');
            generalForm.key = key;
            console.log("key=", key);
            fb.db.collection('saved-charts')
                    .doc(this.email)
                    .collection('charts')
                    .add(generalForm)
                    .then((docRef) => {
                        console.log("Document written with ID: ", docRef.id);
                        console.log('chart saved.');

                        console.log("this.layout.layout.slice()=", JSON.parse(JSON.stringify(this.layout.layout)));
                        let newLeaf = {
                            id: docRef.id,
                            name: generalForm.saveName,
                            isLeaf: true,
                            addLeafNodeDisabled: true
                        };
                        console.log("newLeaf=", newLeaf);

                        let temp = JSON.parse(JSON.stringify(this.layout.layout));
                        console.log("temp=", temp);

                        temp.push(newLeaf);
                        console.log("temp=", temp);

                        fb.db.collection('saved-charts')
                                .doc(this.email)
                                .collection('layout')
                                .doc('layout-document')
                                .set({"layout": temp})
                                .then(() => {
                                    console.log('layout saved.')
                                });
                    });
        },
        async  getAllChartsAndIds() {
            const charts = await fb.db.collection('saved-charts')
                    .doc(this.email)
                    .collection('charts');

            return charts.get().then((querySnapshot) => {
                const tempDoc = querySnapshot.docs.map((doc) => {
                    return {id: doc.id, ...doc.data() }
                    })
                    // console.log("tempDoc=", tempDoc);
                    return tempDoc;
                });
            },
            saveChartWithId(generalForm) {
                console.log("saveChart() starting. saveName=", generalForm.saveName, " id=", generalForm.id);
                // let json = JSON.stringify(generalForm, null, 1);
                console.log("generalForm=", generalForm);
                fb.db.collection('saved-charts')
                        .doc(this.email)
                        .collection('charts')
                        .doc(generalForm.id)
                        .set(generalForm)
                        .then((docRef) => {
                            console.log("Document written with ID: ", docRef.id);
                            console.log('chart saved.');                           
                        });
            },
            saveLayout(layout) {
                console.log("saveLayout() starting.");
                fb.db.collection('saved-charts')
                        .doc(this.email)
                        .collection('layout')
                        .doc('layout-document')
                        .set({"layout": layout})
                        .then(() => {
                            console.log('layout saved.')
                        });
            }
        }
    };

</script>

