<template>
    <b-container>
        <h2>대사 관리</h2>
        <hr/>
        <b-container class="p-0 mb-3">
            <b-row>
                <b-col sm="5">
                    <b-card class="mb-3" header="기초대사량">
                        <b-card-text class="display-4" v-if="bmr !== undefined">{{ bmr }} kcal</b-card-text>
                        <b-card-text v-else>성별과 생일, 신장, 체중 정보가 필요합니다.</b-card-text>
                    </b-card>

                    <b-card class="mb-3" header="비만도">
                        <template v-if="bmi !== undefined">
                            <b-card-text class="display-4">{{ bmi }}</b-card-text>

                            <h6>
                                현재 체중
                                <b-badge v-if="bmiState === bmiStates.underweight" variant="warning">저체중</b-badge>
                                <b-badge v-else-if="bmiState === bmiStates.normal" variant="success">정상 체중</b-badge>
                                <b-badge v-else-if="bmiState === bmiStates.overweight" variant="warning">과체중</b-badge>
                                <b-badge v-else-if="bmiState === bmiStates.obese" variant="danger">비만</b-badge>
                                <b-badge v-else-if="bmiState === bmiStates.extremelyObese" variant="danger">고도비만
                                </b-badge>
                            </h6>
                            <b-progress class="mb-2">
                                <b-progress-bar :label="String(bmi)" :value="bmi - 15" :variant="bmiStateVariant"
                                                max="20"></b-progress-bar>
                            </b-progress>
                            <h6>정상 체중</h6>
                            <b-progress>
                                <b-progress-bar label="18.5~23" max="20" value="6" variant="success"></b-progress-bar>
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
                                    <template v-if="data.value">{{ data.value }}cm</template>
                                    <template v-else>-</template>
                                    <template v-if="abnormalWaist">
                                        <b-badge class="ml-1" variant="danger">비정상</b-badge>
                                    </template>
                                </span>
                                <b-tooltip target="waist">
                                    남자 90cm, 여자 85cm 이상 비정상
                                </b-tooltip>
                            </template>
                            <template v-slot:cell(bloodPressure)="data">
                                <span id="blood-pressure">
                                    <template v-if="data.value && data.value.min && data.value.max">
                                        {{ data.value.min }}~{{ data.value.max }}mmHg
                                    </template>
                                    <template v-else>-</template>
                                    <template v-if="abnormalBloodPressure">
                                        <b-badge class="ml-1" variant="danger">비정상</b-badge>
                                    </template>
                                </span>
                                <b-tooltip target="blood-pressure">130/85mmHg 이상 비정상</b-tooltip>
                            </template>
                            <template v-slot:cell(neutralFat)="data">
                                <span id="neutral-fat">
                                    <template v-if="data.value">
                                        {{ data.value }}mg/DI
                                    </template>
                                    <template v-else>-</template>
                                    <template v-if="abnormalNeutralFat">
                                        <b-badge class="ml-1" variant="danger">비정상</b-badge>
                                    </template>
                                </span>
                                <b-tooltip target="neutral-fat">150mg/DI 이상 비정상</b-tooltip>
                            </template>
                            <template v-slot:cell(hdlCholesterol)="data">
                                <span id="hdl-cholesterol">
                                    <template v-if="data.value">{{ data.value }}mg/DI</template>
                                    <template v-else>-</template>
                                    <template v-if="abnormalHdlCholesterol">
                                        <b-badge class="ml-1" variant="danger">비정상</b-badge>
                                    </template>
                                </span>
                                <b-tooltip target="hdl-cholesterol">
                                    남자 40mg/DI, 여자 50mg/DI 미만 비정상
                                </b-tooltip>
                            </template>
                            <template v-slot:cell(fastingBloodSugar)="data">
                                <span id="fasting-blood-sugar">
                                    <template v-if="data.value">
                                        {{ data.value }}mg/DI
                                    </template>
                                    <template v-else>-</template>
                                    <template v-if="abnormalFastingBloodSugar">
                                        <b-badge class="ml-1" variant="danger">비정상</b-badge>
                                    </template>
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
        <b-container class="text-right">
            <b-button @click="showEditModal()" pill variant="primary">
                <b-icon-pencil></b-icon-pencil>
                정보 입력
            </b-button>
        </b-container>
        <health-edit-modal ref="edit-modal"></health-edit-modal>
    </b-container>
