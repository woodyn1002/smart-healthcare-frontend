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
                        <col style="width: 30%;">
                        <col style="width: 35%;">
                        <col style="width: 23%;">
                        <col style="width: 12%;">
                    </template>

                    <template v-slot:cell(foodName)="data">
                        {{ data.item.food.name }}
                    </template>
                    <template v-slot:cell(amount)="data">
                        <b-button-group size="sm">
                            <b-button @click="decrementDishAmount(data.item)" variant="light">&lsaquo;</b-button>
                            <b-button class="p-0" variant="light">{{ data.value.toFixed(2) }}</b-button>
                            <b-button @click="incrementDishAmount(data.item)" variant="light">&rsaquo;</b-button>
                        </b-button-group>
                    </template>
                    <template v-slot:cell(totalCalories)="data">
                        {{ data.value }}
                        <span class="d-none d-md-inline">kcal</span>
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
                    <b-form>
                        <b-container class="p-0">
                            <b-row class="mb-2">
                                <b-col cols="3">
                                    <label for="new-dish-food-calories-input" style="font-size: 0.9rem;">
                                        음식
                                    </label>
                                </b-col>
                                <b-col>
                                    <ValidationProvider
                                            ref="new-dish-food-name-validation"
                                            rules="required"
                                            slim
                                    >
                                        <b-input
                                                @change="onUpdateFoodOption"
                                                id="new-dish-food-input"
                                                list="food-list"
                                                placeholder="음식 이름"
                                                size="sm"
                                                type="search"
                                                v-model="form.newDish.foodName"
                                        ></b-input>
                                    </ValidationProvider>
                                    <b-datalist :options="foodOptions" id="food-list"></b-datalist>
                                </b-col>
                            </b-row>
                            <b-row class="mb-2">
                                <b-col cols="3">
                                    <label for="new-dish-food-calories-input" style="font-size: 0.9rem;">
                                        열량
                                    </label>
                                </b-col>
                                <b-col>
                                    <ValidationProvider
                                            immediate
                                            ref="new-dish-food-calories-validation"
                                            rules="gt:0|required"
                                            slim
                                    >
                                        <b-input
                                                :disabled="!form.newDish.foodCaloriesEditable"
                                                id="new-dish-food-calories-input"
                                                placeholder="열량 (kcal)"
                                                size="sm"
                                                type="number"
                                                v-model="form.newDish.foodCalories"
                                        ></b-input>
                                    </ValidationProvider>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col cols="3">
                                    <label class="mr-2" for="new-dish-amount-input" style="font-size: 0.9rem;">
                                        양
                                    </label>
                                </b-col>
                                <b-col>
                                    <ValidationProvider
                                            immediate
                                            ref="new-dish-amount-validation"
                                            rules="gt:0|required"
                                    >
                                        <b-form-spinbutton
                                                id="new-dish-amount-input"
                                                inline
                                                min="0"
                                                size="sm"
                                                step="0.25"
                                                v-model="form.newDish.amount"
                                        ></b-form-spinbutton>
                                    </ValidationProvider>
                                    <label class="ml-1 mr-2 d-none d-md-inline" for="new-dish-amount-input"
                                           style="font-size: 0.9rem;">
                                        인분
                                    </label>
                                    <b-button :disabled="!passed" @click="addDish()" class="float-right" size="sm">음식
                                        추가
                                    </b-button>
                                </b-col>
                            </b-row>
                        </b-container>
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

            <b-form-group label="포만감" label-for="satisfaction-score">
                <b-form-rating id="satisfaction-score" v-model="form.satisfactionStars"></b-form-rating>
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
    import {HHmmss, YYYYMMDD} from "@/utils/time-formatter";
    import * as FoodService from "../services/food";

    extend('gt', {
        validate(value, args) {
            return value > args.value;
        },
        params: ['value']
    });

    function defaultFormData() {
        return {
            date: '',
            time: moment().format(HHmmss),
            location: '',
            satisfactionStars: 3,
            dishes: [],
            newDish: {
                foodName: '',
                foodCalories: undefined,
                foodCaloriesEditable: true,
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
                    if (meal.satisfactionScore !== undefined) {
                        this.form.satisfactionStars = meal.satisfactionScore + 1;
                    }
                    if (meal.dishes) {
                        for (let dish of meal.dishes) {
                            if (!dish.food) {
                                dish.food = this.foods.find(food => food.id === dish.foodId);
                            }
                            dish.totalCalories = dish.food.calories * dish.amount;

                            this.form.dishes.push(dish);
                        }
                    }
                }

                this.$refs['new-dish-food-name-validation'].reset();
                this.$refs['new-dish-food-calories-validation'].reset();
            },
            onUpdateFoodOption() {
                let food = this.foods.find(food => food.name === this.form.newDish.foodName);
                if (food) {
                    this.form.newDish.foodCaloriesEditable = false;
                    this.form.newDish.foodCalories = food.calories;
                } else {
                    this.form.newDish.foodCaloriesEditable = true;
                    this.form.newDish.foodCalories = undefined;
                }
            },
            addDish() {
                if (this.form.newDish.amount <= 0) return alert('알맞는 양을 입력해주세요!');

                let food = this.foods.find(food => food.name === this.form.newDish.foodName);
                if (!food) {
                    food = {name: this.form.newDish.foodName, calories: this.form.newDish.foodCalories};
                }

                let amount = this.form.newDish.amount;
                this.form.dishes.push({
                    foodId: food.id,
                    food: food,
                    amount: amount,
                    totalCalories: food.calories * amount
                });

                this.form.newDish = {
                    foodName: '',
                    foodCalories: undefined,
                    foodCaloriesEditable: true,
                    amount: 1
                };

                this.$refs['new-dish-food-name-validation'].reset();
                this.$refs['new-dish-food-calories-validation'].reset();
            },
            incrementDishAmount(dish) {
                dish.amount += 0.25;
                dish.totalCalories = (dish.food.calories * dish.amount).toFixed(2);
            },
            decrementDishAmount(dish) {
                dish.amount -= 0.25;
                dish.amount = Math.max(dish.amount, 0);
                dish.totalCalories = (dish.food.calories * dish.amount).toFixed(2);
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
                    satisfactionScore: this.form.satisfactionStars - 1,
                    dishes: []
                };
                if (this.form.location)
                    body.location = this.form.location;
                for (let dish of this.form.dishes) {
                    if (dish.foodId) {
                        body.dishes.push({foodId: dish.foodId, amount: dish.amount});
                    } else {
                        body.dishes.push({food: dish.food, amount: dish.amount});
                    }
                }

                this.$emit('ok', date, body);
            },
            handleError(error) {
                this.$emit('error', error);
            }
        },
        created() {
            FoodService.getFoods()
                .then(foods => {
                    this.foods = foods;
                    this.foodOptions = this.foods.map(food => food.name);
                })
                .catch(err => this.handleError(err));
        }
    }
</script>

<style scoped>

</style>