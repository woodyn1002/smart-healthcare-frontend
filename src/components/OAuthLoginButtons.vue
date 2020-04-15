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
        <div @click="loginWithGoogle()" class="lbtn lbtn-flat lbtn-google align-self-center mx-auto">
            <i class="logo"></i>
            <p class="label">
                Google 아이디로 로그인
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
    const google = {
        clientId: process.env.VUE_APP_GOOGLE_API_CLIENT_ID,
        redirectUri: process.env.VUE_APP_GOOGLE_API_REDIRECT_URI
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
            },
            loginWithGoogle() {
                this.makeCsrfToken()
                    .then(csrfToken => {
                        window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?response_type=code' +
                                               '&access_type=offline' +
                                               '&client_id=' + google.clientId +
                                               '&redirect_uri=' + google.redirectUri +
                                               '&state=' + csrfToken +
                                               '&scope=profile email';
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