import { useMemo, useState } from 'react'
import { getPanchang } from '../utils/panchangUtils'
import './Panchang.css'

function Panchang() {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const {
    panchangData,
    auspiciousTimings,
    inauspiciousTimings,
  } = useMemo(() => getPanchang(selectedDate), [selectedDate])

  const formattedDate = selectedDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const changeDate = (days: number) => {
    setSelectedDate((previous) => {
      const next = new Date(previous)
      next.setDate(next.getDate() + days)
      return next
    })
  }

  const vedicDetails = [
    { label: 'Vikram Samvat', value: panchangData.samvat },
    { label: 'Shaka Samvat', value: panchangData.shaka },
    { label: 'Ayanam', value: panchangData.ayan },
    { label: 'Ritu (Season)', value: panchangData.ritu },
    { label: 'Masa (Month)', value: panchangData.masa },
    { label: 'Paksha (Fortnight)', value: panchangData.paksha },
  ]

  const fiveElements = [
    {
      label: 'Vara (Day of Week)',
      value: panchangData.vara,
      icon: '☀',
    },
    {
      label: 'Tithi (Lunar Day)',
      value: panchangData.tithi,
      icon: '🌙',
    },
    {
      label: 'Nakshatra (Constellation)',
      value: panchangData.nakshatra,
      icon: '✦',
    },
    {
      label: 'Yoga (Combination)',
      value: panchangData.yoga,
      icon: '✧',
    },
    {
      label: 'Karana (Half of Tithi)',
      value: panchangData.karana,
      icon: '◈',
    },
  ]

  return (
    <main className="panchang-page">
      <div className="panchang-content">

        {/* Page Header */}
        <section className="panchang-title-card">
          <div className="panchang-title-left">
            <div className="panchang-title-icon">🪔</div>

            <div>
              <h1>Daily Panchang</h1>
              <p>Sacred Vedic Calendar and Muhurta Timings</p>
            </div>
          </div>

          <div className="panchang-date-navigation">
            <button
              className="date-nav-btn"
              onClick={() => changeDate(-1)}
              aria-label="Previous day"
            >
              ‹
            </button>

            <input
              type="date"
              className="panchang-date-input"
              value={[
                selectedDate.getFullYear(),
                String(selectedDate.getMonth() + 1).padStart(2, '0'),
                String(selectedDate.getDate()).padStart(2, '0'),
              ].join('-')}
              onChange={(e) => {
                if (e.target.value) {
                  const [year, month, day] = e.target.value
                    .split('-')
                    .map(Number)

                  setSelectedDate(
                    new Date(year, month - 1, day, 12)
                  )
                }
              }}
              aria-label="Select Panchang date"
            />

            <span className="selected-date-label">
              {formattedDate}
            </span>

            <button
              className="date-nav-btn"
              onClick={() => changeDate(1)}
              aria-label="Next day"
            >
              ›
            </button>
          </div>
        </section>

        {/* Sunrise and Moon Timings */}
        <section className="celestial-timings">

          <div className="celestial-item">
            <div className="celestial-info">
              <span className="celestial-label">Sunrise</span>
              <strong>{panchangData.sun.rise}</strong>
            </div>
            <div className="celestial-icon sun-icon">☀</div>
          </div>

          <div className="celestial-item">
            <div className="celestial-info">
              <span className="celestial-label">Sunset</span>
              <strong>{panchangData.sun.set}</strong>
            </div>
            <div className="celestial-icon sunset-icon">♨</div>
          </div>

          <div className="celestial-item">
            <div className="celestial-info">
              <span className="celestial-label">Moonrise</span>
              <strong>{panchangData.moon.rise}</strong>
            </div>
            <div className="celestial-icon moonrise-icon">☾</div>
          </div>

          <div className="celestial-item">
            <div className="celestial-info">
              <span className="celestial-label">Moonset</span>
              <strong>{panchangData.moon.set}</strong>
            </div>
            <div className="celestial-icon moonset-icon">☽</div>
          </div>

        </section>

        {/* Vedic Calendar and Five Elements */}
        <section className="vedic-calendar-card">

          <div className="vedic-card-heading">
            <span>✥</span>
            <h2>Vedic Era & Five Elements</h2>
          </div>

          <div className="vedic-content-grid">

            {/* Vedic Calendar Eras */}
            <div className="vedic-column calendar-column">
              <h3 className="column-title">VEDIC CALENDAR ERAS</h3>

              <div className="vedic-details-list">
                {vedicDetails.map((item) => (
                  <div className="vedic-detail-row" key={item.label}>
                    <span className="vedic-detail-label">
                      {item.label}
                    </span>
                    <strong className="vedic-detail-value">
                      {item.value}
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Five Limbs */}
            <div className="vedic-column elements-column">
              <h3 className="column-title">FIVE LIMBS (PANCHANG)</h3>

              <div className="five-elements-grid">
                {fiveElements.map((item) => (
                  <div className="element-item" key={item.label}>
                    <div className="element-label">
                      <span>{item.icon}</span>
                      {item.label}
                    </div>

                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* Auspicious and Inauspicious Timings */}
        <section className="muhurta-grid">

          {/* Shubh Muhurtas */}
          <div className="muhurta-panel shubh-panel">

            <div className="muhurta-heading">
              <span className="heading-status shubh-status">✓</span>
              <h2>Auspicious Muhurtas (Shubh)</h2>
            </div>

            <div className="muhurta-list">
              {auspiciousTimings.map((item) => (
                <div className="muhurta-item shubh-item" key={item.name}>
                  <div className="muhurta-description">
                    <strong>{item.name}</strong>
                    <span>{item.desc}</span>
                  </div>

                  <span className="muhurta-time shubh-time">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>

          </div>

          {/* Ashubh Timings */}
          <div className="muhurta-panel ashubh-panel">

            <div className="muhurta-heading">
              <span className="heading-status ashubh-status">△</span>
              <h2>Inauspicious Periods (Ashubh)</h2>
            </div>

            <div className="muhurta-list">
              {inauspiciousTimings.map((item) => (
                <div className="muhurta-item ashubh-item" key={item.name}>
                  <div className="muhurta-description">
                    <strong>{item.name}</strong>
                    <span>{item.desc}</span>
                  </div>

                  <span className="muhurta-time ashubh-time">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>

          </div>

        </section>

      </div>
    </main>
  )
}

export default Panchang
