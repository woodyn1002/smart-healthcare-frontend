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
                    <b-button :disabled="selectedExercise === undefined" @click="startExercise()" variant="primary">
                        시작
                    </b-button>
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

    const supportedExercises = [
        'knee-push-up',
        'squat',
        'standing-side-crunch'
    ]
    const modelUrls = {
        'knee-push-up': process.env.VUE_APP_BACKEND_URL + '/ai/exercise-recognizing/knee-push-up',
        'squat': process.env.VUE_APP_BACKEND_URL + '/ai/exercise-recognizing/squat',
        'standing-side-crunch': process.env.VUE_APP_BACKEND_URL + '/ai/exercise-recognizing/standing-side-crunch'
    }

    const sounds = {
        '0': require('@/assets/sounds/0.mp3'),
        '1': require('@/assets/sounds/1.mp3'),
        '2': require('@/assets/sounds/2.mp3'),
        '3': require('@/assets/sounds/3.mp3'),
        '4': require('@/assets/sounds/4.mp3'),
        '5': require('@/assets/sounds/5.mp3'),
        '6': require('@/assets/sounds/6.mp3'),
        '7': require('@/assets/sounds/7.mp3'),
        '8': require('@/assets/sounds/8.mp3'),
        '9': require('@/assets/sounds/9.mp3'),
        'bent': require('@/assets/sounds/bent.mp3')
    }

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
                webcam: undefined,
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
                    .then(mediaStream => {
                        this.recognizing.mediaStream = mediaStream;

                        this.$refs.video.srcObject = mediaStream;
                        this.$refs.video.play();
                        this.$refs.video.classList.remove('d-none');

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
                let modelUrl = modelUrls[this.selectedExercise.id];
                tmPose.load(modelUrl + '/model', modelUrl + '/metadata')
                    .then(async model => {
                        this.model = model;
                        this.maxPredictions = this.model.getTotalClasses();

                        // Convenience function to setup a webcam
                        const size = 200;
                        const flip = true; // whether to flip the webcam
                        this.webcam = new tmPose.Webcam(size, size, flip); // width, height, flip
                        await this.webcam.setup(); // request access to the webcam
                        await this.webcam.play();

                        this.recognizing.state = this.states.recognizing;
                        this.recognizing.count = 0;
                        this.recognizing.startMoment = moment();
                        this.recognizing.elapsedTime = 0;
                        this.recognizing.timer = setInterval(() => this.recognizing.elapsedTime++, 1000);

                        this.recognizing.status = "ready";
                        window.requestAnimationFrame(this.loop);
                    });
            },
            async loop() {
                if (this.recognizing.state === this.states.recognizing) {
                    this.webcam.update();
                    await this.predict();
                    window.requestAnimationFrame(this.loop);
                }
            },
            async predict() {
                const {posenetOutput} = await this.model.estimatePose(this.$refs.video);
                const prediction = await this.model.predict(posenetOutput);

                let audio;
                switch (this.selectedExercise.id) {
                    case 'knee-push-up':
                        if (prediction[0].probability.toFixed(2) > 0.90) {
                            if (this.status === "push") {
                                this.recognizing.count++
                                audio = new Audio(sounds[this.recognizing.count % 10]);
                                audio.play();
                            }
                            this.status = "ready"
                        } else if (prediction[1].probability.toFixed(2) > 0.90) {
                            this.status = "push"
                        } else if (prediction[2].probability.toFixed(2) > 0.90) {
                            if (this.status === "push" || this.status === "ready") {
                                audio = new Audio(sounds['bent']);
                                audio.play();
                            }
                            this.status = "bent"
                        }
                        break;
                    case 'squat':
                        if (prediction[0].probability.toFixed(2) > 0.90) {
                            if (this.status === "squat") {
                                this.recognizing.count++
                                audio = new Audio(sounds[this.recognizing.count % 10]);
                                audio.play();
                            }
                            this.status = "stand"
                        } else if (prediction[1].probability.toFixed(2) > 0.90) {
                            this.status = "squat"
                        } else if (prediction[2].probability.toFixed(2) > 0.90) {
                            if (this.status === "squat" || this.status === "stand") {
                                audio = new Audio(sounds['bent']);
                                audio.play();
                            }
                            this.status = "bent"
                        }
                        break;
                    case 'standing-side-crunch':
                        if (prediction[0].probability.toFixed(2) > 0.90) {
                            if (this.status === "Crunch") {
                                this.recognizing.count++
                                audio = new Audio(sounds[this.recognizing.count % 10]);
                                audio.play();
                            }
                            this.status = "stand"
                        } else if (prediction[1].probability.toFixed(2) > 0.90) {
                            this.status = "Crunch"
                        } else if (prediction[2].probability.toFixed(2) > 0.90) {
                            if (this.status === "Crunch" || this.status === "stand") {
                                audio = new Audio(sounds['bent']);
                                audio.play();
                            }
                            this.status = "bent"
                        }
                        break;
                    default:
                        throw new Error('Unsupported exercise');
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
                    this.exerciseOptions = this.exercises
                        .filter(exercise => supportedExercises.includes(exercise.id))
                        .map(exercise => exercise.name);
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