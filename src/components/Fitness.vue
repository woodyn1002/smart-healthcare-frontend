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
                    <b-table :fields="fitnessTableFields" :items="fitnessList" hover striped>
                        <template v-slot:cell(date)="data">
                            {{ formatDate(data.value) }}
                        </template>
                        <template v-slot:cell(exercise)="data">
                            {{ data.value.name }} {{ data.item.count }}회, {{ formatSeconds(data.item.elapsedTime) }}
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
        <fitness-edit-fitness-modal
                ref="edit-fitness-modal"
        ></fitness-edit-fitness-modal>
    </b-container>
</template>

<script>
    import moment from "moment";
    import "moment/locale/ko";
    import * as timeFormatter from "../utils/time-formatter";
    import FitnessAddFitnessModal from "@/components/FitnessAddFitnessModal";
    import FitnessRecognizeExerciseModal from "@/components/FitnessRecognizeExerciseModal";
    import FitnessEditFitnessModal from "@/components/FitnessEditFitnessModal";

    const dateFormat = 'A h[시] mm[분]';

    export default {
        name: "fitness",
        components: {FitnessEditFitnessModal, FitnessRecognizeExerciseModal, FitnessAddFitnessModal},
        data() {
            return {
                selectedDate: new Date(),
                fitnessTableFields: [
                    {'key': 'date', 'label': '일시'},
                    {'key': 'exercise', 'label': '종목'},
                    {'key': 'burntCalories', 'label': '소모 열량'},
                    {'key': 'buttons', 'label': ''}
                ],
                fitnessList: []
            }
        },
        methods: {
            formatSeconds(time) {
                return timeFormatter.simplify(time);
            },
            formatDate(date) {
                return moment(date).format(dateFormat);
            },
            showRecognizeExerciseModal() {
                this.$refs['recognize-exercise-modal'].show();
            },
            showAddFitnessModal(fitness) {
                this.$refs['add-fitness-modal'].show(this.selectedDate, fitness);
            },
            editFitness(item) {
                this.$refs['edit-fitness-modal'].show(item.date, item);
            },
            deleteFitness(item) {
                this.$bvModal.msgBoxConfirm(item.exercise.name + ' 운동 기록을 제거합니다.', {
                    title: '운동 기록 제거',
                    size: 'sm',
                    okTitle: '제거',
                    cancelTitle: '취소',
                    footerClass: 'p-2',
                    hideHeaderClose: false,
                    centered: true
                })
                    .then(value => {
                        if (value) {
                            alert(item);
                        }
                    })
                    .catch(err => console.error(err))
            }
        },
        created() {
            this.fitnessList = [
                {date: new Date().toISOString(), exerciseId: 'push-up', count: 10, elapsedTime: 20, burntCalories: 10},
                {date: new Date().toISOString(), exerciseId: 'squat', count: 10, elapsedTime: 20, burntCalories: 10}
            ];

            let exercises = [
                {id: 'push-up', name: '팔굽혀펴기', met: 3.8},
                {id: 'squat', name: '스쿼트', met: 3.5}
            ];

            for (let fitness of this.fitnessList) {
                let exercise = exercises.find(exercise => exercise.id === fitness.exerciseId);
                if (!exercise) exercise = {name: '존재하지 않는 운동'};

                fitness.exercise = exercise;
            }
        }
    }
</script>

<style scoped>

</style>