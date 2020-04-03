<template>
    <div>
        <div @click="loginWithNaver()" class="lbtn lbtn-flat lbtn-naver align-self-center mx-auto">
            <i class="logo"></i>
            <p class="label">
                Naver 아이디로 로그인
            </p>
        </div>
    </div>
</template>

<script>
    import {mapActions} from "vuex";

    const naver = {
        clientId: process.env.VUE_APP_NAVER_API_CLIENT_ID,
        callbackUrl: process.env.VUE_APP_NAVER_API_CALLBACK_URL
    };

    export default {
        name: "oauth-login-buttons",
        methods: {
            ...mapActions({
                makeCsrfToken: 'auth/makeCsrfToken'
            }),
            loginWithNaver() {
                this.makeCsrfToken()
                    .then(csrfToken => {
                        window.location.href = 'https://nid.naver.com/oauth2.0/authorize?response_type=code' +
                                               '&client_id=' + naver.clientId +
                                               '&redirect_uri=' + naver.callbackUrl +
                                               '&state=' + csrfToken;
                    });
            }
        }
    }
</script>

<style scoped>
    .lbtn {
        cursor: pointer;
        height: 3rem;
        font-size: 1rem;
    }

    .lbtn .logo {
        width: 3rem;
    }
</style>