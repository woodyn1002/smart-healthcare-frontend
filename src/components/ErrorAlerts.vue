<template>
    <div>
        <b-alert
                @dismissed="remove(error)"
                dismissible
                fade
                show
                v-bind:key="error.id"
                v-for="error in errors"
                variant="danger">
            {{ (error.name) ? `${error.name}: ${error.message}` : error.message }}
        </b-alert>
    </div>
</template>

<script>
    export default {
        name: "error-alerts",
        data() {
            return {
                errors: [],
                nextId: 0
            }
        },
        methods: {
            add(error) {
                error.id = this.nextId++;
                this.errors.push(error);
            },
            remove(error) {
                this.errors.splice(this.errors.indexOf(error), 1);
            }
        }
    }
</script>

<style scoped>

</style>