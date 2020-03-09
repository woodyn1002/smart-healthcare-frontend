<template>
    <b-modal @show="reset" ref="modal" title="사진 업로드">
        <b-form @submit.stop.prevent="recognizeFoods" class="mb-2">
            <b-form-file
                    @change="reset"
                    accept="image/*"
                    browse-text="불러오기"
                    drop-placeholder="이미지를 드랍하세요"
                    id="file-input"
                    placeholder="이미지를 업로드하세요"
                    v-model="selectedFile"
            ></b-form-file>
        </b-form>

        <template v-if="uploaded">
            <hr/>
            <b-img class="mb-3" fluid ref="preview-image"></b-img>
            <p class="lead text-center">인식 결과: 김치찌개</p>
            <p class="text-center">결과가 옳다면 등록 버튼을 눌러주세요.</p>
        </template>

        <template v-slot:modal-footer="{ cancel }">
            <b-button @click="cancel()">
                취소
            </b-button>

            <template v-if="uploaded">
                <b-button :disabled="!selectedFile" @click="handleOk" variant="primary">
                    등록
                </b-button>
            </template>
            <template v-else-if="uploading">
                <b-button disabled variant="primary">
                    <b-spinner small></b-spinner>
                    업로드 중...
                </b-button>
            </template>
            <template v-else>
                <b-button :disabled="!selectedFile" @click="handleOk" variant="primary">
                    인식
                </b-button>
            </template>
        </template>
    </b-modal>
</template>

<script>
    export default {
        name: "meals-recognize-foods-modal",
        data() {
            return {
                selectedFile: null,
                uploading: false,
                uploaded: false,
                dishes: [{foodName: 'kimchi-soup', amount: 1}]
            }
        },
        methods: {
            show() {
                this.$refs['modal'].show();
            },
            hide() {
                this.$refs['modal'].hide();
            },
            handleOk(event) {
                event.preventDefault();

                if (this.uploaded) {
                    this.confirmFoods();
                } else {
                    this.recognizeFoods();
                }
            },
            recognizeFoods() {
                this.uploading = true;

                setTimeout(() => {
                    this.uploading = false;
                    this.uploaded = true;

                    const fileReader = new FileReader();
                    fileReader.onload = (e) => this.$refs['preview-image'].src = e.target.result;
                    fileReader.readAsDataURL(this.selectedFile);
                }, 1000);
            },
            confirmFoods() {
                this.$emit('confirm', this.dishes);
                this.hide();
            },
            reset() {
                this.selectedFile = null;
                this.uploading = false;
                this.uploaded = false;
            }
        }
    }
</script>

<style scoped>

</style>