<template>
    <div style="width: auto; margin: 20px 0 30px 0px; font-size: 1.15rem;">

        <!--  <div><h1 class="text-2xl">Support</h1></div> -->

        <form ref="form" @submit.prevent="sendEmail">
            <label style="font-size: 1.2rem; font-weight: bold; margin-bottom: -5px">Name</label>
            <input 
                type="text" 
                v-model="from_name"
                name="from_name"
                style="background-color: white">

            <label style="font-size: 1.2rem; font-weight: bold; margin: 10px 0 -5px 0">Email</label>
            <input 
                type="email" 
                v-model="email"
                name="email"
                style="background-color: white;">
                
            <label style="font-size: 1.2rem; font-weight: bold; margin: 10px 0 -5px 0">Tab Info</label>
                <p style="margin-top: 30px; font-size: 1.2rem; text-align: left;">  
                    Please select the tab that is causing the problem, if applicable.
                <b-form-select style="width: min-content; border: 1px solid gray; font-size: 1.1rem;"
                               size="sm"
                               v-model="selectedTabtitle"
                               :options="tabTitles"></b-form-select>      
                </p>

            <label style="font-size: 1.2rem; font-weight: bold; margin: 20px 0 -5px 0">Message</label>
            <textarea 
                name="message"
                v-model="message"
                cols="30" rows="5"
                style="background-color: white">
            </textarea>

            <span style="display; hide" id="generalForm"> <label>generalForm</label>
                <input 
                    type="text" 
                    v-model="generalForm"
                    name="generalForm"
                    placeholder="generalForm">
            </span>

            <label style="font-size: 1.2rem; font-weight: bold; margin: 10px 0 -5px 0">Attachments</label>
                <p style="margin-top: 30px; font-size: 1.2rem; text-align: left;">  
                    If you have any images or screenshots you can add them here.                
                        <input type="file" name="my_file" style="margin: 5px 0 0 10px;"> 
                </p>               

            <div style="margin: 30px 0 0 0">
            <input type="submit"><span style="font-size: 1.2rem; font-weight: bold; margin-left: 10px"> {{ response }} </span>
            </div>
        </form>

    </div>
</template>

<style scoped>
    * {box-sizing: border-box;}

    #generalForm {
        display: none;
    }

    .container {
        display: block;
        margin:auto;
        text-align: center;
        border-radius: 5px;
        background-color: #f2f2f2;
        padding: 20px;
        width: 50%;
    }

    label {
        float: left;
    }

    input[type=text], [type=email], textarea {
        width: 100%;
        padding: 12px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
        margin-top: 6px;
        margin-bottom: 16px;
        resize: vertical;
    }

    input[type=submit] {
        background-color: #4CAF50;
        color: white;
        padding: 12px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    input[type=submit]:hover {
        background-color: #45a049;
    }
</style>

<script>

    import emailjs from 'emailjs-com';

    export default {
        mounted() {
            console.log("Support.vue starting.");
            this.selectedTabtitle = this.tabTitles[0];
            console.log("this.selectedTabtitle=", this.selectedTabtitle);

            if(this.selectedTabtitle !== "not applicable"){
            let selectedGeneralForm = JSON.parse(JSON.stringify(this.$store.getters["moduleArray"].find(x => x.tabTitle === this.selectedTabtitle)));
            delete selectedGeneralForm.browserSideOnly;
            delete selectedGeneralForm.playback;
            delete selectedGeneralForm.password;
            delete selectedGeneralForm.chartParameters.levels;

            console.log("selectedGeneralForm=", selectedGeneralForm);
            this.generalForm = JSON.stringify(selectedGeneralForm);
            }
        },
        data() {
            return {
                text: '',

                from_name: '',
                email: '',
                message: '',
                // generalForm: '',
                selectedTabtitle: "",
                response: ""
            }
        },
        computed: {
            tabTitles() {
                let arr = this.$store.getters["moduleArray"].map(x => x.tabTitle);
                arr.push("not applicable");
                //console.log("arr=", arr);
                return arr;
            },
            generalForm: {
                get() {
                    return JSON.stringify(this.$store.getters["moduleArray"].find(x => x.tabTitle === this.selectedTabtitle));
                },
                set() {}
            }
        },
        methods: {
            sendEmail(e) {
                console.log("sendEmail() starting.");
                let that = this;
                try {

                    emailjs.sendForm('contact_service', 'support_iu5c7gg', e.target,
                            'user_9dgrTyfSRJhpv89lkOj4l', {
                                // name: this.name,
                                // email: this.email,
                                // message: this.message
                            })
                     .then(function() {
                        console.log('SUCCESS!');
                        that.response = "Thank you. Your message has been sent.";
                    }, function(error) {
                        console.log('FAILED...', error);
                        that.response = "ERROR: ",  error;
                    });

                } catch (error) {
                    console.log({error})
                }
                // Reset form field
                this.from_name = ''
                this.email = ''
                this.message = ''
                this.response = ''
            }
        }
    }

</script>
