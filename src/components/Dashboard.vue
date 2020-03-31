<template>
    <b-container class="mt-3">
        <vue-headful title="스마트 헬스케어"/>
        <h2>
            <b-icon-person-fill></b-icon-person-fill>
            {{ currentUser.fullName }}님
        </h2>
        <hr/>
        <transition name="fade">
            <template v-if="loadedHealthData">
                <b-alert class="py-3" show v-if="!healthData.bmr && !healthData.bmi" variant="success">
                    <h4 class="alert-heading">Welcome, {{ currentUser.username }}!</h4>
                    <p>
                        사용에 앞서 건강 정보를 입력해주세요.<br/>
                        대사 관리 페이지에서 건강 정보를 입력하면 기초대사량과 비만도가 계산됩니다.
                    </p>
                    <hr/>
                    <b-button to="/health?edit=true" variant="success">
                        <b-icon-pencil></b-icon-pencil>
                        정보 입력
                    </b-button>
                </b-alert>
                <b-card class="mb-3" header="대사 정보" v-else>
                    <b-row>
                        <b-col class="text-center my-auto" v-if="healthData.bmr">
                            <small class="text-muted">기초대사량</small>
                            <h4>{{ prettyBmr }}kcal</h4>
                        </b-col>
                        <b-col class="text-center my-auto" v-if="healthData.bmi">
                            <small class="text-muted">비만도</small>
                            <h4>{{ prettyBmi }}</h4>
                            <b-badge :variant="bmiStateVariant">{{ bmiStateText }}</b-badge>
                        </b-col>
                    </b-row>
                    <template v-slot:footer>
                        <b-button class="float-right" pill to="health" variant="primary">
                            <b-icon-pencil></b-icon-pencil>
                            대사 관리
                        </b-button>
                    </template>
                </b-card>
            </template>
        </transition>
        <b-card-group class="mb-3" deck>
            <transition name="fade">
                <template v-if="loadedMeals">
                    <b-card header="최근 식사">
                        <b-table :fields="mealsTableFields" :items="meals">
                            <template v-slot:cell(date)="data">
                                {{ toSimpleDateText(data.value) }}
                            </template>
                            <template v-slot:cell(dishes)="data">
                                {{ data.value.map(dish => dish.food.name).join(', ') }}
                            </template>
                            <template v-slot:cell(totalCalories)="data">
                                {{ data.value }}kcal
                            </template>
                        </b-table>
                        <template v-slot:footer>
                            <div class="float-right">
                                <b-button class="mr-2" pill size="sm" to="meals">
                                    <b-icon-calendar></b-icon-calendar>
                                    식사 관리
                                </b-button>
                                <b-button pill size="sm" to="/meals?add=true" variant="outline-secondary">
                                    <b-icon-plus></b-icon-plus>
                                    추가
                                </b-button>
                            </div>
                        </template>
                    </b-card>
                </template>
            </transition>
            <transition name="fade">
                <template v-if="loadedFitness">
                    <b-card header="최근 운동">
                        <b-table :fields="fitnessTableFields" :items="fitnessList">
                            <template v-slot:cell(date)="data">
                                {{ toSimpleDateText(data.value) }}
                            </template>
                            <template v-slot:cell(exercise)="data">
                                {{ data.value.name }} {{ data.item.count }}회
                            </template>
                            <template v-slot:cell(burntCalories)="data">
                                {{ data.value }}kcal
                            </template>
                        </b-table>
                        <template v-slot:footer>
                            <div class="float-right">
                                <b-button class="mr-2" pill size="sm" to="fitness">
                                    <b-icon-calendar></b-icon-calendar>
                                    운동 관리
                                </b-button>
                                <b-button pill size="sm" to="/fitness?add=true" variant="outline-secondary">
                                    <b-icon-plus></b-icon-plus>
                                    추가
                                </b-button>
                            </div>
                        </template>
                    </b-card>
                </template>
            </transition>
        </b-card-group>
        <b-card class="mb-3" header="일별 차트">
            <b-card-text>
            </b-card-text>
        </b-card>
        <b-card header="대사 일지">
            <b-card-text>
            </b-card-text>
        </b-card>
        <error-alerts ref="error-alerts"/>
    </b-container>
</template>

<script>
    import {mapGetters} from "vuex";
    import moment from "moment";
    import * as HealthDataService from "../services/health-data";
    import * as MealService from "../services/meal";
    import * as FitnessService from "../services/fitness";
    import ErrorAlerts from "@/components/ErrorAlerts";

    export default {
        name: "dashboard",
        components: {ErrorAlerts},
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
        data() {
            return {
                loadedHealthData: false,
                loadedMeals: false,
                loadedFitness: false,
                healthData: {
                    bmr: undefined,
                    bmi: undefined,
                    bmiState: undefined
                },
                mealsTableFields: [
                    {'key': 'date', 'label': '일시'},
                    {'key': 'dishes', 'label': '음식'},
                    {'key': 'totalCalories', 'label': '열량'}
                ],
                foods: [],
                meals: [],
                fitnessTableFields: [
                    {'key': 'date', 'label': '일시'},
                    {'key': 'exercise', 'label': '운동'},
                    {'key': 'burntCalories', 'label': '열량'}
                ],
                exercises: [],
                fitnessList: [],
                bmiStates: {
                    underweight: 'underweight',
                    normal: 'normal',
                    overweight: 'overweight',
                    obese: 'obese',
                    extremelyObese: 'extremelyObese'
                }
            }
        },
        methods: {
            toSimpleDateText(date) {
                let datePrefix;
                let days = moment().diff(moment(date), 'days');
                if (days === 0)
                    datePrefix = '오늘';
                else if (days === 1)
                    datePrefix = '어제';
                else
                    datePrefix = days + '일 전';

                return datePrefix + ', ' + moment(date).format('A h[시 경]');
            },
            handleError(error) {
                let alerts = this.$refs['error-alerts'];
                if (alerts) {
                    alerts.add(error);
                }
            }
        },
        created() {
            HealthDataService.getHealthData(this.currentUser.username)
                .then(healthData => this.healthData = healthData)
                .catch(err => {
                    if (err.name !== 'HealthDataNotFoundError') {
                        this.handleError(err);
                    }
                })
                .then(() => this.loadedHealthData = true);

            MealService.getMeals(this.currentUser.username, {limit: 3, sortByDatesDesc: true})
                .then(meals => this.meals = meals)
                .catch(err => this.handleError(err))
                .then(() => this.loadedMeals = true);

            FitnessService.getFitnessList(this.currentUser.username, {limit: 3, sortByDatesDesc: true})
                .then(fitnessList => this.fitnessList = fitnessList)
                .catch(err => this.handleError(err))
                .then(() => this.loadedFitness = true);
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