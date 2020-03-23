<template>
    <ValidationObserver>
        <b-form @submit.stop.prevent="ok()">
            <b-card class="mb-3">
                <b-table
                        :fields="dishesFields"
                        :items="form.dishes"
                        class="mb-0"
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
                        {{ data.item.food.name }}
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
                        총 {{ totalMealCalories }}kcal
                    </template>
                </b-table>

                <hr class="mt-2 mb-3"/>
                <ValidationObserver v-slot="{passed}">
                    <b-form inline>
                        <label class="mr-2 d-none d-md-inline" for="new-dish-food-input" style="font-size: 0.9rem;">
                            음식 추가:
                        </label>
                        <ValidationProvider
                                :rules="`oneOf:${foodOptions.join(',')}|required`"
                                ref="new-dish-food-name-validation"
                                slim
                        >
                            <b-input
                                    class="mb-2 mb-md-0 mr-0 mr-md-2"
                                    id="new-dish-food-input"
                                    list="food-list"
                                    placeholder="음식 이름"
                                    size="sm"
                                    type="search"
                                    v-model="form.newDish.option"
                            ></b-input>
                        </ValidationProvider>
                        <b-datalist :options="foodOptions" id="food-list"></b-datalist>

                        <ValidationProvider
                                immediate
                                ref="new-dish-amount-validation"
                                rules="gt:0|required"
                        >
                            <b-form-spinbutton
                                    class="mr-3"
                                    id="new-dish-amount-input"
                                    inline
                                    min="0"
                                    size="sm"
                                    step="0.25"
                                    v-model="form.newDish.amount"
                            ></b-form-spinbutton>
                        </ValidationProvider>

                        <b-button :disabled="!passed" @click="addDish()" class="ml-auto" size="sm">추가</b-button>
                    </b-form>
                </ValidationObserver>
            </b-card>

            <b-form-group label="일시" label-for="date-input">
                <b-form-datepicker class="mb-2" id="date-input" v-model="form.date"></b-form-datepicker>
                <b-form-timepicker hide-header id="time-input" v-model="form.time"></b-form-timepicker>
            </b-form-group>

            <b-form-group label-for="location-input">
                <template v-slot:label>
                    장소 <small class="text-muted font-italic">(Optional)</small>
                </template>
                <b-form-input
                        id="location-input"
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
        <b-alert :show="error.showAlert" @dismissed="error.showAlert=false" dismissible fade variant="danger">
            {{ error.message }}
        </b-alert>
    </ValidationObserver>
</template>

<script>
    import moment from "moment";
    import {extend, ValidationObserver, ValidationProvider} from "vee-validate";
    import {oneOf} from "vee-validate/dist/rules";
    import {HHmmss, YYYYMMDD} from "@/utils/time-formatter";
    import * as FoodService from "../services/food";

    extend('gt', {
        validate(value, args) {
            return value > args.value;
        },
        params: ['value']
    });
    extend('oneOf', oneOf);

    function defaultFormData() {
        return {
            date: '',
            time: moment().format(HHmmss),
            location: '',
            satisfactionScore: 2,
            dishes: [],
            newDish: {
                foodName: '',
                amount: 1
            }
        };
    }

    export default {
        name: "meal-form",
        components: {ValidationProvider, ValidationObserver},
        data() {
            return {
                form: defaultFormData(),
                dishesFields: [
                    {key: 'foodName', label: '음식'},
                    {key: 'amount', label: '양'},
                    {key: 'totalCalories', label: '열량'},
                    {key: 'buttons', label: ''}
                ],
                foodOptions: [],
                foods: [],
                error: {
                    showAlert: false,
                    message: ''
                }
            }
        },
        computed: {
            totalMealCalories() {
                return this.form.dishes
                    .map(dish => dish.totalCalories)
                    .reduce((acc, cur) => acc + cur, 0);
            },
            datetime() {
                return moment(this.form.date + ' ' + this.form.time, YYYYMMDD + ' ' + HHmmss);
            }
        },
        methods: {
            initializeForm(date, meal) {
                this.form = defaultFormData();
                this.form.date = moment(date).format(YYYYMMDD);
                this.form.time = moment(date).format(HHmmss);

                if (meal) {
                    if (meal.location) {
                        this.form.location = meal.location;
                    }
                    if (meal.satisfactionScore) {
                        this.form.satisfactionScore = meal.satisfactionScore;
                    }
                    if (meal.dishes) {
                        for (let dish of meal.dishes) {
                            let food = this.foods.find(food => food.id === dish.foodId);
                            dish.food = food;
                            dish.totalCalories = food.calories * dish.amount;

                            this.form.dishes.push(dish);
                        }
                    }
                }

                this.$refs['new-dish-food-name-validation'].reset();
            },
            addDish() {
                if (this.form.newDish.amount <= 0) return alert('알맞는 양을 입력해주세요!');

                let food = this.foods.find(food => food.name === this.form.newDish.option);
                if (!food) return alert('음식을 찾을 수 없습니다!');

                let amount = this.form.newDish.amount;
                this.form.dishes.push({
                    foodId: food.id,
                    food: food,
                    amount: amount,
                    totalCalories: food.calories * amount
                });

                this.form.newDish = {
                    option: '',
                    amount: 1
                };

                this.$refs['new-dish-food-name-validation'].reset();
            },
            removeDish(dish) {
                this.form.dishes.splice(this.form.dishes.indexOf(dish), 1);
            },
            ok() {
                if (this.form.dishes.length === 0) {
                    this.error.message = '음식을 추가해주세요.';
                    this.error.showAlert = true;
                    return;
                }

                let date = this.datetime.toISOString();
                let body = {
                    satisfactionScore: this.form.satisfactionScore,
                    dishes: []
                };
                if (this.form.location)
                    body.location = this.form.location;
                for (let dish of this.form.dishes)
                    body.dishes.push({foodId: dish.foodId, amount: dish.amount});

                this.$emit('ok', date, body);
            }
        },
        created() {
            FoodService.getFoods()
                .then(foods => {
                    this.foods = foods;
                    this.foodOptions = this.foods.map(food => food.name);
                })
                .catch(err => alert(err.name + ': ' + err.message));
        }
    }
</script>

<style scoped>

</style>