<template>
    <b-modal @show="reset" ref="modal" title="">
        <div class="camera-view d-flex justify-content-center">
            <b-spinner
                    class="mb-3"
                    label="Loading camera"
                    style="width: 3rem; height: 3rem;"
                    variant="primary"
                    v-if="state === states.loadingCamera"
            ></b-spinner>
            <video class="camera-stream mb-3 d-none" ref="video"/>
        </div>

        <div class="text-center">
            <template v-if="state === states.loadingCamera">
                <p class="lead">잠시만 기다려주세요</p>
                <p>카메라를 불러오는 중입니다...</p>
            </template>
            <template v-else-if="state === states.cameraNotFound">
                <p class="lead">카메라를 불러올 수 없습니다.</p>
                <p>촬영 가능한 기기를 사용하고, 권한을 허용해주세요.</p>
            </template>
            <template v-else-if="state === states.ready">
                <p class="lead">준비가 완료되었습니다</p>
                <p class="mb-1" v-if="finishedWithNoCount">운동을 진행하지 않으셨습니다.</p>
                <p class="mb-1" v-else>운동을 선택해주세요</p>
                <b-form class="justify-content-center" inline>
                    <b-select :options="exerciseOptions" class="mr-2" v-model="selectedExerciseText"></b-select>
                    <b-button @click="startExercise()" variant="primary">시작</b-button>
                </b-form>
            </template>
            <template v-else-if="state === states.recognizing">
                <p class="lead">{{ selectedExercise.text }} 인식 중...</p>
                <p>{{ formatSeconds(elapsedTime) }} 소요, {{ count }}회 실시</p>
                <b-button @click="finishExercise()" variant="primary">운동 종료</b-button>
            </template>
            <template v-else-if="state === states.finished">
                <p class="lead">운동을 마쳤습니다</p>
                <p>{{ selectedExercise.text }} {{ count }}회, {{ formatSeconds(elapsedTime) }}</p>
            </template>
        </div>

        <template v-slot:modal-footer="{ cancel }">
            <b-button @click="cancel()">
                취소
            </b-button>
            <b-button :disabled="state !== states.finished" @click="handleOk" variant="primary">
                등록
            </b-button>
        </template>
    </b-modal>
</template>

<script>
    import timeFormatter from "../utils/time-formatter";
    import moment from "moment";

    export default {
        name: "fitness-recognize-exercise-modal",
        data() {
            return {
                exercises: [],
                exerciseOptions: [],
                states: {
                    loadingCamera: 'loadingCamera',
                    cameraNotFound: 'cameraNotFound',
                    ready: 'ready',
                    recognizing: 'recognizing',
                    finished: 'finished'
                },
                state: '',
                mediaStream: null,
                selectedExercise: undefined,
                selectedExerciseText: '',
                count: 0,
                startMoment: null,
                finishMoment: null,
                timer: null,
                elapsedTime: 0,
                finishedWithNoCount: false
            }
        },
        methods: {
            formatSeconds(time) {
                return timeFormatter.formatSeconds(time);
            },
            show() {
                this.$refs['modal'].show();
            },
            hide() {
                this.$refs['modal'].hide();
            },
            startExercise() {
                this.selectedExercise = this.exercises.find(exercise => exercise.text === this.selectedExerciseText);
                this.state = this.states.recognizing;
                this.startMoment = moment();
                this.timer = setInterval(() => this.elapsedTime++, 1000);
            },
            finishExercise() {
                clearInterval(this.timer);

                if (this.count === 0) {
                    this.state = this.states.ready;
                    this.finishedWithNoCount = true;
                } else {
                    this.state = this.states.finished;
                    this.finishMoment = moment();
                }
            },
            handleOk(event) {
                event.preventDefault();
                this.confirmExercise();
            },
            confirmExercise() {
                let fitnessData = {
                    exerciseName: this.selectedExercise.name,
                    count: this.count,
                    startMoment: this.startMoment,
                    finishMoment: this.finishMoment
                };
                this.$emit('confirm', fitnessData);
                this.hide();
            },
            reset() {
                this.state = this.states.loadingCamera;
                this.selectedExercise = '';
                this.selectedExerciseText = '';
                this.count = 0;
                this.startMoment = null;
                this.finishMoment = null;
                if (this.timer) {
                    clearInterval(this.timer);
                    this.timer = null;
                }
                this.elapsedTime = 0;
                this.finishedWithNoCount = false;

                navigator.mediaDevices.getUserMedia({video: true})
                    .then(mediaStream => {
                        this.mediaStream = mediaStream;

                        this.$refs.video.srcObject = mediaStream;
                        this.$refs.video.play();
                        this.$refs.video.classList.remove('d-none');

                        this.state = this.states.ready;
                    })
                    .catch(err => {
                        this.state = this.states.cameraNotFound;
                        console.error(err);
                    });
            }
        },
        mounted() {
            this.exercises = [
                {name: 'push-up', text: '팔굽혀펴기', met: 3.8},
                {name: 'squat', text: '스쿼트', met: 3.5}
            ];
            this.exerciseOptions = this.exercises.map(exercise => exercise.text);
        }
    }
</script>

<style scoped>
    .camera-view {
        width: 100%;
        height: 100%;
    }

    .camera-stream {
        width: 100%;
        max-height: 100%;
    }
</style>