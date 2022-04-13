import {ChartJSNodeCanvas} from 'chartjs-node-canvas';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import fs from "fs";
import labelmake from "labelmake";
import templates from "./template/template.json";
import {fromPath} from "pdf2pic";
import makeDir from "make-dir";
import config from "config";
import {EventEmitter} from "events";
import {ChartType, ChartConfiguration, ChartData} from "chart.js";
import {Template} from "labelmake/dist/types/type";

// fromPath.bulk(-1) forks page numbers of gm process which is 11
// set max emitter to 20 to avoid leak
EventEmitter.defaultMaxListeners = 20;

// 한글처리
const NanumGothic = fs.readFileSync("./template/NanumGothic-Regular.ttf");
const font = {
    NanumGothic: {
        data: NanumGothic,
        subset: false
    }
};
// ByYear label
const labelsByYear = [new Date().getFullYear()];

type Data = {
    "info": {
        "name": string,
        "reservationNumber": number,
        "centerCode": number,
        "examDate": string,
        "reportDate": string,
    },
    "KOSS": {
        "autonomy": {"distribution": string, "score": number},
        "compensation": {"distribution": string, "score": number},
        "culture": {"distribution": string, "score": number},
        "jobInstability": {"distribution": string, "score": number},
        "relationship": {"distribution": string, "score": number},
        "requirements": {"distribution": string, "score": number},
        "system": {"distribution": string, "score": number},
        "total": {
            "distribution" : string,
            "score" : number,
            "scoreMean" : number,
            "level": number,
            "result": string,
            "byYear": number,
            "details": string,
        }
    },
    "PHQ9" : {
        "level": number,
        "result": string,
        "score" : number,
        "riskRate": number,
        "description": string,
        "guidance": string,
        "advice": string,
        "byYear": number,
        "details": string,
    },
    "GAD7" : {
        "level": number,
        "result": string,
        "score" : number,
        "riskRate": number,
        "description": string,
        "guidance": string,
        "advice": string,
        "byYear": number,
        "details": string,
    },
    "ADNM4" : {
        "level": number,
        "result": string,
        "score" : number,
        "riskRate": number,
        "description": string,
        "guidance": string,
        "advice": string,
        "byYear": number,
        "details": string,    },
    "PCPTSD5" : {
        "level": number,
        "result": string,
        "score" : number,
        "riskRate": number,
        "description": string,
        "guidance": string,
        "advice": string,
        "byYear": number,
        "details": string,    },
    "ISI" : {
        "level": number,
        "result": string,
        "score" : number,
        "riskRate": number,
        "description": string,
        "guidance": string,
        "advice": string,
        "byYear": number,
        "details": string,    },
    "CSS" : {
        "result": string,
        "description": string,
        "guidance": string,
        "advice": string,
        "details": string,
    },
}
class ScalesDefault {
    constructor(max: number) {
        this.x.max = max;
    };
    x = {
        grid: {
            drawBorder: false,
            display: false
        },
        ticks: {
            display: false,
        },
        min: 0,
        max: 0,
    };
    y = {
        grid: {
            drawBorder: false,
            display: false,
        },
        ticks: {
            display: false,
        }
    };
};
class ScalesByYear { // ScalsDefault class를 extend할 순 없을까..?
    constructor(max: number) {
        this.y.max = max;
    };
    x = {
        grid: {
            display: false,
            drawBorder: false,
        },
        ticks: {
            font: {
                size: 10,
                lineHeight: 0.1,
                weight: "bold",
            },
        },
    };
    y = {
        grid: {
            drawBorder: false,
            color: 'white',
        },
        ticks: {
            display: false,
        },
        min: 0,
        max: 0,
    };
};
class ConfigSignals implements ChartConfiguration {
    constructor(private input: number) { };
    type = 'bar' as ChartType;
    data = {
        labels: ['a'],
        datasets: [
            {
                data: [this.input],
                barPercentage: 0.0,
            }
        ]
    } as ChartData;
    plugins = [ChartDataLabels];
    options = {
        indexAxis: 'y',
        scales: new ScalesDefault(100),
        plugins: {
            datalabels: {
                color: [ // 여기가 또 겹치는데 음..
                    this.input == 24 ? '#1C99AE'
                        : this.input == 45 ? '#E5A614'
                            : this.input == 66 ? '#DE301E'
                                : this.input == 87 ? '#75161A' : ''],
                backgroundColor: [
                    this.input == 24 ? '#1C99AE'
                        : this.input == 45 ? '#E5A614'
                            : this.input == 66 ? '#DE301E'
                                : this.input == 87 ? '#75161A' : ''],
                anchor: 'end',
                align: 'center',
                borderWidth: 37,
                borderRadius: 50,
                font: {
                    size: 2,
                    weight: 'bold'
                },
            },
            legend: {
                display: false
            },
        },
    } as any;
};
class ConfigPoints implements ChartConfiguration {
    constructor(private input: {"distribution": string, "score": number}) { };
    type = 'bar' as ChartType;
    data = {
        labels: ['a'],
        datasets: [
            {
                data: [this.input.score],
                barPercentage: 0.0,
            }
        ]
    } as ChartData;
    plugins = [ChartDataLabels];
    options = {
        indexAxis: 'y',
        scales: new ScalesDefault(104),
        plugins: {
            datalabels: {
                color: ['#FF0000'],
                backgroundColor: ['#FF0000'],
                anchor: 'end',
                align: 'center',
                borderWidth: this.input.score == 0 ? '' : 15,
                borderRadius: 50,
                font: {
                    size: 1,
                    weight: 'bold'
                },
            },
            legend: {
                display: false
            }
        }
    } as any;
};
class ConfigRateBar implements ChartConfiguration {
    constructor(private input: number) { };
    private changeColour(): Array<string> {
        return [
            this.input == 0 ? '' : '#A6D7C3'
        ]
    };
    type = 'bar' as ChartType;
    data = {
        labels: ['a'],
        datasets: [
            {
                data: [this.input],
                barPercentage: 100,
                backgroundColor: this.changeColour()
            }
        ]
    } as ChartData;
    options = {
        indexAxis: 'y',
        scales: new ScalesDefault(100),
        plugins: {
            legend: {
                display: false
            }
        }
    } as any;
};
class ConfigByYear implements ChartConfiguration {
    constructor(private input: number, scales: ScalesByYear) {
        this.options.scales = scales;
    };
    type = 'bar' as ChartType;
    data = {
        labels: this.input == -1 ? '' : labelsByYear,
        datasets: [
            {
                data: [this.input],
                barPercentage: 0.1,
                backgroundColor: ['#020715'],
            }
        ]
    } as ChartData;
    options = {
        scales: new ScalesByYear(1),
        plugins: {
            legend: {
                display: false
            }
        }
    } as any;
};

