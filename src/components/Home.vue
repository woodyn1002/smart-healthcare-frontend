<template>
    <div>
        <vue-headful title="스마트 헬스케어"/>
        <div id="title-background">
            <b-jumbotron class="d-flex text-center" id="title-jumbotron" text-variant="light">
                <b-container class="my-auto">
                    <b-img class="mb-3" src="@/assets/images/logo-white.png" style="width: 192px; height: 192px;"/>
                    <h1 class="display-4 d-md-none">Smart Healthcare</h1>
                    <h1 class="display-2 d-none d-md-block">Smart Healthcare</h1>
                    <hr class="border-light my-4 w-25"/>
                    <p class="lead">스마트 헬스케어 대사 관리 서비스</p>

                    <p class="mt-4">
                        <template v-if="loggedIn">
                            <b-button size="lg" to="dashboard" variant="primary">시작하기</b-button>
                        </template>
                        <template v-if="!loggedIn">
                            <b-button class="mr-2" size="lg" to="register" variant="primary">회원 가입</b-button>
                            <b-button size="lg" to="login" variant="outline-light">로그인</b-button>
                        </template>
                    </p>
                </b-container>
            </b-jumbotron>
        </div>

        <b-container class="my-5">
            <b-row align-v="center" class="my-5" style="height: 30rem;">
                <b-col class="text-center" md="6" order-md="2">
                    <h2 class="mt-3">카메라를 통한 AI 운동 인식</h2>
                    <p class="lead">잘못된 자세를 교정해줄 나만의 홈 트레이너</p>
                </b-col>
                <b-col order-md="1">
                    <b-img alt="운동 관리" class="float-left" fluid-grow src="@/assets/images/fitness-management.jpg"/>
                </b-col>
            </b-row>

            <b-row align-v="center" class="my-5" style="height: 30rem;">
                <b-col class="text-center" md="6">
                    <h2 class="mt-3">촬영 한 번으로 식사 기록</h2>
                    <p class="lead">사진 한 장만으로 AI를 통한 음식 인식</p>
                </b-col>
                <b-col>
                    <b-img alt="운동 관리" class="float-left" fluid src="@/assets/images/meal-management.jpg"/>
                </b-col>
            </b-row>

            <div id="calorie-background">
                <b-jumbotron class="d-flex text-center" id="calorie-jumbotron" text-variant="light">
                    <b-container class="my-auto">
                        <h2 class="mt-3">칼로리 계산으로 손쉬운 대사 관리</h2>
                        <p class="lead">운동 인식과 식사 인식을 통해 총 섭취 열량 관리</p>
                    </b-container>
                </b-jumbotron>
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
    #title-background {
        background-image: url('../assets/images/title-background.jpg');
        background-position: center 30%;
        background-size: cover;
    }

    #title-jumbotron {
        background-color: rgba(0, 0, 0, 0.3);
        height: 50rem;
    }

    #calorie-background {
        background-image: url('../assets/images/calorie-management.jpg');
        background-position: center;
        background-size: cover;
    }

    #calorie-jumbotron {
        background-color: rgba(0, 0, 0, 0.4);
        height: 30rem;
    }
</style>