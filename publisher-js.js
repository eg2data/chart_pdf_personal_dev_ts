// import amqp from 'amqplib/callback_api.js';
const amqp = require('amqplib/callback_api.js')
const config = require('config')

const data_0 =
    {
        pathInfo: {
            reservationNumber: 1110111011,
            centerCode: 111,
            examDate: "1989-02-17",
            reportDate: "1989-02-19"
        },
        basicInfo: {
            userName: "test-1",
        },
        KOSSSF: {
            signals: [24], // 24, 45, 66, 87
            signalTexts: "약간 심함",
            points : [24],
            rates : ["상위 25"],
            means : [3.3],
            compensation: [3, "하위 25"],
            jobInstability: [7.7, "하위 50"],
            requirements: [4.2, "하위 25"],
            culture: [15, "하위 25"],
            autonomy: [2.1, "하위 50"],
            system: [7.9, "하위 50"],
            relationship: [3, "하위 25"],
            changesByYear: [24], // 24
            commentDetails: "스트레스 측정 점수는 39.5점으로, 참고치 하위 25%에 해당합니다.",
        },
        PHQ9 : {
            signals: [45],
            signalTexts: "자살위험아님",
            points : [12],
            rates: [75],
            comments: "약간 심한 수준의 우울감을 자주 느낌",
            requirements: "추가 평가 또는 전문가의 도움이 필요함",
            requirementTexts: "전문도움필요",
            changesByYear: [12],
            commentDetails: "검사 결과는 약간 심한 수준의 우울감을 자주 느끼고 있습니다. 우울증 진단은 병력 및 여러 검사 결과와 전문의의 종합적인 판단에 의해 이루어지므로, 추가 평가 또는 전문가의 도움이 필요합니다.",
        },
        GAD7 : {
            signals: [45],
            signalTexts: "자살위험아님",
            points : [15],
            rates: [75],
            comments: "약간 심한 수준의 우울감을 자주 느낌",
            requirements: "추가 평가 또는 전문가의 도움이 필요함",
            requirementTexts: "전문도움필요",
            changesByYear: [15],
            commentDetails: "검사 결과는 중간 수준의 불안감을 자주 느끼고 있습니다. 불안장애 진단은 병력 및 여러 검사 결과와 전문의의 종합적인 판단에 의해 이루어지므로, 추가 평가 또는 전문가의 도움이 필요합니다.",
        },
        ADNM4 : {
            signals: [45],
            signalTexts: "자살위험아님",
            points : [12],
            rates: [75],
            comments: "약간 심한 수준의 우울감을 자주 느낌",
            requirements: "추가 평가 또는 전문가의 도움이 필요함",
            requirementTexts: "전문도움필요",
            changesByYear: [12],
            commentDetails: "검사 결과는 심각한 수준의 적응 스트레스를 자주 느끼고 있습니다. 적응장애 진단은 병력 및 여러 검사 결과와 전문의의 종합적인 판단에 의해 이루어지므로, 추가 평가 또는 전문가의 도움이 필요합니다.",
        },
        PCPTSD5 : {
            signals: [45],
            signalTexts: "자살위험아님",
            points : [12],
            rates: [75],
            comments: "약간 심한 수준의 우울감을 자주 느낌",
            requirements: "추가 평가 또는 전문가의 도움이 필요함",
            requirementTexts: "전문도움필요",
            changesByYear: [12],
            commentDetails: "검사 결과는 심각한 수준의 적응 스트레스를 자주 느끼고 있습니다. PTSD 진단은 병력 및 여러 검사 결과와 전문의의 종합적인 판단에 의해 이루어지므로, 추가 평가 또는 전문가의 도움이 필요합니다.",
        },
        ISI : {
            signals: [45],
            signalTexts: "자살위험아님",
            points : [12],
            rates: [75],
            comments: "약간 심한 수준의 우울감을 자주 느낌",
            requirements: "추가 평가 또는 전문가의 도움이 필요함",
            requirementTexts: "전문도움필요",
            changesByYear: [12],
            commentDetails: "검사 결과는 경미한 수준의 불면증을 자주 느끼고 있습니다. 2주 이상 지속 시 전문가의 도움이 필요합니다. 불면증 진단은 병력 및 여러 검사 결과와 전문의의 종합적인 판단에 의해 이루어지므로, 추가 평가 또는 전문가의 도움이 필요합니다.",
        },
        CSS : {
            signals: [45],
            signalTexts: "자살위험아님",
            points : [12],
            rates: [75],
            comments: "약간 심한 수준의 우울감을 자주 느낌",
            requirements: "추가 평가 또는 전문가의 도움이 필요함",
            requirementTexts: "전문도움필요",
            commentDetails: "검사 결과는 자살사고 위험이 없습니다",
        },
    }
