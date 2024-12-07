<template>
    <div style=" width: auto; margin: -12px 0 0 0;">       

        <span style="font-weight: bold; font-size: 1.28rem; text-align: center; margin: 10px 0px -10px 75px; color: #404040">Saved Tabs</span> 
        <div class="card" id="saving-tabs-description" style=" width: auto; margin: -22px 6px 0px 5px; border: 1px solid darkgray; 
        font-size: 1.0rem; text-align: left;  color: rgb(7, 85, 163);">
            <div class="card-body">
                <p class="card-text"><b>Use the input box</b> below to name and save your tabs. You can add folders and drag and drop the saved links into them to help you organize.</p>
            </div>
        </div>
        <b-container fluid="xl" style="padding: 2px; margin: 2px 0px 2px 20px; ">
            <b-form inline v-on:submit.prevent="onSaveChart" style="margin: 5px 0px 0 -16px">
                <input size="sm" v-model="saveName" ref="saveName" type="text" class="form-control form-control-sm" id="__BVID__112" 
                       style="border: 1px solid gray; font-size: 1.1rem; margin: 3px 3px 3px -2px; width: 237px;" placeholder="Insert text to save the tab">
                <b-button v-if="saveShow" id="saving-tabs-button" ref="saveButton" size="sm" variant="primary" placeholder="Insert text to save the chart"
                          v-on:click="onSaveChart" style="background-color: #404040; color: white; font-size: 1.0rem; margin-right: 8px;
                           border: 1px solid white;">
                          Save
                </b-button>
            </b-form>

            <b-form-select v-if="$store.state.user.role === 'superadmin'" style="border:1px solid gray; margin: 4px 0px 0 -18px; width: 288px"
                           v-model="userEmail"
                           :options="usersOptions"></b-form-select> 

            <div v-if="$store.state.user.role === 'superadmin'" style="text-align: center; margin: 4px 30px -15px 0">
                <b-form-group label="" v-slot="{ ariaDescribedby }">
                    <b-form-checkbox-group
                        id="checkbox-group-1"
                        v-model="selectedDisplayOptions"
                        :options="displayOptions"
                        :aria-describedby="ariaDescribedby"
                        name="flavour-1"
                        ></b-form-checkbox-group>
                </b-form-group>
            </div>

            <div v-if="data !== null && selectedDisplayOptions.includes('tree')" id="saving-tabs-list"
                 style="color: #0755A3;; background-color: white; margin: 2px 24px 2px -17px; border: 1px solid darkgray;
                 font-size: 1rem; border-radius: 3px; width: auto">
                <b-button id="saving-add-folder" size="sm" variant="secondary" @click="addNode"
                          style="margin: 4px; text-align: left; border: 1px solid darkgray; font-weight: bold; color: #0755A3;">Add Folder</b-button>
                <vue-tree-list
                    @click="onClick"
                    @change-name="onChangeName"
                    @update="onUpdate"
                    @delete-node="onDel"
                    @add-node="onAddNode"
                    :model="data"
                    default-tree-node-name="new folder"
                    default-update-name="update database"
                    default-leaf-node-name="new chart"
                    v-bind:default-expanded="false"
                    add-leaf-node-disabled = "true"
                    style="font-size: 1.0rem; line-height: 1.0em; width: fit-content"
                    id="left">
                    <template v-slot:leafNameDisplay="slotProps">
                        <span>
                            {{ slotProps.model.name }} <span class="muted"></span>
                        </span>
                    </template>
                    <span class="icon" slot="addTreeNodeIcon"><i class="far fa-folder" style="color: black; margin: 0 4px 0 0"></i></span>
                    <span class="icon" slot="addLeafNodeIcon">＋</span>
                    <span class="icon" slot="editNodeIcon"><i class="far fa-edit" style="color: black; margin: 1px 2px 1px 2px"></i></span>
                    <span class="icon" slot="updateNodeIcon"><i class="fa fa-refresh" style="color: black; margin: 1px 2px 1px 2px"></i></span>
                    <span class="icon" slot="delNodeIcon"><i class="far fa-trash-alt" style="color: black; margin: 1px 2px 1px 2px"></i></span>
                    <span class="icon" slot="leafNodeIcon"></span>
                    <span class="icon" slot="treeNodeIcon"><i class="far fa-folder" style="color: black; margin: 1px 2px 1px 2px"></i></span>
                </vue-tree-list>
            </div>

            <div v-if="selectedDisplayOptions.includes('flat')" style="margin: 7px 0px 0 -18px">
                <b-list-group v-for="(number, i) in sortedSavedCharts" v-bind:key="i">
                    <b-list-group-item button v-on:click="onFlatClick(sortedSavedCharts[i].id)"
                                       style="border:1px solid darkgray; color: black; width: 250px">{{sortedSavedCharts[i].saveName}}</b-list-group-item>
                </b-list-group>
            </div>


        </b-container>
    </div>

