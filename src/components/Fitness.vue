<template>
    <b-container>
        <vue-headful title="운동 관리 - 스마트 헬스케어"/>
        <h2>운동 관리</h2>
        <hr/>
        <error-alerts ref="error-alerts"/>
        <b-container>
            <b-row>
                <b-col class="mb-3" lg="4">
                    <b-calendar @selected="loadFitnessList()" block v-model="selectedDate">
                        <div class="d-flex" dir="ltr">
                            <b-dropdown class="ml-auto" ref="add-dropdown" variant="outline-primary">
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

                <transition name="fade">
                    <b-col v-if="loadedFitness">
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
                </transition>
            </b-row>
        </b-container>

        <fitness-recognize-exercise-modal
                @confirm="showAddFitnessModal"
                ref="recognize-exercise-modal"
        ></fitness-recognize-exercise-modal>
        <fitness-add-fitness-modal
                @created="loadFitnessList()"
                ref="add-fitness-modal"
        ></fitness-add-fitness-modal>
        <fitness-edit-fitness-modal
                @updated="loadFitnessList()"
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
    import * as FitnessService from "@/services/fitness";
    import {mapGetters} from "vuex";
    import ErrorAlerts from "@/components/ErrorAlerts";

    const dateFormat = 'A h[시] mm[분]';

    export default {
        name: "fitness",
        components: {ErrorAlerts, FitnessEditFitnessModal, FitnessRecognizeExerciseModal, FitnessAddFitnessModal},
        data() {
            return {
                loadedFitness: false,
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
        computed: {
            ...mapGetters({
                currentUser: 'auth/currentUser'
            })
        },
        methods: {
            loadFitnessList() {
                this.loadedFitness = false;

                let params = {date: this.selectedDate, sortByDates: true};
                FitnessService.getFitnessList(this.currentUser.username, params)
                    .then(fitnessList => this.fitnessList = fitnessList)
                    .catch(err => this.handleError(err))
                    .then(() => this.loadedFitness = true);
            },
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
                            FitnessService.deleteFitness(this.currentUser.username, item.date)
                                .then(() => this.loadFitnessList())
                                .catch(err => this.handleError(err));
                        }
                    })
                    .catch(err => this.handleError(err));
            },
            handleError(error) {
                this.$refs['error-alerts'].add(error);
            }
        },
        created() {
            this.loadFitnessList();

            if (this.$route.query.add) {
                this.$nextTick(() => this.$refs['add-dropdown'].show());
            }
        }
    }
</script>

<style scoped>
    .fade-enter-active {
        transition: opacity .5s;
    }

    .fade-enter {
        opacity: 0;
    }
</style>