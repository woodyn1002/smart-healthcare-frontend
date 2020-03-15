<template>
    <div>
        <b-container>
            <b-jumbotron header="Smart Healthcare">
                <template v-slot:lead>
                    스마트 헬스케어 대사 관리 서비스
                </template>
                <hr class="my-4">
                <p>
                    <template v-if="loggedIn">
                        <b-button size="lg" to="dashboard" variant="primary">시작하기</b-button>
                    </template>
                    <template v-if="!loggedIn">
                        <b-button class="mr-2" size="lg" to="register" variant="primary">회원 가입</b-button>
                        <b-button size="lg" to="login" variant="outline-secondary">로그인</b-button>
                    </template>
                </p>
            </b-jumbotron>
        </b-container>

        <b-container>
            <div class="row">
                <div class="col-md-4">
                    <h2>대사 관리</h2>
                    <p>ㅇㅇ</p>
                    <p><a class="btn btn-default" href="#" role="button">정보 입력하기</a></p>
                </div>
                <div class="col-md-4">
                    <h2>식사 관리</h2>
                    <p>ㅇㅇ</p>
                    <p><a class="btn btn-default" href="#" role="button">식사 기록하기</a></p>
                </div>
                <div class="col-md-4">
                    <h2>운동 관리</h2>
                    <p>ㅇㅇ</p>
                    <p><a class="btn btn-default" href="#" role="button">운동 기록하기</a></p>
                </div>
            </div>
        </b-container>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: "home",
        computed: {
            ...mapGetters({
                loggedIn: 'auth/loggedIn',
                currentUser: 'auth/currentUser'
            })
        },
        methods: {
            logout() {
                this.$store.dispatch('auth/logout');
                this.$router.push('/');
            }
        }
    }
</script>

<style scoped>

</style>