<template>
    <b-modal @hidden="initializeForm()" ref="modal" static title="건강 정보 입력">
        <ValidationObserver ref="form-validation">
            <b-form @submit.stop.prevent="editHealthData()">
                <b-row class="mb-3">
                    <b-col sm="6">
                        <label for="sex-input">성별:</label>
                    </b-col>
                    <b-col>
                        <b-form-radio-group id="sex-input" v-model="form.sex">
                            <b-form-radio value="male">남성</b-form-radio>
                            <b-form-radio value="female">여성</b-form-radio>
                        </b-form-radio-group>
                    </b-col>
                </b-row>

                <b-row class="mb-3">
                    <b-col sm="6">
                        <label for="birthdate-input">생일:</label>
                    </b-col>
                    <b-col>
                        <ValidationProvider :rules="{ regex: /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/}"
                                            name="생일" slim v-slot="{errors}">
                            <b-input-group>
                                <b-form-input :state="(errors[0]) ? false : null" aria-describedby="birthdate-feedback"
                                              id="birthdate-input" placeholder="YYYY-MM-DD" type="text"
                                              v-model="form.birthdate.date">
                                </b-form-input>
                                <b-input-group-append>
                                    <b-form-datepicker aria-controls="birthdate-input" button-only right
                                                       v-model="form.birthdate.date"></b-form-datepicker>
                                </b-input-group-append>
                            </b-input-group>
                        </ValidationProvider>
                        <b-form-checkbox class="mt-1" v-model="form.birthdate.isLunar">음력</b-form-checkbox>
                    </b-col>
                </b-row>

                <b-row class="mb-3">
                    <b-col sm="6">
                        <label for="height-input">신장(cm):</label>
                    </b-col>
                    <b-col>
                        <ValidationProvider name="신장" rules="min_value:0" v-slot="{errors}">
                            <b-form-input
                                    :state="(errors[0]) ? false : null"
                                    aria-describedby="height-feedback"
                                    id="height-input"
                                    type="number"
                                    v-model="form.height"
                            ></b-form-input>
                            <b-form-invalid-feedback id="height-feedback">
                                {{ errors[0] }}
                            </b-form-invalid-feedback>
                        </ValidationProvider>
                    </b-col>
                </b-row>

                <b-row class="mb-3">
                    <b-col sm="6">
                        <label for="weight-input">체중(kg):</label>
                    </b-col>
                    <b-col>
                        <ValidationProvider name="체중" rules="min_value:0" v-slot="{errors}">
                            <b-form-input
                                    :state="(errors[0]) ? false : null"
                                    aria-describedby="weight-feedback"
                                    id="weight-input"
                                    type="number"
                                    v-model="form.weight"
                            ></b-form-input>
                            <b-form-invalid-feedback id="weight-feedback">
                                {{ errors[0] }}
                            </b-form-invalid-feedback>
                        </ValidationProvider>
                    </b-col>
                </b-row>

                <b-row class="mb-3">
                    <b-col sm="6">
                        <label for="weight-input">저밀도 콜레스테롤(mg/DI):</label>
                    </b-col>
                    <b-col>
                        <ValidationProvider name="저밀도 콜레스테롤" rules="min_value:0" v-slot="{errors}">
                            <b-form-input
                                    :state="(errors[0]) ? false : null"
                                    aria-describedby="ldl-cholesterol-feedback"
                                    id="ldl-cholesterol-input"
                                    type="number"
                                    v-model="form.ldlCholesterol"
                            ></b-form-input>
                            <b-form-invalid-feedback id="ldl-cholesterol-feedback">
                                {{ errors[0] }}
                            </b-form-invalid-feedback>
                        </ValidationProvider>
                    </b-col>
                </b-row>

                <b-row class="mb-3">
                    <b-col sm="6">
                        <label for="weight-input">허리둘레(cm):</label>
                    </b-col>
                    <b-col>
                        <ValidationProvider name="허리둘레" rules="min_value:0" v-slot="{errors}">
                            <b-form-input
                                    :state="(errors[0]) ? false : null"
                                    aria-describedby="waist-feedback"
                                    id="waist-input"
                                    type="number"
                                    v-model="form.waist"
                            ></b-form-input>
                            <b-form-invalid-feedback id="waist-feedback">
                                {{ errors[0] }}
                            </b-form-invalid-feedback>
                        </ValidationProvider>
                    </b-col>
                </b-row>

                <b-row class="mb-3">
                    <b-col sm="6">
                        <label for="weight-input">혈압(mmHg):</label>
                    </b-col>
                    <b-col>
                        <b-form inline>
                            <ValidationProvider :rules="`max_value:${form.bloodPressure.max}`"
                                                slim v-slot="{errors}">
                                <b-form-input
                                        :state="(errors[0]) ? false : null"
                                        aria-describedby="blood-pressure-min-feedback"
                                        id="blood-pressure-min-input"
                                        style="width: 45%;"
                                        type="number"
                                        v-model="form.bloodPressure.min"
                                ></b-form-input>
                            </ValidationProvider>
                            <span class="text-center" style="width: 10%">~</span>
                            <ValidationProvider :rules="`min_value:${form.bloodPressure.min}`"
                                                slim v-slot="{errors}">
                                <b-form-input
                                        :state="(errors[0]) ? false : null"
                                        aria-describedby="blood-pressure-max-feedback"
                                        id="blood-pressure-max-input"
                                        style="width: 45%;"
                                        type="number"
                                        v-model="form.bloodPressure.max"
                                ></b-form-input>
                            </ValidationProvider>
                        </b-form>
                        <b-form-checkbox class="mt-1" v-model="form.bloodPressureMedicine">
                            고혈압 치료약제 복용
                        </b-form-checkbox>
                    </b-col>
                </b-row>

                <b-row class="mb-3">
                    <b-col sm="6">
                        <label for="weight-input">중성지방(mg/DI):</label>
                    </b-col>
                    <b-col>
                        <ValidationProvider name="중성지방" rules="min_value:0" v-slot="{errors}">
                            <b-form-input
                                    :state="(errors[0]) ? false : null"
                                    aria-describedby="neutral-fat-feedback"
                                    id="neutral-fat-input"
                                    type="number"
                                    v-model="form.neutralFat"
                            ></b-form-input>
                            <b-form-invalid-feedback id="neutral-fat-feedback">
                                {{ errors[0] }}
                            </b-form-invalid-feedback>
                        </ValidationProvider>
                        <b-form-checkbox class="mt-1" v-model="form.neutralFatMedicine">
                            이상지혈증 치료약제 복용
                        </b-form-checkbox>
                    </b-col>
                </b-row>

                <b-row class="mb-3">
                    <b-col sm="6">
                        <label for="weight-input">고밀도 콜레스테롤(mg/DI):</label>
                    </b-col>
                    <b-col>
                        <ValidationProvider name="고밀도 콜레스테롤" rules="min_value:0"
                                            v-slot="{errors}">
                            <b-form-input
                                    :state="(errors[0]) ? false : null"
                                    aria-describedby="hdl-cholesterol-feedback"
                                    id="hdl-cholesterol-input"
                                    type="number"
                                    v-model="form.hdlCholesterol"
                            ></b-form-input>
                            <b-form-invalid-feedback id="hdl-cholesterol-feedback">
                                {{ errors[0] }}
                            </b-form-invalid-feedback>
                        </ValidationProvider>
                    </b-col>
                </b-row>

                <b-row class="mb-3">
                    <b-col sm="6">
                        <label for="weight-input">공복혈당(mg/DI):</label>
                    </b-col>
                    <b-col>
                        <ValidationProvider name="공복혈당" rules="min_value:0"
                                            v-slot="{errors}">
                            <b-form-input
                                    :state="(errors[0]) ? false : null"
                                    aria-describedby="fasting-blood-sugar-feedback"
                                    id="fasting-blood-sugar-input"
                                    type="number"
                                    v-model="form.fastingBloodSugar"
                            ></b-form-input>
                            <b-form-invalid-feedback id="fasting-blood-sugar-feedback">
                                {{ errors[0] }}
                            </b-form-invalid-feedback>
                        </ValidationProvider>
                        <b-form-checkbox class="mt-1" v-model="form.fastingBloodSugarMedicine">
                            당뇨병 치료약제 복용
                        </b-form-checkbox>
                    </b-col>
                </b-row>
            </b-form>
        </ValidationObserver>

        <error-alerts ref="error-alerts"/>

        <template v-slot:modal-footer="{ cancel }">
            <b-button @click="cancel()">
                취소
            </b-button>
            <b-button @click="handleOk" variant="primary">
                등록
            </b-button>
        </template>
    </b-modal>
