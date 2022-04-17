const testData = require('./tessData.json') as Array<any>

{
    const centerCode =  [111, 112, 113, 211, 611, 612, 711];

    const newTessData = testData.map((value, index: number) => {
        // 이게 먹힌다. 즉, type Data에만 맞으면, 정상적으로 들어간다는 것.
        // return { ...value }

        return {
            "info" : {
                "name": `test ${index+101}`,
                "reservationNumber": `${index+1000000001}`,
                "centerCode": centerCode[Math.floor(Math.random() * centerCode.length)],
                "examDate": `${new Date(value.date).getFullYear()}-${("0" + (new Date(value.date).getMonth()+1)).slice(-2)}-${new Date(value.date).getDate()}`,
                "reportDate": `${new Date().getFullYear()}-${("0" + (new Date().getMonth()+1)).slice(-2)}-${new Date().getDate()}`,
            },

            // 1. KOSS 와 CSS 는 없을 수도 있다는 점. 이걸 어떻게 표현할 것인지..!
                // 지금처럼 처리하면, null이 아닐 때 데이터가 2번 표시되는 문제가 음..
            // 2. mapping을 어떤 식으로 해결할 것인지에 대한...
                // 그대로 받아오면, 바뀌어야할 것은
                //  1. level 0 ~ 4 => 24 ~ 87
                //  2. advice  0 ~ 2 => "" "주의필요" "전문도움필요"
                //  3.
                // 그대로 받아오면, 추가해야 할 것은
                //  1. level에 따른 result 추가 -> 사실상 증상마다 다른데.. -> 정확한 계산은 아니고, 1:1 대응해서 넣어야겠음 일단. -> 1 2 3 4
                //  2. byYear는 score 그대로 넣어라
                //  3. details는 음.. 어떻게 해야하지? treatment에 따라 들어가나? v1에서 지금 details 제공하고 있나?

            "KOSS": value.assessment.KOSS == undefined ?
                    {
                        "autonomy": {"distribution": "", "score": null},
                        "compensation": {"distribution": "", "score": null},
                        "culture": {"distribution": "", "score": null},
                        "jobInstability": {"distribution": "", "score": null},
                        "relationship": {"distribution": "", "score": null},
                        "requirements": {"distribution": "", "score": null},
                        "system": {"distribution": "", "score": null},
                        "total": {
                            "distribution": "",
                            "score": null,
                            "level": null,
                            "result": "",
                            "byYear": null,
                            "details": ""
                        }
                    }
                    : {},
                    // {
                    //     "autonomy": {"distribution": "고정 25%", "score": value.assessment.KOSS.autonomy.score},
                    //     "compensation": {"distribution": "고정 25%", "score": value.assessment.KOSS.compensation.score},
                    //     "culture": {"distribution": "고정 25%", "score": value.assessment.KOSS.culture.score},
                    //     "jobInstability": {"distribution": "고정 25%", "score": value.assessment.KOSS.jobInstability.score},
                    //     "relationship": {"distribution": "고정 25%", "score": value.assessment.KOSS.relationship.score},
                    //     "requirements": {"distribution": "고정 25%", "score": value.assessment.KOSS.requirements.score},
                    //     "system": {"distribution": "고정 25%", "score": value.assessment.KOSS.system.score},
                    //     "total": {
                    //         "distribution" : "고정 25%",
                    //         "score": value.assessment.KOSS.total.score,
                    //         "level": 24,
                    //         "result": "고정 정상",
                    //         "byYear": value.assessment.KOSS.total.score,
                    //         "details": `스트레스 측정 점수는 ${value.assessment.KOSS.total.score}점으로 참고치 고정 25%에 해당합니다.`,
                    //     }
                    // },
            "CSS" : value.assessment.CSS == undefined ?
                {
                    "result": "",
                    "description": "",
                    "guidance": "",
                    "advice": "",
                    "details": "",
                }
                :
                {},

            // "PHQ9" : {
            //     "level": number,
            //     "result": string,
            //     "score" : number,
            //     "riskRate": number,
            //     "description": string,
            //     "guidance": string,
            //     "advice": string,
            //     "byYear": number,
            //     "details": string,
            // },
            // "GAD7" : {
            //     "level": number,
            //     "result": string,
            //     "score" : number,
            //     "riskRate": number,
            //     "description": string,
            //     "guidance": string,
            //     "advice": string,
            //     "byYear": number,
            //     "details": string,
            // },
            // "ADNM4" : {
            //     "level": number,
            //     "result": string,
            //     "score" : number,
            //     "riskRate": number,
            //     "description": string,
            //     "guidance": string,
            //     "advice": string,
            //     "byYear": number,
            //     "details": string,    },
            // "PCPTSD5" : {
            //     "level": number,
            //     "result": string,
            //     "score" : number,
            //     "riskRate": number,
            //     "description": string,
            //     "guidance": string,
            //     "advice": string,
            //     "byYear": number,
            //     "details": string,    },
            // "ISI" : {
            //     "level": number,
            //     "result": string,
            //     "score" : number,
            //     "riskRate": number,
            //     "description": string,
            //     "guidance": string,
            //     "advice": string,
            //     "byYear": number,
            //     "details": string,    },


            ...value

            // 이제 할 일은, row data를 최대한 정리하고.
            // 바꿀 것을 바꿔가면서 받아들이는 것. 그게 point.
        }
    })

    console.log(typeof newTessData[0].KOSS.total)
    console.log(typeof newTessData[1].KOSS.total)


}