</template>

<script>
    import HealthEditModal from "@/components/HealthEditModal";
    import moment from "moment";

    export default {
        name: "health",
        components: {HealthEditModal},
        data() {
            return {
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
                    fastingBloodSugarMedicine: undefined
                },
                bmiStates: {
                    underweight: 0,
                    normal: 1,
                    overweight: 2,
                    obese: 3,
                    extremelyObese: 4
                }
            }
        },
        computed: {
            age() {
                if (!this.healthData.birthdate || this.healthData.birthdate.date) return undefined;

                return moment().year() - moment(this.healthData.birthdate.date).year() + 1;
            },
            bmr() {
                if (!this.age) return undefined;
                if (!this.healthData.weight) return undefined;
                if (!this.healthData.height) return undefined;

                let sex = this.healthData.sex;
                let weight = this.healthData.weight;
                let height = this.healthData.height;

                if (sex === 'male')
                    return 66.47 + (13.75 * weight) + (5 * height) - (6.76 * this.age);
                else if (sex === 'female')
                    return 65.51 + (9.56 * weight) + (1.85 * height) - (4.68 * this.age);
                else
                    return undefined;
            },
            bmi() {
                if (!this.healthData.weight) return undefined;
                if (!this.healthData.height) return undefined;

                let weight = this.healthData.weight;
                let heightInMeters = this.healthData.height / 100;

                let value = weight / (heightInMeters * heightInMeters);
                return Math.floor(value * 100) / 100;
            },
            bmiState() {
                if (this.bmi < 18.5) return this.bmiStates.underweight;
                else if (this.bmi < 23) return this.bmiStates.normal;
                else if (this.bmi < 25) return this.bmiStates.overweight;
                else if (this.bmi < 30) return this.bmiStates.obese;
                else return this.bmiStates.extremelyObese;
            },
            bmiStateVariant() {
                if (this.bmiState <= this.bmiStates.underweight) return 'warning';
                else if (this.bmiState === this.bmiStates.normal) return 'success';
                else if (this.bmiState === this.bmiStates.overweight) return 'warning';
                else return 'danger';
            },
            abnormalWaist() {
                if (!this.healthData.waist) return false;

                let sex = this.healthData.sex;
                if (sex === 'male')
                    return this.healthData.waist >= 90;
                else if (sex === 'female')
                    return this.healthData.waist >= 85;
                else
                    return false;
            },
            abnormalBloodPressure() {
                if (!this.healthData.bloodPressure) return false;
                if (!this.healthData.bloodPressure.min) return false;
                if (!this.healthData.bloodPressure.max) return false;

                return this.healthData.bloodPressure.min >= 85 || this.healthData.bloodPressure.max >= 130;
            },
            abnormalNeutralFat() {
                if (!this.healthData.neutralFat) return false;

                return this.healthData.neutralFat >= 150;
            },
            abnormalHdlCholesterol() {
                if (!this.healthData.hdlCholesterol) return false;

                let sex = this.healthData.sex;
                if (sex === 'male')
                    return this.healthData.hdlCholesterol < 40;
                else if (sex === 'female')
                    return this.healthData.hdlCholesterol < 50;
                else
                    return false;
            },
            abnormalFastingBloodSugar() {
                if (!this.healthData.fastingBloodSugar) return false;

                return this.healthData.fastingBloodSugar >= 100;
            }
        },
        methods: {
            showEditModal() {
                this.$refs['edit-modal'].show();
            }
        },
        created() {
            this.healthData = {
                sex: 'male',
                height: 180,
                weight: 80,
                ldlCholesterol: 100,
                waist: 70,
                bloodPressure: {min: 75, max: 120},
                neutralFat: 160,
                hdlCholesterol: 30,
                fastingBloodSugar: 110,
            };
        }
    }
</script>

<style scoped>

</style>