const data_1 =
    {
        "path-info": {
            "reservation-number": 1120112011, // 예약번호
            "center-code": 112, // 센터코드
            "exam-date": "1989-02-17"
        },
        "basic-info": {
            "user-name": "test-2",
        },
        "koss-sf" : {
            "signals": [87], // 24, 45, 66, 87
            "signal-texts": "약간 심함",
            "points" : [48.1],
            "rates" : ["상위 25"],
            "means" : [8],
            "compensation": [5.8, "하위 25"],
            "jobInstability": [6, "하위 50"],
            "requirements": [6, "하위 25"],
            "culture": [11.9, "하위 25"],
            "autonomy": [4, "하위 50"],
            "system": [10, "하위 50"],
            "relationship": [4.9, "하위 25"],
            "changes-by-year": [48.1],
            "comment-details": "스트레스 측정 점수는 39.5점으로, 참고치 하위 25%에 해당합니다.",
        },
        "phq-9" : {
            "signals": [24],
            "signal-texts": "자살위험아님",
            "points" : [6.2],
            "rates": [3],
            "comments": "약간 심한 수준의 우울감을 자주 느낌",
            "requirements": "추가 평가 또는 전문가의 도움이 필요함",
            "requirement-texts": "전문도움필요",
            "changes-by-year": [6.2],
            "comment-details": "검사 결과는 약간 심한 수준의 우울감을 자주 느끼고 있습니다. 우울증 진단은 병력 및 여러 검사 결과와 전문의의 종합적인 판단에 의해 이루어지므로, 추가 평가 또는 전문가의 도움이 필요합니다.",
        },
        "gad-7" : {
            "signals": [45],
            "signal-texts": "심각함",
            "points" : [10.3],
            "rates": [9],
            "comments": "주의가 필요한 과도한 걱정, 불안을 느낌",
            "requirements": "추가 평가 또는 전문가의 도움이 필요함",
            "requirement-texts": "전문도움필요",
            "changes-by-year": [10.3],
            "comment-details": "검사 결과는 중간 수준의 불안감을 자주 느끼고 있습니다. 불안장애 진단은 병력 및 여러 검사 결과와 전문의의 종합적인 판단에 의해 이루어지므로, 추가 평가 또는 전문가의 도움이 필요합니다.",
        },
        "adnm-4" : {
            "signals": [66],
            "signal-texts": "심각함",
            "points" : [8.4],
            "rates": [55.7],
            "comments": "일상 생활 적응에 어려움이 있을 수 있음",
            "requirements": "추가 평가 또는 전문가의 도움이 필요함",
            "requirement-texts": "전문도움필요",
            "changes-by-year": [8.4],
            "comment-details": "검사 결과는 심각한 수준의 적응 스트레스를 자주 느끼고 있습니다. 적응장애 진단은 병력 및 여러 검사 결과와 전문의의 종합적인 판단에 의해 이루어지므로, 추가 평가 또는 전문가의 도움이 필요합니다.",
        },
        "pc-ptsd-5" : {
            "signals": [87],
            "signal-texts": "중간",
            "points" : [3.5],
            "rates": [23.9],
            "comments": "일상 생활 적응에 어려움이 있을 수 있음",
            "requirements": "추가 평가 또는 전문가의 도움이 필요함",
            "requirement-texts": "전문도움필요",
            "changes-by-year": [3.5],
            "comment-details": "검사 결과는 심각한 수준의 적응 스트레스를 자주 느끼고 있습니다. PTSD 진단은 병력 및 여러 검사 결과와 전문의의 종합적인 판단에 의해 이루어지므로, 추가 평가 또는 전문가의 도움이 필요합니다.",
        },
        "isi" : {
            "signals": [24],
            "signal-texts": "정상",
            "points" : [18.6],
            "rates": [57],
            "comments": "경미한 불면증이 있는 것으로 보임",
            "requirements": "2주 이상 지속 시 전문가의 도움이 필요함",
            "requirement-texts": "전문도움필요",
            "changes-by-year": [18.6],
            "comment-details": "검사 결과는 경미한 수준의 불면증을 자주 느끼고 있습니다. 2주 이상 지속 시 전문가의 도움이 필요합니다. 불면증 진단은 병력 및 여러 검사 결과와 전문의의 종합적인 판단에 의해 이루어지므로, 추가 평가 또는 전문가의 도움이 필요합니다.",
        },
        "css" : {
            "signals": [45],
            "signal-texts": "정상",
            "points" : [8.8],
            "rates": [87],
            "comments": "위험한 수준의 자살 사고가 보이지 않음",
            "requirements": "상담필요",
            "requirement-texts": "전문도움필요",
            "comment-details": "검사 결과는 자살사고 위험이 없습니다",
        },
    }

