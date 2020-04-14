<template>
    <b-container class="mt-3">
        <vue-headful title="대사 관리 - 스마트 헬스케어"/>
        <h2>대사 관리</h2>
        <hr/>
        <error-alerts ref="error-alerts"/>

        <transition name="fade">
            <template v-if="loadedHealthData">
                <b-container class="p-0 mb-3">
                    <b-row>
                        <b-col sm="5">
                            <b-card class="mb-3" header="기초대사량">
                                <b-card-text class="display-4" v-if="healthData.bmr">{{ prettyBmr }}kcal
                                </b-card-text>
                                <b-card-text v-else>성별과 생일, 신장, 체중 정보가 필요합니다.</b-card-text>
                            </b-card>

                            <b-card class="mb-3" header="비만도">
                                <template v-if="healthData.bmi">
                                    <b-card-text class="display-4">{{ prettyBmi }}</b-card-text>

                                    <h6>
                                        현재 체중
                                        <b-badge :variant="bmiStateVariant">{{ bmiStateText }}</b-badge>
                                    </h6>
                                    <b-progress class="mb-2">
                                        <b-progress-bar :label="String(prettyBmi)" :value="healthData.bmi - 15"
                                                        :variant="bmiStateVariant" max="20"></b-progress-bar>
                                    </b-progress>
                                    <h6>정상 체중</h6>
                                    <b-progress>
                                        <b-progress-bar label="18.5~23" max="20" value="6"
                                                        variant="success"></b-progress-bar>
                                    </b-progress>
                                </template>
                                <template v-else>
                                    <b-card-text>신장과 체중 정보가 필요합니다.</b-card-text>
                                </template>
                            </b-card>
                        </b-col>
                        <b-col>
                            <b-card header="건강 정보">
                                <b-table :fields="healthDataTableFields" :items="[healthData]" stacked>
                                    <template v-slot:cell(height)="data">
                                        <template v-if="data.value">{{ data.value }}cm</template>
                                        <template v-else>-</template>
                                    </template>
                                    <template v-slot:cell(weight)="data">
                                        <template v-if="data.value">{{ data.value }}kg</template>
                                        <template v-else>-</template>
                                    </template>
                                    <template v-slot:cell(ldlCholesterol)="data">
                                        <template v-if="data.value">{{ data.value }}mg/DI</template>
                                        <template v-else>-</template>
                                    </template>
                                    <template v-slot:cell(waist)="data">
                                <span id="waist">
                                    <template v-if="data.value">
                                        {{ data.value }}cm
                                        <template v-if="healthData.abnormalFields.includes('waist')">
                                            <b-badge class="ml-1" variant="danger">비정상</b-badge>
                                        </template>
                                    </template>
                                    <template v-else>-</template>
                                </span>
                                        <b-tooltip target="waist">
                                            남자 90cm, 여자 85cm 이상 비정상
                                        </b-tooltip>
                                    </template>
                                    <template v-slot:cell(bloodPressure)="data">
                                <span id="blood-pressure">
                                    <template v-if="data.value && data.value.min && data.value.max">
                                        {{ data.value.min }}~{{ data.value.max }}mmHg
                                        <template v-if="healthData.abnormalFields.includes('bloodPressure')">
                                            <b-badge class="ml-1" variant="danger">비정상</b-badge>
                                        </template>
                                    </template>
                                    <template v-else>-</template>
                                </span>
                                        <b-tooltip target="blood-pressure">130/85mmHg 이상 비정상</b-tooltip>
                                    </template>
                                    <template v-slot:cell(neutralFat)="data">
                                <span id="neutral-fat">
                                    <template v-if="data.value">
                                        {{ data.value }}mg/DI
                                        <template v-if="healthData.abnormalFields.includes('neutralFat')">
                                            <b-badge class="ml-1" variant="danger">비정상</b-badge>
                                        </template>
                                    </template>
                                    <template v-else>-</template>
                                </span>
                                        <b-tooltip target="neutral-fat">150mg/DI 이상 비정상</b-tooltip>
                                    </template>
                                    <template v-slot:cell(hdlCholesterol)="data">
                                <span id="hdl-cholesterol">
                                    <template v-if="data.value">
                                        {{ data.value }}mg/DI
                                        <template v-if="healthData.abnormalFields.includes('hdlCholesterol')">
                                            <b-badge class="ml-1" variant="danger">비정상</b-badge>
                                        </template>
                                    </template>
                                    <template v-else>-</template>
                                </span>
                                        <b-tooltip target="hdl-cholesterol">
                                            남자 40mg/DI, 여자 50mg/DI 미만 비정상
                                        </b-tooltip>
                                    </template>
                                    <template v-slot:cell(fastingBloodSugar)="data">
                                <span id="fasting-blood-sugar">
                                    <template v-if="data.value">
                                        {{ data.value }}mg/DI
                                        <template v-if="healthData.abnormalFields.includes('fastingBloodSugar')">
                                            <b-badge class="ml-1" variant="danger">비정상</b-badge>
                                        </template>
                                    </template>
                                    <template v-else>-</template>
                                </span>
                                        <b-tooltip target="fasting-blood-sugar">
                                            100mg/DI 이상 비정상
                                        </b-tooltip>
                                    </template>
                                </b-table>
                            </b-card>
                        </b-col>
                    </b-row>
                </b-container>
            </template>
        </transition>

        <b-container class="text-right">
            <b-button @click="showEditModal()" pill variant="primary">
                <b-icon-pencil></b-icon-pencil>
                정보 입력
            </b-button>
        </b-container>

        <health-edit-modal @updated="updateHealthData" ref="edit-modal"></health-edit-modal>
    </b-container>
