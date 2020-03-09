<template>
    <b-modal @show="reset" ref="modal" title="식사 등록">
        <b-form @submit.stop.prevent="addMeal">
            <b-card class="mb-3">
                <b-table
                        :fields="dishesFields"
                        :items="form.dishes"
                        class="mb-3"
                        empty-html="<small>음식을 추가해주세요!</small>"
                        fixed
                        no-border-collapse
                        show-empty
                        small
                        sticky-header>
                    <template v-slot:table-colgroup>
                        <col style="width: 35%;">
                        <col style="width: 15%;">
                        <col style="width: 30%;">
                        <col style="width: 20%;">
                    </template>

                    <template v-slot:cell(foodName)="data">
                        {{ foods.find(food => food.name === data.value).text }}
                    </template>
                    <template v-slot:cell(totalCalories)="data">
                        {{ data.value }}kcal
                    </template>
                    <template v-slot:cell(buttons)="data">
                        <b-button @click="removeDish(data.item)" class="m-1" size="sm">
                            <b-icon-trash></b-icon-trash>
                        </b-button>
                    </template>

                    <template v-slot:table-caption>
                        총 {{ form.dishes.map(dish => dish.totalCalories).reduce((acc, cur) => acc + cur, 0) }}kcal
                    </template>
                </b-table>
                <b-form inline>
                    <label class="mr-2 d-none d-md-inline" for="new-dish-food-input" style="font-size: 0.9rem;">음식
                        추가:</label>
                    <b-input
                            class="mb-2 mb-md-0 mr-0 mr-md-2"
                            id="new-dish-food-input"
                            list="food-list"
                            placeholder="음식을 입력해주세요"
                            size="sm"
                            v-model="newDish.option"
                    ></b-input>
                    <b-datalist :options="foodOptions" id="food-list"></b-datalist>
                    <b-form-spinbutton
                            class="mr-3"
                            id="new-dish-amount-input"
                            inline
                            min="0"
                            size="sm"
                            step="0.25"
                            v-model="newDish.amount"
                    ></b-form-spinbutton>
                    <b-button @click="addDish" class="ml-auto" size="sm">추가</b-button>
                </b-form>
            </b-card>

            <b-form-group label="일시" label-for="date-input">
                <b-form-datepicker id="date-input" v-model="form.date" value-as-date></b-form-datepicker>
            </b-form-group>

            <b-form-group label-for="location-input">
                <template v-slot:label>
                    장소 <small class="text-muted font-italic">(Optional)</small>
                </template>
                <b-form-input
                        id="location-input"
                        required
                        v-model="form.location"
                ></b-form-input>
            </b-form-group>

            <b-form-group label="만족감" label-for="satisfaction-score">
                <b-form-radio name="satisfaction-score-input" v-model="form.satisfactionScore" value="0">매우 배고프다
                </b-form-radio>
                <b-form-radio name="satisfaction-score-input" v-model="form.satisfactionScore" value="1">조금 배고프다
                </b-form-radio>
                <b-form-radio name="satisfaction-score-input" v-model="form.satisfactionScore" value="2">보통이다
                </b-form-radio>
                <b-form-radio name="satisfaction-score-input" v-model="form.satisfactionScore" value="3">조금 배부르다
                </b-form-radio>
                <b-form-radio name="satisfaction-score-input" v-model="form.satisfactionScore" value="4">매우 배부르다
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
    export default {
        name: "meals-add-meal-modal",
        data() {
            return {
                form: {
                    date: null,
                    location: '',
                    satisfactionScore: 2,
                    dishes: []
                },
                newDish: {
                    option: '',
                    amount: 1
                },
                dishesFields: [
                    {key: 'foodName', label: '음식'},
                    {key: 'amount', label: '양'},
                    {key: 'totalCalories', label: '열량'},
                    {key: 'buttons', label: ''}
                ],
                foodOptions: [],
                foods: []
            }
        },
        methods: {
            show(date, dishes) {
                this.$refs['modal'].show();

                this.form.date = date;
                if (dishes) {
                    this.form.dishes = dishes;
                    for (let dish of this.form.dishes) {
                        let food = this.foods.find(food => food.name === dish.foodName);
                        dish.totalCalories = food.calories * dish.amount;
                    }
                }
            },
            hide() {
                this.$refs['modal'].hide();
            },
            handleOk(event) {
                event.preventDefault();
                this.addMeal();
            },
            addDish() {
                if (this.newDish.amount <= 0) return alert('알맞는 양을 입력해주세요!');

                let food = this.foods.find(food => food.text === this.newDish.option);
                if (!food) return alert('음식을 찾을 수 없습니다!');

                let amount = this.newDish.amount;
                this.form.dishes.push({
                    foodName: food.name,
                    amount: amount,
                    totalCalories: food.calories * amount
                });

                this.newDish = {
                    option: '',
                    amount: 1
                };
            },
            removeDish(dish) {
                this.form.dishes.splice(this.form.dishes.indexOf(dish), 1);
            },
            addMeal() {
                alert(this.form.date);
            },
            reset() {
                this.form = {
                    date: '',
                    location: '',
                    satisfactionScore: 2,
                    dishes: []
                };
                this.newDish = {
                    option: '',
                    amount: 1
                };
            }
        },
        mounted() {
            this.foods = [
                {name: 'kimchi-soup', text: '김치찌개', calories: 456},
                {name: 'rice', text: '밥 한 공기', calories: 300}
            ];
            this.foodOptions = this.foods.map(food => food.text);
        }
    }
</script>

<style scoped>

</style>