<template>
    <ValidationObserver ref="form-validation">
        <b-form @submit.stop.prevent="ok()">
            <b-form-group label="운동 종목" label-for="exercise-name-input">
                <ValidationProvider
                        :rules="`oneOf:${exerciseOptions.join(',')}|required`"
                        name="운동"
                        v-slot="{passed, errors}"
                >
                    <b-form-input
                            :state="(errors[0]) ? false : ((passed) ? true : null)"
                            aria-describedby="exercise-name-feedback"
                            id="exercise-name-input"
                            list="exercise-name-list"
                            placeholder="운동을 입력해주세요"
                            type="search"
                            v-model="form.exerciseName"
                    ></b-form-input>
                    <b-form-invalid-feedback id="exercise-name-feedback">
                        {{ errors[0] }}
                    </b-form-invalid-feedback>
                </ValidationProvider>
                <b-form-datalist :options="exerciseOptions" id="exercise-name-list"></b-form-datalist>
            </b-form-group>

            <b-form-group label="횟수" label-for="count-input">
                <ValidationProvider
                        name="횟수"
                        rules="min_value:1|required"
                        v-slot="{passed, errors}"
                >
                    <b-form-input
                            :state="(errors[0]) ? false : ((passed) ? true : null)"
                            aria-describedby="count-feedback"
                            id="count-input"
                            min="0"
                            type="number"
                            v-model="form.count"
                    ></b-form-input>
                    <b-form-invalid-feedback id="count-feedback">
                        {{ errors[0] }}
                    </b-form-invalid-feedback>
                </ValidationProvider>
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
        <b-alert :show="error.showAlert" @dismissed="error.showAlert=false" dismissible fade variant="danger">
            {{ error.message }}
        </b-alert>
    </ValidationObserver>
</template>

<script>
    import moment from "moment";
    import {extend, localize, ValidationObserver, ValidationProvider} from "vee-validate";
    import {HHmmss} from "../utils/time-formatter";
    import {min_value, oneOf} from "vee-validate/dist/rules";
    import * as ExerciseService from "@/services/exercise";

    localize('ko');

    extend('min_value', min_value);
    extend('oneOf', oneOf);

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
        name: "fitness-form",
        components: {ValidationObserver, ValidationProvider},
        data() {
            return {
                exercises: [],
                exerciseOptions: [],
                userWeight: 60,
                form: defaultFormData(),
                error: {
                    showAlert: false,
                    message: ''
                }
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
            initializeForm(date, fitness) {
                this.form = defaultFormData();
                this.form.date = date;

                if (fitness) {
                    if (fitness.date) {
                        this.form.startTime = moment(fitness.date).format(HHmmss);
                    }
                    if (fitness.exerciseId) {
                        let exercise = this.exercises.find(exercise => exercise.id === fitness.exerciseId);
                        this.form.exerciseName = (exercise) ? exercise.name : '존재하지 않는 운동';
                    }
                    if (fitness.count) {
                        this.form.count = fitness.count;
                    }
                    if (fitness.elapsedTime) {
                        this.form.finishTime = moment(fitness.date)
                            .add(fitness.elapsedTime, 'seconds')
                            .format(HHmmss);
                    }
                }

                this.$refs['form-validation'].reset();
            },
            ok() {
                this.$refs['form-validation'].validate()
                    .then(passed => {
                        if (passed) {
                            let date = moment(this.form.startTime, HHmmss).toISOString();
                            let body = {
                                exerciseId: this.selectedExercise.id,
                                burntCalories: this.burntCalories,
                                count: this.form.count,
                                elapsedTime: this.elapsedTime,
                                intensity: this.form.intensity
                            };
                            this.$emit('ok', date, body);
                        }
                    });
            }
        },
        created() {
            ExerciseService.getExercises()
                .then(exercises => {
                    this.exercises = exercises;
                    this.exerciseOptions = this.exercises.map(exercise => exercise.name);
                })
                .catch(err => alert(err.name + ': ' + err.message));
        }
    }
</script>

<style scoped>

</style>