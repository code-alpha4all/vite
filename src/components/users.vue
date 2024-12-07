<template>
  <div>
    <!-- Main user table -->
    <div class="col-10 offset-md-1">
      <template>
        <main style="margin-top: 35px">
          <div v-if="userDelete == true">
            <b-alert show dismissible fade variant="danger"
              >User Deleted Successfully!</b-alert
            >
          </div>
          <button
            class="btn btn-success"
            @click="addNewUser"
            style="position: absolute"
          >
            <i class="icon-x flaticon-users-1"></i>
            Add User
          </button>
          <data-table
            v-bind="mainTable"
            @actionTriggered="handleMainTableAction"
          />
        </main>
      </template>
    </div>

    <!-- View/Edit user details popup -->
    <div>
      <b-modal ref="detailsPopup" hide-footer size="lg" title="Subscriptions">
        <div class="d-block">
          <div v-if="serviceModification == true">
            <b-alert
              show
              dismissible
              fade
              v-bind:variant="serviceModificationAlertClass"
              >{{ serviceModificationText }}</b-alert
            >
          </div>
          <button
            class="btn btn-outline-success"
            @click="addSubscriptionPopup(popupData)"
          >
            Add New
          </button>

          <div style="float: right">
            <b-dropdown
              style="padding: 2px; position: relative; top: -5px"
              size="sm"
              split
              v-bind:text="popupData.role"
              class="m-2 btn btn-warning"
              variant="btn-warning"
            >
              <b-dropdown-item-button
                v-for="(roleOp, i) in roleOptions"
                v-bind:key="i"
                @click="changeRole(popupData.email, roleOp)"
                >{{ roleOp.text }}</b-dropdown-item-button
              >
            </b-dropdown>
          </div>

          <div style="margin-top: 20px">
            <template>
              <table class="table table-striped">
                <tr style="font-size: 14px">
                  <td>UID</td>
                  <td>Chart Name</td>
                  <td>Service</td>
                  <td>Expiration</td>
                  <td>Status</td>
                  <td>Actions</td>
                </tr>
                <tr
                  v-for="(item, i) in popupData"
                  v-bind:key="i"
                  style="font-size: 13px; text-align: left"
                >
                  <td style="border: 1px solid darkgray; padding: 3px">
                    {{ item.uid }}
                  </td>
                  <td style="border: 1px solid darkgray; padding: 3px">
                    {{ item.name }}
                  </td>
                  <td style="border: 1px solid darkgray; padding: 3px">
                    {{ item.value.type }}
                  </td>
                  <td style="border: 1px solid darkgray; padding: 3px">
                    <v-text-field
                      type="date"
                      hide-details
                      filled
                      rounded
                      dense
                      single-line
                      :min="disablePastDate()"
                      class="shrink"
                      v-model="item.value.expDate"
                      @focusout="updateExpirateionDate($event, popupData, item)"
                      style="
                        font-size: 12px;
                        margin: 0;
                        padding: 0;
                        display: content;
                      "
                    ></v-text-field>
                  </td>
                  <td
                    style="
                      border: 1px solid darkgray;
                      padding: 3px;
                      vertical-align: middle;
                      text-align: center;
                    "
                    v-html="item.subscriptionsStatus"
                  ></td>
                  <td
                    style="
                      border: 1px solid darkgray;
                      padding: 3px;
                      vertical-align: middle;
                      text-align: center;
                    "
                  >
                    <b-button
                      size="sm"
                      class="btn btn-danger"
                      @click="removeItem(item, popupData)"
                      ><i class="icon-1x flaticon-delete"></i>Delete</b-button
                    >
                  </td>
                </tr>
              </table>
            </template>
          </div>
        </div>
      </b-modal>
    </div>

    <!-- Add new user popup -->
    <div>
      <b-modal ref="addUserPopup" hide-footer title="Add New User">
        <div class="d-block">
          <div v-if="userSaved == true">
            <b-alert show dismissible fade variant="success"
              >Successfully {{ modified }}!</b-alert
            >
          </div>

          <div style="margin-top: 20px">
            <template>
              <div>
                <b-form
                  @submit="onSubmitNewUserForm"
                  @reset="onResetNewUserForm"
                >
                  <b-form-group
                    id="input-group-1"
                    label="Email address:"
                    label-for="email"
                  >
                    <b-form-input
                      id="email"
                      v-model="form.email"
                      type="email"
                      required
                      placeholder="Enter email"
                    ></b-form-input>
                  </b-form-group>

                  <b-form-group
                    id="input-group-2"
                    label="Name:"
                    label-for="name"
                  >
                    <b-form-input
                      id="name"
                      v-model="form.name"
                      required
                      placeholder="Name"
                    ></b-form-input>
                  </b-form-group>

                  <b-form-group
                    id="input-group-3"
                    label="Role:"
                    label-for="role"
                  >
                    <b-form-select
                      id="role"
                      v-model="form.role"
                      :options="roleOptions"
                      required
                    ></b-form-select>
                  </b-form-group>
                  <b-button type="submit" variant="primary">Submit</b-button> |
                  <b-button type="reset" variant="danger">Reset</b-button>
                </b-form>
              </div>
            </template>
          </div>
        </div>
      </b-modal>
    </div>

    <!-- Add new subscription popup -->
    <div>
      <b-modal
        ref="addSubscriptionPopup"
        hide-footer
        title="Add New Subscription"
      >
        <div class="d-block">
          <div v-if="subscriptionModification == true">
            <b-alert
              show
              dismissible
              fade
              v-bind:variant="subscriptionModificationAlert"
              >{{ subscriptionModificationText }}</b-alert
            >
          </div>

          <div style="margin-top: 20px">
            <template>
              <div>
                <b-form @submit="onSubmitNewSubscription">
                  <b-form-group
                    id="input-group-1"
                    label="Email address:"
                    label-for="email"
                  >
                    <b-form-input
                      id="email"
                      v-model="subscriptionsForm.email"
                      type="email"
                      required
                      readonly
                      placeholder="Enter email"
                    ></b-form-input>
                  </b-form-group>

                  <b-form-group
                    id="input-group-3"
                    label="Product Name:"
                    label-for="productName"
                  >
                    <select
                      class="form-control"
                      :required="true"
                      id="productName"
                      v-model="subscriptionsForm.productName"
                      @change="changeItems(subscriptionsForm.productName)"
                    >
                      <option
                        v-for="productGroup in productGroups"
                        v-bind:key="productGroup.productName"
                        v-bind:value="productGroup.id"
                      >
                        {{ productGroup.productName }}
                      </option>
                    </select>
                  </b-form-group>

                  <b-form-group
                    id="input-group-3"
                    label="Type:"
                    label-for="type"
                  >
                    <select
                      class="form-control"
                      :required="true"
                      id="type"
                      v-model="subscriptionsForm.itemType"
                    >
                      <option
                        v-for="productType in productTypes"
                        v-bind:key="productType.text"
                        v-bind:value="productType.value"
                      >
                        {{ productType.text }}
                      </option>
                    </select>
                  </b-form-group>

                  <b-form-group
                    id="input-group-2"
                    label="Expiration Date:"
                    label-for="expDate"
                  >
                    <v-text-field
                      type="date"
                      id="expDate"
                      :min="disablePastDate()"
                      v-model="subscriptionsForm.expDate"
                      required
                      placeholder="Name"
                      style="
                        font-size: 12px;
                        margin: 0;
                        padding: 0;
                        display: content;
                      "
                    ></v-text-field>
                  </b-form-group>

                  <b-button type="submit" variant="success">Save</b-button>
                </b-form>
              </div>
            </template>
          </div>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
