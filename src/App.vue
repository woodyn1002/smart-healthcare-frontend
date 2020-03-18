<template>
    <div id="app">
        <b-navbar class="mb-3" sticky toggleable="lg" type="light" variant="light">
            <b-container>
                <b-navbar-brand :to="loggedIn ? '/dashboard' : '/'">
                    Smart Healthcare
                </b-navbar-brand>

                <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

                <b-collapse id="nav-collapse" is-nav>
                    <b-navbar-nav>
                        <b-nav-item to="health">대사 관리</b-nav-item>
                        <b-nav-item to="meals">식사 관리</b-nav-item>
                        <b-nav-item to="fitness">운동 관리</b-nav-item>
                    </b-navbar-nav>

                    <b-navbar-nav class="ml-auto">
                        <template v-if="loggedIn">
                            <b-nav-item-dropdown right>
                                <template v-slot:button-content>
                                    <b-icon-person-fill></b-icon-person-fill>
                                </template>
                                <b-dropdown-item href="#">정보 변경</b-dropdown-item>
                                <b-dropdown-item @click="logout()">로그아웃</b-dropdown-item>
                            </b-nav-item-dropdown>
                        </template>
                        <template v-else>
                            <b-nav-item to="login">로그인</b-nav-item>
                        </template>
                    </b-navbar-nav>
                </b-collapse>
            </b-container>
        </b-navbar>
        <router-view/>
        <div class="container">
            <hr/>
            <footer>
                <small>&copy; Copyright 2020, 광운대학교 산학연계 SW프로젝트 '다이어트를 부탁해' 팀</small>
            </footer>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: "app",
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

<style>
    ::-webkit-scrollbar {
        width: 5px;
    }

    ::-webkit-scrollbar-track {
        background: #f1f1f1;
    }

    ::-webkit-scrollbar-thumb {
        background: #888;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
</style>
