<template>
    <b-container>
        <vue-headful title="로그인 - 스마트 헬스케어"/>
        <b-card class="mx-auto" style="max-width: 30rem;" title="로그인">
            <ValidationObserver ref="form-validation">
                <b-form @submit="handleLogin">
                    <b-form-group label="사용자 이름:" label-for="username-input">
                        <ValidationProvider name="사용자 이름" rules="required" v-slot="{valid, errors}">
                            <b-form-input
                                    :state="(errors[0]) ? false : ((valid) ? true : null)"
                                    aria-describedby="username-feedback"
                                    id="username-input"
                                    placeholder="Enter username"
                                    trim
                                    type="text"
                                    v-model="form.username"
                            ></b-form-input>
                            <b-form-invalid-feedback id="username-feedback">
                                {{ errors[0] }}
                            </b-form-invalid-feedback>
                        </ValidationProvider>
                    </b-form-group>

                    <b-form-group label="비밀번호:" label-for="password-input">
                        <ValidationProvider name="비밀번호" rules="required" v-slot="{valid, errors}">
                            <b-form-input
                                    :state="(errors[0]) ? false : ((valid) ? true : null)"
                                    aria-describedby="password-feedback"
                                    id="password-input"
                                    placeholder="Enter password"
                                    trim
                                    type="password"
                                    v-model="form.password"
                            ></b-form-input>
                            <b-form-invalid-feedback id="password-feedback">
                                {{ errors[0] }}
                            </b-form-invalid-feedback>
                        </ValidationProvider>
                    </b-form-group>

                    <error-alerts ref="error-alerts"/>

                    <b-button class="mr-1" type="submit" variant="primary">로그인</b-button>
                    <b-button to="/register" variant="light">회원 가입</b-button>
                </b-form>
            </ValidationObserver>
        </b-card>
    </b-container>
</template>

<script>
    import {mapActions} from "vuex";
    import {extend, localize, ValidationObserver, ValidationProvider} from "vee-validate";
    import {required} from "vee-validate/dist/rules";
    import ErrorAlerts from "@/components/ErrorAlerts";

    localize('ko');

    extend('required', required);

    export default {
        name: "login",
        components: {ErrorAlerts, ValidationObserver, ValidationProvider},
        data() {
            return {
                form: {
                    username: '',
                    password: ''
                }
            }
        },
        methods: {
            ...mapActions({
                login: 'auth/login'
            }),
            handleLogin(event) {
                event.preventDefault();

                this.$refs['form-validation'].validate()
                    .then(passed => {
                        if (passed) {
                            let body = {
                                username: this.form.username,
                                password: this.form.password
                            };
                            this.login(body).then(
                                () => {
                                    this.$router.push('/dashboard');
                                },
                                error => {
                                    if (error.name === 'UserNotFoundError')
                                        error = {message: '등록되지 않은 사용자입니다.'};
                                    else if (error.name === 'InvalidPasswordError')
                                        error = {message: '비밀번호가 일치하지 않습니다.'};

                                    this.$refs['error-alerts'].add(error);
                                }
                            );
                        }
                    });
            }
        }
    }
</script>

<style scoped>

</style>