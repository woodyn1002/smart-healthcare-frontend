<template>
    <b-modal @hide="reset" ref="modal" title="운동 등록">
        <b-form @submit.stop.prevent="addFitness">
            <b-form-group label="운동 종목" label-for="exercise-text-input">
                <b-form-input
                        @change="updateFitnessData()"
                        id="exercise-text-input"
                        list="exercise-list"
                        placeholder="운동을 입력해주세요"
                        v-model="form.exerciseText"
                ></b-form-input>
                <b-form-datalist :options="exerciseOptions" id="exercise-list"></b-form-datalist>
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
                                @input="updateFitnessData()"
                                hide-header
                                show-seconds
                                id="start-time-input"
                                v-model="form.startTime"
                        ></b-form-timepicker>
                    </b-form-group>
                </b-col>
                <b-col>
                    <b-form-group label="종료 시간" label-for="finish-time-input">
                        <b-form-timepicker
                                @input="updateFitnessData()"
                                hide-header
                                show-seconds
                                id="finish-time-input"
                                v-model="form.finishTime"
                        ></b-form-timepicker>
                    </b-form-group>
                </b-col>
            </b-row>

            <p class="text-muted">소모 열량: {{ burntCalories }}kcal</p>

            <b-form-group label="강도" label-for="intensity">
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

    export default {
        name: "fitness-add-fitness-modal",
        data() {
            return {
                exercises: [],
                exerciseOptions: [],
                userWeight: 60,
                form: {
                    date: null,
                    exerciseText: '',
                    count: 0,
                    startTime: moment().format('HH:mm:ss'),
                    finishTime: moment().format('HH:mm:ss'),
                    intensity: 2
                },
                exerciseName: '',
                elapsedTime: 0,
                burntCalories: 0
            }
        },
        methods: {
            show(date, fitnessData) {
                this.$refs['modal'].show();

                this.form.date = date;
                if (fitnessData) {
                    this.exerciseName = fitnessData.exerciseName;
                    this.form.count = fitnessData.count;
                    this.form.startTime = fitnessData.startMoment.format('HH:mm:ss');
                    this.form.finishTime = fitnessData.finishMoment.format('HH:mm:ss');

                    let exercise = this.exercises.find(exercise => exercise.name === this.exerciseName);
                    this.form.exerciseText = exercise.text;

                    this.updateFitnessData();
                }
            },
            hide() {
                this.$refs['modal'].hide();
            },
            updateFitnessData() {
                let exercise = this.exercises.find(exercise => exercise.text === this.form.exerciseText);

                if (exercise) {
                    let startMoment = moment(this.form.startTime, 'HH:mm:ss');
                    let finishMoment = moment(this.form.finishTime, 'HH:mm:ss');
                    if (finishMoment.isBefore(startMoment)) finishMoment.add(1, 'days');
                    this.elapsedTime = finishMoment.diff(startMoment, 'seconds');

                    this.burntCalories = exercise.met * this.userWeight * (this.elapsedTime / 60 / 60);
                    this.burntCalories = Math.floor(this.burntCalories * 100) / 100;
                } else {
                    this.elapsedTime = 0;
                    this.burntCalories = 0;
                }
            },
            handleOk(event) {
                event.preventDefault();
                this.addFitness();
            },
            addFitness() {
                if (this.form.count <= 0) return alert('알맞는 횟수를 입력해주세요!');

                let exercise = this.exercises.find(exercise => exercise.text === this.form.exerciseText);
                if (!exercise) return alert('운동을 찾을 수 없습니다!');

                let body = {
                    exerciseName: exercise.name,
                    burntCalories: this.burntCalories,
                    count: this.form.count,
                    elapsedTime: this.elapsedTime,
                    intensity: this.form.intensity
                };
                alert(JSON.stringify(body));
            },
            reset() {
                this.form = {
                    date: null,
                    exerciseText: '',
                    count: 0,
                    startTime: moment().format('HH:mm:ss'),
                    finishTime: moment().format('HH:mm:ss'),
                    intensity: 2
                };
                this.exerciseName = '';
                this.burntCalories = 0;
            }
        },
        mounted() {
            this.exercises = [
                {name: 'push-up', text: '팔굽혀펴기', met: 3.8},
                {name: 'squat', text: '스쿼트', met: 3.5}
            ];
            this.exerciseOptions = this.exercises.map(exercise => exercise.text);
        }
    }
</script>

<style scoped>

</style>