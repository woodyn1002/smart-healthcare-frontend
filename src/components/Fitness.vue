<template>
    <b-container>
        <h2>운동 관리</h2>
        <hr/>
        <b-container>
            <b-row>
                <b-col class="mb-3" lg="4">
                    <b-calendar block v-model="selectedDate">
                        <div class="d-flex" dir="ltr">
                            <b-dropdown class="ml-auto" variant="outline-primary">
                                <template v-slot:button-content>
                                    <b-icon-plus></b-icon-plus>
                                    운동 등록
                                </template>
                                <b-dropdown-item-button @click="showRecognizeExerciseModal">
                                    촬영하여 등록
                                </b-dropdown-item-button>
                                <b-dropdown-item-button @click="showAddFitnessModal()">
                                    직접 등록
                                </b-dropdown-item-button>
                            </b-dropdown>
                        </div>
                    </b-calendar>
                </b-col>
                <b-col>
                    <b-table :fields="fitnessList.fields" :items="fitnessList.items" hover striped>
                        <template v-slot:cell(exercise)="data">
                            {{ data.value }} {{ data.item.count }}회, {{ formatSeconds(data.item.elapsedTime) }}
                        </template>
                        <template v-slot:cell(burntCalories)="data">
                            {{ data.value }}kcal
                        </template>
                        <template v-slot:cell(buttons)="data">
                            <b-button @click="editFitness(data.item)" class="m-1" size="sm">
                                <b-icon-pencil></b-icon-pencil>
                            </b-button>
                            <b-button @click="deleteFitness(data.item)" class="m-1" size="sm">
                                <b-icon-trash></b-icon-trash>
                            </b-button>
                        </template>
                    </b-table>
                </b-col>
            </b-row>
        </b-container>

        <fitness-recognize-exercise-modal
                @confirm="showAddFitnessModal"
                ref="recognize-exercise-modal"
        ></fitness-recognize-exercise-modal>
        <fitness-add-fitness-modal
                ref="add-fitness-modal"
        ></fitness-add-fitness-modal>
    </b-container>
</template>

<script>
    import timeFormatter from "../utils/time-formatter";
    import FitnessAddFitnessModal from "@/components/FitnessAddFitnessModal";
    import FitnessRecognizeExerciseModal from "@/components/FitnessRecognizeExerciseModal";

    export default {
        name: "fitness",
        components: {FitnessRecognizeExerciseModal, FitnessAddFitnessModal},
        data() {
            return {
                selectedDate: new Date(),
                fitnessList: {
                    fields: [
                        {'key': 'date', 'label': '일시'},
                        {'key': 'exercise', 'label': '종목'},
                        {'key': 'burntCalories', 'label': '소모 열량'},
                        {'key': 'buttons', 'label': ''}
                    ],
                    items: [
                        {date: '오후 4시 20분', exercise: '팔굽혀펴기', count: 10, elapsedTime: 60, burntCalories: 230},
                        {date: '오후 4시 20분', exercise: '스쿼트', count: 19, elapsedTime: 98, burntCalories: 300}
                    ]
                }
            }
        },
        methods: {
            formatSeconds(time) {
                return timeFormatter.formatSeconds(time);
            },
            showRecognizeExerciseModal() {
                this.$refs['recognize-exercise-modal'].show();
            },
            showAddFitnessModal(fitnessData) {
                this.$refs['add-fitness-modal'].show(this.selectedDate, fitnessData);
            },
            editFitness(item) {
                alert(item.date);
            },
            deleteFitness(item) {
                alert(item.date);
            }
        }
    }
</script>

<style scoped>

</style>