async function saveMessage(message: any): Promise<Data> {
    const data = JSON.parse(message)

    const centerCode = data.info.centerCode;
    const examDate = data.info.examDate.replace(/-/g, "");
    const reservationNumber = data.info.reservationNumber;

    const pdfPath = await makeDir(config.get('PDF_PATH_LOCAL'));
    const fn = `${pdfPath}/${centerCode}_${examDate}_${reservationNumber}.json`;

    fs.writeFileSync(fn, message, 'utf-8');
    console.log(`Message saved: ${fn}`);

    return data;
}

// promise인 string들로 구성된 { } 를 type으로서 어떻게 정의할 수 있을까
// 나는  Promise<string[]> 로 생각했는데 아닌가봄
async function generateChart(data: Data) {
    // data 가져오자마자, 여기서 null 처리 필요한 것들 딱 처리하고 시작하면 편할텐데.
    // 그러면 generateChart, generatePdf 어디서건 걍 바로 쓸 수 있는 장점도 있고. 음.
    // data null check - 이거 그냥.. 호출하는 함수로 만들어둘까? 호출만하면 걍 만들어지게?

    // data가 들어오자마자, null이 있다면 치환해버려
    const dataSignalsKOSSSF = data.KOSS.total.level == null ? -1 : data.KOSS.total.level;
    const dataSignalsPHQ9 = data.PHQ9.level == null ? -1 : data.PHQ9.level;
    const dataSignalsGAD7 = data.GAD7.level == null ? -1 : data.GAD7.level;
    const dataSignalsADNM4 = data.ADNM4.level == null ? -1 : data.ADNM4.level;
    const dataSignalsPCPTSD5 = data.PCPTSD5.level == null ? -1 : data.PCPTSD5.level;
    const dataSignalsISI = data.ISI.level == null ? -1 : data.ISI.level;

    const dataByYearKOSSSF = data.KOSS.total.byYear == null ? -1 : data.KOSS.total.byYear;
    const dataByYearPHQ9 = data.PHQ9.byYear == null ? -1 : data.PHQ9.byYear;
    const dataByYearGAD7 = data.GAD7.byYear == null ? -1 : data.GAD7.byYear;
    const dataByYearADNM4 = data.ADNM4.byYear == null ? -1 : data.ADNM4.byYear;
    const dataByYearPCPTSD5 = data.PCPTSD5.byYear == null ? -1 : data.PCPTSD5.byYear;
    const dataByYearISI = data.ISI.byYear == null ? -1 : data.ISI.byYear;

    const dataRatesKOSSSF = data.KOSS.total.distribution == "" ? 0 : data.KOSS.total.distribution;
    const dataRatesPHQ9 = data.PHQ9.riskRate == null ? 0 : data.PHQ9.riskRate;
    const dataRatesGAD7 = data.GAD7.riskRate == null ? 0 : data.GAD7.riskRate;
    const dataRatesADNM4 = data.ADNM4.riskRate == null ? 0 : data.ADNM4.riskRate;
    const dataRatesPCPTSD5 = data.PCPTSD5.riskRate == null ? 0 : data.PCPTSD5.riskRate;
    const dataRatesISI = data.ISI.riskRate == null ? 0 : data.ISI.riskRate;

    const dataKosssfCompensation = data.KOSS.compensation.score == null ? {"distribution": "0", "score": 0} : data.KOSS.compensation;
    const dataKosssfJobInstability = data.KOSS.jobInstability.score == null ? {"distribution": "0", "score": 0} : data.KOSS.jobInstability;
    const dataKosssfRequirements = data.KOSS.requirements.score == null ? {"distribution": "0", "score": 0} : data.KOSS.requirements;
    const dataKosssfCulture = data.KOSS.culture.score == null ? {"distribution": "0", "score": 0} : data.KOSS.culture;
    const dataKosssfAutonomy = data.KOSS.autonomy.score == null ? {"distribution": "0", "score": 0} : data.KOSS.autonomy;
    const dataKosssfSystem = data.KOSS.system.score == null ? {"distribution": "0", "score": 0} : data.KOSS.system;
    const dataKosssfRelationship = data.KOSS.relationship.score == null ? {"distribution": "0", "score": 0} : data.KOSS.relationship;

    const dataMeansKOSSSF = data.KOSS.total.scoreMean == null ? 0 : data.KOSS.total.scoreMean;
    const dataPointsKOSSSF = data.KOSS.total.score == null ? 0 : data.KOSS.total.score;
    const dataPointsPHQ9 = data.PHQ9.score == null ? 0 : data.PHQ9.score;
    const dataPointsGAD7 = data.GAD7.score == null ? 0 : data.GAD7.score;
    const dataPointsADNM4 = data.ADNM4.score == null ? 0 : data.ADNM4.score;
    const dataPointsPCPTSD5 = data.PCPTSD5.score == null ? 0 : data.PCPTSD5.score;
    const dataPointsISI = data.ISI.score == null ? 0 : data.ISI.score;

    // canvas
    const canvasSignals = new ChartJSNodeCanvas({width: 240, height: 60});
    const canvasRateBar = new ChartJSNodeCanvas({width: 480, height: 36});
    const canvasPoints = new ChartJSNodeCanvas({width: 240, height: 36});
    const canvasByYear = new ChartJSNodeCanvas({width: 240, height: 120});

    // config
    const configSignalsKOSSSF = new ConfigSignals(dataSignalsKOSSSF);
    const configSignalsPHQ9 = new ConfigSignals(dataSignalsPHQ9);
    const configSignalsGAD7 = new ConfigSignals(dataSignalsGAD7);
    const configSignalsADNM4 = new ConfigSignals(dataSignalsADNM4);
    const configSignalsPCPTSD5 = new ConfigSignals(dataSignalsPCPTSD5);
    const configSignalsISI = new ConfigSignals(dataSignalsISI);

    const configRateBarPHQ9 = new ConfigRateBar(dataRatesPHQ9);
    const configRateBarGAD7 = new ConfigRateBar(dataRatesGAD7);
    const configRateBarADNM4 = new ConfigRateBar(dataRatesADNM4);
    const configRateBarPCPTSD5 = new ConfigRateBar(dataRatesPCPTSD5);
    const configRateBarISI = new ConfigRateBar(dataRatesISI);

    const configPointsCompensation = new ConfigPoints(dataKosssfCompensation);
    const configPointsJobInstability = new ConfigPoints(dataKosssfJobInstability);
    const configPointsRequirements = new ConfigPoints(dataKosssfRequirements);
    const configPointsCulture = new ConfigPoints(dataKosssfCulture);
    const configPointsAutonomy = new ConfigPoints(dataKosssfAutonomy);
    const configPointsSystem = new ConfigPoints(dataKosssfSystem);
    const configPointsRelationship = new ConfigPoints(dataKosssfRelationship);

    const configByYearKOSSSF = new ConfigByYear(dataByYearKOSSSF, new ScalesByYear(96));
    const configByYearPHQ9 = new ConfigByYear(dataByYearPHQ9, new ScalesByYear(24));
    const configByYearGAD7 = new ConfigByYear(dataByYearGAD7, new ScalesByYear(20));
    const configByYearADNM4 = new ConfigByYear(dataByYearADNM4, new ScalesByYear(16));
    const configByYearPCPTSD5 = new ConfigByYear(dataByYearPCPTSD5, new ScalesByYear(4));
    const configByYearISI = new ConfigByYear(dataByYearISI, new ScalesByYear(24));


    // generate charts
    const chartSignalsKOSSSF = await canvasSignals.renderToDataURL(configSignalsKOSSSF);
    const chartSignalsPHQ9 = await canvasSignals.renderToDataURL(configSignalsPHQ9);
    const chartSignalsGAD7 = await canvasSignals.renderToDataURL(configSignalsGAD7);
    const chartSignalsADNM4 = await canvasSignals.renderToDataURL(configSignalsADNM4);
    const chartSignalsPCPTSD5 = await canvasSignals.renderToDataURL(configSignalsPCPTSD5);
    const chartSignalsISI = await canvasSignals.renderToDataURL(configSignalsISI);

    const chartRateBarPHQ9 = await canvasRateBar.renderToDataURL(configRateBarPHQ9);
    const chartRateBarGAD7 = await canvasRateBar.renderToDataURL(configRateBarGAD7);
    const chartRateBarADNM4 = await canvasRateBar.renderToDataURL(configRateBarADNM4);
    const chartRateBarPCPTSD5 = await canvasRateBar.renderToDataURL(configRateBarPCPTSD5);
    const chartRateBarISI = await canvasRateBar.renderToDataURL(configRateBarISI);

    const chartPointsCompensation = await canvasPoints.renderToDataURL(configPointsCompensation);
    const chartPointsJobInstability = await canvasPoints.renderToDataURL(configPointsJobInstability);
    const chartPointsRequirements = await canvasPoints.renderToDataURL(configPointsRequirements);
    const chartPointsCulture = await canvasPoints.renderToDataURL(configPointsCulture);
    const chartPointsAutonomy = await canvasPoints.renderToDataURL(configPointsAutonomy);
    const chartPointsSystem = await canvasPoints.renderToDataURL(configPointsSystem);
    const chartPointsRelationship = await canvasPoints.renderToDataURL(configPointsRelationship);

    const chartByYearKOSSSF = await canvasByYear.renderToDataURL(configByYearKOSSSF);
    const chartByYearPHQ9 = await canvasByYear.renderToDataURL(configByYearPHQ9);
    const chartByYearGAD7 = await canvasByYear.renderToDataURL(configByYearGAD7);
    const chartByYearADNM4 = await canvasByYear.renderToDataURL(configByYearADNM4);
    const chartByYearPCPTSD5 = await canvasByYear.renderToDataURL(configByYearPCPTSD5);
    const chartByYearISI = await canvasByYear.renderToDataURL(configByYearISI);

    // return - 어떻게 줄일 수 있을까 이걸?
    // 일단 변수명 조정부터 => 같으면 하나만 쓰면 되는 거 이용해서. 걍 바로 때린다.
    // 아래 이건.. 어떤 타입이라고 할 수 있을까? 만들어야할까? + 각각이 string으로 잡히는게 지금.. 맞는 것인가....
    // Promisd<string>[] 이거 같긴하다. promise들의 집합.
    return {
        chartSignalsKOSSSF,
        chartSignalsPHQ9, chartSignalsGAD7, chartSignalsADNM4, chartSignalsPCPTSD5, chartSignalsISI,
        chartRateBarPHQ9, chartRateBarGAD7, chartRateBarADNM4, chartRateBarPCPTSD5, chartRateBarISI,
        chartByYearKOSSSF,
        chartByYearPHQ9, chartByYearGAD7, chartByYearADNM4, chartByYearPCPTSD5, chartByYearISI,
        chartPointsCompensation, chartPointsJobInstability, chartPointsRequirements, chartPointsCulture, chartPointsAutonomy, chartPointsSystem, chartPointsRelationship,
    };
};

