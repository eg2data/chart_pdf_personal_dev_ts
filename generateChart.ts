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
        pathInfo: {
            reservationNumber: number,
            centerCode: number,
            examDate: string,
            reportDate: string
        },
        basicInfo: {
            userName: string,
        },
        KOSSSF: {
            signals: number[],
            signalTexts: string,
            points : number[],
            rates : string[],
            means : number[],
            compensation: [number, string],
            jobInstability: [number, string],
            requirements: [number, string],
            culture: [number, string],
            autonomy: [number, string],
            system: [number, string],
            relationship: [number, string],
            changesByYear: number[], // 24
            commentDetails: string,
        },
        PHQ9 : {
            signals: number[],
            signalTexts: string,
            points : number[],
            rates: number[],
            comments: string,
            requirements: string,
            requirementTexts: string,
            changesByYear: number[],
            commentDetails: string,
        },
        GAD7 : {
            signals: number[],
            signalTexts: string,
            points : number[],
            rates: number[],
            comments: string,
            requirements: string,
            requirementTexts: string,
            changesByYear: number[],
            commentDetails: string,
        },
        ADNM4 : {
            signals: number[],
            signalTexts: string,
            points : number[],
            rates: number[],
            comments: string,
            requirements: string,
            requirementTexts: string,
            changesByYear: number[],
            commentDetails: string,        },
        PCPTSD5 : {
            signals: number[],
            signalTexts: string,
            points : number[],
            rates: number[],
            comments: string,
            requirements: string,
            requirementTexts: string,
            changesByYear: number[],
            commentDetails: string,        },
        ISI : {
            signals: number[],
            signalTexts: string,
            points : number[],
            rates: number[],
            comments: string,
            requirements: string,
            requirementTexts: string,
            changesByYear: number[],
            commentDetails: string,        },
        CSS : {
            signals: number[],
            signalTexts: string,
            points : number[],
            rates: number[],
            comments: string,
            requirements: string,
            requirementTexts: string,
            commentDetails: string,
        },
    };
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
    constructor(private input: number[] | number) { };
    type = 'bar' as ChartType;
    data = {
        labels: ['a'],
        datasets: [
            {
                data: this.input,
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
    constructor(private input: (number | string)[] | number[]) { };
    type = 'bar' as ChartType;
    data = {
        labels: ['a'],
        datasets: [
            {
                data: this.input.slice(0,1),
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
                borderWidth: this.input[1] == 0 ? '' : 15,
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
    constructor(private input: number[] | number) { };
    private changeColour(): Array<string> {
        return [
            this.input == -1 ? '' : '#A6D7C3'
        ]
    };
    type = 'bar' as ChartType;
    data = {
        labels: ['a'],
        datasets: [
            {
                data: this.input,
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
    constructor(private input: number[] | number, scales: ScalesByYear) {
        this.options.scales = scales;
    };
    type = 'bar' as ChartType;
    data = {
        labels: this.input == -1 ? '' : labelsByYear,
        datasets: [
            {
                data: this.input,
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

    const centerCode = data.pathInfo.centerCode;
    const examDate = data.pathInfo.examDate.replace(/-/g, "");
    const reservationNumber = data.pathInfo.reservationNumber;

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
    const dataSignalsKOSSSF = data.KOSSSF.signals == null ? -1 : data.KOSSSF.signals;
    const dataSignalsPHQ9 = data.PHQ9.signals == null ? -1 : data.PHQ9.signals;
    const dataSignalsGAD7 = data.GAD7.signals == null ? -1 : data.GAD7.signals;
    const dataSignalsADNM4 = data.ADNM4.signals == null ? -1 : data.ADNM4.signals;
    const dataSignalsPCPTSD5 = data.PCPTSD5.signals == null ? -1 : data.PCPTSD5.signals;
    const dataSignalsISI = data.ISI.signals == null ? -1 : data.ISI.signals;
    const dataSignalsCSS = data.CSS.signals == null ? -1 : data.CSS.signals;

    const dataByYearKOSSSF = data.KOSSSF.changesByYear == null ? -1 : data.KOSSSF.changesByYear;
    const dataByYearPHQ9 = data.PHQ9.changesByYear == null ? -1 : data.PHQ9.changesByYear;
    const dataByYearGAD7 = data.GAD7.changesByYear == null ? -1 : data.GAD7.changesByYear;
    const dataByYearADNM4 = data.ADNM4.changesByYear == null ? -1 : data.ADNM4.changesByYear;
    const dataByYearPCPTSD5 = data.PCPTSD5.changesByYear == null ? -1 : data.PCPTSD5.changesByYear;
    const dataByYearISI = data.ISI.changesByYear == null ? -1 : data.ISI.changesByYear;

    const dataRatesKOSSSF = data.KOSSSF.rates == null ? -1 : data.KOSSSF.rates;
    const dataRatesPHQ9 = data.PHQ9.rates == null ? -1 : data.PHQ9.rates;
    const dataRatesGAD7 = data.GAD7.rates == null ? -1 : data.GAD7.rates;
    const dataRatesADNM4 = data.ADNM4.rates == null ? -1 : data.ADNM4.rates;
    const dataRatesPCPTSD5 = data.PCPTSD5.rates == null ? -1 : data.PCPTSD5.rates;
    const dataRatesISI = data.ISI.rates == null ? -1 : data.ISI.rates;
    const dataRatesCSS = data.CSS.rates == null ? -1 : data.CSS.rates;

    const dataKosssfCompensation = data.KOSSSF.compensation == null ? [0, '0'] : data.KOSSSF.compensation;
    const dataKosssfJobInstability = data.KOSSSF.jobInstability == null ? [0, '0'] : data.KOSSSF.jobInstability;
    const dataKosssfRequirements = data.KOSSSF.requirements == null ? [0, '0'] : data.KOSSSF.requirements;
    const dataKosssfCulture = data.KOSSSF.culture == null ? [0, '0'] : data.KOSSSF.culture;
    const dataKosssfAutonomy = data.KOSSSF.autonomy == null ? [0, '0'] : data.KOSSSF.autonomy;
    const dataKosssfSystem = data.KOSSSF.system == null ? [0, '0'] : data.KOSSSF.system;
    const dataKosssfRelationship = data.KOSSSF.relationship == null ? [0, '0'] : data.KOSSSF.relationship;

    const dataMeansKOSSSF = data.KOSSSF.means == null ? -1 : data.KOSSSF.means;
    const dataPointsKOSSSF = data.KOSSSF.points == null ? -1 : data.KOSSSF.points;
    const dataPointsPHQ9 = data.PHQ9.points == null ? -1 : data.PHQ9.points;
    const dataPointsGAD7 = data.GAD7.points == null ? -1 : data.GAD7.points;
    const dataPointsADNM4 = data.ADNM4.points == null ? -1 : data.ADNM4.points;
    const dataPointsPCPTSD5 = data.PCPTSD5.points == null ? -1 : data.PCPTSD5.points;
    const dataPointsISI = data.ISI.points == null ? -1 : data.ISI.points;
    const dataPointsCSS = data.CSS.points == null ? -1 : data.CSS.points;

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
    const configSignalsCSS = new ConfigSignals(dataSignalsCSS);

    const configRateBarPHQ9 = new ConfigRateBar(dataRatesPHQ9);
    const configRateBarGAD7 = new ConfigRateBar(dataRatesGAD7);
    const configRateBarADNM4 = new ConfigRateBar(dataRatesADNM4);
    const configRateBarPCPTSD5 = new ConfigRateBar(dataRatesPCPTSD5);
    const configRateBarISI = new ConfigRateBar(dataRatesISI);
    const configRateBarCSS = new ConfigRateBar(dataRatesCSS);

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
    const chartSignalsCSS = await canvasSignals.renderToDataURL(configSignalsCSS);

    const chartRateBarPHQ9 = await canvasRateBar.renderToDataURL(configRateBarPHQ9);
    const chartRateBarGAD7 = await canvasRateBar.renderToDataURL(configRateBarGAD7);
    const chartRateBarADNM4 = await canvasRateBar.renderToDataURL(configRateBarADNM4);
    const chartRateBarPCPTSD5 = await canvasRateBar.renderToDataURL(configRateBarPCPTSD5);
    const chartRateBarISI = await canvasRateBar.renderToDataURL(configRateBarISI);
    const chartRateBarCSS = await canvasRateBar.renderToDataURL(configRateBarCSS);

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
        chartSignalsKOSSSF, chartSignalsPHQ9, chartSignalsGAD7, chartSignalsADNM4, chartSignalsPCPTSD5, chartSignalsISI, chartSignalsCSS,
        chartRateBarPHQ9, chartRateBarGAD7, chartRateBarADNM4, chartRateBarPCPTSD5, chartRateBarISI, chartRateBarCSS,
        chartByYearKOSSSF, chartByYearPHQ9, chartByYearGAD7, chartByYearADNM4, chartByYearPCPTSD5, chartByYearISI,
        chartPointsCompensation, chartPointsJobInstability, chartPointsRequirements, chartPointsCulture, chartPointsAutonomy, chartPointsSystem, chartPointsRelationship,
    };
};

// generateChart 함수의 return type을 아직 정하지 못해 charts의 type을 any로 일단.
async function generateFile(data: Data, charts: any) {
    // data null check - 이거 그냥.. 호출하는 함수로 만들어둘까? 호출만하면 걍 만들어지게?
    const dataSignalsKOSSSF = data.KOSSSF.signals == null ? -1 : data.KOSSSF.signals;
    const dataSignalsPHQ9 = data.PHQ9.signals == null ? -1 : data.PHQ9.signals;
    const dataSignalsGAD7 = data.GAD7.signals == null ? -1 : data.GAD7.signals;
    const dataSignalsADNM4 = data.ADNM4.signals == null ? -1 : data.ADNM4.signals;
    const dataSignalsPCPTSD5 = data.PCPTSD5.signals == null ? -1 : data.PCPTSD5.signals;
    const dataSignalsISI = data.ISI.signals == null ? -1 : data.ISI.signals;
    const dataSignalsCSS = data.CSS.signals == null ? -1 : data.CSS.signals;

    const dataByYearKOSSSF = data.KOSSSF.changesByYear == null ? -1 : data.KOSSSF.changesByYear;
    const dataByYearPHQ9 = data.PHQ9.changesByYear == null ? -1 : data.PHQ9.changesByYear;
    const dataByYearGAD7 = data.GAD7.changesByYear == null ? -1 : data.GAD7.changesByYear;
    const dataByYearADNM4 = data.ADNM4.changesByYear == null ? -1 : data.ADNM4.changesByYear;
    const dataByYearPCPTSD5 = data.PCPTSD5.changesByYear == null ? -1 : data.PCPTSD5.changesByYear;
    const dataByYearISI = data.ISI.changesByYear == null ? -1 : data.ISI.changesByYear;

    const dataRatesKOSSSF = data.KOSSSF.rates == null ? -1 : data.KOSSSF.rates;
    const dataRatesPHQ9 = data.PHQ9.rates == null ? -1 : data.PHQ9.rates;
    const dataRatesGAD7 = data.GAD7.rates == null ? -1 : data.GAD7.rates;
    const dataRatesADNM4 = data.ADNM4.rates == null ? -1 : data.ADNM4.rates;
    const dataRatesPCPTSD5 = data.PCPTSD5.rates == null ? -1 : data.PCPTSD5.rates;
    const dataRatesISI = data.ISI.rates == null ? -1 : data.ISI.rates;
    const dataRatesCSS = data.CSS.rates == null ? -1 : data.CSS.rates;

    const dataKosssfCompensation = data.KOSSSF.compensation == null ? [0, '0'] : data.KOSSSF.compensation;
    const dataKosssfJobInstability = data.KOSSSF.jobInstability == null ? [0, '0'] : data.KOSSSF.jobInstability;
    const dataKosssfRequirements = data.KOSSSF.requirements == null ? [0, '0'] : data.KOSSSF.requirements;
    const dataKosssfCulture = data.KOSSSF.culture == null ? [0, '0'] : data.KOSSSF.culture;
    const dataKosssfAutonomy = data.KOSSSF.autonomy == null ? [0, '0'] : data.KOSSSF.autonomy;
    const dataKosssfSystem = data.KOSSSF.system == null ? [0, '0'] : data.KOSSSF.system;
    const dataKosssfRelationship = data.KOSSSF.relationship == null ? [0, '0'] : data.KOSSSF.relationship;

    const dataMeansKOSSSF = data.KOSSSF.means == null ? -1 : data.KOSSSF.means;
    const dataPointsKOSSSF = data.KOSSSF.points == null ? -1 : data.KOSSSF.points;
    const dataPointsPHQ9 = data.PHQ9.points == null ? -1 : data.PHQ9.points;
    const dataPointsGAD7 = data.GAD7.points == null ? -1 : data.GAD7.points;
    const dataPointsADNM4 = data.ADNM4.points == null ? -1 : data.ADNM4.points;
    const dataPointsPCPTSD5 = data.PCPTSD5.points == null ? -1 : data.PCPTSD5.points;
    const dataPointsISI = data.ISI.points == null ? -1 : data.ISI.points;
    const dataPointsCSS = data.CSS.points == null ? -1 : data.CSS.points;

    // 데이터 api 정리하고 나서 아래 부분 정리하자.
    const inputs = [
        {
            coverUserName: data.basicInfo.userName,
            coverExamDate: data.pathInfo.examDate,
            coverReportDate: data.pathInfo.reportDate,

            overallUserName: data.basicInfo.userName,
            overallKOSSSFSignalTexts: ": " + data.KOSSSF.signalTexts,
            overallKOSSSFSignals: charts.chartSignalsKOSSSF,
            overallKOSSSFPoints: dataPointsKOSSSF.toString() + "점  /",
            overallKOSSSFRates: dataRatesKOSSSF.toString() + "%",
            overallKOSSSFMeans: dataMeansKOSSSF.toString() + "점",

            overallPHQ9SignalTexts: ": " + data.PHQ9.signalTexts,
            overallPHQ9Signals: charts.chartSignalsPHQ9,
            overallPHQ9Points: dataPointsPHQ9.toString() + "점  /",
            overallPHQ9Rates: dataRatesPHQ9.toString() + "%",
            overallPHQ9Comments: data.PHQ9.comments,

            overallGAD7SignalTexts: ": " + data.GAD7.signalTexts,
            overallGAD7Signals: charts.chartSignalsGAD7,
            overallGAD7Points: dataPointsGAD7.toString() + "점  /",
            overallGAD7Rates: dataRatesGAD7.toString() + "%",
            overallGAD7Comments: data.GAD7.comments,

            overallADNM4SignalTexts: ": " + data.ADNM4.signalTexts,
            overallADNM4Signals: charts.chartSignalsADNM4,
            overallADNM4Points: dataPointsADNM4.toString() + "점  /",
            overallADNM4Rates: dataRatesADNM4.toString() + "%",
            overallADNM4Comments: data.ADNM4.comments,

            overallPCPTSD5SignalTexts: ": " + data.PCPTSD5.signalTexts,
            overallPCPTSD5Signals: charts.chartSignalsPCPTSD5,
            overallPCPTSD5Points: dataPointsPCPTSD5.toString() + "점  /",
            overallPCPTSD5Rates: dataRatesPCPTSD5.toString() + "%",
            overallPCPTSD5Comments: data.PCPTSD5.comments,

            overallISISignalTexts: ": " + data.ISI.signalTexts,
            overallISISignals: charts.chartSignalsISI,
            overallISIPoints: dataPointsISI.toString() + "점  /",
            overallISIRates: dataRatesISI.toString() + "%",
            overallISIComments: data.ISI.comments,

            overallCSSSignalTexts: ": " + data.CSS.signalTexts,
            overallCSSSignals: charts.chartSignalsCSS,
            overallCSSPoints: dataPointsCSS.toString() + "점  /",
            overallCSSRates: dataRatesCSS.toString() + "%",
            overallCSSComments: data.CSS.comments,

            KOSSSFSignals: charts.chartSignalsKOSSSF,
            KOSSSFCompensation: charts.chartPointsCompensation,
            KOSSSFJobInstability: charts.chartPointsJobInstability,
            KOSSSFRequirements: charts.chartPointsRequirements,
            KOSSSFCulture: charts.chartPointsCulture,
            KOSSSFAutonomy: charts.chartPointsAutonomy,
            KOSSSFSystem: charts.chartPointsSystem,
            KOSSSFRelationship: charts.chartPointsRelationship,
            KOSSSFByYear: charts.chartByYearKOSSSF,
            KOSSSFCommentDetails: data.KOSSSF.commentDetails,

            KOSSSFCompensationPoints: dataKosssfCompensation[0].toString() + "점  /",
            KOSSSFCompensationRates: dataKosssfCompensation[1] + "%",
            KOSSSFJobInstabilityPoints: dataKosssfJobInstability[0].toString() + "점  /",
            KOSSSFJobInstabilityRates: dataKosssfJobInstability[1] +"%",
            KOSSSFRequirementsPoints: dataKosssfRequirements[0].toString() + "점  /",
            KOSSSFRequirementsRates: dataKosssfRequirements[1] +"%",
            KOSSSFCulturePoints: dataKosssfCulture[0].toString() + "점  /",
            KOSSSFCultureRates: dataKosssfCulture[1] +"%",
            KOSSSFAutonomyPoints: dataKosssfAutonomy[0].toString() + "점  /",
            KOSSSFAutonomyRates: dataKosssfAutonomy[1] +"%",
            KOSSSFSystemPoints: dataKosssfSystem[0].toString() + "점  /",
            KOSSSFSystemRates: dataKosssfSystem[1] +"%",
            KOSSSFRelationshipPoints: dataKosssfRelationship[0].toString() + "점  /",
            KOSSSFRelationshipRates: dataKosssfRelationship[1] +"%",

            PHQ9Signals: charts.chartSignalsPHQ9,
            PHQ9SignalTexts: data.PHQ9.signalTexts,
            PHQ9Rates: dataRatesPHQ9.toString() + "%",
            PHQ9RateBar: charts.chartRateBarPHQ9,
            PHQ9Comments: data.PHQ9.comments,
            PHQ9Requirements: data.PHQ9.requirements,
            PHQ9RequirementTexts: data.PHQ9.requirementTexts,
            PHQ9ByYear: charts.chartByYearPHQ9,
            PHQ9CommentDetails: data.PHQ9.commentDetails,

            GAD7Signals: charts.chartSignalsGAD7,
            GAD7SignalTexts: data.GAD7.signalTexts,
            GAD7Rates: dataRatesGAD7.toString() + "%",
            GAD7RateBar: charts.chartRateBarGAD7,
            GAD7Comments: data.GAD7.comments,
            GAD7Requirements: data.GAD7.requirements,
            GAD7RequirementTexts: data.GAD7.requirementTexts,
            GAD7ByYear: charts.chartByYearGAD7,
            GAD7CommentDetails: data.GAD7.commentDetails,

            ADNM4Signals: charts.chartSignalsADNM4,
            ADNM4SignalTexts: data.ADNM4.signalTexts,
            ADNM4Rates: dataRatesADNM4.toString() + "%",
            ADNM4RateBar: charts.chartRateBarADNM4,
            ADNM4Comments: data.ADNM4.comments,
            ADNM4Requirements: data.ADNM4.requirements,
            ADNM4RequirementTexts: data.ADNM4.requirementTexts,
            ADNM4ByYear: charts.chartByYearADNM4,
            ADNM4CommentDetails: data.ADNM4.commentDetails,

            PCPTSD5Signals: charts.chartSignalsPCPTSD5,
            PCPTSD5SignalTexts: data.PCPTSD5.signalTexts,
            PCPTSD5Rates: dataRatesPCPTSD5.toString() + "%",
            PCPTSD5RateBar: charts.chartRateBarPCPTSD5,
            PCPTSD5Comments: data.PCPTSD5.comments,
            PCPTSD5Requirements: data.PCPTSD5.requirements,
            PCPTSD5RequirementTexts: data.PCPTSD5.requirementTexts,
            PCPTSD5ByYear: charts.chartByYearPCPTSD5,
            PCPTSD5CommentDetails: data.PCPTSD5.commentDetails,

            ISISignals: charts.chartSignalsISI,
            ISISignalTexts: data.ISI.signalTexts,
            ISIRates: dataRatesISI.toString() + "%",
            ISIRateBar: charts.chartRateBarISI,
            ISIComments: data.ISI.comments,
            ISIRequirements: data.ISI.requirements,
            ISIRequirementTexts: data.ISI.requirementTexts,
            ISIByYear: charts.chartByYearISI,
            ISICommentDetails: data.ISI.commentDetails,

            CSSSignals: charts.chartSignalsCSS,
            CSSSignalTexts: data.CSS.signalTexts,
            CSSRates: dataRatesCSS.toString() + "%",
            CSSRateBar: charts.chartRateBarCSS,
            CSSComments: data.CSS.comments,
            CSSRequirements: data.CSS.requirements,
            CSSRequirementTexts: data.CSS.requirementTexts,
            CSSCommentDetails: data.CSS.commentDetails,
        }
    ];

    // jpg 경로 생성 준비
    // 센터코드 => 센터명 변경
    const centerCode = data.pathInfo.centerCode
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

    const examDate = data.pathInfo.examDate.replace(/-/g, "");
    const reservationNumber = data.pathInfo.reservationNumber;

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

