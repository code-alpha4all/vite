<template>
    <span>

        <table style="width: auto" border=0>
            <tr>
                <td>
            <b-form-checkbox
                v-if="program === 'Portfolio'"
                id="checkbox-1"
                v-model="showAllPortfolioFolders"
                name="checkbox-1"
                v-bind:value="true"
                v-bind:unchecked-value="false"
                style="margin: 0 0 0 30px">
                show all folders
            </b-form-checkbox>
            <!-- https://stackoverflow.com/questions/72199214/b-form-checkbox-v-model-as-a-boolean -->

            <!-- <div>State: <strong>{{ showAllPortfolioFolders }}</strong></div> -->

            </td>
            <td v-if="!(program === 'Portfolio' && showAllPortfolioFolders)" style="font-size: 1.1rem; padding: 2px 2px 0px 30px; font-weight: normal">folder:</td>
            <td :id="'add-to-portfolio-folders-'+namespace">
            <b-form-select v-if="program !== 'Portfolio' || !showAllPortfolioFolders" size="sm" style="border:1px solid gray; width: auto; border-radius:3px; font-size: 1.1rem;"
                           v-model="portfolioDirectory" :options="folderOptions" @change="upDatePortfolioDirectory"></b-form-select> 
            </td>
            <td v-if="program !== 'Portfolio'" :id="'add-to-portfolio-add-folder-'+namespace">        
            <b-button size="sm" variant="info" 
                      style="border: 1px solid darkgray; margin: 0 0 0px 10px;"
                      @click="toggleNewFolderNameInput">add folder</b-button>
            </td>
            <td v-if="showNewFolderName && program !== 'Portfolio'" style="font-size: 1.1rem; padding: 0px 0px 0px 20px">name:</td>
            <td v-if="showNewFolderName && program !== 'Portfolio'" style="font-size: 1.1rem; padding: 0px 0px 0px 2px">
            <b-input ref="newFolderInput" style="width: 190px; border: 1px solid gray; border-radius: 3px; font-size: 1.1rem;"
                     size="sm"
                     v-model="newFolder"
                     :id="'add-to-portfolio-new-folder-'+namespace">
            </b-input>
            </td>
            <td v-if="showNewFolderName && program !== 'Portfolio'">
            <b-button size="sm" variant="success" 
                      style="border: 1px solid darkgray; margin: 0 0 0px 2px;"
                      :id="'add-to-portfolio-new-folder-add-button-'+namespace"
                      @click="addNewFolder">add</b-button>
            </td>
            <!--  <td>
                  <b-button size="sm" variant="warning" 
                        style="border: 1px solid darkgray; margin: 0 0 0px 20px;"
                        @click="getLastBar">get last data</b-button>
              </td> -->
            </tr>
        </table>

    </span>
</template>

<script>

    import * as fb from "@/firebase";

    export default {
        mounted() {
            console.log("mounted() starting. this.namespace=", this.namespace);

            this.$store.dispatch('user/bindStrategies').then(data => {  // Take a look at https://stackoverflow.com/questions/60601094/how-to-wait-on-vuex-state-initialization-from-a-view-component
                //console.log("data=", data);
                this.strategies = data;
            });

            this.$store.dispatch('user/bindFolders');
        },
        props: ['namespace'],
        data: function () {
            return{
                newFolder: "",
                showNewFolderName: false,
                result: null
            };
        },
        computed: {
            email() {
                return this.$store.state.user.email;
            },
            folders() {
                return this.$store.getters["user/portfolioFolders"];
            },
            folderOptions() {
                let options = this.folders.map(x => x.folder);
                if (this.newFolder !== "" && !options.includes(this.newFolder)) {
                    options.push(this.newFolder);
                    console.log("options=", options);
                }
                return options;
            },
            portfolioDirectory: {
                get() {
                    return this.$store.state.user.portfolioDirectory;
                },
                set(portfolioDirectory) {
                    this.$store.commit('user/setPortfolioDirectory', portfolioDirectory);
                }
            },
            program() {
                return this.$store.state[this.namespace].program;
            },
            showAllPortfolioFolders: {
                get() {
                    return this.$store.state.user.showAllPortfolioFolders;
                },
                set(showAllPortfolioFolders) {
                    this.$store.commit('user/setShowAllPortfolioFolders', showAllPortfolioFolders);
                }
            }
        },
        watch: {
            folderOptions(folderOptions) {
                console.log("watch folderOptions=", folderOptions);
                if (folderOptions.length > 0) {
                    let index = folderOptions.indexOf(this.portfolioDirectory);
                    console.log("index=", index);
                    if (index === -1) {
                        this.portfolioDirectory = folderOptions[0].folder;
                    }
                }
            }
        },
        methods: {
            toggleNewFolderNameInput() {
                this.showNewFolderName = !this.showNewFolderName;
                console.log("this.$refs=", this.$refs);
                // console.log("this.$refs.newFolderInput=", this.$refs.newFolderInput);
                let that = this;

                if (Object.keys(this.$refs).includes("newFolderInput")) {
                    console.log("Setting focus to newFolderInput");
                    setTimeout(function () {
                        that.$refs.newFolderInput.focus();
                    }, 10);
                }
            },
            showNewFolderNameInput() {
                this.showNewFolderName = true;
                console.log("this.$refs=", this.$refs);
                // console.log("this.$refs.newFolderInput=", this.$refs.newFolderInput);
                let that = this;

                if (Object.keys(this.$refs).includes("newFolderInput")) {
                    console.log("Setting focus to newFolderInput");
                    setTimeout(function () {
                        that.$refs.newFolderInput.focus();
                    }, 10);
                }
            },
            upDatePortfolioDirectory(portfolioDirectory) {
                console.log("upDatePortfolioDirectory() starting. portfolioDirectory=", portfolioDirectory);
                fb.usersCollection
                        .doc(this.email)
                        .update({"portfolioDirectory": portfolioDirectory})
                        .then(() => {
                            console.log('portfolioDirectory updated.');
                            // this.getStrategies();
                        }).catch((error) => {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                });
            },
            addNewFolder() {
                console.log("addNewFolder() starting. this.portfolioDirectory=", this.portfolioDirectory, " this.newFolder=", this.newFolder);
                console.log("this.folders=", this.folders);

                if (this.folders.map(x => x.folder).includes(this.newFolder)) {
                    alert("This folder already exists!");
                } else if(this.newFolder == ""){
                    alert("Please add a name for the new folder.")
                } else {
                    fb.db.collection("portfolio-alpha")
                            .doc(this.email)
                            .collection("folders")
                            .add({folder: this.newFolder})
                            .then((docRef) => {
                                console.log("Document written with ID: ", docRef.id);
                                console.log('folder added.');
                                this.result = "Success.";

                                this.upDatePortfolioDirectory(this.newFolder);
                                this.portfolioDirectory = this.newFolder;
                                this.showNewFolderName = false;
                            });
                }
            }
        }
    }
</script>
