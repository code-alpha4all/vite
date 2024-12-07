// import { createInitialState } from '@/js/createInitialState.js';
import {symbolArray} from '@/js/main';

const portfolioTourMixin = {
    mounted() {
        console.log("portfolioTourMixin.js mounted() starting. this.namespace=", this.namespace);
    },
    data: function(){
        return {
            last: null,
            ticksize: null,
            futuresTabIndex: null
        }
    },
    computed: {
        portfolioSteps() {
            let that = this;
            return  [
                {
                    target: '#tour-start', 
                    header: {
                        title: 'Portfolio Tour',
                    },
                    content: `<p style="text-align: left">We start by opening a Futures chart.</p>
                        <p style="text-align: left">You may use the ←, → and ESC keys to navigate through the tour.</p>`,
                    params: {
                        enableScrolling: false
                    },
                    before: (type) => {
                        console.log("type=", type);

                        if(type === 'start'){
                            let initializingState = [];
                            that.$store.commit("user/setInitializingState", initializingState);
                            that.$store.dispatch('newTab', "BasicChartsNew");

                        }
                    }
                },
                {
                    target: '#add-to-portfolio-button-' + that.activeModuleName,
                    content: `<p style="text-align: left">Push this button to add this trade to the portfolio. This button is also on the Calculator program.</p>`,

                    params: {
                        placement: 'bottom',
                        enableScrolling: false
                    },
                    before: (type) => {
                        // 'type' can be 'start', 'nextStep', or 'previousStep'
                        console.log("type=", type);
                        return new Promise((resolve) => {
                            console.log("that.$store.state.activeModuleIndex=", that.$store.state.activeModuleIndex);

                            that.futuresTabIndex = that.$store.state.activeModuleIndex;
                            console.log("that.futuresTabIndex=", that.futuresTabIndex);

                            if(type === 'previous'){
                                that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-basic-chart-output'][0].$refs['add-to-portfolio-button-'+that.activeModuleName].hideModal();                     
                            }

                             setTimeout(function () {
                                console.log("that.$refs=", that.$refs);

                                 resolve('foo');
                             }, 500);
                        });
                    } 
                },
                {
                    target: '#add-to-portfolio-folders-' + that.activeModuleName,
                    content: `<p style="text-align: left">These are the folders that are available in the Portfolio. Select the one you want to add the trade to, or...</p>`,
                    params: {
                        placement: 'bottom',
                        enableScrolling: false
                    },
                    before: (type) => {
                        // 'type' can be 'start', 'nextStep', or 'previousStep'
                        console.log("type=", type);
                        return new Promise((resolve) => {

                            if(type === 'next'){
                                that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-basic-chart-output'][0].$refs['add-to-portfolio-button-'+that.activeModuleName].showModal();                     
                            } 
                            
                            setTimeout(function () {
                                console.log("that.$refs=", that.$refs);

                                 resolve('foo');
                             }, 500);
                        });
                    }                    
                },
                {
                    target: '#add-to-portfolio-add-folder-' + that.activeModuleName,
                    content: `<p style="text-align: left">Click here if you would like to add a new folder to the Portfolio.</p>`,
                    params: {
                        placement: 'bottom',
                        enableScrolling: false
                    }                
                },
                {
                    target: '#add-to-portfolio-new-folder-' + that.activeModuleName,
                    content: `<p style="text-align: left">We are going to create a new folder named 'Tour'.</p>`,
                    params: {
                        placement: 'bottom',
                        enableScrolling: false
                    },
                    before: () => {
                        // 'type' can be 'start', 'nextStep', or 'previousStep'

                      /* console.log("that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-basic-chart-output'][0].$refs['add-to-portfolio-button-'+that.activeModuleName].$refs['portfolio-folders-'+that.activeModuleName]=", 
                        that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-basic-chart-output'][0].$refs['add-to-portfolio-button-'+that.activeModuleName].$refs['portfolio-folders-'+that.activeModuleName]);
                      */

                        return new Promise((resolve) => {

                        that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-basic-chart-output'][0].$refs['add-to-portfolio-button-'+that.activeModuleName]
                            .$refs['portfolio-folders-'+that.activeModuleName].showNewFolderNameInput();
                        
                        that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-basic-chart-output'][0].$refs['add-to-portfolio-button-'+that.activeModuleName]
                            .$refs['portfolio-folders-'+that.activeModuleName].newFolder = "Tour";                
                    
                            setTimeout(function () {
                                 resolve('foo');
                             }, 50);
                        });
                    }            
                },
                {
                    target: '#add-to-portfolio-new-folder-add-button-' + that.activeModuleName,
                    content: `<p style="text-align: left">Then click the Add button to create the folder.</p>`,
                    params: {
                        placement: 'bottom',
                        enableScrolling: false
                    },
                    before: (type) => {
                        if(type === "previous"){          
                            that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-basic-chart-output'][0].$refs['add-to-portfolio-button-'+that.activeModuleName]
                            .$refs['portfolio-folders-'+that.activeModuleName].showNewFolderNameInput();
                        }

                        return new Promise((resolve) => {
                            setTimeout(function () {
                                 resolve('foo');
                            }, 200);
                        });
                    }
                },
                {
                    target: '#add-to-portfolio-add-button-' + that.activeModuleName,
                    content: `<p style="text-align: left">Click here to add the trade to the selected folder.</p>`,
                    params: {
                        placement: 'bottom',
                        enableScrolling: false
                    },
                    before: () => {
                        // 'type' can be 'start', 'nextStep', or 'previousStep'

                      that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-basic-chart-output'][0].$refs['add-to-portfolio-button-'+that.activeModuleName]
                        .$refs['portfolio-folders-'+that.activeModuleName].addNewFolder();                                    
                    }                                
                },
                {
                   target: '#go-to-portfolio-button-' + that.activeModuleName,
                   content: `<p style="text-align: left">Click here to go to the Portfolio.</p>`,
                    params: {
                        placement: 'bottom',
                        enableScrolling: false
                    },
                    before: (type) => {
                        if(type === "next"){
                        console.log("that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-basic-chart-output'][0].$refs=", that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-basic-chart-output'][0].$refs['add-to-portfolio-button-'+that.activeModuleName]);
                        that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-basic-chart-output'][0].$refs['add-to-portfolio-button-'+that.activeModuleName].createTrade();
                        
                        return new Promise((resolve) => {
                            setTimeout(function () {
                                 resolve('foo');
                            }, 800);
                        });
                    } else if(type === "previous"){
                                console.log("that.futuresTabIndex=", that.futuresTabIndex);
                                this.$store.commit("setActiveModuleIndex", that.futuresTabIndex);
                                that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-basic-chart-output'][0].$refs['add-to-portfolio-button-'+that.activeModuleName].showModal();   
                                that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-basic-chart-output'][0].$refs['add-to-portfolio-button-'+that.activeModuleName].result = "success";
                             /*   that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-basic-chart-output'][0].$refs['add-to-portfolio-button-'+that.activeModuleName]
                            .$refs['portfolio-folders-'+that.activeModuleName].showNewFolderName = true; */
                            return new Promise((resolve) => {
                                setTimeout(function () {
                                     resolve('foo');
                                }, 2000);
                            });
                        }
                       
                        
                    }                    
                },
                {
                    target: '#portfolioTicker-0',
                    content: `<p style="text-align: left">Here's the ticker that was just added.</p>`,
                    params: {
                        enableScrolling: false
                    },
                    before: (type) => {
                        if(type === "next"){
                        that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-basic-chart-output'][0].$refs['add-to-portfolio-button-'+that.activeModuleName].goToPortfolio();

                        console.log("this.$refs.content.$refs.tabsBox", this.$refs.content.$refs.tabsBox);
                       // this.$refs.content.$refs.tabsBox.closeTab(this.activeModuleName);

                        return new Promise((resolve) => {
                       setTimeout(function () {
                        resolve('foo');
                            }, 3000);
                        });
                    } 
                }
                },
                {
                    target: '#portfolioBuySell-0',
                    content: `<p style="text-align: left">This was chosen from the Futures page that added this ticker.</p>`,

                    params: {
                        placement: 'bottom',
                        enableScrolling: false
                    }
                },
                {
                    target: '#portfolioNumberOfOpenPositions-0',
                    content: `<p style="text-align: left">Notice that the number of open trades, the number of closed trades, realized profit and unrealized profit are all zero. This because we
                        haven't added any trades to this ticker yet.</p>`,

                    params: {
                        placement: 'bottom',
                        enableScrolling: false
                    }
                },                
                {
                    target: '#tradesIcon-0',
                    content: `<p style="text-align: left">To toggle the trades panel, click the icon above.</p>`,

                    params: {
                        placement: 'bottom',
                        enableScrolling: false
                    }
                },
                {
                    target: '#portfolio-trades-openDate-selector',
                    content: `<p style="text-align: left">Click the box above to change the entry date.</p>`,

                    params: {
                        placement: 'bottom',
                        enableScrolling: false
                    },
                    before: () => {
                        // 'type' can be 'start', 'nextStep', or 'previousStep'

                       // console.log("this.$refs.content.$refs.tabsBox", this.$refs.content.$refs.tabsBox);
                       // console.log("that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-portfolio-output']", that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-portfolio-output']);

                        let item = that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-portfolio-output'][0].strategies[0];
                        item.portfolio.detailsType = "trades";
                        console.log("item=", item);
                        that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-portfolio-output'][0].openTrades(item);
                    } 
                },
                {
                    target: '#portfolio-trades-openPrice-selector',
                    content: `<p style="text-align: left">It is not necessary to enter the remaining parameters of the trade. All values can be added or edited later. We will set an entry
                                price of `+ (that.last - that.tickSize) +` for the tour.</p>`,

                    params: {
                        placement: 'bottom',
                        enableScrolling: false
                    },
                    before: () => {
                        // 'type' can be 'start', 'nextStep', or 'previousStep'
                        console.log("that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-portfolio-output'][0].$refs['portfolio-trades-table'", 
                                that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-portfolio-output'][0].$refs['portfolio-trades-table']);

                        console.log("symbolArray=", symbolArray);
                        that.tickSize = symbolArray.find(x => x.eod === "S").tickSize;
                        console.log("that.tickSize=", that.tickSize);

                        let item = that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-portfolio-output'][0].strategies[0];
                        console.log("item=", item);

                        that.last = item.last;

                        let newTrade = that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-portfolio-output'][0].$refs['portfolio-trades-table'].newTrade;
                        newTrade.openPrice = that.last-that.tickSize;
                        console.log("newTrade=", newTrade);

                        return new Promise((resolve) => {
                            setTimeout(function () {
                                 resolve('foo');
                            }, 200);
                        });

                    } 
                },
                {
                    target: '#portfolio-trades-add-trade-button',
                    content: `<p style="text-align: left">Click here to add the trade.</p>`,

                    params: {
                        placement: 'bottom',
                        enableScrolling: false
                    }
                },
                {
                    target: '#portfolio-trades-edit-icon',
                    content: `<p style="text-align: left">Click here to edit the trade.</p>`,

                    params: {
                        placement: 'bottom',
                        enableScrolling: false
                    },
                    before: (type) => {
                        if(type === "next"){
                        console.log("that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-portfolio-output'][0].$refs['portfolio-trades-table'", 
                                that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-portfolio-output'][0].$refs['portfolio-trades-table']);

                                that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-portfolio-output'][0].$refs['portfolio-trades-table'].addTrade();
                        }
                                return new Promise((resolve) => {
                                    setTimeout(function () {
                                         resolve('foo');
                                    }, 100);
                                });
                    } 
                },
                {
                    target: '#portfolio-trades-duplicate-icon',
                    content: `<p style="text-align: left">If you want to use a current trade as a template for a new trade, click here to duplicate the trade.</p>`,

                    params: {
                        placement: 'bottom',
                        enableScrolling: false
                    } 
                },
                {
                    target: '#portfolio-trades-delete-icon',
                    content: `<p style="text-align: left">Click here to delete the trade.</p>`,

                    params: {
                        placement: 'bottom',
                        enableScrolling: false
                    } 
                },                
                {
                    target: '#portfolio-trades-select-chart-icon',
                    content: `<p style="text-align: left">If you want to see a chart, click here and select.</p>`,

                    params: {
                        placement: 'bottom',
                        enableScrolling: false
                    },
                    before: (type) => {
                       // console.log("that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-portfolio-output']", that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-portfolio-output']);
                       if(type === "previous"){
                        let item = that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-portfolio-output'][0].strategies[0];
                        item.portfolio.detailsType = "trades";
                        console.log("item=", item);
                        that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-portfolio-output'][0].openTrades(item);
                       }
                    }  
                },
                {
                    target: '#portfolio-alarms-icon-0',
                    content: `<p style="text-align: left">If you would like to add some email alarms, click, here.</p>`,

                    params: {
                        placement: 'bottom',
                        enableScrolling: false
                    },
                    
                },
                {
                    target: '#portfolio-alarms-ruleTarget-selector',
                    content: `<p style="text-align: left">Select what you want to compare.</p>`,

                    params: {
                        placement: 'bottom',
                        enableScrolling: false
                    },
                    before: () => {
                        // 'type' can be 'start', 'nextStep', or 'previousStep'

                        console.log("that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-portfolio-output']", that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-portfolio-output']);

                        let item = that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-portfolio-output'][0].strategies[0];
                        item.portfolio.detailsType = "alarms";
                        console.log("item=", item);
                        that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-portfolio-output'][0].openAlarms(item);
                    } 
                },
                {
                    target: '#portfolio-alarms-ruleComparator-selector',
                    content: `<p style="text-align: left">Select the type of comparison.</p>`,

                    params: {
                        placement: 'bottom',
                        enableScrolling: false
                    }                    
                },
                {
                    target: '#portfolio-alarms-ruleValue',
                    content: `<p style="text-align: left">Select the value to compare to. We have set the value to be less than the last price to show the 'triggered' state.</p>`,

                    params: {
                        placement: 'bottom',
                        enableScrolling: false
                    },
                    before: () => {
                        // 'type' can be 'start', 'nextStep', or 'previousStep'
                            console.log("that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-portfolio-output'][0].$refs[portfolio-alarms-table]._props.item.last=", 
                            that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-portfolio-output'][0].$refs['portfolio-alarms-table']._props.item.last);

                            let newAlarmValue = that.last-that.tickSize;
                            console.log("newAlarmValue=", newAlarmValue);
                            that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-portfolio-output'][0].$refs['portfolio-alarms-table'].newAlarm.value = that.last-that.tickSize;
                    }                    
                },
                {
                    target: '#portfolio-alarms-add-alarm',
                    content: `<p style="text-align: left">Click here to add the alarm.</p>`,

                    params: {
                        placement: 'bottom',
                        enableScrolling: false
                    } ,
                    before: (type) => {
                        // 'type' can be 'start', 'nextStep', or 'previousStep'
                            console.log("that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-portfolio-output'][0].$refs[portfolio-alarms-table]=", 
                            that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-portfolio-output'][0].$refs['portfolio-alarms-table']);

                            if(type === "previous"){
                            let newAlarm = that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-portfolio-output'][0].$refs['portfolio-alarms-table'].newAlarm;
                            that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-portfolio-output'][0].$refs['portfolio-alarms-table'].removeAlarm(newAlarm);
                            }
                    }                      
                },  
                {
                    target: '#portfolio-alarms-status-0',
                    content: `<p style="text-align: left">Notice the status is "triggered". You should receive an email in the evening with a notification.</p>`,

                    params: {
                        placement: 'bottom',
                        enableScrolling: false
                    },
                    before: (type) => {
                        // 'type' can be 'start', 'nextStep', or 'previousStep'
                            console.log("that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-portfolio-output'][0].$refs[portfolio-alarms-table]=", 
                            that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-portfolio-output'][0].$refs['portfolio-alarms-table']);

                            if(type === "next"){
                            let newAlarm = that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-portfolio-output'][0].$refs['portfolio-alarms-table'].newAlarm;
                            that.$refs.content.$refs.tabsBox.$refs[that.activeModuleName + '-portfolio-output'][0].$refs['portfolio-alarms-table'].addAlarm(newAlarm);
                            }
                    }                    
                },    
                {
                    target: '#portfolio-alarms-edit-0',
                    content: `<p style="text-align: left">Click here to edit the alarm.</p>`,

                    params: {
                        placement: 'bottom',
                        enableScrolling: false
                    }                  
                }, 
                {
                    target: '#portfolio-alarms-delete-0',
                    content: `<p style="text-align: left">Click here to delete the alarm.</p>`,

                    params: {
                        placement: 'bottom',
                        enableScrolling: false
                    }                  
                },   
                {
                    target: '#portfolio-delete-icon-0',
                    content: `<p style="text-align: left">If you would like to delete this ticker and all of its trades and alarms, click here.</p>`,

                    params: {
                        placement: 'bottom',
                        enableScrolling: false
                    },
                    
                },
                {
                    target: '#portfolio-delete-folder',
                    content: `<p style="text-align: left">If you would like to delete this folder and everything in it, click here.</p>`,

                    params: {
                        placement: 'bottom',
                        enableScrolling: false
                    },
                    
                }, 
            ];
        },
    }
};

export default portfolioTourMixin;