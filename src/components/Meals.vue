<template>
    <b-container>
        <vue-headful title="식사 관리 - 스마트 헬스케어"/>
        <h2>식사 관리</h2>
        <hr/>
        <error-alerts ref="error-alerts"/>
        <b-container>
            <b-row>
                <b-col class="mb-3" lg="4">
                    <b-calendar block v-model="selectedDate">
                        <div class="d-flex" dir="ltr">
                            <b-dropdown class="ml-auto" ref="add-dropdown" variant="outline-primary">
                                <template v-slot:button-content>
                                    <b-icon-plus></b-icon-plus>
                                    식사 등록
                                </template>
                                <b-dropdown-item-button @click="showRecognizeFoodsModal">
                                    사진으로 등록
                                </b-dropdown-item-button>
                                <b-dropdown-item-button @click="showAddMealModal()">
                                    직접 등록
                                </b-dropdown-item-button>
                            </b-dropdown>
                        </div>
                    </b-calendar>
                </b-col>

                <transition name="fade">
                    <b-col v-if="loadedMeals">
                        <b-table :fields="mealsTableFields" :items="meals" hover striped>
                            <template v-slot:cell(date)="data">
                                {{ formatDate(data.value) }}
                            </template>
                            <template v-slot:cell(dishes)="data">
                                {{ data.value.map(dish => dish.food.name).join(', ') }}
                            </template>
                            <template v-slot:cell(totalCalories)="data">
                                {{ data.value }}kcal
                            </template>
                            <template v-slot:cell(buttons)="data">
                                <b-button @click="editMeal(data.item)" class="m-1" size="sm">
                                    <b-icon-pencil></b-icon-pencil>
                                </b-button>
                                <b-button @click="deleteMeal(data.item)" class="m-1" size="sm">
                                    <b-icon-trash></b-icon-trash>
                                </b-button>
                            </template>
                        </b-table>
                    </b-col>
                </transition>
            </b-row>
        </b-container>

        <meals-recognize-foods-modal
                @confirm="showAddMealModal"
                ref="recognize-foods-modal"
        ></meals-recognize-foods-modal>
        <meals-add-meal-modal
                @created="updateMeals()"
                ref="add-meal-modal"
        ></meals-add-meal-modal>
        <meals-edit-meal-modal
                @updated="updateMeals()"
                ref="edit-meal-modal"
        ></meals-edit-meal-modal>
    </b-container>
</template>

<script>
    import moment from "moment";
    import "moment/locale/ko";
    import {YYYYMMDD} from "@/utils/time-formatter";
    import MealsAddMealModal from "./MealsAddMealModal";
    import MealsRecognizeFoodsModal from "./MealsRecognizeFoodsModal";
    import MealsEditMealModal from "@/components/MealsEditMealModal";
    import * as MealService from "@/services/meal";
    import {mapGetters} from "vuex";
    import ErrorAlerts from "@/components/ErrorAlerts";

    const dateFormat = 'A h[시] mm[분]';

    export default {
        name: "meals",
        components: {ErrorAlerts, MealsEditMealModal, MealsRecognizeFoodsModal, MealsAddMealModal},
        data() {
            return {
                loadedMeals: false,
                selectedDate: moment().format(YYYYMMDD),
                mealsTableFields: [
                    {'key': 'date', 'label': '일시'},
                    {'key': 'dishes', 'label': '음식'},
                    {'key': 'totalCalories', 'label': '열량'},
                    {'key': 'buttons', 'label': ''}
                ],
                meals: []
            }
        },
        computed: {
            ...mapGetters({
                currentUser: 'auth/currentUser'
            })
        },
        methods: {
            formatDate(date) {
                return moment(date).format(dateFormat);
            },
            showRecognizeFoodsModal() {
                this.$refs['recognize-foods-modal'].show();
            },
            showAddMealModal(date, meal) {
                if (!date) {
                    let selected = moment(this.selectedDate, YYYYMMDD);
                    date = moment()
                        .year(selected.year())
                        .month(selected.month())
                        .date(selected.date());
                }
                this.$refs['add-meal-modal'].show(date, meal);
            },
            editMeal(item) {
                this.$refs['edit-meal-modal'].show(item.date, item);
            },
            deleteMeal(item) {
                this.$bvModal.msgBoxConfirm(item.dishes.map(dish => dish.food.name).join(', ') + ' 식사 기록을 제거합니다.', {
                    title: '식사 기록 제거',
                    size: 'sm',
                    okTitle: '제거',
                    cancelTitle: '취소',
                    footerClass: 'p-2',
                    hideHeaderClose: false,
                    centered: true
                })
                    .then(value => {
                        if (value) {
                            MealService.deleteMeal(this.currentUser.username, item.date)
                                .then(() => this.updateMeals())
                                .catch(err => this.handleError(err));
                        }
                    })
                    .catch(err => this.handleError(err));
            },
            updateMeals() {
                MealService.getMeals(this.currentUser.username)
                    .then(meals => this.meals = meals)
                    .catch(err => this.handleError(err));
            },
            handleError(error) {
                this.$refs['error-alert'].add(error);
            }
        },
        created() {
            MealService.getMeals(this.currentUser.username)
                .then(meals => this.meals = meals)
                .catch(err => this.handleError(err))
                .then(() => this.loadedMeals = true);

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