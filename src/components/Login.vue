<template>
    <b-container>
        <b-card class="mx-auto" style="max-width: 30rem;" title="로그인">
            <b-form @submit="handleLogin">
                <b-form-group
                        id="input-group-username"
                        label="사용자 이름:"
                        label-for="input-1"
                >
                    <b-form-input
                            :state="null"
                            id="input-username"
                            placeholder="Enter username"
                            required
                            trim
                            type="text"
                            v-model="form.username"
                    ></b-form-input>
                </b-form-group>

                <b-form-group
                        id="input-group-password"
                        label="비밀번호:"
                        label-for="input-1"
                >
                    <b-form-input
                            :state="null"
                            id="input-password"
                            placeholder="Enter password"
                            required
                            trim
                            type="password"
                            v-model="form.password"
                    ></b-form-input>
                </b-form-group>

                <b-alert :show="error.showAlert" @dismissed="error.showAlert=false" dismissible fade variant="danger">
                    {{ error.message }}
                </b-alert>

                <b-button class="mr-1" type="submit" variant="primary">로그인</b-button>
                <b-button to="/register" variant="light">회원 가입</b-button>
            </b-form>
        </b-card>
    </b-container>
</template>

<script>
    import {mapActions} from "vuex";

    export default {
        name: "login",
        data() {
            return {
                form: {
                    username: '',
                    password: ''
                },
                error: {
                    showAlert: false,
                    message: ''
                }
            }
        },
        methods: {
            ...mapActions({
                login: 'auth/login'
            }),
            handleLogin(event) {
                event.preventDefault();
                this.login(this.form).then(
                    () => {
                        this.$router.push('/dashboard');
                    },
                    error => {
                        this.error.message = error.message;
                        this.error.showAlert = true;
                    }
                );
            }
        }
    }
</script>

<style scoped>

</style>