</template>

<script>
    import {extend, ValidationObserver, ValidationProvider} from "vee-validate";
    import {max_value, min_value, regex} from "vee-validate/dist/rules";
    import * as HealthDataService from "@/services/health-data";
    import {mapGetters} from "vuex";
    import ErrorAlerts from "@/components/ErrorAlerts";
    import {YYYYMMDD} from "@/utils/time-formatter";
    import moment from "moment";

    extend('regex', regex);
    extend('max_value', max_value);
    extend('min_value', min_value);

    function defaultFormData() {
        return {
            sex: undefined,
            birthdate: {
                date: undefined,
                isLunar: undefined
            },
            height: undefined,
            weight: undefined,
            ldlCholesterol: undefined,
            waist: undefined,
            bloodPressure: {
                min: undefined,
                max: undefined,
            },
            bloodPressureMedicine: undefined,
            neutralFat: undefined,
            neutralFatMedicine: undefined,
            hdlCholesterol: undefined,
            fastingBloodSugar: undefined,
            fastingBloodSugarMedicine: undefined
        };
    }

    function clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    export default {
        name: "health-edit-modal",
        components: {ErrorAlerts, ValidationObserver, ValidationProvider},
        data() {
            return {
                healthData: undefined,
                form: defaultFormData()
            }
        },
        computed: {
            ...mapGetters({
                currentUser: 'auth/currentUser'
            })
        },
        methods: {
            show() {
                this.$refs['modal'].show();
            },
            hide() {
                this.$refs['modal'].hide();
            },
            initializeForm() {
                this.form = (this.healthData) ? clone(this.healthData) : defaultFormData();

                if (!this.form.birthdate) this.form.birthdate = {};
                if (!this.form.bloodPressure) this.form.bloodPressure = {};

                if (this.form.birthdate.date) {
                    this.form.birthdate.date = moment(this.healthData.birthdate.date).format(YYYYMMDD);
                }

                this.$refs['form-validation'].reset();
            },
            handleOk(event) {
                event.preventDefault();
                this.editHealthData();
            },
            editHealthData() {
                this.$refs['form-validation'].validate()
                    .then(passed => {
                        if (passed) {
                            let date = moment().toISOString();
                            let body = this.form;

                            HealthDataService.createHealthData(this.currentUser.id, date, body)
                                .then(healthData => {
                                    this.healthData = healthData;
                                    this.$emit('updated', healthData);
                                    this.hide();
                                })
                                .catch(err => this.handleError(err));
                        }
                    });
            },
            handleError(error) {
                let alerts = this.$refs['error-alerts'];
                if (alerts) {
                    alerts.add(error);
                }
            }
        },
        created() {
            HealthDataService.getLatestHealthData(this.currentUser.id)
                .then(healthData => {
                    this.healthData = healthData;
                    this.initializeForm();
                })
                .catch(err => this.handleError(err));
        }
    }
</script>

<style scoped>

</style>