const data_2 =
    {
        "path_info": {
            "reservation-number": 1130113011, // 예약번호
            "center-code": 113, // 센터코드
            "exam-date": "1989-02-17"
        },
        "basic-info": {
            "user-name": "test-3",
        },
        "koss-sf" : {
            "signals": [66], // 24, 45, 66, 87
            "signal-texts": "약간 심함",
            "points" : [72],
            "rates" : ["상위 25"],
            "means" : [24.9],
            "compensation": [9, "하위 25"],
            "jobInstability": [7.8, "하위 50"],
            "requirements": [14, "하위 25"],
            "culture": [10, "하위 25"],
            "autonomy": [6.1, "하위 50"],
            "system": [11.9, "하위 50"],
            "relationship": [6, "하위 25"],
            "changes-by-year": [72],
            "comment-details": "스트레스 측정 점수는 39.5점으로, 참고치 하위 25%에 해당합니다.",
        },
        "phq-9" : {
            "signals": [87],
            "signal-texts": "자살위험아님",
            "points" : [24.1],
            "rates": [21.9],
            "comments": "약간 심한 수준의 우울감을 자주 느낌",
            "requirements": "추가 평가 또는 전문가의 도움이 필요함",
            "requirement-texts": "전문도움필요",
            "changes-by-year": [24.1],
            "comment-details": "검사 결과는 약간 심한 수준의 우울감을 자주 느끼고 있습니다. 우울증 진단은 병력 및 여러 검사 결과와 전문의의 종합적인 판단에 의해 이루어지므로, 추가 평가 또는 전문가의 도움이 필요합니다.",
        },
        "gad-7" : {
            "signals": [24],
            "signal-texts": "심각함",
            "points" : [15],
            "rates": [32],
            "comments": "주의가 필요한 과도한 걱정, 불안을 느낌",
            "requirements": "추가 평가 또는 전문가의 도움이 필요함",
            "requirement-texts": "전문도움필요",
            "changes-by-year": [15],
            "comment-details": "검사 결과는 중간 수준의 불안감을 자주 느끼고 있습니다. 불안장애 진단은 병력 및 여러 검사 결과와 전문의의 종합적인 판단에 의해 이루어지므로, 추가 평가 또는 전문가의 도움이 필요합니다.",
        },
        "adnm-4" : {
            "signals": [45],
            "signal-texts": "심각함",
            "points" : [4.3],
            "rates": [66.6],
            "comments": "일상 생활 적응에 어려움이 있을 수 있음",
            "requirements": "추가 평가 또는 전문가의 도움이 필요함",
            "requirement-texts": "전문도움필요",
            "changes-by-year": [4.3],
            "comment-details": "검사 결과는 심각한 수준의 적응 스트레스를 자주 느끼고 있습니다. 적응장애 진단은 병력 및 여러 검사 결과와 전문의의 종합적인 판단에 의해 이루어지므로, 추가 평가 또는 전문가의 도움이 필요합니다.",
        },
        "pc-ptsd-5" : {
            "signals": [66],
            "signal-texts": "중간",
            "points" : [2],
            "rates": [39],
            "comments": "일상 생활 적응에 어려움이 있을 수 있음",
            "requirements": "추가 평가 또는 전문가의 도움이 필요함",
            "requirement-texts": "전문도움필요",
            "changes-by-year": [2],
            "comment-details": "검사 결과는 심각한 수준의 적응 스트레스를 자주 느끼고 있습니다. PTSD 진단은 병력 및 여러 검사 결과와 전문의의 종합적인 판단에 의해 이루어지므로, 추가 평가 또는 전문가의 도움이 필요합니다.",
        },
        "isi" : {
            "signals": [87],
            "signal-texts": "정상",
            "points" : [24.3],
            "rates": [76.9],
            "comments": "경미한 불면증이 있는 것으로 보임",
            "requirements": "2주 이상 지속 시 전문가의 도움이 필요함",
            "requirement-texts": "전문도움필요",
            "changes-by-year": [24.3],
            "comment-details": "검사 결과는 경미한 수준의 불면증을 자주 느끼고 있습니다. 2주 이상 지속 시 전문가의 도움이 필요합니다. 불면증 진단은 병력 및 여러 검사 결과와 전문의의 종합적인 판단에 의해 이루어지므로, 추가 평가 또는 전문가의 도움이 필요합니다.",
        },
        "css" : {
            "signals": [24],
            "signal-texts": "정상",
            "points" : [9.1],
            "rates": [92.2],
            "comments": "위험한 수준의 자살 사고가 보이지 않음",
            "requirements": "상담필요",
            "requirement-texts": "전문도움필요",
            "comment-details": "검사 결과는 자살사고 위험이 없습니다",
        },
    }