// generateChart 함수의 return type을 아직 정하지 못해 charts의 type을 any로 일단.
async function generateFile(data: Data, charts: any) {
    // data null check - 이거 그냥.. 호출하는 함수로 만들어둘까? 호출만하면 걍 만들어지게?
    const dataSignalsKOSSSF = data.KOSS.total.level == null ? -1 : data.KOSS.total.level;
    const dataSignalsPHQ9 = data.PHQ9.level == null ? -1 : data.PHQ9.level;
    const dataSignalsGAD7 = data.GAD7.level == null ? -1 : data.GAD7.level;
    const dataSignalsADNM4 = data.ADNM4.level == null ? -1 : data.ADNM4.level;
    const dataSignalsPCPTSD5 = data.PCPTSD5.level == null ? -1 : data.PCPTSD5.level;
    const dataSignalsISI = data.ISI.level == null ? -1 : data.ISI.level;

    const dataByYearKOSSSF = data.KOSS.total.byYear == null ? -1 : data.KOSS.total.byYear;
    const dataByYearPHQ9 = data.PHQ9.byYear == null ? -1 : data.PHQ9.byYear;
    const dataByYearGAD7 = data.GAD7.byYear == null ? -1 : data.GAD7.byYear;
    const dataByYearADNM4 = data.ADNM4.byYear == null ? -1 : data.ADNM4.byYear;
    const dataByYearPCPTSD5 = data.PCPTSD5.byYear == null ? -1 : data.PCPTSD5.byYear;
    const dataByYearISI = data.ISI.byYear == null ? -1 : data.ISI.byYear;

    const dataRatesKOSSSF = data.KOSS.total.distribution == "" ? 0 : data.KOSS.total.distribution;
    const dataRatesPHQ9 = data.PHQ9.riskRate == null ? 0 : data.PHQ9.riskRate;
    const dataRatesGAD7 = data.GAD7.riskRate == null ? 0 : data.GAD7.riskRate;
    const dataRatesADNM4 = data.ADNM4.riskRate == null ? 0 : data.ADNM4.riskRate;
    const dataRatesPCPTSD5 = data.PCPTSD5.riskRate == null ? 0 : data.PCPTSD5.riskRate;
    const dataRatesISI = data.ISI.riskRate == null ? 0 : data.ISI.riskRate;

    const dataKosssfCompensation = data.KOSS.compensation.score == null ? {"distribution": "0", "score": 0} : data.KOSS.compensation;
    const dataKosssfJobInstability = data.KOSS.jobInstability.score == null ? {"distribution": "0", "score": 0} : data.KOSS.jobInstability;
    const dataKosssfRequirements = data.KOSS.requirements.score == null ? {"distribution": "0", "score": 0} : data.KOSS.requirements;
    const dataKosssfCulture = data.KOSS.culture.score == null ? {"distribution": "0", "score": 0} : data.KOSS.culture;
    const dataKosssfAutonomy = data.KOSS.autonomy.score == null ? {"distribution": "0", "score": 0} : data.KOSS.autonomy;
    const dataKosssfSystem = data.KOSS.system.score == null ? {"distribution": "0", "score": 0} : data.KOSS.system;
    const dataKosssfRelationship = data.KOSS.relationship.score == null ? {"distribution": "0", "score": 0} : data.KOSS.relationship;

    const dataMeansKOSSSF = data.KOSS.total.scoreMean == null ? 0 : data.KOSS.total.scoreMean;
    const dataPointsKOSSSF = data.KOSS.total.score == null ? 0 : data.KOSS.total.score;
    const dataPointsPHQ9 = data.PHQ9.score == null ? 0 : data.PHQ9.score;
    const dataPointsGAD7 = data.GAD7.score == null ? 0 : data.GAD7.score;
    const dataPointsADNM4 = data.ADNM4.score == null ? 0 : data.ADNM4.score;
    const dataPointsPCPTSD5 = data.PCPTSD5.score == null ? 0 : data.PCPTSD5.score;
    const dataPointsISI = data.ISI.score == null ? 0 : data.ISI.score;

    const inputs = [
        {
            coverUserName: data.info.name,
            coverExamDate: data.info.examDate,
            coverReportDate: data.info.reportDate,

            overallUserName: data.info.name,
            overallKOSSSFSignalTexts: ": " + data.KOSS.total.result,
            overallKOSSSFSignals: charts.chartSignalsKOSSSF,
            overallKOSSSFPoints: dataPointsKOSSSF.toString() + "점  /",
            overallKOSSSFRates: dataRatesKOSSSF.toString() + "%",
            overallKOSSSFMeans: dataMeansKOSSSF.toString() + "점",

            overallPHQ9SignalTexts: ": " + data.PHQ9.result,
            overallPHQ9Signals: charts.chartSignalsPHQ9,
            overallPHQ9Points: dataPointsPHQ9.toString() + "점  /",
            overallPHQ9Rates: dataRatesPHQ9.toString() + "%",
            overallPHQ9Comments: data.PHQ9.description,

            overallGAD7SignalTexts: ": " + data.GAD7.result,
            overallGAD7Signals: charts.chartSignalsGAD7,
            overallGAD7Points: dataPointsGAD7.toString() + "점  /",
            overallGAD7Rates: dataRatesGAD7.toString() + "%",
            overallGAD7Comments: data.GAD7.description,

            overallADNM4SignalTexts: ": " + data.ADNM4.result,
            overallADNM4Signals: charts.chartSignalsADNM4,
            overallADNM4Points: dataPointsADNM4.toString() + "점  /",
            overallADNM4Rates: dataRatesADNM4.toString() + "%",
            overallADNM4Comments: data.ADNM4.description,

            overallPCPTSD5SignalTexts: ": " + data.PCPTSD5.result,
            overallPCPTSD5Signals: charts.chartSignalsPCPTSD5,
            overallPCPTSD5Points: dataPointsPCPTSD5.toString() + "점  /",
            overallPCPTSD5Rates: dataRatesPCPTSD5.toString() + "%",
            overallPCPTSD5Comments: data.PCPTSD5.description,

            overallISISignalTexts: ": " + data.ISI.result,
            overallISISignals: charts.chartSignalsISI,
            overallISIPoints: dataPointsISI.toString() + "점  /",
            overallISIRates: dataRatesISI.toString() + "%",
            overallISIComments: data.ISI.description,

            overallCSSSignalTexts: ": " + data.CSS.result,
            overallCSSSignals: charts.chartSignalsCSS,
            overallCSSComments: data.CSS.description,

            KOSSSFSignals: charts.chartSignalsKOSSSF,
            KOSSSFCompensation: charts.chartPointsCompensation,
            KOSSSFJobInstability: charts.chartPointsJobInstability,
            KOSSSFRequirements: charts.chartPointsRequirements,
            KOSSSFCulture: charts.chartPointsCulture,
            KOSSSFAutonomy: charts.chartPointsAutonomy,
            KOSSSFSystem: charts.chartPointsSystem,
            KOSSSFRelationship: charts.chartPointsRelationship,
            KOSSSFByYear: charts.chartByYearKOSSSF,
            KOSSSFCommentDetails: data.KOSS.total.details,

            KOSSSFCompensationPoints: dataKosssfCompensation.score.toString() + "점  /",
            KOSSSFCompensationRates: dataKosssfCompensation.distribution + "%",
            KOSSSFJobInstabilityPoints: dataKosssfJobInstability.score.toString() + "점  /",
            KOSSSFJobInstabilityRates: dataKosssfJobInstability.distribution +"%",
            KOSSSFRequirementsPoints: dataKosssfRequirements.score.toString() + "점  /",
            KOSSSFRequirementsRates: dataKosssfRequirements.distribution +"%",
            KOSSSFCulturePoints: dataKosssfCulture.score.toString() + "점  /",
            KOSSSFCultureRates: dataKosssfCulture.distribution +"%",
            KOSSSFAutonomyPoints: dataKosssfAutonomy.score.toString() + "점  /",
            KOSSSFAutonomyRates: dataKosssfAutonomy.distribution +"%",
            KOSSSFSystemPoints: dataKosssfSystem.score.toString() + "점  /",
            KOSSSFSystemRates: dataKosssfSystem.distribution +"%",
            KOSSSFRelationshipPoints: dataKosssfRelationship.score.toString() + "점  /",
            KOSSSFRelationshipRates: dataKosssfRelationship.distribution +"%",

            PHQ9Signals: charts.chartSignalsPHQ9,
            PHQ9SignalTexts: data.PHQ9.result,
            PHQ9Rates: dataRatesPHQ9.toString() + "%",
            PHQ9RateBar: charts.chartRateBarPHQ9,
            PHQ9Comments: data.PHQ9.description,
            PHQ9Requirements: data.PHQ9.guidance,
            PHQ9RequirementTexts: data.PHQ9.advice,
            PHQ9ByYear: charts.chartByYearPHQ9,
            PHQ9CommentDetails: data.PHQ9.details,

            GAD7Signals: charts.chartSignalsGAD7,
            GAD7SignalTexts: data.GAD7.result,
            GAD7Rates: dataRatesGAD7.toString() + "%",
            GAD7RateBar: charts.chartRateBarGAD7,
            GAD7Comments: data.GAD7.description,
            GAD7Requirements: data.GAD7.guidance,
            GAD7RequirementTexts: data.GAD7.advice,
            GAD7ByYear: charts.chartByYearGAD7,
            GAD7CommentDetails: data.GAD7.details,

            ADNM4Signals: charts.chartSignalsADNM4,
            ADNM4SignalTexts: data.ADNM4.result,
            ADNM4Rates: dataRatesADNM4.toString() + "%",
            ADNM4RateBar: charts.chartRateBarADNM4,
            ADNM4Comments: data.ADNM4.description,
            ADNM4Requirements: data.ADNM4.guidance,
            ADNM4RequirementTexts: data.ADNM4.advice,
            ADNM4ByYear: charts.chartByYearADNM4,
            ADNM4CommentDetails: data.ADNM4.details,

            PCPTSD5Signals: charts.chartSignalsPCPTSD5,
            PCPTSD5SignalTexts: data.PCPTSD5.result,
            PCPTSD5Rates: dataRatesPCPTSD5.toString() + "%",
            PCPTSD5RateBar: charts.chartRateBarPCPTSD5,
            PCPTSD5Comments: data.PCPTSD5.description,
            PCPTSD5Requirements: data.PCPTSD5.guidance,
            PCPTSD5RequirementTexts: data.PCPTSD5.advice,
            PCPTSD5ByYear: charts.chartByYearPCPTSD5,
            PCPTSD5CommentDetails: data.PCPTSD5.details,

            ISISignals: charts.chartSignalsISI,
            ISISignalTexts: data.ISI.result,
            ISIRates: dataRatesISI.toString() + "%",
            ISIRateBar: charts.chartRateBarISI,
            ISIComments: data.ISI.description,
            ISIRequirements: data.ISI.guidance,
            ISIRequirementTexts: data.ISI.advice,
            ISIByYear: charts.chartByYearISI,
            ISICommentDetails: data.ISI.details,

            CSSSignals: charts.chartSignalsCSS,
            CSSSignalTexts: data.CSS.result,
            CSSComments: data.CSS.description,
            CSSRequirements: data.CSS.guidance,
            CSSRequirementTexts: data.CSS.advice,
            CSSCommentDetails: data.CSS.details,
        }
    ];

    // jpg 경로 생성 준비
    // 센터코드 => 센터명 변경
    const centerCode = data.info.centerCode
    let centerName;
    if (centerCode == 111) {
        centerName = "his_jno";
    } else if (centerCode == 112) {
        centerName = "his_ydp";
    } else if (centerCode == 113) {
        centerName = "his_gnm";
    } else if (centerCode == 211) {
        centerName = "his_swn";
    } else if (centerCode == 611) {
        centerName = "his_tae";
    } else if (centerCode == 612) {
        centerName = "his_pus";
    } else if (centerCode == 711) {
        centerName = "his_kwj";
    } else {
        console.log("unknown center code");
        return 0;
    };

    const examDate = data.info.examDate.replace(/-/g, "");
    const reservationNumber = data.info.reservationNumber;

    // pdf 생성 경로에 따른 디렉토리 생성 + pdf 파일명 설정
    // const pdfPath = await makeDir(config.get('PDF_PATH'));
    const pdfPath = await makeDir(config.get('PDF_PATH_LOCAL'));
    const pdfName = `${pdfPath}/${centerCode}_${examDate}_${reservationNumber}.pdf`;

    try {
        const template = templates as Template;
        const pdf = await labelmake({ inputs, template, font });
        fs.writeFileSync(pdfName, pdf, "utf-8");
        console.log(`PDF generated: ${pdfName}`);

        // jpg 생성 경로에 따른 디렉토리 생성 + jpg 파일명 설정
        // const jpgPath = await makeDir(config.get('JPG_PATH') + `/${centerName}/${examDate}`);
        const jpgPath = await makeDir(config.get('JPG_PATH_LOCAL') + `/${centerName}/${examDate}`);

        const options = {
            density: 100,
            savePath: jpgPath,
            saveFilename: `${reservationNumber}`,
            format: "jpg",
            width: 2100,
            height: 2970
        };

        // option 1 : bulk convert, forks several (page numbers) gm process, fast use much memory
        const result = await fromPath(pdfName, options).bulk!(-1); // bulk!로 처리하는 것이 과연 충분한가..
        console.log(`Convert completed: ${jpgPath}/${reservationNumber}.jpg`);
        return result;

        // option 2 : serial convert, forks 1 process, slow
        // const storeAsImage = fromPath(pdfName, options);
        // let pages = 0;
        // for (let i = 1; i < 7; i++) {
        //     await storeAsImage(i);
        //     pages++;
        // }
        // console.log(`Convert compeleted: ${centerName}/${examDate}/${reservationNumber}`);
        // return pages;
    } catch(exception) {
        console.log(exception);
    }
}


export {
    saveMessage, generateChart, generateFile
}