</template>

<style scoped>
   
    .toggle {
        cursor: pointer;
    }

    .card-text {
        margin: -17px !important;
    }
</style>

<script>

    function sortFn(b, a) {
        // console.log("a=", a, " b=", b);
        let aIsFolder = !a.isLeaf;
        let bIsFolder = !b.isLeaf;
        //console.log("aIsFolder=", aIsFolder, " bIsFolder=", bIsFolder);

        if (aIsFolder && bIsFolder || !aIsFolder && !bIsFolder) {
            let returnObject = a.name.localeCompare(b.name);
            // console.log("returnObject=", returnObject);
            return returnObject;
        } else {
            return aIsFolder ? -1 : 1;
        }
    }

    function sortNodesAndChildren(nodes) {
        // console.log("sortNodesAndChildren() starting.");
        return nodes
                .sort(sortFn)
                .forEach(function (node) {
                    if (typeof node.children !== 'undefined' && node.children.length) {
                        sortNodesAndChildren(node.children);
                    }
                })
    }

    import Vue from 'vue';
    import { VueTreeList, Tree, TreeNode } from 'vue-tree-list-modified-for-saved-charts';
    import * as fb from '@/firebase';
    // import savedChartsSearch from "@/components/saved-charts-search.vue";

    Vue.use(VueTreeList);

    export default {
        components: {
            VueTreeList
        },
        mounted() {
            // console.log("mounted() starting. this.namespace=", this.namespace);
            this.userEmail = this.$store.state.user.email;
        },
        props: {
            namespace: {
                type: String
            },
            defaultAddTreeNodeTitle: {
                type: String,
                default: 'Add Folder'
            }
        },
        data: function () {
             return{
                json: "",
                saveName: "",
                hide: 'hide',
                show: 'show',
                saveShow: true,
                savedCharts: [],
                selectedDisplayOptions: ["tree"],
                displayOptions: [
                    {text: 'tree view', value: 'tree'},
                    {text: 'flat view', value: 'flat'}
                ],
                // layout: [],
                oldName: "",
                newTree: {},
                data: null,
                initialized: false,
                users: [],
                userEmail: "",

          
        }
    },

        firestore: {
            users: fb.usersCollection,
        },
        computed: {
            usersOptions() {
                return this.users.map(x => x.email);
            },
            email() {
                // console.log("this.$store.state.user.email=", this.$store.state.user.email);
                return this.$store.state.user.role === 'superadmin' ? this.userEmail : this.$store.state.user.email;
            },
            sortedSavedCharts() {
                return this.savedCharts.slice().sort(function (a, b) {
                    return (a.saveName > b.saveName) ? 1 : ((b.saveName > a.saveName) ? -1 : 0);
                });
            },
            program() {
                // console.log("program=", this.$store.state[this.namespace].program);
                return typeof this.$store.state[this.namespace] === 'undefined' || typeof this.$store.state[this.namespace].program === 'undefined' ? 
                        "Tabs" : this.$store.state[this.namespace].program;
            },
            activeModuleName() {
                let activeModuleName = this.$store.getters['activeModuleName'];
                // console.log("activeModuleName=", activeModuleName);
                return activeModuleName;
            }
        },
        watch: {
            email: {
                immediate: true,
                handler(email) {
                    if (email !== "") {
                        fb.db.collection('saved-charts')
                                .doc(this.email).collection('layout').doc('layout-document')
                                .get()
                                .then((doc) => {
                                    if (doc.exists) {
                                       // console.log("Document data:", doc.data());
                                        let layout = JSON.parse(JSON.stringify(doc.data().layout));
                                        sortNodesAndChildren(layout);
                                       // console.log("layout=", layout);
                                        this.data = new Tree(layout);
                                        this.initialized = true;
                                    } else {
                                        // doc.data() will be undefined in this case
                                        console.log("No such document!");
                                        this.data = new Tree([/*{name: 'root', id: 1, pid: 0, children: []}*/]);
                                        this.initialized = true;
                                    }
                                }).catch((error) => {
                            console.log("Error getting document:", error);
                            console.log("No such document!");
                            this.data = new Tree([/*{name: 'root', id: 1, pid: 0, children: []}*/]);
                            this.initialized = true;
                        });

                        this.$bind('savedCharts', fb.db.collection('saved-charts').doc(email).collection('charts'));
                    }
                }
            },
            data: {
                handler(/*data*/) {
                    // console.log("watching data. this.oldName=", this.oldName + " this.initialized=", this.initialized);
                    if (this.oldName === "") {
                        if (this.initialized) {      // This is correct.
                            let layout = this.getNewTree().children;
                            if (typeof layout === 'undefined') {
                                layout = [];
                            }
                            // console.log("data=", data);
                           // console.log("layout=", layout);
                            fb.db.collection('saved-charts')
                                    .doc(this.email)
                                    .collection('layout')
                                    .doc('layout-document')
                                    .set({"layout": layout})
                                    .then(() => {
                                        // console.log('layout saved.')
                                    });
                        }
                    }
                },
                deep: true
            }
        },
        methods: {
            tourClickHandler(){
                    console.log("tourClickHandler() starting.");
                    this.$tours['savingTabsTour'].start();
            },
            getNewTree: function () {
                // console.log("getNewTree() starting.");
                let vm = this
                function _dfs(oldNode) {
                    // console.log("oldNode=", oldNode);

                    let newNode = {}

                    for (let k in oldNode) {
                        if (k !== 'children' && k !== 'parent') {
                            newNode[k] = oldNode[k]
                        }
                    }
                    // console.log("newNode=", newNode);

                    if (oldNode.children && oldNode.children.length > 0) {
                        newNode.children = []
                        for (let i = 0, len = oldNode.children.length; i < len; i++) {
                            newNode.children.push(_dfs(oldNode.children[i]))
                        }
                    }
                    return newNode
                }

                // vm.newTree = _dfs(vm.data);
                return _dfs(vm.data);
            },
            onDel(node) {
                console.log("onDel() starting. node=", node);
                if (node.isLeaf) {
                    if (node.name !== "") {
                        this.removeChart(node.id);
                        node.remove();
                    }
                } else {
                    if (node.children !== null) {
                        let numberOfChildren = node.children.length;
                        console.log("numberOfChildren=", numberOfChildren);
                        if (numberOfChildren === 0) {
                            node.remove();
                        } else {
                            alert("You can only delete empty folders.");
                        }
                    } else {
                        node.remove();
                    }
                }
            },
            onUpdate(node) {
                console.log("onUpdate() starting. node=", node);
                let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                // let saveName = generalForm.saveName;
                let parent = node.parent;

                const {name} = node;
                console.log("parent=", parent);

                this.saveChart(name, generalForm)
                        .then(result => {
                            let newNode = new TreeNode({name: name, isLeaf: true, addLeafNodeDisabled: true, id: result.id})
                            if (parent !== null) {
                                if (!parent.children) {
                                    parent.children = [];
                                }
                                parent.addChildren(newNode);
                                this.onDel(node);
                            }
                        });
            },
            onChangeName(params) {
                console.log("onChangeName() starting. params=", params, " this.oldName=", this.oldName);
                if (this.oldName === "") {
                    this.oldName = params.oldName;
                }
                if (typeof params.eventType !== 'undefined') {
                    console.log("Changing name.");
                    console.log("this.oldName=", this.oldName);

                    if (params.isLeaf) {
                        fb.db.collection("saved-charts").doc(this.email).collection("charts").doc(params.id)
                                .update({saveName: params.newName})
                                .then(() => {
                                    console.log("Chart successfully updated!");
                                    this.oldName = "";
                                })
                                .catch((error) => {
                                    // The document probably doesn't exist.
                                    console.error("Error updating document: ", error);
                                });

                        let layout = this.getNewTree().children;
                        if (typeof layout === 'undefined') {
                            layout = [];
                        }
                        // console.log("layout=", layout);
                        fb.db.collection('saved-charts').doc(this.email).collection('layout').doc('layout-document')
                                .set({"layout": layout})
                                .then(() => {
                                    console.log('layout saved.')
                                });
                    } else {
                        let layout = this.getNewTree().children;
                        if (typeof layout === 'undefined') {
                            layout = [];
                        }
                        // console.log("layout=", layout);
                        fb.db.collection('saved-charts')
                                .doc(this.email).collection('layout').doc('layout-document').set({"layout": layout})
                                .then(() => {
                                    console.log('layout saved.');
                                    this.oldName = "";
                                });
                    }
                }
            },

            onAddNode(params) {
                console.log("onAddNode() starting. params=", params);
                params.addLeafNodeDisabled = true;
            },
            addLeafHighlight(id) {
                // console.log("addLeafHighlight() starting.");
                document.getElementById(id).style.fontWeight = "bold";
                document.getElementById(id).style.color = "blue";
                document.getElementById(id).classList.add("highlightedLeaf");

                let updateNode = document.getElementById(id).getElementsByClassName("fa fa-refresh")[0];
                // console.log("updateNode=", updateNode);
                updateNode.style.visibility = "visible";

            },
            removeLeafHighlight() {
                // console.log("removeLeafHighlight() starting.");
                let highlightedLeaf = document.getElementsByClassName("highlightedLeaf");
                // console.log("highlightedLeaf=", highlightedLeaf);

                if (highlightedLeaf.length > 0) {
                    highlightedLeaf.forEach(x => {
                        // console.log(" x=", x);
                        x.style.fontWeight = "normal";
                        x.style.color = "#0755A3";
                        x.classList.remove("highlightedLeaf");

                        let updateNode = x.getElementsByClassName("fa fa-refresh")[0];
                        // console.log("updateNode=", updateNode);
                        updateNode.style.visibility = "hidden";
                    })
                }
            },
            onClick(params) {
                console.log("onClick() starting. params=", params);
                //  console.log("params.editable=", params.editable);

                params.toggle();

                this.removeLeafHighlight();

                let that = this;
                if (params.isLeaf) {
                    this.addLeafHighlight(params.id);
                    if (!params.editable) {


                        this.getChart(params.id)
                                .then(chart => {
                                  that.$store.dispatch('newTabWithInitialState', chart);
                                });
                    }
                }
            },
            onFlatClick(id) {
                // console.log("onFlatClick() starting. id=", id);
                let that = this;
                this.getChart(id)
                        .then(chart => {
                            console.log("chart=", chart);
                            that.$store.dispatch('newTabWithInitialState', chart);
                            this.saveName = chart.saveName;
                        });
            },
            addNode() {
                //  console.log("addNode() starting.");
                let node = new TreeNode({name: 'new folder', isLeaf: false, addLeafNodeDisabled: true})
                if (!this.data.children) {
                    this.data.children = [];
                }
                this.data.addChildren(node);
            },
            addLeaf(name, id) {
                console.log("addLeaf() starting. name=", name, " this.data=", this.data, " id=", id);
                if (name !== "") {
                    let node = new TreeNode({name: name, isLeaf: true, addLeafNodeDisabled: true, id: id})
                    if (this.data !== null) {
                        if (!this.data.children) {
                            this.data.children = [];
                        }
                    }
                    this.data.addChildren(node);
                }
            },
            onSaveChart() {
                console.log("onSaveChart() starting.");
                console.log("this.$parent.$parent.$parent.$parent.$parent=", this.$parent.$parent.$parent.$parent.$parent)

                if (this.saveName !== "") {
                    let generalForm = JSON.parse(JSON.stringify(this.$store.state[this.namespace]));
                    if(generalForm.program === "Portfolio"){
                        alert("There is no need to save the Portfolio.");
                    } else {
                    this.saveChart(this.saveName.slice(), generalForm)
                            .then(result => {
                                this.addLeaf(this.saveName, result.id);
                                this.saveName = "";
                            });
                    }
                  //  this.$parent.$parent.$parent.$parent.$parent.$refs["saving-tabs-tour"].nextStep();  This causes infinite loop!
                } else {
                    alert("Please enter a name for this.");
                }
            },
            saveChart: function (saveName, generalForm) {
                console.log("saveChart() starting.");

                return new Promise((resolve) => {
                    let language = "en";
                    console.log("saveName=" + saveName);

                    language = "en";
                    console.log("language=" + language);
                    let subscribersOnlyMessage, enterNameMessage;
                    if (language == "en") {
                        subscribersOnlyMessage = "Only subscribers can save charts.";
                        enterNameMessage = "Please enter a name for this chart.";
                    } else if (language == "de") {
                        subscribersOnlyMessage = "Nur Abonnenten kÃ¯Â¿Â½nnen Diagramme speichern.";
                        enterNameMessage = "Bitte geben Sie einen Namen fÃ¯Â¿Â½r diese Tabelle ein.";
                    } else if (language == "es") {
                        subscribersOnlyMessage = "SÃ¯Â¿Â½lo los suscriptores pueden guardar grÃ¯Â¿Â½ficos.";
                        enterNameMessage = "Introduzca un nombre para esta tabla.";
                    }

                    if (this.email == "" || this.email == "guest") {
                        alert(subscribersOnlyMessage);
                    } else if (saveName == "") {
                        alert(enterNameMessage);
                    } else {
                        delete generalForm.browserSideOnly;
                        // delete generalForm.playback;
                        generalForm.saveName = saveName;
                        //    generalForm.language = $('#language').val();
                        console.log("generalForm", generalForm);

                        fb.db.collection('saved-charts')
                                .doc(this.email)
                                .collection('charts')
                                .add(generalForm)
                                .then((docRef) => {
                                    console.log("Document written with ID: ", docRef.id);
                                    console.log('chart saved.');
                                    resolve({id: docRef.id});
                                });
                    }
                });
            },
            removeChart: function (id) {
                console.log("removeChart() starting. id=", id);
                fb.db.collection("saved-charts").doc(this.email).collection("charts").doc(id).delete().then(() => {
                    console.log("chart deleted.");

                    let layout = this.getNewTree().children;
                    sortNodesAndChildren(layout);
                    // console.log("layout=", layout);
                    this.data = new Tree(layout);
                }).catch((error) => {
                    console.error("Error removing document: ", error);
                });
            },
            getChart: function (id) {
                console.log("getChart() starting. id=", id);
                return new Promise((resolve) => {
                    fb.db.collection("saved-charts").doc(this.email).collection("charts").doc(id).get()
                            .then((doc) => {
                                if (doc.exists) {
                                    // console.log("Document data:", doc.data());
                                    resolve(doc.data());
                                } else {
                                    // console.log("No such document!");
                                    resolve("No such document!");
                                }
                            }).catch((error) => {
                        console.log("Error getting document:", error);
                    });
                });
            }
        }
    }
</script>
