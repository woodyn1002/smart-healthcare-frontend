<template>
    <ValidationObserver ref="form-validation">
        <b-form @submit.stop.prevent="ok()">
            <b-form-group label="운동 종목" label-for="exercise-name-input">
                <ValidationProvider
                        rules="required"
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
                            @change="updateBurntCalories"
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
                <b-form-datepicker id="date-input" v-model="form.date"></b-form-datepicker>
            </b-form-group>

            <b-row>
                <b-col>
                    <b-form-group label="시작 시간" label-for="start-time-input">
                        <b-form-timepicker
                                hide-header
                                id="start-time-input"
                                show-seconds
                                v-model="form.startTime"
                                @input="updateBurntCalories"
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
                                @input="updateBurntCalories"
                        ></b-form-timepicker>
                    </b-form-group>
                </b-col>
            </b-row>

            <b-form-group label="소모 열량 (kcal)" label-for="burnt-calories-input">
                <ValidationProvider
                        name="소모 열량"
                        rules="min_value:0|required"
                        v-slot="{passed, errors}"
                >
                    <b-form-input
                            :disabled="!form.burntCaloriesEditable"
                            :state="(errors[0]) ? false : ((passed) ? true : null)"
                            aria-describedby="burnt-calories-feedback"
                            id="burnt-calories-input"
                            min="0"
                            type="text"
                            v-model="form.burntCalories"
                    ></b-form-input>
                    <b-form-invalid-feedback id="burnt-calories-feedback">
                        {{ errors[0] }}
                    </b-form-invalid-feedback>
                </ValidationProvider>
            </b-form-group>

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
    import {HHmmss, YYYYMMDD} from "../utils/time-formatter";
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
            burntCalories: undefined,
            burntCaloriesEditable: true,
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
            datetime() {
                return moment(this.form.date + ' ' + this.form.startTime, YYYYMMDD + ' ' + HHmmss);
            },
            elapsedTime() {
                let startMoment = moment(this.form.startTime, HHmmss);
                let finishMoment = moment(this.form.finishTime, HHmmss);
                if (finishMoment.isBefore(startMoment)) finishMoment.add(1, 'days');
                return finishMoment.diff(startMoment, 'seconds');
            }
        },
        methods: {
            initializeForm(date, fitness) {
                this.form = defaultFormData();
                this.form.date = moment(date).format(YYYYMMDD);

                if (fitness) {
                    if (fitness.date) {
                        this.form.startTime = moment(fitness.date).format(HHmmss);
                    }
                    if (fitness.exerciseId) {
                        let exercise = this.exercises.find(exercise => exercise.id === fitness.exerciseId);
                        this.form.exerciseName = (exercise) ? exercise.name : '존재하지 않는 운동';
                    } else if (fitness.exercise) {
                        this.form.exerciseName = fitness.exercise.name;
                    }
                    if (fitness.count) {
                        this.form.count = fitness.count;
                    }
                    if (fitness.elapsedTime) {
                        this.form.finishTime = moment(fitness.date)
                            .add(fitness.elapsedTime, 'seconds')
                            .format(HHmmss);
                    }
                    if (fitness.burntCalories) {
                        this.form.burntCalories = fitness.burntCalories;
                    }
                    this.updateBurntCalories();
                }

                this.$refs['form-validation'].reset();
            },
            findSelectedExercise() {
                return this.exercises.find(exercise => exercise.name === this.form.exerciseName);
            },
            updateBurntCalories() {
                let exercise = this.findSelectedExercise();
                if (exercise) {
                    let burntCalories = exercise.met * this.userWeight * (this.elapsedTime / 60 / 60);
                    burntCalories = Math.floor(burntCalories * 100) / 100;
                    this.form.burntCalories = burntCalories;
                    this.form.burntCaloriesEditable = false;
                } else {
                    this.form.burntCalories = undefined;
                    this.form.burntCaloriesEditable = true;
                }
            },
            ok() {
                this.$refs['form-validation'].validate()
                    .then(passed => {
                        if (passed) {
                            let date = this.datetime.toISOString();
                            let body = {
                                burntCalories: this.form.burntCalories,
                                count: this.form.count,
                                elapsedTime: this.elapsedTime,
                                intensity: this.form.intensity
                            };
                            let exercise = this.findSelectedExercise();
                            if (exercise) {
                                body.exerciseId = exercise.id;
                            } else {
                                body.exercise = {name: this.form.exerciseName};
                            }
                            this.$emit('ok', date, body);
                        }
                    });
            },
            handleError(error) {
                this.$emit('error', error);
            }
        },
        created() {
            ExerciseService.getExercises()
                .then(exercises => {
                    this.exercises = exercises;
                    this.exerciseOptions = this.exercises.map(exercise => exercise.name);
                })
                .catch(err => this.handleError(err));
        }
    }
</script>

<style scoped>

</style>