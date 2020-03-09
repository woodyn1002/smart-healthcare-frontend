<template>
    <b-container>
        <h2>식사 관리</h2>
        <hr/>
        <b-container>
            <b-row>
                <b-col class="mb-3" lg="4">
                    <b-calendar block v-model="selectedDate">
                        <div class="d-flex" dir="ltr">
                            <b-dropdown class="ml-auto" variant="outline-primary">
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
                    <b-table :fields="meals.fields" :items="meals.items" hover striped>
                        <template v-slot:cell(calories)="data">
                            {{ data.value }} kcal
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
    </b-container>
</template>

<script>
    import MealsAddMealModal from "./MealsAddMealModal";
    import MealsRecognizeFoodsModal from "./MealsRecognizeFoodsModal";

    export default {
        name: "meals",
        components: {MealsRecognizeFoodsModal, MealsAddMealModal},
        data() {
            return {
                selectedDate: new Date(),
                meals: {
                    fields: [
                        {'key': 'date', 'label': '일시'},
                        {'key': 'foods', 'label': '음식'},
                        {'key': 'calories', 'label': '열량'},
                        {'key': 'buttons', 'label': ''}
                    ],
                    items: [
                        {date: '오후 4시 20분', foods: '김치찌개, 밥, 삼겹살, 상추', calories: 600},
                        {date: '오후 4시 20분', foods: '김치찌개, 밥', calories: 600},
                        {date: '오후 4시 20분', foods: '김치찌개, 밥', calories: 600},
                        {date: '오후 4시 20분', foods: '김치찌개, 밥', calories: 600}
                    ]
                }
            }
        },
        methods: {
            showRecognizeFoodsModal() {
                this.$refs['recognize-foods-modal'].show();
            },
            showAddMealModal(dishes) {
                this.$refs['add-meal-modal'].show(this.selectedDate, dishes);
            },
            editMeal(item) {
                alert(item.date);
            },
            deleteMeal(item) {
                alert(item.date);
            }
        }
    }
</script>

<style scoped>

</style>