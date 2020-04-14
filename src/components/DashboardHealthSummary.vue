<template>
    <b-container>
        <b-container class="d-flex justify-content-center px-0 mb-3">
            <b-button-toolbar>
                <b-button-group class="mx-1" size="sm">
                    <b-button @click="prevYear()" variant="light">&laquo;</b-button>
                    <b-button @click="prevMonth()" variant="light">&lsaquo;</b-button>
                </b-button-group>

                <p class="lead mx-3 my-auto">{{ year }}년 {{ month + 1 }}월</p>

                <b-button-group class="mx-1" size="sm">
                    <b-button @click="nextMonth()" variant="light">&rsaquo;</b-button>
                    <b-button @click="nextYear()" variant="light">&raquo;</b-button>
                </b-button-group>
            </b-button-toolbar>
        </b-container>
        <transition name="fade">
            <b-table :fields="healthSummaryTableFields" :items="healthSummary" head-variant="light"
                     show-empty sticky-header v-if="loadedHealthSummary">
                <template v-slot:cell(mealCalories)="data">
                    <span class="text-danger">+{{ data.value }}</span>
                </template>
                <template v-slot:cell(burntCalories)="data">
                    <span class="text-secondary">-{{ data.item.bmr }}</span>
                    <span class="text-success"> -{{ data.item.fitnessCalories }}</span>
                </template>
                <template v-slot:cell(sumOfCalories)="data">
                    <strong>{{ data.value }}</strong>
                </template>
                <template v-slot:empty>
                    <p class="text-muted text-center mt-4">데이터가 없습니다.</p>
                </template>
            </b-table>
        </transition>
    </b-container>
</template>

<script>
    import moment from "moment";
    import {mapGetters} from "vuex";
    import * as HealthSummaryService from "../services/health-summary";

    export default {
        name: "health-summary",
        data() {
            return {
                loadedHealthSummary: false,
                year: moment().year(),
                month: moment().month(),
                healthSummaryTableFields: [
                    {'key': 'day', 'label': '날짜'},
                    {'key': 'mealCalories', 'label': '섭취 열량'},
                    {'key': 'burntCalories', 'label': '소모 열량'},
                    {'key': 'sumOfCalories', 'label': '계'}
                ],
                healthSummary: []
            }
        },
        computed: {
            ...mapGetters({
                currentUser: 'auth/currentUser'
            }),
        },
        methods: {
            loadData() {
                this.loadedHealthSummary = false;
                HealthSummaryService.getHealthSummary(this.currentUser.id, this.year, this.month)
                    .then(healthSummary => {
                        this.healthSummary = healthSummary;

                        let current = moment();
                        if (this.year === current.year() && this.month === current.month()) {
                            this.healthSummary = healthSummary.filter(it => it.day <= current.date());
                        } else if (moment([this.year, this.month, 1]).isAfter(current)) {
                            this.healthSummary = [];
                        }
                    })
                    .catch(err => this.handleError(err))
                    .then(() => this.loadedHealthSummary = true);
            },
            prevYear() {
                this.year--;
                this.loadData();
            },
            prevMonth() {
                this.month--;
                if (this.month < 0) {
                    this.year--;
                    this.month = 11;
                }
                this.loadData();
            },
            nextYear() {
                this.year++;
                this.loadData();
            },
            nextMonth() {
                this.month++;
                if (this.month > 11) {
                    this.year++;
                    this.month = 0;
                }
                this.loadData();
            },
            handleError(error) {
                this.$emit('error', error);
            }
        },
        created() {
            this.loadData();
        }
    }
</script>

<style scoped>

</style>