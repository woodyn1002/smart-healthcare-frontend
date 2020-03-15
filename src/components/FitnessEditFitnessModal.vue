<template>
    <b-modal ref="modal" title="운동 수정">
        <fitness-form @ok="editFitness" ref="fitness-form"></fitness-form>

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
    import FitnessForm from "@/components/FitnessForm";

    export default {
        name: "fitness-edit-fitness-modal",
        components: {FitnessForm},
        methods: {
            show(date, fitness) {
                this.$refs['modal'].show();
                this.$nextTick(() => {
                    this.$refs['fitness-form'].initializeForm(date, fitness);
                });
            },
            hide() {
                this.$refs['modal'].hide();
            },
            handleOk(event) {
                event.preventDefault();
                this.$refs['fitness-form'].ok();
            },
            editFitness(date, body) {
                alert(JSON.stringify(body));
            }
        }
    }
</script>

<style scoped>

</style>