import * as fb from "../firebase";
import Vue from "vue";
import DataTable from "@andresouzaabreu/vue-data-table";
import "@andresouzaabreu/vue-data-table/dist/DataTable.css";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import moment from "moment";

Vue.component("data-table", DataTable);

export default {
  mounted() {
    console.log("users.vue mounted() starting.");
  },
  computed: {
    mainTable(data) {
      let userData = data.users;
      let finalData = [];
      let subList = "";
      let subArr = [];

      userData.forEach((el) => {
        let subscriptions = el.subscriptions;

        if (subscriptions != null) {
          subscriptions.forEach((el) => {
            let subData = el.data;
            subData.forEach((el2) => {
              let expirationDate = new Date(el2.expDate.seconds * 1000);
              let finalExpDate = moment(expirationDate).format("YYYY-MM-DD");
              // console.log(finalExpDate);

              subArr.push({
                name: el.name,
                uid: el.uid,
                value: {
                  type: el2.type,
                  expDate: finalExpDate,
                },
              });
            });
          });

          // subscriptions.forEach((sub) => {
          //   // sub = [...new Set(sub)];
          //   const uniqueSub = [ ...new Set(sub.map(item => item.name))]

          //   // subList += sub.name + ", ";
          //   subList += uniqueSub + ", ";
          // });

          const uniqueSub = [...new Set(subscriptions.map((sub) => sub.name))];
          subList = uniqueSub.toString();
        } else {
          subList = "";
        }

        finalData.push({
          email: el.email,
          name: el.name,
          subscriptions: subList.replace(/,\s*$/, ""),
          role: el.role,
          subscriptions_list: subArr,
        });
        subArr = [];
        subList = "";
      });

      return {
        data: finalData,
        actionMode: "single",
        actions: ["view", "delete"],
        columns: [
          {
            key: "email",
            title: "Email",
            sortable: true,
            searchable: true,
          },
          {
            key: "name",
            title: "Name",
            sortable: true,
            searchable: true,
          },
          {
            key: "subscriptions",
            title: "Subscriptions",
            sortable: true,
            searchable: true,
          },
          {
            key: "role",
            title: "Role",
            sortable: true,
            searchable: true,
          },
        ],

        showDownloadButton: false,
        showPagination: true,
        showEntriesInfo: false,
        showPerPage: false,
        tableClass: "table table-bordered table-hover",

        /* other props...*/
      };
    },
  },
  //  props: ['id'],
  data() {
    return {
      users: [],
      dbName: "newUsers",
      popupData: {},
      modified: "",
      userSaved: false,
      userDelete: false,
      subscriptionModification: false,
      subscriptionModificationAlert: "",
      subscriptionModificationText: "",

      serviceModification: false,
      serviceModificationText: "",
      serviceModificationAlertClass: "",
      form: {
        email: "",
        name: "",
        role: null,
      },
      subscriptionsForm: {
        email: "",
        productName: "",
        itemType: "",
        expDate: "",
      },
      productTypes: "",
      productGroups: [
        {
          id: "scarrcharts",
          productName: "Scarr Charts",
          items: {
            types: [{ value: "main", text: "Main" }],
          },
        },
        {
          id: "chartslab",
          productName: "Charts Lab",
          items: {
            types: [
              { value: "commodities", text: "Commodities" },
              { value: "stocks", text: "Stocks" },
              { value: "options", text: "Options" },
            ],
          },
        },
      ],
      selectedRole: "subscriber",
      roleOptions: [
        { value: "admin", text: "Admin" },
        { value: "superadmin", text: "Superadmin" },
        { value: "subscriber", text: "Subscriber" },
        { value: "guest", text: "Guest" },
      ],
    };
  },
  firestore: {
    users: fb.db.collection("newUsers"),
  },
  methods: {
    onSubmitNewUserForm(evt) {
      evt.preventDefault();
      // console.log(JSON.stringify(this.form));
      let formData = this.form;
      let oneMonthExp = moment(moment(), "YYYYMMDD").add(1, "months").format();
      console.log(oneMonthExp);

      let v = {
        email: formData.email,
        name: formData.name,
        role: formData.role,
        subscriptions: [],
      };

      (async () => {
        try {
          const email = formData.email;

          const doc = await fb.db.collection(this.dbName).doc(email).get();
          if (doc && doc.exists) {
            console.log("User Already Exist!"); //For update we are suppose to make sure we don't override subscriptions data.

            // await doc.ref.update(v).then(() => {
            //   console.log("Document successfully updated!");
            //   this.userSaved = true;
            //   this.modified = "updated";
            // });
          } else {
            await doc.ref.set(v);
            console.log("Done");
            this.userSaved = true;
            this.modified = "added";
          }
        } catch (error) {
          console.log(error);
        }
      })();
    },
    onResetNewUserForm(evt) {
      evt.preventDefault();
      // Reset our form values
      this.form.email = "";
      this.form.name = "";
      this.form.role = null;
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
    handleMainTableAction(action, payload) {
      this.serviceModification = false;
      this.subscriptionModification = false;
      this.userSaved = false;
      // console.log(action, payload);
      if (action == "view") {
        let subscription = payload.subscriptions_list;
        subscription.forEach((el) => {
          let subDate = el.value.expDate;
          subDate = new Date(subDate);
          var now = new Date();
          now.setHours(0, 0, 0, 0);
          if (subDate < now) {
            el.subscriptionsStatus =
              "<span class='badge badge-info'>Expired</span>";
          } else {
            el.subscriptionsStatus =
              "<span class='badge badge-success'>Active</span>";
          }
        });
        this.popupData = payload.subscriptions_list;
        this.popupData.email = payload.email;
        this.popupData.role = payload.role;
        this.popupData.uid = payload.uid;

        console.log("popupData New: ", this.popupData);

        this.$refs["detailsPopup"].show();
      }
      if (action == "delete") {
        Swal.fire({
          title: "Eliminare",
          text: "Sei sicuro?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "rgb(138 211 187)",
          cancelButtonColor: "rgb(255 133 133)",
          cancelButtonText: "Annulla",
          confirmButtonText: "Si, prosegui!",
          reverseButtons: true,
        }).then(async (result) => {
          if (result.isConfirmed) {
            let email = payload.email;

            await fb.db
              .collection(this.dbName)
              .doc(email)
              .delete()
              .then(() => {
                this.userDelete = true;
                console.log("Document successfully deleted!");
              })
              .catch((error) => {
                console.error("Error removing document: ", error);
              });
          }
        });
      }
    },
    addNewUser() {
      this.$refs["addUserPopup"].show();
      this.serviceModification = false;
      this.subscriptionModification = false;
      this.userSaved = false;
    },
    changeItems(productName) {
      let prodName = this.productGroups;
      var result = prodName.find((obj) => {
        return obj.id == productName;
      });
      this.productTypes = result.items.types;
    },
    disablePastDate() {
      return new Date().toISOString().substr(0, 10);
    },
    onSubmitNewSubscription(evt) {
      evt.preventDefault();
      // console.log(JSON.stringify(this.subscriptionsForm));

      let subscriptionsFormData = this.subscriptionsForm;
      let email = subscriptionsFormData.email;
      let productName = subscriptionsFormData.productName;
      let itemType = subscriptionsFormData.itemType;
      let expiration = subscriptionsFormData.expDate;
      //expiration = moment(expiration.toString(), "YYYYMMDD").format();
      expiration = new Date(expiration.toString());
      let uid = "uid_" + Math.random().toString(36).slice(2, 12);

      let v = [
        {
          data: [{ expDate: expiration, type: itemType }],
          name: productName,
          uid: uid,
        },
      ];

      (async () => {
        try {
          var usersData = fb.db.collection(this.dbName);
          usersData.get().then(async (querySnapshot) => {
            querySnapshot.forEach(async (doc) => {
              let data = doc.data();
              if (data.email == email) {
                this.addSubscription(data, v, email);
              }
            });
          });
        } catch (error) {
          console.log(error);
        }
      })();
    },

    addSubscriptionPopup(popupData) {
      this.serviceModification = false;
      this.subscriptionModification = false;
      this.userSaved = false;

      this.$refs["detailsPopup"].hide();
      this.$refs["addSubscriptionPopup"].show();
      this.subscriptionsForm.email = popupData.email;
    },

    addSubscription(data, v, email) {
      try {
        let newData = data;
        newData.subscriptions.push(v[0]);
        this.subscriptionModification = true;
        this.subscriptionModificationAlert = "success";
        this.subscriptionModificationText = "Saved successfully!";
        fb.db
          .collection(this.dbName)
          .doc(email)
          .update(newData)
          .then(function () {
            console.log("Added!");
          });
      } catch (error) {
        console.error(error);
      }
    },

    changeExpDate(data, uid, chartName, type, expDate) {
      data = [data];
      data.map((obj) => {
        let subscriptions = obj.subscriptions;
        for (var i = 0; i < subscriptions.length; i++) {
          let items = obj.subscriptions[i].data;
          for (var j = 0; j < items.length; j++) {
            if (
              obj.subscriptions[i].name == chartName &&
              obj.subscriptions[i].uid == uid
            ) {
              if (items[j].type == type) {
                obj.subscriptions[i].data[j].expDate = expDate;
              }
            }
          }
        }
      });
      return data;
    },

    updateExpirateionDate(event, popupData, item) {
      let expDate = event.target.value;
      let expiration = new Date(expDate);
      //moment(expDate.toString(), "YYYYMMDD").format();
      let email = popupData.email;
      let itemType = item.value.type;
      let productName = item.name;
      let uid = item.uid;

      (async () => {
        try {
          fb.db
            .collection(this.dbName)
            .get()
            .then(async (querySnapshot) => {
              querySnapshot.forEach(async (doc) => {
                let data = doc.data();
                if (data.email == email) {
                  let subscriptions = data.subscriptions;

                  await subscriptions.forEach(async (subscription) => {
                    if (subscription.name == productName) {
                      let prodTypes = subscription.data;
                      prodTypes.forEach(async (prodType) => {
                        if (prodType.type == itemType) {
                          console.log("data: ", data);
                          let v = this.changeExpDate(
                            data,
                            uid,
                            productName,
                            itemType,
                            expiration
                          );
                          try {
                            this.serviceModification = true;
                            this.serviceModificationAlertClass = "success";
                            this.serviceModificationText =
                              "Subscription updated successfully!";
                            await fb.db
                              .collection(this.dbName)
                              .doc(email)
                              .update(v[0])
                              .then(function () {
                                console.log("Updated!");
                              });
                          } catch (error) {
                            console.error(error);
                          }
                        }
                      });
                    }
                  });
                }
              });
            });
        } catch (error) {
          console.log(error);
        }
      })();
    },

    removeItemfromSubscription(obj, email, name, uid, type) {
      if (obj.email == email) {
        let subs = obj.subscriptions;
        let index;

        subs.forEach((sub, i) => {
          if (sub.name == name && sub.uid == uid) {
            let objType = sub.data[0].type;
            if (objType == type) {
              index = i;
            }
          }
        });
        delete obj.subscriptions[index];
      }

      let subscriptions = obj.subscriptions.filter((n) => n);
      obj.subscriptions = [];
      subscriptions.forEach((sub) => {
        obj.subscriptions.push(sub);
      });
      return obj;
    },

    removeItem(item, popupData) {
      let email = popupData.email;
      let uid = item.uid;
      let name = item.name;
      let type = item.value.type;

      (async () => {
        try {
          var usersData = fb.db.collection(this.dbName);
          usersData.get().then(async (querySnapshot) => {
            querySnapshot.forEach(async (doc) => {
              let data = doc.data();

              if (data.email == email) {
                let newData = [data];
                newData.map((obj) => {
                  let subscriptions = obj.subscriptions;
                  for (var i = 0; i < subscriptions.length; i++) {
                    let items = obj.subscriptions[i].data;
                    for (var j = 0; j < items.length; j++) {
                      if (
                        obj.subscriptions[i].name == name &&
                        obj.subscriptions[i].uid == uid
                      ) {
                        if (items[j].type == type) {
                          let newD = this.removeItemfromSubscription(
                            data,
                            email,
                            name,
                            uid,
                            type
                          );

                          Swal.fire({
                            title: "Eliminare",
                            text: "Sei sicuro?",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "rgb(138 211 187)",
                            cancelButtonColor: "rgb(255 133 133)",
                            cancelButtonText: "Annulla",
                            confirmButtonText: "Si, prosegui!",
                            reverseButtons: true,
                          }).then(async (result) => {
                            if (result.isConfirmed) {
                              try {
                                this.serviceModification = true;
                                this.serviceModificationAlertClass = "warning";
                                this.serviceModificationText =
                                  "Item delete successfully!";
                                fb.db
                                  .collection(this.dbName)
                                  .doc(email)
                                  .update(newD)
                                  .then(function () {
                                    console.log("Deleted!");
                                  });
                              } catch (error) {
                                console.error(error);
                              }
                            }
                          });
                        }
                      }
                    }
                  }
                });
              }
            });
          });
        } catch (error) {
          console.log(error);
        }
      })();
    },

    changeRole(email, roleOp) {
      try {
        this.serviceModification = true;
        this.serviceModificationAlertClass = "success";
        this.serviceModificationText = "User Role updated successfully!";
        fb.db
          .collection(this.dbName)
          .doc(email)
          .update("role", roleOp.value)
          .then(function () {
            console.log("Updated!");
          });
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
