<template>
    <div>
        <div @click="loginWithNaver()" class="lbtn lbtn-flat lbtn-naver align-self-center mx-auto">
            <i class="logo"></i>
            <p class="label">
                Naver 아이디로 로그인
            </p>
        </div>
        <div @click="loginWithFacebook()" class="lbtn lbtn-flat lbtn-facebook align-self-center mx-auto">
            <i class="logo"></i>
            <p class="label">
                Facebook 아이디로 로그인
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
    const facebook = {
        appId: process.env.VUE_APP_FACEBOOK_API_APP_ID,
        redirectUri: process.env.VUE_APP_FACEBOOK_API_REDIRECT_URI
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
            },
            loginWithFacebook() {
                this.makeCsrfToken()
                    .then(csrfToken => {
                        window.location.href = 'https://www.facebook.com/v6.0/dialog/oauth?response_type=code' +
                                               '&client_id=' + facebook.appId +
                                               '&redirect_uri=' + facebook.redirectUri +
                                               '&state=' + csrfToken +
                                               '&scope=email';
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