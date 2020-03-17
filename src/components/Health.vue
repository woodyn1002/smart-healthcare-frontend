<template>
    <b-container>
        <h2>대사 관리</h2>
        <hr/>
        <b-container class="p-0 mb-3">
            <b-row>
                <b-col sm="5">
                    <b-card class="mb-3" header="기초대사량">
                        <b-card-text class="display-4">1999 kcal</b-card-text>
                    </b-card>

                    <b-card class="mb-3" header="비만도">
                        <b-card-text class="display-4">24.69</b-card-text>
                        <h6>현재 체중
                            <b-badge variant="warning">과체중</b-badge>
                        </h6>
                        <b-progress class="mb-2">
                            <b-progress-bar label="24.69" max="20" value="9.69" variant="warning"></b-progress-bar>
                        </b-progress>
                        <h6>정상 체중</h6>
                        <b-progress>
                            <b-progress-bar label="18.5~23" max="20" value="6" variant="success"></b-progress-bar>
                        </b-progress>
                    </b-card>
                </b-col>
                <b-col>
                    <b-card header="건강 정보">
                        <b-table :fields="healthData.fields" :items="healthData.items" stacked>
                            <template v-slot:cell(height)="data">
                                {{ data.value }}cm
                            </template>
                            <template v-slot:cell(weight)="data">
                                {{ data.value }}kg
                            </template>
                            <template v-slot:cell(ldlCholesterol)="data">
                                {{ data.value }}mg/DI
                            </template>
                            <template v-slot:cell(waist)="data">
                                {{ data.value }}cm
                            </template>
                            <template v-slot:cell(bloodPressure)="data">
                                {{ data.value.min }}~{{ data.value.max }}
                            </template>
                            <template v-slot:cell(neutralFat)="data">
                                {{ data.value }}mg/DI
                            </template>
                            <template v-slot:cell(hdlCholesterol)="data">
                                {{ data.value }}mg/DI
                            </template>
                            <template v-slot:cell(fastingBloodSugar)="data">
                                {{ data.value }}mg/DI
                            </template>
                        </b-table>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
        <b-container class="text-right">
            <b-button @click="showEditModal()" pill variant="primary">
                <b-icon-pencil></b-icon-pencil>
                정보 수정
            </b-button>
        </b-container>
        <health-edit-modal ref="edit-modal"></health-edit-modal>
    </b-container>
</template>

<script>
    import HealthEditModal from "@/components/HealthEditModal";

    export default {
        name: "health",
        components: {HealthEditModal},
        data() {
            return {
                healthData: {
                    fields: [
                        {key: 'height', label: '신장'},
                        {key: 'weight', label: '체중'},
                        {key: 'ldlCholesterol', label: '저밀도 콜레스테롤'},
                        {key: 'waist', label: '허리둘레'},
                        {key: 'bloodPressure', label: '혈압'},
                        {key: 'neutralFat', label: '중성지방'},
                        {key: 'hdlCholesterol', label: '고밀도 콜레스테롤'},
                        {key: 'fastingBloodSugar', label: '공복혈당'},
                    ],
                    items: [
                        {
                            height: 170,
                            weight: 50,
                            ldlCholesterol: 100,
                            waist: 70,
                            bloodPressure: {min: 75, max: 120},
                            neutralFat: 160,
                            hdlCholesterol: 30,
                            fastingBloodSugar: 110,
                        }
                    ]
                }
            }
        },
        methods: {
            showEditModal() {
                this.$refs['edit-modal'].show();
            }
        }
    }
</script>

<style scoped>

</style>