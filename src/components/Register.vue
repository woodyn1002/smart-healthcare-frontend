<template>
    <b-container class="mt-3">
        <vue-headful title="회원 가입 - 스마트 헬스케어"/>
        <b-card class="mx-auto" style="max-width: 40rem;" title="회원 가입">
            <ValidationObserver ref="form-validation">
                <b-form @submit="handleRegister">
                    <b-form-group
                            description="6-16자, 영문과 숫자만으로 구성"
                            label="사용자 이름:"
                            label-for="username-input"
                    >
                        <ValidationProvider name="사용자 이름" rules="alpha_num|min:6|max:16|required"
                                            v-slot="{valid, errors}">
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

                    <b-form-group
                            description="6자 이상, 20자 이하"
                            label="비밀번호:"
                            label-for="password-input"
                    >
                        <ValidationProvider name="비밀번호" rules="min:6|max:20|required" v-slot="{valid, errors}"
                                            vid="password">
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

                    <b-form-group
                            description="위와 동일한 비밀번호를 입력"
                            label="비밀번호 확인:"
                            label-for="password-confirm-input"
                    >
                        <ValidationProvider name="비밀번호 확인" rules="confirmed:password|required" v-slot="{valid, errors}">
                            <b-form-input
                                    :state="(errors[0]) ? false : ((valid) ? true : null)"
                                    aria-describedby="password-confirm-feedback"
                                    id="password-confirm-input"
                                    placeholder="Enter password"
                                    trim
                                    type="password"
                                    v-model="form.passwordConfirm"
                            ></b-form-input>
                            <b-form-invalid-feedback id="password-confirm-feedback">
                                {{ errors[0] }}
                            </b-form-invalid-feedback>
                        </ValidationProvider>
                    </b-form-group>

                    <b-form-group
                            label="실명:"
                            label-for="full-name-input"
                    >
                        <ValidationProvider name="실명" rules="required" v-slot="{valid, errors}">
                            <b-form-input
                                    :state="(errors[0]) ? false : ((valid) ? true : null)"
                                    aria-describedby="full-name-feedback"
                                    id="full-name-input"
                                    placeholder="Enter your full name"
                                    type="text"
                                    v-model="form.fullName"
                            ></b-form-input>
                            <b-form-invalid-feedback id="full-name-feedback">
                                {{ errors[0] }}
                            </b-form-invalid-feedback>
                        </ValidationProvider>
                    </b-form-group>

                    <b-form-group
                            description="email@example.com 형식"
                            label="이메일:"
                            label-for="email-input"
                    >
                        <ValidationProvider name="이메일" rules="email|required" v-slot="{valid, errors}">
                            <b-form-input
                                    :state="(errors[0]) ? false : ((valid) ? true : null)"
                                    id="email-input"
                                    placeholder="Enter email"
                                    trim
                                    type="email"
                                    v-model="form.email"
                            ></b-form-input>
                            <b-form-invalid-feedback id="email-feedback">
                                {{ errors[0] }}
                            </b-form-invalid-feedback>
                        </ValidationProvider>
                    </b-form-group>

                    <error-alerts ref="error-alerts"/>

                    <b-button class="mr-1" type="submit" variant="primary">회원 가입</b-button>
                    <b-button to="/login" variant="light">로그인</b-button>
                </b-form>
            </ValidationObserver>
        </b-card>
    </b-container>
</template>

<script>
    import {mapActions} from "vuex";
    import {extend, localize, ValidationObserver, ValidationProvider} from "vee-validate";
    import {alpha_num, confirmed, email, max, min, required} from "vee-validate/dist/rules";
    import ErrorAlerts from "@/components/ErrorAlerts";

    localize('ko');

    extend('alpha_num', alpha_num);
    extend('confirmed', confirmed);
    extend('email', email);
    extend('max', max);
    extend('min', min);
    extend('required', required);

    export default {
        name: "register",
        components: {ErrorAlerts, ValidationObserver, ValidationProvider},
        data() {
            return {
                form: {
                    username: '',
                    password: '',
                    passwordConfirm: '',
                    email: '',
                    fullName: ''
                }
            };
        },
        methods: {
            ...mapActions({
                register: 'auth/register'
            }),
            handleRegister(event) {
                event.preventDefault();

                this.$refs['form-validation'].validate()
                    .then(passed => {
                        if (passed) {
                            let body = {
                                username: this.form.username,
                                sns: null,
                                password: this.form.password,
                                email: this.form.email,
                                fullName: this.form.fullName
                            };
                            this.register(body).then(
                                () => {
                                    this.$router.push('/');
                                },
                                error => {
                                    if (error.name === 'UsernameExistError')
                                        error = {message: '이미 사용중인 사용자 이름입니다.'};

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