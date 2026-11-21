
import * as Astronomy from 'astronomy-engine'

// Default location: Vijayawada
const observer = new Astronomy.Observer(16.5062, 80.648, 20)

const TZ = 'Asia/Kolkata'

const norm = (x: number) => ((x % 360) + 360) % 360

const fmt = (d?: Date | null) =>
    d
        ? d.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: TZ,
        })
        : '--'

const add = (d: Date, ms: number) =>
    new Date(d.getTime() + ms)

// Approximate Lahiri ayanamsa
const ayanamsa = (d: Date) =>
    23.853 +
    0.013972 *
    ((d.getTime() - Date.UTC(2000, 0, 1, 12)) / 3.15576e10)

const sunLon = (d: Date) => Astronomy.SunPosition(d).elon

const elong = (d: Date) => Astronomy.MoonPhase(d)

const tithiNo = (d: Date) => Math.floor(elong(d) / 12)

const karanaNo = (d: Date) => Math.floor(elong(d) / 6)

const nakNo = (d: Date) =>
    Math.floor(
        norm(sunLon(d) + elong(d) - ayanamsa(d)) / (360 / 27)
    )

const yogaNo = (d: Date) =>
    Math.floor(
        norm(2 * sunLon(d) + elong(d) - 2 * ayanamsa(d)) /
        (360 / 27)
    )

const TITHIS = [
    'Pratipada',
    'Dwitiya',
    'Tritiya',
    'Chaturthi',
    'Panchami',
    'Shashthi',
    'Saptami',
    'Ashtami',
    'Navami',
    'Dashami',
    'Ekadashi',
    'Dwadashi',
    'Trayodashi',
    'Chaturdashi',
]

const NAKSHATRAS = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini',
    'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya',
    'Ashlesha', 'Magha', 'Purva Phalguni',
    'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati',
    'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula',
    'Purva Ashadha', 'Uttara Ashadha', 'Shravana',
    'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada',
    'Uttara Bhadrapada', 'Revati',
]

const YOGAS = [
    'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya',
    'Shobhana', 'Atiganda', 'Sukarma', 'Dhriti',
    'Shula', 'Ganda', 'Vriddhi', 'Dhruva',
    'Vyaghata', 'Harshana', 'Vajra', 'Siddhi',
    'Vyatipata', 'Variyana', 'Parigha', 'Shiva',
    'Siddha', 'Sadhya', 'Shubha', 'Shukla',
    'Brahma', 'Indra', 'Vaidhriti',
]

const MOVABLE = [
    'Bava', 'Balava', 'Kaulava', 'Taitila',
    'Gara', 'Vanija', 'Vishti',
]

const VARAS = [
    'Sunday (Ravivara)',
    'Monday (Somvara)',
    'Tuesday (Mangalvara)',
    'Wednesday (Budhvara)',
    'Thursday (Guruvara)',
    'Friday (Shukravara)',
    'Saturday (Shanivara)',
]

const tithiName = (i: number) =>
    i === 14
        ? 'Purnima'
        : i === 29
            ? 'Amavasya'
            : TITHIS[i % 15]

const karanaName = (k: number) =>
    k === 0
        ? 'Kimstughna'
        : k >= 57
            ? ['Shakuni', 'Chatushpada', 'Naga'][k - 57]
            : MOVABLE[(k - 1) % 7]

function endOf(
    fn: (d: Date) => number,
    from: Date
): Date | null {
    const v = fn(from)
    let a = from

    for (let i = 0; i < 200; i++) {
        const b = add(a, 10 * 60000)

        if (fn(b) !== v) {
            let lo = a
            let hi = b

            while (hi.getTime() - lo.getTime() > 30000) {
                const m = new Date(
                    (lo.getTime() + hi.getTime()) / 2
                )

                if (fn(m) === v) {
                    lo = m
                } else {
                    hi = m
                }
            }

            return hi
        }

        a = b
    }

    return null
}

const describe = (
    fn: (d: Date) => number,
    name: (i: number) => string,
    at: Date
) => {
    const end = endOf(fn, at)

    return `${name(fn(at))} (up to ${fmt(end)}${end ? `, then ${name(fn(add(end, 60000)))}` : ''
        })`
}

const RAHU = [8, 2, 7, 5, 6, 4, 3]
const YAMA = [5, 4, 3, 2, 1, 7, 6]
const GULIKA = [7, 6, 5, 4, 3, 2, 1]

export function getPanchang(date: Date = new Date()) {
    const day = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    )

    const riseResult = Astronomy.SearchRiseSet(
        Astronomy.Body.Sun,
        observer,
        +1,
        day,
        1
    )

    if (!riseResult) {
        throw new Error('Unable to calculate sunrise.')
    }

    const rise = riseResult.date

    const setResult = Astronomy.SearchRiseSet(
        Astronomy.Body.Sun,
        observer,
        -1,
        rise,
        1
    )

    if (!setResult) {
        throw new Error('Unable to calculate sunset.')
    }

    const sunset = setResult.date

    const moonRise = Astronomy.SearchRiseSet(
        Astronomy.Body.Moon,
        observer,
        +1,
        day,
        1
    )?.date

    const moonSet = Astronomy.SearchRiseSet(
        Astronomy.Body.Moon,
        observer,
        -1,
        day,
        1
    )?.date

    const dayLen = sunset.getTime() - rise.getTime()

    const eighth = (n: number) =>
        `${fmt(add(rise, (n - 1) * dayLen / 8))} - ${fmt(
            add(rise, n * dayLen / 8)
        )}`

    const muhurta = (n: number) =>
        `${fmt(add(rise, (n - 1) * dayLen / 15))} - ${fmt(
            add(rise, n * dayLen / 15)
        )}`

    const wd = day.getDay()

    const panchangData = {
        samvat: 'Vikram Samvat 2083',
        shaka: 'Shaka Samvat 1948',
        ritu: 'Grishma (Summer)',
        masa: 'Jyeshtha (Adhika)',

        ayan:
            norm(sunLon(rise)) >= 270 ||
                norm(sunLon(rise)) < 90
                ? 'Uttarayan'
                : 'Dakshinayan',

        paksha:
            elong(rise) < 180
                ? 'Shukla Paksha'
                : 'Krishna Paksha',

        vara: VARAS[wd],

        tithi: describe(tithiNo, tithiName, rise),

        nakshatra: describe(
            nakNo,
            (i) => NAKSHATRAS[i],
            rise
        ),

        yoga: describe(
            yogaNo,
            (i) => YOGAS[i],
            rise
        ),

        karana: describe(
            karanaNo,
            karanaName,
            rise
        ),

        sun: {
            rise: fmt(rise),
            set: fmt(sunset),
        },

        moon: {
            rise: fmt(moonRise),
            set: fmt(moonSet),
        },
    }

    const auspiciousTimings = [
        {
            name: 'Abhijit Muhurta',
            time: muhurta(8),
            desc: 'Best for new undertakings',
        },
        {
            name: 'Vijay Muhurta',
            time: muhurta(11),
            desc: 'Good for solving disputes',
        },
    ]

    const inauspiciousTimings = [
        {
            name: 'Rahu Kaal',
            time: eighth(RAHU[wd]),
            desc: 'Avoid important actions',
        },
        {
            name: 'Yamaganda Kaal',
            time: eighth(YAMA[wd]),
            desc: 'Do not start travel',
        },
        {
            name: 'Gulika Kaal',
            time: eighth(GULIKA[wd]),
            desc: 'Auspicious/neutral delayed outcomes',
        },
    ]

    return {
        panchangData,
        auspiciousTimings,
        inauspiciousTimings,
    }
}
