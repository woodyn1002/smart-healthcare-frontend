<template>
    <b-modal ref="modal" title="사진 업로드">
        <b-form @submit.stop.prevent="recognizeFoods()" class="mb-2">
            <b-form-file
                    @change="resetRecognizingData()"
                    accept="image/*"
                    browse-text="불러오기"
                    drop-placeholder="이미지를 드랍하세요"
                    id="file-input"
                    placeholder="이미지를 업로드하세요"
                    v-model="recognizing.file"
            ></b-form-file>
        </b-form>

        <template v-if="recognizing.state >= states.uploading">
            <hr/>
            <div class="d-flex justify-content-center">
                <b-img :src="recognizing.fileSrc" class="mb-3" fluid></b-img>
            </div>
        </template>

        <template v-if="recognizing.state === states.finished">
            <p class="lead text-center">인식 결과: {{ recognizing.result.map(it => it.food.name).join(', ') }}</p>
            <p class="text-center">결과가 옳다면 등록 버튼을 눌러주세요.</p>
        </template>

        <template v-slot:modal-footer="{ cancel }">
            <b-button @click="cancel()">
                취소
            </b-button>

            <template v-if="recognizing.state === states.ready">
                <b-button :disabled="!recognizing.file" @click="handleOk" variant="primary">
                    인식
                </b-button>
            </template>
            <template v-else-if="recognizing.state === states.uploading">
                <b-button disabled variant="primary">
                    <b-spinner small></b-spinner>
                    업로드 중...
                </b-button>
            </template>
            <template v-else-if="recognizing.state === states.estimating">
                <b-button disabled variant="primary">
                    <b-spinner small></b-spinner>
                    인식 중...
                </b-button>
            </template>
            <template v-else-if="recognizing.state === states.finished">
                <b-button @click="handleOk" variant="primary">
                    등록
                </b-button>
            </template>
        </template>
    </b-modal>
</template>

<script>
    import * as FoodRecognizingService from "../services/food-recognizing";

    function defaultRecognizingData() {
        return {
            state: 0,
            file: null,
            fileSrc: '',
            date: null,
            result: []
        }
    }

    export default {
        name: "meals-recognize-foods-modal",
        data() {
            return {
                states: {
                    ready: 0,
                    uploading: 1,
                    estimating: 2,
                    finished: 3
                },
                recognizing: defaultRecognizingData()
            }
        },
        methods: {
            resetRecognizingData() {
                this.recognizing = defaultRecognizingData();
            },
            show() {
                this.resetRecognizingData();

                this.$refs['modal'].show();
            },
            hide() {
                this.$refs['modal'].hide();
            },
            handleOk(event) {
                event.preventDefault();

                if (this.recognizing.state === this.states.ready) {
                    this.recognizeFoods();
                } else if (this.recognizing.state === this.states.finished) {
                    this.confirmFoods();
                }
            },
            recognizeFoods() {
                this.recognizing.state = this.states.uploading;
                this.recognizing.date = new Date().toISOString();

                const fileReader = new FileReader();
                fileReader.onload = (e) => this.recognizing.fileSrc = e.target.result;
                fileReader.readAsDataURL(this.recognizing.file);

                let formData = new FormData();
                formData.append('imageFile', this.recognizing.file);
                FoodRecognizingService.recognize(formData)
                    .then(result => {
                        this.recognizing.state = this.states.finished;
                        this.recognizing.result = result;
                    })
                    .catch(err => console.log(err));
            },
            confirmFoods() {
                let date = this.recognizing.date;
                let meal = {dishes: []};
                for (let entry of this.recognizing.result) {
                    meal.dishes.push({foodId: entry.food.id, amount: 1});
                }

                this.$emit('confirm', date, meal);
                this.hide();
            }
        }
    }
</script>

<style scoped>

</style>