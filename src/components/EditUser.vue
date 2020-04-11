<template>
    <b-container class="mt-3">
        <vue-headful title="정보 변경 - 스마트 헬스케어"/>
        <b-card class="mx-auto" style="max-width: 40rem;" title="사용자 정보 변경">
            <ValidationObserver ref="form-validation">
                <b-form @submit="handleSubmit">
                    <template v-if="currentUser && currentUser.sns === null">
                        <b-form-group
                                description="6자 이상, 20자 이하"
                                label="새 비밀번호:"
                                label-for="password-input"
                        >
                            <ValidationProvider name="새 비밀번호" rules="min:6|max:20" v-slot="{errors}"
                                                vid="password">
                                <b-form-input
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
                                label="새 비밀번호 확인:"
                                label-for="password-confirm-input"
                        >
                            <ValidationProvider name="새 비밀번호 확인" rules="confirmed:password" v-slot="{errors}">
                                <b-form-input
                                        :state="(errors[0]) ? false : null"
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
                    </template>

                    <b-form-group
                            label="실명:"
                            label-for="full-name-input"
                    >
                        <b-form-input
                                id="full-name-input"
                                placeholder="Enter your full name"
                                type="text"
                                v-model="form.fullName"
                        ></b-form-input>
                    </b-form-group>

                    <error-alerts ref="error-alerts"/>

                    <b-button class="mr-1" type="submit" variant="primary">정보 변경</b-button>
                </b-form>
            </ValidationObserver>

            <hr/>

            <label for="unregister-button">회원 탈퇴:</label>
            <p class="mb-0">
                <b-button @click="handleUnregister" id="unregister-button" variant="danger">회원 탈퇴</b-button>
            </p>
            <small class="text-muted">회원 탈퇴는 신중하게 생각해주세요.</small>
        </b-card>
    </b-container>
</template>

<script>
    import {extend, localize, ValidationObserver, ValidationProvider} from "vee-validate";
    import {confirmed, max, min} from "vee-validate/dist/rules";
    import ErrorAlerts from "@/components/ErrorAlerts";
    import * as UserService from "../services/user";
    import {mapActions, mapGetters} from "vuex";

    localize('ko');

    extend('confirmed', confirmed);
    extend('max', max);
    extend('min', min);

    export default {
        name: "edit-user",
        components: {ErrorAlerts, ValidationObserver, ValidationProvider},
        data() {
            return {
                form: {
                    password: '',
                    passwordConfirm: '',
                    fullName: ''
                }
            };
        },
        computed: {
            ...mapGetters({
                currentUser: 'auth/currentUser'
            }),
        },
        methods: {
            ...mapActions({
                logout: 'auth/logout'
            }),
            handleSubmit(event) {
                event.preventDefault();

                this.$refs['form-validation'].validate()
                    .then(passed => {
                        if (passed) {
                            let body = {};

                            if (this.form.password !== '') body.password = this.form.password;
                            if (this.form.fullName !== '') body.fullName = this.form.fullName;

                            UserService.updateUser(this.currentUser.id, body)
                                .then(() => this.$router.push('/dashboard'))
                                .catch(err => this.handleError(err));
                        }
                    });
            },
            handleUnregister(event) {
                event.preventDefault();

                UserService.deleteUser(this.currentUser.id)
                    .then(() => this.logout())
                    .then(() => this.$router.push('/'))
                    .catch(err => this.handleError(err));
            },
            handleError(error) {
                let alerts = this.$refs['error-alerts'];
                if (alerts) {
                    alerts.add(error);
                }
            }
        }
    }
</script>

<style scoped>

</style>