<template>
<div id="app" data-app>
  <v-card>
  <v-card-title>
      <h2>EXERCISES</h2>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
  </v-card-title>
  <v-data-table
    :items="desserts"
    :search="search"
    :headers="headers"
    sort-by="calories"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-spacer></v-spacer>
        <v-dialog
          fullscreen
          v-model="dialogCommodities"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="m-2"
              v-bind="attrs"
              v-on="on"
            >
              New Commodity Exercise
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                    v-show="show"
                  >
                    <v-text-field
                      v-model="editedItem.name"
                      label="NAME"
                    ></v-text-field>
                    <v-text-field
                      v-model="editedItem.ticker"
                      label="TICKER"
                      @focusout="updateState"
                    ></v-text-field>
                    <v-select
                      v-model="editedItem.sector"
                      :items="sectors"
                      label="SECTOR"
                    ></v-select>
                    <v-select
                      v-model="editedItem.buySell"
                      :items="buySell"
                      @change="updateState"
                      label="POSITION"
                    ></v-select>
                    <v-select
                      v-model="editedItem.strategy"
                      :items="strategies"
                      label="TYPE"
                    ></v-select>
                    <v-select
                      v-model="editedItem.seasonality"
                      :items="seasonalities"
                      label="SEASONALITIES"
                    ></v-select>
                    <v-select
                      v-model="editedItem.rsi"
                      :items="rsis"
                      label="RSI"
                    ></v-select>
                    <v-select
                      v-model="editedItem.risk"
                      :items="risks"
                      label="RISK"
                    ></v-select>
                    <v-select
                      v-model="editedItem.deadlines"
                      :items="deadlines"
                      label="DEADLINES"
                    ></v-select>
                    <v-spacer></v-spacer>
                    <v-btn
                      style="float: left;background: yellow;color: black;"
                      @click="close"
                    >BACK</v-btn>
                    <v-btn
                      style="float: right;background: #3699FF;color: white;"
                      @click="show = !show; thresholds = !thresholds"
                    >NEXT</v-btn>
                  </v-col>
                  <!--  THRESHOLDS SECTION -->
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                    v-show="!thresholds"
                  >
                  <span class="h2 btn-light">THRESHOLDS SECTION</span>
                    <v-text-field
                      v-model="editedItem.margin"
                      @focusout="updateStop('all')"
                      label="MAX MARGIN ($)"
                    >
                    </v-text-field>
                    <v-text-field
                      v-model="editedItem.bronze_price"
                      @focusout="updateStop('bronze')"
                      label="BRONZE PRICE"
                    >
                    </v-text-field>
                    <v-text-field
                      v-model="editedItem.silver_price"
                      @focusout="updateStop('silver')"
                      label="SILVER PRICE"
                    >
                    </v-text-field>
                    <v-text-field
                      v-model="editedItem.gold_price"
                      @focusout="updateStop('gold')"
                      label="GOLD PRICE"
                    >
                    </v-text-field>
                    <v-text-field
                      v-model="editedItem.stop_bronze_price"
                      label="STOP BRONZE PRICE"
                    >
                    </v-text-field>
                    <v-text-field
                      v-model="editedItem.stop_silver_price"
                      label="STOP SILVER PRICE"
                    >
                    </v-text-field>
                    <v-text-field
                      v-model="editedItem.stop_gold_price"
                      label="STOP GOLD PRICE"
                    >
                    </v-text-field>
                    <span class="h2 btn-light">REPLAY SECTION</span>
                    <div class="datepicker">
                      <v-menu
                        ref="menu_start_date"
                        v-model="menu_start_date"
                        :close-on-content-click="false"
                        :return-value.sync="start_date"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="start_date"
                            label="START DATE"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker 
                          v-model="start_date"
                          no-title
                          scrollable
                        >
                          <v-spacer></v-spacer>
                          <v-btn
                            text
                            color="primary"
                            @click="menu_start_date = false"
                          >
                            Cancel
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.menu_start_date.save(start_date)"
                            @focusout="updateState('start_date',start_date)"
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </div>
                    <v-menu
                      ref="menu_end_date"
                      v-model="menu_end_date"
                      :close-on-content-click="false"
                      :return-value.sync="end_date"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="end_date"
                          label="END DATE"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="end_date"
                        no-title
                        scrollable
                      >
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="primary"
                          @click="menu_end_date = false"
                        >
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.menu_end_date.save(end_date)"
                          @focusout="updateState('end_date',end_date)"
                        >
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                    <v-spacer></v-spacer>
                    <v-btn
                      style="float: left;background: #3699FF;color: white;"
                      @click="thresholds = !thresholds; show = !show"
                    >
                      PREV
                    </v-btn>
                    <v-btn
                      style="float: right;background: #3699FF;color: white;"
                      @click="levels = !levels; thresholds = !thresholds"
                    >
                      NEXT
                    </v-btn>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                    v-show="!levels"
                  >
                  <span class="h2 btn-light">BREAKPOINTS SECTION</span>
                    <br<br>
                    <span class="h3 btn-light mt-5">BRONZE SECTION</span>
                    <br>
                    <div style="background:#ffe5b6">
                      <v-text-field
                        v-model="editedItem.message_bronze_break_1"
                        label="MESSAGE"
                      >
                      </v-text-field>
                      <v-text-field
                        v-model="editedItem.title_bronze_break_1"
                        label="TITLE"
                      >
                      </v-text-field>
                      <v-select
                        v-model="editedItem.type_bronze_break_1"
                        :items="breakpoint_type"
                        label="TYPE"
                      ></v-select>
                      <v-menu
                        ref="menu_bronze_break_1"
                        v-model="menu_bronze_break_1"
                        :close-on-content-click="false"
                        :return-value.sync="bronze_break_1"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="bronze_break_1"
                            label="DATE BREAKPOINT"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="bronze_break_1"
                          no-title
                          scrollable
                        >
                          <v-spacer></v-spacer>
                          <v-btn
                            text
                            color="primary"
                            @click="menu_bronze_break_1 = false"
                          >
                            Cancel
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.menu_bronze_break_1.save(bronze_break_1)"
                            @focusout="updateState('bronze_break_1',bronze_break_1)"
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </div>
                    <v-spacer></v-spacer>
                    <span class="h3 btn-light mt-5">SILVER SECTION</span>
                    <br>
                    <div style="background:#F3F6F9">
                      <v-text-field
                        v-model="editedItem.message_silver_break_1"
                        label="MESSAGE"
                      >
                      </v-text-field>
                      <v-text-field
                        v-model="editedItem.title_silver_break_1"
                        label="TITLE"
                      >
                      </v-text-field>
                      <v-select
                        v-model="editedItem.type_silver_break_1"
                        :items="breakpoint_type"
                        label="TYPE"
                      ></v-select>
                      <v-menu
                        ref="menu_silver_break_1"
                        v-model="menu_silver_break_1"
                        :close-on-content-click="false"
                        :return-value.sync="silver_break_1"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="silver_break_1"
                            label="DATE BREAKPOINT"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="silver_break_1"
                          no-title
                          scrollable
                        >
                          <v-spacer></v-spacer>
                          <v-btn
                            text
                            color="primary"
                            @click="menu_silver_break_1 = false"
                          >
                            Cancel
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.menu_silver_break_1.save(silver_break_1)"
                            @focusout="updateState('silver_break_1',silver_break_1)"
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </div>
                    <v-spacer></v-spacer>
                    <span class="h3 btn-light mt-5">GOLD SECTION</span>
                    <br>
                    <div style="background:#f3f7029c">
                      <v-text-field
                        v-model="editedItem.message_gold_break_1"
                        label="MESSAGE"
                      >
                      </v-text-field>
                      <v-text-field
                        v-model="editedItem.title_gold_break_1"
                        label="TITLE"
                      >
                      </v-text-field>
                      <v-select
                        v-model="editedItem.type_gold_break_1"
                        :items="breakpoint_type"
                        label="TYPE"
                      ></v-select>
                      <v-menu
                        ref="menu_gold_break_1"
                        v-model="menu_gold_break_1"
                        :close-on-content-click="false"
                        :return-value.sync="gold_break_1"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="gold_break_1"
                            label="DATE BREAKPOINT"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="gold_break_1"
                          no-title
                          scrollable
                        >
                          <v-spacer></v-spacer>
                          <v-btn
                            text
                            color="primary"
                            @click="menu_gold_break_1 = false"
                          >
                            Cancel
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.menu_gold_break_1.save(gold_break_1)"
                            @focusout="updateState('gold_break_1',gold_break_1)"
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </div>
                    <v-spacer></v-spacer>
                    <v-btn
                      style="float: left;background: #3699FF;color: white;"
                      @click="levels = !levels; thresholds = !thresholds"
                    >
                      PREV
                    </v-btn>
                    <v-btn
                      style="float: right;background: #3699FF;color: white;"
                      @click="levels = !levels; traderbot= !traderbot"
                    >
                      NEXT
                    </v-btn>
                  </v-col>
                   <v-col
                    cols="12"
                    sm="6"
                    md="4"
                    v-show="!traderbot"
                  >
                  <span class="h2 btn-light">TRADERBOT SECTION</span>
                    <br<br>
                    <br>
                    <div style="background:#ffe5b6">
                      <v-textarea
                        v-model="editedItem.traderbot_message_bronze"
                        label="BRONZE MESSAGE"
                      >
                      </v-textarea>
                    </div>
                    <v-spacer></v-spacer>
                    <br>
                    <div style="background:#F3F6F9">
                     <v-textarea
                        v-model="editedItem.traderbot_message_silver"
                        label="SILVER MESSAGE"
                      >
                      </v-textarea>
                    </div>
                    <v-spacer></v-spacer>
                    <br>
                    <div style="background:#f3f7029c">
                      <v-textarea
                        v-model="editedItem.traderbot_message_gold"
                        label="GOLD MESSAGE"
                      >
                      </v-textarea>
                    </div>
                    <v-spacer></v-spacer>
                    <br>
                    <div style="background:#ff49499c">
                      <v-textarea
                        v-model="editedItem.traderbot_message_not_interested"
                        label="NOT INTERESTED MESSAGE"
                      >
                      </v-textarea>
                    </div>
                    <br><br>
                    <v-btn
                      style="float: left;background: #3699FF;color: white;"
                      @click="levels = !levels; traderbot= !traderbot"
                    >PREV</v-btn>
                    <v-btn
                      style="float: right;background: #3699FF;color: white;"
                      @click="save"
                    >SAVE</v-btn>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="8"
                  >
                     <basic-chart-output
                      v-bind:windowHeight="'700'"
                      v-bind:ref="'playback'"
                      v-bind:namespace="namespace"
                      style="border: 1px solid darkgray;"
                    ></basic-chart-output>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog
          v-model="dialogStocks"
          max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="m-2"
              v-bind="attrs"
              v-on="on"
            >
              New Stock Exercise
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.id"
                      label="Dessert name"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.product_title"
                      label="Calories"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.product_price"
                      label="Fat (g)"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.product_price"
                      label="Carbs (g)"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.product_price"
                      label="Protein (g)"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog
          v-model="dialogOptions"
          max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="m-2"
              v-bind="attrs"
              v-on="on"
            >
              New Options Exercise
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.id"
                      label="Dessert name"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.product_title"
                      label="Calories"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.product_price"
                      label="Fat (g)"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.product_price"
                      label="Carbs (g)"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.product_price"
                      label="Protein (g)"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon v-if="item.asset=='Commodities'"
        small
        class="mr-2"
        @click="editCommoditiesItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon v-if="item.asset=='Commodities'"
        small
        @click="deleteCommoditiesItem(item)"
      >
        mdi-delete
      </v-icon>
            <v-icon v-if="item.product_title=='Great product name here'"
        small
        class="mr-2"
        @click="editStocksItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon v-if="item.product_title=='Great product name here'"
        small
        @click="deleteStocksItem(item)"
      >
        mdi-delete
      </v-icon>
            <v-icon v-if="item.product_title=='Some item name here'"
        small
        class="mr-2"
        @click="editOptionsItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon v-if="item.product_title=='Some item name here'"
        small
        @click="deleteOptionsItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn
        color="primary"
        @click="initialize"
      >
        Reset
      </v-btn>
    </template>
  </v-data-table>
  </v-card>
  </div>
