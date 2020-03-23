<template>
    <b-modal ref="modal" static title="운동 등록">
        <fitness-form @ok="addFitness" ref="fitness-form"></fitness-form>

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
    import FitnessForm from "@/components/FitnessForm";
    import * as FitnessService from "@/services/fitness";
    import {mapGetters} from "vuex";

    export default {
        name: "fitness-add-fitness-modal",
        components: {FitnessForm},
        computed: {
            ...mapGetters({
                currentUser: 'auth/currentUser'
            })
        },
        methods: {
            show(date, fitness) {
                this.$refs['modal'].show();
                this.$refs['fitness-form'].initializeForm(date, fitness);
            },
            hide() {
                this.$refs['modal'].hide();
            },
            handleOk(event) {
                event.preventDefault();
                this.$refs['fitness-form'].ok();
            },
            addFitness(date, body) {
                FitnessService.createFitness(this.currentUser.username, date, body)
                    .then(() => {
                        this.$emit('created');
                        this.hide();
                    })
                    .catch(err => alert(err.name + ': ' + err.message));
            }
        }
    }
</script>

<style scoped>

</style>