/**
 * 接口列表
 */

const URI = 'https://duanwei.ollf.wang/' 
const PATH = `v1/`
const BASE_URI = `${URI}${PATH}`
const appId = ''
const UPYUN_IMG_PATH = 'https://duanwei.ollf.wang/'
const UPYUN_AUDIO_PATH = 'https://duanwei.ollf.wang/'
const api = {
  user: {
    login0: `${BASE_URI}user/login0`,
    checkSession: `${BASE_URI}user/check-session`,
    me: `${BASE_URI}user/me`,
    login: `${BASE_URI}user/login`,
  },
  set: {
    userSet: `${BASE_URI}user/setting`,
    planIndex: `${BASE_URI}word-package/index`,
    studyPlan: `${BASE_URI}word-package/study-plan`,
  },
  exam: {
    getList: `${BASE_URI}model-exam/page-list`,
    getDetail: `${BASE_URI}model-exam/page-info`,
    AddLearnProcess: `${BASE_URI}learning-process/add-learn-process`,
    RetryLearn: `${BASE_URI}learning-process/retry-learn`,
  },
  wGame: {
    challengeStatus: `${URI}game/challenge/status`,
    queue: `${URI}game/challenge/queue`,
    save: `${URI}game/challenge/save`,
    checkin: `${URI}game/challenge/checkin`,
    qrcode: `${URI}game/challenge/checkin-qrcode-file`,
    decodeGroup: `${URI}game/challenge/decrypt`,
    ranking: `${URI}game/challenge/rank`,
    randomShare: `${BASE_URI}share-card/random?category=challenge`
  },
  mapRed: {
    mapEnvelop: `${BASE_URI}ump/map-envelope`,
    getQuestions: `${BASE_URI}ump/questions`,
    answer: `${BASE_URI}ump/answer`,
    getList: `${BASE_URI}ump/map-envelope`,
    record: `${BASE_URI}ump/red-pack-record`,
    treasure: `${BASE_URI}ump/treasure-box`,
    withDraw: `${BASE_URI}ump/with-draw`,
    invitation: `${BASE_URI}ump/invitation-record`,
    Tutorials: `${BASE_URI}ump/tutorials`,
    VerifyTutorials: `${BASE_URI}ump/verify-tutorials`,
    treasure: `${BASE_URI}ump/treasure-box`,
    envelopes: `${BASE_URI}ump/pull-envelopes`,
    shareUser: `${BASE_URI}ump/invitation`
  },
  course:{
    getCourseList: `${BASE_URI}course/course-list`,
    getCourse: `${BASE_URI}course/course-detail`,
    getPhone: `${BASE_URI}user/get-phone-number`
  },
  welfare:{
    coupon: `${BASE_URI}coupon/index`,
    getStudyList: `${BASE_URI}learn-material/material-list`,
    getCoupon: `${BASE_URI}coupon/get`,
    hasAscription: `${BASE_URI}user/ascription`,
    addStudyNum: `${BASE_URI}learn-material/add-receive`
  }
}
export {
  api,
  UPYUN_IMG_PATH as img,
  UPYUN_AUDIO_PATH as audio,
}