const data_3 =
    {
        "path-info": {
            "reservation-number": 2110211021, // 예약번호
            "center-code": 211, // 센터코드
            "exam-date": "1989-02-17"
        },
        "basic-info": {
            "user-name": "test-4",
        },
        "koss-sf" : {
            "signals": [45], // 24, 45, 66, 87
            "signal-texts": "약간 심함",
            "points" : [96.9],
            "rates" : ["상위 25"],
            "means" : [88],
            "compensation": [14.4, "하위 25"],
            "jobInstability": [4, "하위 50"],
            "requirements": [8, "하위 25"],
            "culture": [8.2, "하위 25"],
            "autonomy": [7, "하위 50"],
            "system": [12, "하위 50"],
            "relationship": [7.8, "하위 25"],
            "changes-by-year": [96.9],
            "comment-details": "스트레스 측정 점수는 39.5점으로, 참고치 하위 25%에 해당합니다.",
        },
        "phq-9" : {
            "signals": [66],
            "signal-texts": "자살위험아님",
            "points" : [18],
            "rates": [67],
            "comments": "약간 심한 수준의 우울감을 자주 느낌",
            "requirements": "추가 평가 또는 전문가의 도움이 필요함",
            "requirement-texts": "전문도움필요",
            "changes-by-year": [18],
            "comment-details": "검사 결과는 약간 심한 수준의 우울감을 자주 느끼고 있습니다. 우울증 진단은 병력 및 여러 검사 결과와 전문의의 종합적인 판단에 의해 이루어지므로, 추가 평가 또는 전문가의 도움이 필요합니다.",
        },
        "gad-7" : {
            "signals": [87],
            "signal-texts": "심각함",
            "points" : [20.8],
            "rates": [33.3],
            "comments": "주의가 필요한 과도한 걱정, 불안을 느낌",
            "requirements": "추가 평가 또는 전문가의 도움이 필요함",
            "requirement-texts": "전문도움필요",
            "changes-by-year": [20.8],
            "comment-details": "검사 결과는 중간 수준의 불안감을 자주 느끼고 있습니다. 불안장애 진단은 병력 및 여러 검사 결과와 전문의의 종합적인 판단에 의해 이루어지므로, 추가 평가 또는 전문가의 도움이 필요합니다.",
        },
        "adnm-4" : {
            "signals": [24],
            "signal-texts": "심각함",
            "points" : [16],
            "rates": [8],
            "comments": "일상 생활 적응에 어려움이 있을 수 있음",
            "requirements": "추가 평가 또는 전문가의 도움이 필요함",
            "requirement-texts": "전문도움필요",
            "changes-by-year": [16],
            "comment-details": "검사 결과는 심각한 수준의 적응 스트레스를 자주 느끼고 있습니다. 적응장애 진단은 병력 및 여러 검사 결과와 전문의의 종합적인 판단에 의해 이루어지므로, 추가 평가 또는 전문가의 도움이 필요합니다.",
        },
        "pc-ptsd-5" : {
            "signals": [45],
            "signal-texts": "중간",
            "points" : [1.8],
            "rates": [34.9],
            "comments": "일상 생활 적응에 어려움이 있을 수 있음",
            "requirements": "추가 평가 또는 전문가의 도움이 필요함",
            "requirement-texts": "전문도움필요",
            "changes-by-year": [1.8],
            "comment-details": "검사 결과는 심각한 수준의 적응 스트레스를 자주 느끼고 있습니다. PTSD 진단은 병력 및 여러 검사 결과와 전문의의 종합적인 판단에 의해 이루어지므로, 추가 평가 또는 전문가의 도움이 필요합니다.",
        },
        "isi" : {
            "signals": [66],
            "signal-texts": "정상",
            "points" : [6],
            "rates": [98],
            "comments": "경미한 불면증이 있는 것으로 보임",
            "requirements": "2주 이상 지속 시 전문가의 도움이 필요함",
            "requirement-texts": "전문도움필요",
            "changes-by-year": [6],
            "comment-details": "검사 결과는 경미한 수준의 불면증을 자주 느끼고 있습니다. 2주 이상 지속 시 전문가의 도움이 필요합니다. 불면증 진단은 병력 및 여러 검사 결과와 전문의의 종합적인 판단에 의해 이루어지므로, 추가 평가 또는 전문가의 도움이 필요합니다.",
        },
        "css" : {
            "signals": [87],
            "signal-texts": "정상",
            "points" : [1],
            "rates": [44.4],
            "comments": "위험한 수준의 자살 사고가 보이지 않음",
            "requirements": "상담필요",
            "requirement-texts": "전문도움필요",
            "comment-details": "검사 결과는 자살사고 위험이 없습니다",
        },
    }
