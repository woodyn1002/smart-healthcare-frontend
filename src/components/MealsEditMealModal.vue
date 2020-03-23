<template>
    <b-modal ref="modal" static title="식사 수정">
        <meal-form @ok="editMeal" ref="meal-form"></meal-form>

        <template v-slot:modal-footer="{ cancel }">
            <b-button @click="cancel()">
                취소
            </b-button>
            <b-button @click="handleOk" variant="primary">
                저장
            </b-button>
        </template>
    </b-modal>
</template>

<script>
    import MealForm from "@/components/MealForm";
    import {mapGetters} from "vuex";
    import * as MealService from "@/services/meal";

    export default {
        name: "meals-edit-meal-modal",
        components: {MealForm},
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
            editMeal(date, body) {
                MealService.updateMeal(this.currentUser.username, date, body)
                    .then(() => {
                        this.$emit('updated');
                        this.hide();
                    })
                    .catch(err => alert(err.name + ': ' + err.message));
            }
        }
    }
</script>

<style scoped>

</style>