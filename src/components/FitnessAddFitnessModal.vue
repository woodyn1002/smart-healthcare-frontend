<template>
    <b-modal ref="modal" title="운동 등록">
        <b-form @submit.stop.prevent="addFitness">
            <b-form-group label="운동 종목" label-for="exercise-name-input">
                <b-form-input
                        id="exercise-name-input"
                        list="exercise-name-list"
                        placeholder="운동을 입력해주세요"
                        v-model="form.exerciseName"
                ></b-form-input>
                <b-form-datalist :options="exerciseOptions" id="exercise-name-list"></b-form-datalist>
            </b-form-group>

            <b-form-group label="횟수" label-for="count-input">
                <b-form-input
                        id="count-input"
                        min="0"
                        type="number"
                        v-model="form.count"
                ></b-form-input>
            </b-form-group>

            <b-form-group label="일시" label-for="date-input">
                <b-form-datepicker id="date-input" v-model="form.date" value-as-date></b-form-datepicker>
            </b-form-group>

            <b-row>
                <b-col>
                    <b-form-group label="시작 시간" label-for="start-time-input">
                        <b-form-timepicker
                                hide-header
                                id="start-time-input"
                                show-seconds
                                v-model="form.startTime"
                        ></b-form-timepicker>
                    </b-form-group>
                </b-col>
                <b-col>
                    <b-form-group label="종료 시간" label-for="finish-time-input">
                        <b-form-timepicker
                                hide-header
                                id="finish-time-input"
                                show-seconds
                                v-model="form.finishTime"
                        ></b-form-timepicker>
                    </b-form-group>
                </b-col>
            </b-row>

            <p class="text-muted">소모 열량: {{ burntCalories }}kcal</p>

            <b-form-group label="강도" label-for="intensity-input">
                <b-form-radio name="intensity-input" v-model="form.intensity" value="0">매우 쉽다
                </b-form-radio>
                <b-form-radio name="intensity-input" v-model="form.intensity" value="1">조금 쉽다
                </b-form-radio>
                <b-form-radio name="intensity-input" v-model="form.intensity" value="2">보통이다
                </b-form-radio>
                <b-form-radio name="intensity-input" v-model="form.intensity" value="3">조금 어렵다
                </b-form-radio>
                <b-form-radio name="intensity-input" v-model="form.intensity" value="4">매우 어렵다
                </b-form-radio>
            </b-form-group>
        </b-form>

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
    import moment from "moment";
    import {HHmmss} from "../utils/time-formatter";

    function defaultFormData() {
        return {
            date: null,
            exerciseName: '',
            count: 0,
            startTime: moment().format(HHmmss),
            finishTime: moment().format(HHmmss),
            intensity: 2
        };
    }

    export default {
        name: "fitness-add-fitness-modal",
        data() {
            return {
                exercises: [],
                exerciseOptions: [],
                userWeight: 60,
                form: defaultFormData()
            }
        },
        computed: {
            selectedExercise() {
                return this.exercises.find(exercise => exercise.name === this.form.exerciseName);
            },
            elapsedTime() {
                if (this.selectedExercise) {
                    let startMoment = moment(this.form.startTime, HHmmss);
                    let finishMoment = moment(this.form.finishTime, HHmmss);
                    if (finishMoment.isBefore(startMoment)) finishMoment.add(1, 'days');
                    return finishMoment.diff(startMoment, 'seconds');
                } else {
                    return 0;
                }
            },
            burntCalories() {
                if (this.selectedExercise) {
                    let burntCalories = this.selectedExercise.met * this.userWeight * (this.elapsedTime / 60 / 60);
                    return Math.floor(burntCalories * 100) / 100;
                } else {
                    return 0;
                }
            }
        },
        methods: {
            resetFormData() {
                this.form = defaultFormData();
            },
            show(date, fitnessData) {
                this.resetFormData();

                this.$refs['modal'].show();

                this.form.date = date;
                if (fitnessData) {
                    this.form.exerciseName = fitnessData.exercise.name;
                    this.form.count = fitnessData.count;
                    this.form.startTime = fitnessData.startMoment.format(HHmmss);
                    this.form.finishTime = fitnessData.finishMoment.format(HHmmss);
                }
            },
            hide() {
                this.$refs['modal'].hide();
            },
            handleOk(event) {
                event.preventDefault();
                this.addFitness();
            },
            addFitness() {
                if (this.form.count <= 0) return alert('알맞는 횟수를 입력해주세요!');

                if (!this.selectedExercise) return alert('운동을 찾을 수 없습니다!');

                let body = {
                    exerciseId: this.selectedExercise.id,
                    burntCalories: this.burntCalories,
                    count: this.form.count,
                    elapsedTime: this.elapsedTime,
                    intensity: this.form.intensity
                };
                alert(JSON.stringify(body));
            }
        },
        created() {
            this.exercises = [
                {id: 'push-up', name: '팔굽혀펴기', met: 3.8},
                {id: 'squat', name: '스쿼트', met: 3.5}
            ];
            this.exerciseOptions = this.exercises.map(exercise => exercise.name);
        }
    }
</script>

<style scoped>

</style>