const data_4 =
    {
        "path-info": {
            "reservation-number": 6110611061, // 예약번호
            "center-code": 611, // 센터코드
            "exam-date": "1989-02-17"
        },
        "basic-info": {
            "user-name": "test-5",
        },
        "koss-sf" : {
            "signals": [24], // 24, 45, 66, 87
            "signal-texts": "약간 심함",
            "points" : [24.4],
            "rates" : ["상위 25"],
            "means" : [8.8],
            "compensation": [12, "하위 25"],
            "jobInstability": [9.9, "하위 50"],
            "requirements": [14, "하위 25"],
            "culture": [6, "하위 25"],
            "autonomy": [8.8, "하위 50"],
            "system": [14.9, "하위 50"],
            "relationship": [9, "하위 25"],
            "changes-by-year": [24.4],
            "comment-details": "스트레스 측정 점수는 39.5점으로, 참고치 하위 25%에 해당합니다.",
        },
        "phq-9" : {
            "signals": [45],
            "signal-texts": "자살위험아님",
            "points" : [12],
            "rates": [1],
            "comments": "약간 심한 수준의 우울감을 자주 느낌",
            "requirements": "추가 평가 또는 전문가의 도움이 필요함",
            "requirement-texts": "전문도움필요",
            "changes-by-year": [12],
            "comment-details": "검사 결과는 약간 심한 수준의 우울감을 자주 느끼고 있습니다. 우울증 진단은 병력 및 여러 검사 결과와 전문의의 종합적인 판단에 의해 이루어지므로, 추가 평가 또는 전문가의 도움이 필요합니다.",
        },
        "gad-7" : {
            "signals": [66],
            "signal-texts": "심각함",
            "points" : [5.5],
            "rates": [65],
            "comments": "주의가 필요한 과도한 걱정, 불안을 느낌",
            "requirements": "추가 평가 또는 전문가의 도움이 필요함",
            "requirement-texts": "전문도움필요",
            "changes-by-year": [5.5],
            "comment-details": "검사 결과는 중간 수준의 불안감을 자주 느끼고 있습니다. 불안장애 진단은 병력 및 여러 검사 결과와 전문의의 종합적인 판단에 의해 이루어지므로, 추가 평가 또는 전문가의 도움이 필요합니다.",
        },
        "adnm-4" : {
            "signals": [87],
            "signal-texts": "심각함",
            "points" : [12],
            "rates": [1.1],
            "comments": "일상 생활 적응에 어려움이 있을 수 있음",
            "requirements": "추가 평가 또는 전문가의 도움이 필요함",
            "requirement-texts": "전문도움필요",
            "changes-by-year": [12],
            "comment-details": "검사 결과는 심각한 수준의 적응 스트레스를 자주 느끼고 있습니다. 적응장애 진단은 병력 및 여러 검사 결과와 전문의의 종합적인 판단에 의해 이루어지므로, 추가 평가 또는 전문가의 도움이 필요합니다.",
        },
        "pc-ptsd-5" : {
            "signals": [24],
            "signal-texts": "중간",
            "points" : [4.9],
            "rates": [41],
            "comments": "일상 생활 적응에 어려움이 있을 수 있음",
            "requirements": "추가 평가 또는 전문가의 도움이 필요함",
            "requirement-texts": "전문도움필요",
            "changes-by-year": [4.9],
            "comment-details": "검사 결과는 심각한 수준의 적응 스트레스를 자주 느끼고 있습니다. PTSD 진단은 병력 및 여러 검사 결과와 전문의의 종합적인 판단에 의해 이루어지므로, 추가 평가 또는 전문가의 도움이 필요합니다.",
        },
        "isi" : {
            "signals": [45],
            "signal-texts": "정상",
            "points" : [12],
            "rates": [8.5],
            "comments": "경미한 불면증이 있는 것으로 보임",
            "requirements": "2주 이상 지속 시 전문가의 도움이 필요함",
            "requirement-texts": "전문도움필요",
            "changes-by-year": [12],
            "comment-details": "검사 결과는 경미한 수준의 불면증을 자주 느끼고 있습니다. 2주 이상 지속 시 전문가의 도움이 필요합니다. 불면증 진단은 병력 및 여러 검사 결과와 전문의의 종합적인 판단에 의해 이루어지므로, 추가 평가 또는 전문가의 도움이 필요합니다.",
        },
        "css" : {
            "signals": [66],
            "signal-texts": "정상",
            "points" : [1.1],
            "rates": [22],
            "comments": "위험한 수준의 자살 사고가 보이지 않음",
            "requirements": "상담필요",
            "requirement-texts": "전문도움필요",
            "comment-details": "검사 결과는 자살사고 위험이 없습니다",
        },
    }
