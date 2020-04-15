<template>
    <b-container class="mt-2 text-center">
        <b-spinner
                class="my-5"
                label="Progressing"
                ref="spinner"
                style="width: 3rem; height: 3rem;"
                variant="primary"
        ></b-spinner>
        <error-alerts ref="error-alerts"/>
    </b-container>
</template>

<script>
    import {mapActions, mapGetters} from "vuex";
    import ErrorAlerts from "@/components/ErrorAlerts";

    export default {
        name: "login-with-google-callback",
        components: {ErrorAlerts},
        computed: {
            ...mapGetters({
                csrfToken: 'auth/csrfToken'
            }),
        },
        methods: {
            ...mapActions({
                loginWithGoogle: 'auth/loginWithGoogle'
            }),
            handleError(error) {
                this.$refs['spinner'].classList.add('d-none');
                this.$refs['error-alerts'].add(error);
            }
        },
        created() {
            if (this.$route.query.state !== this.csrfToken) {
                return this.$nextTick(() => this.handleError({message: '정상적인 요청이 아닙니다.'}));
            }

            const authCode = this.$route.query.code;

            this.loginWithGoogle({code: authCode})
                .then(() => this.$router.push('/dashboard'))
                .then(() => window.location.reload())
                .catch(err => this.handleError(err));
        }
    }
</script>

<style scoped>

</style>