</template>

<script>
    import HealthEditModal from "@/components/HealthEditModal";
    import * as HealthDataService from "@/services/health-data";
    import {mapGetters} from "vuex";
    import ErrorAlerts from "@/components/ErrorAlerts";

    export default {
        name: "health",
        components: {ErrorAlerts, HealthEditModal},
        data() {
            return {
                loadedHealthData: false,
                healthDataTableFields: [
                    {key: 'height', label: '신장'},
                    {key: 'weight', label: '체중'},
                    {key: 'ldlCholesterol', label: '저밀도 콜레스테롤'},
                    {key: 'waist', label: '허리둘레'},
                    {key: 'bloodPressure', label: '혈압'},
                    {key: 'neutralFat', label: '중성지방'},
                    {key: 'hdlCholesterol', label: '고밀도 콜레스테롤'},
                    {key: 'fastingBloodSugar', label: '공복혈당'}
                ],
                healthData: {
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
                    fastingBloodSugarMedicine: undefined,
                    age: undefined,
                    bmr: undefined,
                    bmi: undefined,
                    bmiState: undefined,
                    abnormalFields: []
                },
                bmiStates: {
                    underweight: 'underweight',
                    normal: 'normal',
                    overweight: 'overweight',
                    obese: 'obese',
                    extremelyObese: 'extremelyObese'
                }
            }
        },
        computed: {
            ...mapGetters({
                currentUser: 'auth/currentUser'
            }),
            prettyBmr() {
                return Math.floor(this.healthData.bmr);
            },
            prettyBmi() {
                return Math.floor(this.healthData.bmi * 100) / 100;
            },
            bmiStateText() {
                let bmiState = this.healthData.bmiState;
                if (bmiState === this.bmiStates.underweight) return '저체중';
                else if (bmiState === this.bmiStates.normal) return '정상 체중';
                else if (bmiState === this.bmiStates.overweight) return '과체중';
                else if (bmiState === this.bmiStates.obese) return '비만';
                else return '고도비만';
            },
            bmiStateVariant() {
                let bmiState = this.healthData.bmiState;
                if (bmiState === this.bmiStates.underweight) return 'warning';
                else if (bmiState === this.bmiStates.normal) return 'success';
                else if (bmiState === this.bmiStates.overweight) return 'warning';
                else return 'danger';
            }
        },
        methods: {
            showEditModal() {
                this.$refs['edit-modal'].show();
            },
            updateHealthData(healthData) {
                this.healthData = healthData;
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
                .then(healthData => this.healthData = healthData)
                .catch(err => this.handleError(err))
                .then(() => this.loadedHealthData = true);

            if (this.$route.query.edit) {
                this.$nextTick(() => this.showEditModal());
            }
        }
    }
</script>

<style scoped>

</style>