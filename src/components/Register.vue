<template>
    <b-container>
        <b-card class="mx-auto" style="max-width: 40rem;" title="회원 가입">
            <b-form @submit="handleRegister">
                <b-form-group
                        description="6-16자, 영문과 숫자만으로 구성"
                        id="input-group-username"
                        label="사용자 이름:"
                        label-for="input-1"
                >
                    <b-form-input
                            :state="null"
                            aria-describedby="username-feedback"
                            id="input-username"
                            placeholder="Enter username"
                            required
                            trim
                            type="text"
                            v-model="form.username"
                    ></b-form-input>
                    <b-form-invalid-feedback id="username-feedback">
                        사용자 이름은 6자 이상, 20자 이하이어야 합니다
                    </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group
                        description="6자 이상, 20자 이하"
                        id="input-group-password"
                        label="비밀번호:"
                        label-for="input-1"
                >
                    <b-form-input
                            :state="null"
                            aria-describedby="password-feedback"
                            id="input-password"
                            placeholder="Enter password"
                            required
                            trim
                            type="password"
                            v-model="form.password"
                    ></b-form-input>
                    <b-form-invalid-feedback id="password-feedback">
                        비밀번호은 6자 이상, 20자 이하이어야 합니다
                    </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group
                        description="위와 동일한 비밀번호를 입력"
                        id="input-group-password-confirm"
                        label="비밀번호 확인:"
                        label-for="input-1"
                >
                    <b-form-input
                            :state="null"
                            aria-describedby="password-confirm-feedback"
                            id="input-password-confirm"
                            placeholder="Enter password"
                            required
                            trim
                            type="password"
                            v-model="form.passwordConfirm"
                    ></b-form-input>
                    <b-form-invalid-feedback id="password-confirm-feedback">
                        비밀번호은 6자 이상, 20자 이하이어야 합니다
                    </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group
                        id="input-group-full-name"
                        label="실명:"
                        label-for="input-1"
                >
                    <b-form-input
                            :state="null"
                            id="input-full-name"
                            placeholder="Enter your full name"
                            required
                            type="text"
                            v-model="form.fullName"
                    ></b-form-input>
                </b-form-group>
                <b-form-group
                        description="email@example.com 형식"
                        id="input-group-email"
                        label="이메일:"
                        label-for="input-1"
                >
                    <b-form-input
                            :state="null"
                            id="input-email"
                            placeholder="Enter email"
                            required
                            trim
                            type="email"
                            v-model="form.email"
                    ></b-form-input>
                </b-form-group>
                <b-alert :show="error.showAlert" @dismissed="error.showAlert=false" dismissible fade variant="danger">
                    {{ error.message }}
                </b-alert>
                <b-button class="mr-1" type="submit" variant="primary">회원 가입</b-button>
                <b-button to="/login" variant="light">로그인</b-button>
            </b-form>
        </b-card>
    </b-container>
</template>

<script>
    import {mapActions} from "vuex";

    export default {
        name: "register",
        computed: {
            usernameState() {
                return this.username.length >= 6;
            },
            passwordState() {
                return this.password.length >= 6;
            },
            emailState() {
                return this.email.length >= 6;
            }
        },
        data() {
            return {
                form: {
                    username: '',
                    password: '',
                    email: '',
                    fullName: ''
                },
                error: {
                    showAlert: false,
                    message: ''
                }
            };
        },
        methods: {
            ...mapActions({
                register: 'auth/register'
            }),
            handleRegister(event) {
                event.preventDefault();

                this.register(this.form).then(
                    () => {
                        this.$router.push('/');
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