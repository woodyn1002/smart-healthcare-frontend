<template>
    <b-container>
        <h2>
            <b-icon-person-fill></b-icon-person-fill>
            {{ currentUser.username }}님
        </h2>
        <hr/>
        <b-card class="mb-3" header="대사 정보">
            <b-row>
                <b-col class="text-center my-auto">
                    <small class="text-muted">기초대사량</small>
                    <h4>100 kcal</h4>
                </b-col>
                <b-col class="text-center my-auto">
                    <small class="text-muted">비만도</small>
                    <h4>24.69</h4>
                    <b-badge variant="warning">과체중</b-badge>
                </b-col>
            </b-row>
            <template v-slot:footer>
                <b-button class="float-right" pill to="health" variant="primary">
                    <b-icon-pencil></b-icon-pencil>
                    대사 관리
                </b-button>
            </template>
        </b-card>
        <b-card-group class="mb-3" deck>
            <b-card header="최근 식사">
                <b-table :fields="meals.fields" :items="meals.items">
                    <template v-slot:cell(calories)="data">
                        {{ data.value }} kcal
                    </template>
                </b-table>
                <template v-slot:footer>
                    <div class="float-right">
                        <b-button class="mr-2" pill size="sm" to="meals">
                            <b-icon-calendar></b-icon-calendar>
                            식사 관리
                        </b-button>
                        <b-button pill size="sm" to="meals/add" variant="outline-secondary">
                            <b-icon-plus></b-icon-plus>
                            추가
                        </b-button>
                    </div>
                </template>
            </b-card>
            <b-card header="최근 운동">
                <b-table :fields="fitness.fields" :items="fitness.items">
                    <template v-slot:cell(calories)="data">
                        {{ data.value }} kcal
                    </template>
                </b-table>
                <template v-slot:footer>
                    <div class="float-right">
                        <b-button class="mr-2" pill size="sm" to="fitness">
                            <b-icon-calendar></b-icon-calendar>
                            운동 관리
                        </b-button>
                        <b-button pill size="sm" to="fitness/add" variant="outline-secondary">
                            <b-icon-plus></b-icon-plus>
                            추가
                        </b-button>
                    </div>
                </template>
            </b-card>
        </b-card-group>
        <b-card class="mb-3" header="일별 차트">
            <b-card-text>
            </b-card-text>
        </b-card>
        <b-card header="대사 일지">
            <b-card-text>
            </b-card-text>
        </b-card>
    </b-container>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: "dashboard",
        computed: {
            ...mapGetters({
                currentUser: 'auth/currentUser'
            })
        },
        data() {
            return {
                meals: {
                    fields: [
                        {'key': 'date', 'label': '일시'},
                        {'key': 'foods', 'label': '음식'},
                        {'key': 'calories', 'label': '열량'}
                    ],
                    items: [
                        {date: '오늘, 오후 4시 경', foods: '김치찌개, 밥', calories: 600},
                        {date: '어제, 오후 1시 경', foods: '김치찌개, 밥', calories: 600},
                        {date: '5일 전, 오전 11시 경', foods: '김치찌개, 밥', calories: 600}
                    ]
                },
                fitness: {
                    fields: [
                        {'key': 'date', 'label': '일시'},
                        {'key': 'exercises', 'label': '운동'},
                        {'key': 'calories', 'label': '열량'}
                    ],
                    items: [
                        {date: '오늘, 오후 4시 경', exercises: '팔굽혀펴기', calories: 300}
                    ]
                }
            }
        }
    }
</script>

<style scoped>

</style>