const data_5 =
    {
        "path-info": {
            "reservation-number": 6120612061, // 예약번호
            "center-code": 612, // 센터코드
            "exam-date": "1989-02-17"
        },
        "basic-info": {
            "user-name": "test-6",
        },
        "koss-sf" : {
            "signals": [87], // 24, 45, 66, 87
            "signal-texts": "약간 심함",
            "points" : [48.8],
            "rates" : ["상위 25"],
            "means" : [54.8],
            "compensation": [8.8, "하위 25"],
            "jobInstability": [2, "하위 50"],
            "requirements": [10, "하위 25"],
            "culture": [4.4, "하위 25"],
            "autonomy": [10, "하위 50"],
            "system": [16, "하위 50"],
            "relationship": [10.1, "하위 25"],
            "changes-by-year": [48.8],
            "comment-details": "스트레스 측정 점수는 39.5점으로, 참고치 하위 25%에 해당합니다.",
        },
        "phq-9" : {
            "signals": [24],
            "signal-texts": "자살위험아님",
            "points" : [6],
            "rates": [75],
            "comments": "약간 심한 수준의 우울감을 자주 느낌",
            "requirements": "추가 평가 또는 전문가의 도움이 필요함",
            "requirement-texts": "전문도움필요",
            "changes-by-year": [6],
            "comment-details": "검사 결과는 약간 심한 수준의 우울감을 자주 느끼고 있습니다. 우울증 진단은 병력 및 여러 검사 결과와 전문의의 종합적인 판단에 의해 이루어지므로, 추가 평가 또는 전문가의 도움이 필요합니다.",
        },
        "gad-7" : {
            "signals": [45],
            "signal-texts": "심각함",
            "points" : [10.1],
            "rates": [5.1],
            "comments": "주의가 필요한 과도한 걱정, 불안을 느낌",
            "requirements": "추가 평가 또는 전문가의 도움이 필요함",
            "requirement-texts": "전문도움필요",
            "changes-by-year": [10.1],
            "comment-details": "검사 결과는 중간 수준의 불안감을 자주 느끼고 있습니다. 불안장애 진단은 병력 및 여러 검사 결과와 전문의의 종합적인 판단에 의해 이루어지므로, 추가 평가 또는 전문가의 도움이 필요합니다.",
        },
        "adnm-4" : {
            "signals": [66],
            "signal-texts": "심각함",
            "points" : [8],
            "rates": [81.1],
            "comments": "일상 생활 적응에 어려움이 있을 수 있음",
            "requirements": "추가 평가 또는 전문가의 도움이 필요함",
            "requirement-texts": "전문도움필요",
            "changes-by-year": [8],
            "comment-details": "검사 결과는 심각한 수준의 적응 스트레스를 자주 느끼고 있습니다. 적응장애 진단은 병력 및 여러 검사 결과와 전문의의 종합적인 판단에 의해 이루어지므로, 추가 평가 또는 전문가의 도움이 필요합니다.",
        },
        "pc-ptsd-5" : {
            "signals": [87],
            "signal-texts": "중간",
            "points" : [3.3],
            "rates": [41],
            "comments": "일상 생활 적응에 어려움이 있을 수 있음",
            "requirements": "추가 평가 또는 전문가의 도움이 필요함",
            "requirement-texts": "전문도움필요",
            "changes-by-year": [3.3],
            "comment-details": "검사 결과는 심각한 수준의 적응 스트레스를 자주 느끼고 있습니다. PTSD 진단은 병력 및 여러 검사 결과와 전문의의 종합적인 판단에 의해 이루어지므로, 추가 평가 또는 전문가의 도움이 필요합니다.",
        },
        "isi" : {
            "signals": [24],
            "signal-texts": "정상",
            "points" : [18],
            "rates": [28.5],
            "comments": "경미한 불면증이 있는 것으로 보임",
            "requirements": "2주 이상 지속 시 전문가의 도움이 필요함",
            "requirement-texts": "전문도움필요",
            "changes-by-year": [18],
            "comment-details": "검사 결과는 경미한 수준의 불면증을 자주 느끼고 있습니다. 2주 이상 지속 시 전문가의 도움이 필요합니다. 불면증 진단은 병력 및 여러 검사 결과와 전문의의 종합적인 판단에 의해 이루어지므로, 추가 평가 또는 전문가의 도움이 필요합니다.",
        },
        "css" : {
            "signals": [45],
            "signal-texts": "정상",
            "points" : [11.1],
            "rates": [13],
            "comments": "위험한 수준의 자살 사고가 보이지 않음",
            "requirements": "상담필요",
            "requirement-texts": "전문도움필요",
            "comment-details": "검사 결과는 자살사고 위험이 없습니다",
        },
    }
