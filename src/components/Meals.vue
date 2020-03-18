<template>
    <b-container>
        <vue-headful title="식사 관리 - 스마트 헬스케어"/>
        <h2>식사 관리</h2>
        <hr/>
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
                <b-col>
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
            </b-row>
        </b-container>
        <meals-recognize-foods-modal
                @confirm="showAddMealModal"
                ref="recognize-foods-modal"
        ></meals-recognize-foods-modal>
        <meals-add-meal-modal
                ref="add-meal-modal"
        ></meals-add-meal-modal>
        <meals-edit-meal-modal
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

    const dateFormat = 'A h[시] mm[분]';

    export default {
        name: "meals",
        components: {MealsEditMealModal, MealsRecognizeFoodsModal, MealsAddMealModal},
        data() {
            return {
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
                            alert(item);
                        }
                    })
                    .catch(err => console.error(err))
            }
        },
        created() {
            this.meals = [
                {
                    date: new Date().toISOString(),
                    location: '집',
                    satisfactionScore: 2,
                    dishes: [{foodId: 'kimchi-soup', amount: 1}, {foodId: 'rice', amount: 1}]
                },
                {date: new Date().toISOString(), dishes: [{foodId: 'kimchi-soup', amount: 1}]}
            ];

            let foods = [
                {id: 'kimchi-soup', name: '김치찌개', calories: 456},
                {id: 'rice', name: '쌀밥', calories: 313}
            ];

            for (let meal of this.meals) {
                let totalCalories = 0;
                for (let dish of meal.dishes) {
                    let food = foods.find(food => food.id === dish.foodId);
                    if (!food) food = {name: '존재하지 않는 음식'};

                    dish.food = food;
                    totalCalories += food.calories * dish.amount;
                }
                meal.totalCalories = totalCalories;
            }

            if (this.$route.query.add) {
                this.$nextTick(() => this.$refs['add-dropdown'].show());
            }
        }
    }
</script>

<style scoped>

</style>