</template>

<script>
import {getCommoditiesArray} from "../../js/main";
import basicChartOutput from '@/components/programs/BasicChartNew/basic-chart-output-new';
import * as fb from '../../firebase';

  export default {
    components: {
      basicChartOutput,
    },
    data: () => ({
      show: true,
      thresholds: true,
      levels: true,
      traderbot: true,
      menu_start_date: false,
      menu_end_date : false,
      menu_bronze_break_1: false,
      menu_silver_break_1 : false,
      menu_gold_break_1: false,
      modalEndDate: false,
      start_date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      end_date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      bronze_break_1:'',
      silver_break_1:'',
      gold_break_1:'',
      namespace: "generalFormModulePlaybackPage",
      buySell: ['Buy', 'Sell'],
      strategies: ['Future', 'Calendar Spread','Butterfly','Condor'],
      types: ['Not Available', 'Intramarket', 'Intermarket'],
      seasonalities: ['Bullish', 'Bearish'],
      rsis: ['Low','Medium','High'],
      risks: ['Low','Medium','High'],
      deadlines: ['Summer','Winter'],
      sectors: ['Currencies','Energies','Grains','Indices','Interest Rates','Meats','Metals','Softs and Fibers'],
      prices : ['Not Available','Contango','Backwardation'],
      breakpoint_type: ['Take Profit','Stop Loss'],
      dialogCommodities: false,
      dialogStocks: false,
      dialogOptions: false,
      dialogDelete: false,
      search: '',
      headers: [
        {
          text: 'ID',
          align: 'start',
          sortable: false,
          value: 'text1',
        },
        { text: 'ASSET', value: 'asset' },
        { text: 'NAME', value: 'text1' },
        { text: 'STRATEGY', value: 'text1' },
        { text: 'START DATE', value: 'text1' },
        { text: 'END DATE', value: 'text1' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      unitMove: [0,0,0,0],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
        ticker: '',
        sector: '',
        buySell: 'Buy',
        strategy:'',
        seasonality:'',
        risk:'',
        rsi: '',
        deadlines: '',
        margin: '500',
        bronze_price: '',
        silver_price: '',
        gold_price: '',
        stop_bronze_price: '',
        stop_silver_price: '',
        stop_gold_price: '',
        title_bronze_break_1: '',
        message_bronze_break_1: '',
        type_bronze_break_1: '',
        title_silver_break_1: '',
        message_silver_break_1: '',
        type_silver_break_1: '',
        title_gold_break_1: '',
        message_gold_break_1: '',
        type_gold_break_1: '',
        traderbot_message_bronze: '',
        traderbot_message_silver: '',
        traderbot_message_gold: '',
        traderbot_message_not_interested: ''
      },
      defaultItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
        ticker: '',
        sector: '',
        buySell: 'Buy',
        strategy:'',
        seasonality:'',
        risk:'',
        rsi: '',
        deadlines: '',
        margin: '500',
        bronze_price: '',
        silver_price: '',
        gold_price: '',
        stop_bronze_price: '',
        stop_silver_price: '',
        stop_gold_price: '',
        title_bronze_break_1: '',
        message_bronze_break_1: '',
        type_bronze_break_1: '',
        title_silver_break_1: '',
        message_silver_break_1: '',
        type_silver_break_1: '',
        title_gold_break_1: '',
        message_gold_break_1: '',
        type_gold_break_1: '',
        traderbot_message_bronze: '',
        traderbot_message_silver: '',
        traderbot_message_gold: '',
        traderbot_message_not_interested: ''
      },
    }),
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Exercise' : 'Edit Exercise'
      },
    },
    watch: {
      dialogCommodities (val) {
        val || this.close()
      },
      dialogStocks (val) {
        val || this.close()
      },
      dialogOptions (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      }
    },
    created () {
      this.initialize();
      console.log("Playback.vue created() starting.");
      console.log("initialState=", initialState);
      this.unitMove = initialState.unitMove;
      this.$store.commit("generalFormModulePlaybackPage/setGeneralForm", initialState);
      this.$store.commit("generalFormModulePlaybackPage/setModuleName", "generalFormModulePlaybackPage");
      this.$store.dispatch("generalFormModulePlaybackPage/getContractListsFromServer");
    },
    methods: {
      updateStop(level) {
        if(this.buySell=='Buy') {
          if(level=='bronze' || level=='all')
          this.editedItem.stop_bronze_price = parseFloat(this.editedItem.bronze_price) - parseFloat(this.editedItem.margin) /  parseFloat(this.unitMove);
          if(level=='silver' || level=='all')
          this.editedItem.stop_silver_price = parseFloat(this.editedItem.silver_price) -  parseFloat(this.editedItem.margin) / parseFloat(this.unitMove);
          if(level=='gold' || level=='all')
          this.editedItem.stop_gold_price = parseFloat(this.editedItem.gold_price) - parseFloat(this.editedItem.margin) /  parseFloat(this.unitMove);
        } else {
          if(level=='bronze' || level=='all')
          this.editedItem.stop_bronze_price = parseFloat(this.editedItem.bronze_price) + parseFloat(this.editedItem.margin) /  parseFloat(this.unitMove);
          if(level=='silver' || level=='all')
          this.editedItem.stop_silver_price = parseFloat(this.editedItem.silver_price) +  parseFloat(this.editedItem.margin) /  parseFloat(this.unitMove);
          if(level=='gold' || level=='all')
          this.editedItem.stop_gold_price = parseFloat(this.editedItem.gold_price) + parseFloat(this.editedItem.margin) /  parseFloat(this.unitMove);
        }
        initialState.addHorizontalLine = true;
        initialState.chartParameters.levels = [
          { from: parseFloat(this.editedItem.bronze_price)-2, to: parseFloat(this.editedItem.bronze_price)+2, color: "orange", name: "horizontal-bronze-series" },
          { from: parseFloat(this.editedItem.silver_price)-2, to: parseFloat(this.editedItem.silver_price)+2, color: "silver", name: "horizontal-silver-series" },
          { from: parseFloat(this.editedItem.gold_price)-2, to: parseFloat(this.editedItem.gold_price)+2, color: "gold", name: "horizontal-gold-series" },
          { from: parseFloat(this.editedItem.stop_bronze_price)-2, to: parseFloat(this.editedItem.stop_bronze_price)+2, color: "red", name: "horizontal-red-series" },
        
        ];
        this.$store.commit("generalFormModulePlaybackPage/setGeneralForm", initialState);
        this.$store.commit("generalFormModulePlaybackPage/setModuleName", "generalFormModulePlaybackPage");
        //this.$store.dispatch("generalFormModulePlaybackPage/getContractListsFromServer");
      },
      updateState(key,value) {
          console.log("updateState() starting.");
          var newUnitMove = getCommoditiesArray().find(x => x.symbol === 'CL').unitMove;
          this.unitMove[0] = newUnitMove;
          console.log(newUnitMove);
          if(this.editedItem.ticker!='') initialState.selected[0] = this.editedItem.ticker;
          if(key=='start_date') initialState.playback.start = value;
          if(key=='end_date') initialState.playback.end = value;
          if(key=='bronze_break_1') {
            initialState.playback.breakpoints = initialState.playback.breakpoints.filter(function(value, index, arr){ 
                return arr[index].level!='bronze';
            });
            var obj = new Object();
            obj['title'] = this.editedItem.title_bronze_break_1;
            obj['message'] = this.editedItem.message_bronze_break_1;
            obj['type'] = this.editedItem.type_bronze_break_1;
            obj['date'] = value;
            obj['level'] = 'bronze';
            initialState.playback.breakpoints.push(obj);
          }
          initialState.buySell = this.editedItem.buySell;
          this.$store.commit(this.namespace + '/setGeneralForm', initialState);
          this.$store.dispatch(this.namespace + '/getContractListsFromServer');
          console.log("updateState() starting.");
      },
      initialize () {
       fb.db.collection('saved-charts')
          .doc('chartslab@system.com').collection('charts').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                var obj = new Object();
                obj['text1'] = doc.data().generalForm.title;
                obj['text2'] = doc.data().generalForm.buySell;
                obj['settore'] = doc.data().generalForm.study;
                obj['asset'] = doc.data().generalForm.asset;
                this.desserts.push(obj);
            });
        });
      },
      editCommoditiesItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogCommodities = true
      },
      deleteCommoditiesItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },
      editStocksItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogStocks = true
      },
      deleteStocksItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },
      editOptionsItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogOptions = true
      },
      deleteOptionsItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },
      deleteItemConfirm () {
        this.desserts.splice(this.editedIndex, 1)
        this.closeDelete()
      },
      prev () {
        this.dialogCommodities = false
        this.dialogStocks = false
        this.dialogOptions = false

      },
      close () {
        this.dialogCommodities = false
        this.dialogStocks = false
        this.dialogOptions = false
      },
      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.desserts[this.editedIndex], this.editedItem)
        } else {
          this.desserts.push(this.editedItem);
          var generalForm = initialState;
          fb.db.collection('saved-charts')
            .doc('chartslab@system.com')
            .collection('charts')
            .doc()
            .set({generalForm})
            .then(() => {
                console.log('chart saved.');
            });
        }
        this.close()
      }
    },
  }
  let initialState = {
  p: [1, -1, 1, 1],
  spreadP: 1,
  unitMove: [50, 50, 50, 50],
  legs: 1,
  sampleContract: ["S2021X", "O2021U", "MW2020U", "KW2020U"],
  stockArray: ["AAPL, Apple Inc.", "IBM, International Business Machines"],
  selected: ["S2021X", "ZCU21"], //["AAPL, Apple Inc."],
  barchartTicker: "ZSX21",
  title: "S2021X",
  mult: [1, 1, 1, 1],
  y1: 15,
  open: "2021-01-25",
  close: "2021-03-26",
  generator: "BasicBarsGenerator",
  program: "BasicCharts",
  study: "basic",
  language: "en",
  addBollinger: false,
  addSMA: false,
  smaLength: 20,
  addRSIPanel: false,
  addMACDPanel: false,
  addATRPanel: false,
  addVolumePanel: false,
  addCCIPanel: false,
  addVolumeProfile: false,
  showTradingPeriod: false,
  aligned: false,
  addProfitLoss: false,
  overwriteShow: false,
  rsiPeriod: 7,
  cciPeriod: 20,
  volumeProfileColumns: 24,
  cciSource: "closes",
  showBullets: true,
  showPlaybackControl: true,
  addHorizontalLine: false,
  intracommodity: false,
  stockGraphType: "line",
  showSeasonals: true,
  seasonals: [5, 15],
  truncate: 1,
  buySell: "buy",
  dataSource: "eod",
  chartParameters: {
    lastChartDate: "2020-12-31",
    balloons: false,
    skipEmptyPeriods: false,
    levels: [
      { from: 400, to: 440, color: "orange", name: "horizontal-bronze-series" },
      { from: 440, to: 500, color: "silver", name: "horizontal-silver-series" },
      { from: 500, to: 550, color: "gold", name: "horizontal-gold-series" },
    ],
    entryType: "stop",
  },
  playback: {
    start: "2021-02-25",
    end: "2021-05-06",
    interval: 1,
    breakpoints: [
    ],
  },
  search: {},
  instrument: "future",
  user: "A4A-user0",
  password: "M1-K8xQgmR",
};
</script>
<style scoped>
table > thead > tr > th {
  font-size: 1.75rem !important;
}
table > tbody > tr > td {
  font-size: 1.75rem !important;
}
.v-text-field .v-label--active {
    left: -8px !important;
}
.accent {
  background-color: #005caf !important;
  border-color: #005caf !important;
}
textarea {
  margin-top:10px;
}
</style>