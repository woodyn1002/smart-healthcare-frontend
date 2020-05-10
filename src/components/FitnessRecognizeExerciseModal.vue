<template>
    <b-modal @hide="handleHide" ref="modal" title="운동 인식">
        <div class="camera-view d-flex justify-content-center">
            <b-spinner
                    class="mb-3"
                    label="Loading camera"
                    style="width: 3rem; height: 3rem;"
                    v-if="recognizing.state === states.loadingCamera"
                    variant="primary"
            ></b-spinner>
            <video class="camera-stream mb-3 d-none" ref="video"/>
        </div>

        <div class="text-center">
            <template v-if="recognizing.state === states.loadingCamera">
                <p class="lead">잠시만 기다려주세요</p>
                <p>카메라를 불러오는 중입니다...</p>
            </template>
            <template v-else-if="recognizing.state === states.cameraNotFound">
                <p class="lead">카메라를 불러올 수 없습니다.</p>
                <p>촬영 가능한 기기를 사용하고, 권한을 허용해주세요.</p>
            </template>
            <template v-else-if="recognizing.state === states.ready">
                <p class="lead">준비가 완료되었습니다!</p>
                <p class="mb-1" v-if="recognizing.finishedWithNoCount">운동을 진행하지 않으셨습니다.</p>
                <p class="mb-1" v-else>운동을 선택해주세요</p>
                <b-form class="justify-content-center" inline>
                    <b-select :options="exerciseOptions" class="mr-2"
                              v-model="recognizing.selectedExerciseName"></b-select>
                    <b-button @click="startExercise()" variant="primary">시작</b-button>
                </b-form>
            </template>
            <template v-else-if="recognizing.state === states.recognizing">
                <p class="lead">{{ selectedExercise.name }} 인식 중...</p>
                <p>{{ formattedElapsedTime }} 소요, {{ recognizing.count }}회 실시</p>
                <b-button @click="finishExercise()" variant="primary">운동 종료</b-button>
            </template>
            <template v-else-if="recognizing.state === states.finished">
                <p class="lead">운동을 마쳤습니다</p>
                <p>
                    {{ selectedExercise.name }} {{ recognizing.count }}회, {{ formattedElapsedTime }}
                </p>
            </template>
        </div>

        <error-alerts ref="error-alerts"/>

        <template v-slot:modal-footer="{ cancel }">
            <b-button @click="cancel()">
                취소
            </b-button>
            <b-button :disabled="recognizing.state !== states.finished" @click="handleOk" variant="primary">
                등록
            </b-button>
        </template>
    </b-modal>
</template>

