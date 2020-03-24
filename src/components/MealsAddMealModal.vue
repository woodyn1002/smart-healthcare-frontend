<template>
    <b-modal ref="modal" static title="식사 등록">
        1
        <meal-form @error="handleError" @ok="addMeal" ref="meal-form"></meal-form>
        <error-alerts ref="error-alerts"/>

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
    import MealForm from "@/components/MealForm";
    import {mapGetters} from "vuex";
    import * as MealService from "@/services/meal";
    import ErrorAlerts from "@/components/ErrorAlerts";

    export default {
        name: "meals-add-meal-modal",
        components: {ErrorAlerts, MealForm},
        computed: {
            ...mapGetters({
                currentUser: 'auth/currentUser'
            })
        },
        methods: {
            show(date, meal) {
                this.$refs['modal'].show();
                this.$refs['meal-form'].initializeForm(date, meal);
            },
            hide() {
                this.$refs['modal'].hide();
            },
            handleOk(event) {
                event.preventDefault();
                this.$refs['meal-form'].ok();
            },
            addMeal(date, body) {
                MealService.createMeal(this.currentUser.username, date, body)
                    .then(() => {
                        this.$emit('created');
                        this.hide();
                    })
                    .catch(err => this.handleError(err));
            },
            handleError(error) {
                let alerts = this.$refs['error-alerts'];
                if (alerts) {
                    alerts.add(error);
                }
            }
        }
    }
</script>

<style scoped>

</style>