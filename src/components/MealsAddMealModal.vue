<template>
    <b-modal ref="modal" static title="식사 등록">
        <meal-form @ok="addMeal" ref="meal-form"></meal-form>

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

    export default {
        name: "meals-add-meal-modal",
        components: {MealForm},
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
                alert(JSON.stringify(body));
            }
        }
    }
</script>

<style scoped>

</style>