const data_6 =
    {
        "path-info": {
            "reservation-number": 7110711071, // 예약번호
            "center-code": 711, // 센터코드
            "exam-date": "1989-02-17"
        },
        "basic-info": {
            "user-name": "null-test",
        },
        "koss-sf" : {
            "signals": null,
            "signal-texts": "",
            "points" : null,
            "rates" : null,
            "means" : null,
            "surroundings": null,
            "instability": null,
            "demands": null,
            "culture": null,
            "autonomy": null,
            "system": null,
            "conflict": null,
            "changes-by-year": null,
            "comment-details": "",
        },
        "phq-9" : {
            "signals": null,
            "signal-texts": "",
            "points" : null,
            "rates": null,
            "comments": "",
            "requirements": "",
            "requirement-texts": "",
            "changes-by-year": null,
            "comment-details": "",
        },
        "gad-7" : {
            "signals": null,
            "signal-texts": "",
            "points" : null,
            "rates": null,
            "comments": "",
            "requirements": "",
            "requirement-texts": "",
            "changes-by-year": null,
            "comment-details": "",
        },
        "adnm-4" : {
            "signals": null,
            "signal-texts": "",
            "points" : null,
            "rates": null,
            "comments": "",
            "requirements": "",
            "requirement-texts": "",
            "changes-by-year": null,
            "comment-details": "",
        },
        "pc-ptsd-5" : {
            "signals": null,
            "signal-texts": "",
            "points" : null,
            "rates": null,
            "comments": "",
            "requirements": "",
            "requirement-texts": "",
            "changes-by-year": null,
            "comment-details": "",
        },
        "isi" : {
            "signals": null,
            "signal-texts": "",
            "points" : null,
            "rates": null,
            "comments": "",
            "requirements": "",
            "requirement-texts": "",
            "changes-by-year": null,
            "comment-details": "",
        },
        "css" : {
            "signals": null,
            "signal-texts": "",
            "points" : null,
            "rates": null,
            "comments": "",
            "requirements": "",
            "requirement-texts": "",
            "comment-details": "",
        },
    }


const data = [
    data_0, data_1, data_2, data_3, data_4, data_5, data_6,
]


// Step 1: create connection
amqp.connect('amqp://localhost', (connectionError, connection) => { // library가 js인 경우의 타입... how?
    if(connectionError) {
        throw connectionError;
    }
    // Step 2: create channel
    connection.createChannel((channelError, channel) => { // library가 js인 경우의 타입... how?
        if(channelError) {
            throw channelError;
        }
        // Step 3: assert queue
        const queueName = config.get('QUEUE_NAME')
        channel.assertQueue(queueName, {
            durable: false
        });
        // Step 4: send message to queue
        // for (let i = 0; i < 7; i++) {
        //     const message = JSON.stringify(data[i])
        //     channel.sendToQueue(queueName, Buffer.from(message), {
        //         persistent: true
        //     });
        //     console.log(`[x] Sent data_${i} successfully.`)
        // }
        const message = JSON.stringify(data_0)
        channel.sendToQueue(queueName, Buffer.from(message), {
            persistent: true
        });
        console.log(`[x] Sent data successfully.`)
    })
    setTimeout(() => {
        connection.close();
        process.exit(0)
    }, 1000)
})