<script>
    import * as timeFormatter from "../utils/time-formatter";
    import moment from "moment";
    import "@tensorflow/tfjs";
    import * as tmPose from "@teachablemachine/pose";
    import * as ExerciseService from "../services/exercise";
    import ErrorAlerts from "@/components/ErrorAlerts";

    function defaultRecognizingData() {
        return {
            state: 'loadingCamera',
            mediaStream: null,
            selectedExerciseName: '',
            status: null,
            count: 0,
            startMoment: null,
            timer: null,
            elapsedTime: 0,
            finishedWithNoCount: false
        }
    }

    const modelUrl = process.env.VUE_APP_BACKEND_URL + '/ai/exercise-recognizing/model';
    const metadataUrl = process.env.VUE_APP_BACKEND_URL + '/ai/exercise-recognizing/metadata';

    export default {
        name: "fitness-recognize-exercise-modal",
        components: {ErrorAlerts},
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
                model: undefined,
                maxPredictions: 0,
                recognizing: defaultRecognizingData()
            }
        },
        computed: {
            selectedExercise() {
                return this.exercises.find(exercise => exercise.name === this.recognizing.selectedExerciseName);
            },
            formattedElapsedTime() {
                return timeFormatter.simplify(this.recognizing.elapsedTime);
            }
        },
        methods: {
            resetRecognizingData() {
                if (this.recognizing && this.recognizing.timer) {
                    clearInterval(this.recognizing.timer);
                }
                this.recognizing = defaultRecognizingData();
            },
            show() {
                this.resetRecognizingData();

                this.$refs['modal'].show();

                navigator.mediaDevices.getUserMedia({video: true})
                    .then(async mediaStream => {
                        this.recognizing.mediaStream = mediaStream;

                        this.$refs.video.srcObject = mediaStream;
                        this.$refs.video.play();
                        this.$refs.video.classList.remove('d-none');

                        this.model = await tmPose.load(modelUrl, metadataUrl);
                        this.maxPredictions = this.model.getTotalClasses();

                        this.recognizing.state = this.states.ready;
                    })
                    .catch(err => {
                        this.recognizing.state = this.states.cameraNotFound;
                        console.error(err);
                    });
            },
            hide() {
                this.$refs['modal'].hide();
            },
            handleHide() {
                if (this.recognizing.mediaStream) {
                    let tracks = this.recognizing.mediaStream.getTracks();
                    tracks.forEach(track => track.stop());

                    this.$refs.video.srcObject = null;
                    this.recognizing.mediaStream = null;
                }
            },
            startExercise() {
                this.recognizing.state = this.states.recognizing;
                this.recognizing.count = 0;
                this.recognizing.startMoment = moment();
                this.recognizing.elapsedTime = 0;
                this.recognizing.timer = setInterval(() => this.recognizing.elapsedTime++, 1000);

                this.recognizing.status = "ready";
                window.requestAnimationFrame(this.loop);
            },
            async loop() {
                if (this.recognizing.state === this.states.recognizing) {
                    await this.predict();
                    setTimeout(window.requestAnimationFrame(this.loop), 500);
                }
            },
            async predict() {
                const {posenetOutput} = await this.model.estimatePose(this.$refs.video);
                const prediction = await this.model.predict(posenetOutput);

                if (prediction[0].probability.toFixed(2) > 0.90) {
                    if (this.recognizing.status === "push") {
                        this.recognizing.count++;
                        // var audio = new Audio(count%10+'.mp3');
                        // audio.play();
                    }
                    this.recognizing.status = "ready"
                } else if (prediction[1].probability.toFixed(2) > 0.90) {
                    this.recognizing.status = "push"
                } else if (prediction[2].probability.toFixed(2) > 0.90) {
                    if (this.recognizing.status === "push" || this.recognizing.status === "ready") {
                        // var audio = new Audio('bent.mp3');
                        // audio.play();
                    }
                    this.recognizing.status = "bent"
                }
                for (let i = 0; i < this.maxPredictions; i++) {
                    const classPrediction =
                        prediction[i].className + ": " + prediction[i].probability.toFixed(2);
                    console.debug(classPrediction);
                }
            },
            finishExercise() {
                clearInterval(this.recognizing.timer);

                this.recognizing.finishedWithNoCount = (this.recognizing.count === 0);

                if (this.recognizing.finishedWithNoCount) {
                    this.recognizing.state = this.states.ready;
                } else {
                    this.recognizing.state = this.states.finished;
                }
            },
            handleOk(event) {
                event.preventDefault();
                this.confirmExercise();
            },
            confirmExercise() {
                let fitness = {
                    date: this.recognizing.startMoment.toISOString(),
                    exerciseId: this.selectedExercise.id,
                    count: this.recognizing.count,
                    elapsedTime: this.recognizing.elapsedTime
                };
                this.$emit('confirm', fitness);
                this.hide();
            },
            handleError(error) {
                let alerts = this.$refs['error-alerts'];
                if (alerts) {
                    alerts.add(error);
                }
            }
        },
        created() {
            ExerciseService.getExercises()
                .then(exercises => {
                    this.exercises = exercises;
                    this.exerciseOptions = this.exercises.map(exercise => exercise.name);
                })
                .catch(err => this.handleError(err));
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