export const output = `
### **1. Calculate Deviations**
#### **Key Metrics (Last 48 Hours vs. 14-Day Average)**
- **Resting Heart Rate (RHR):**
  - **Recent (Feb 25-26):** 49–51 bpm
  - **14-Day Avg:** ~49.3 bpm
  - **Deviation:** **+1.7 bpm** (3.4% increase, **<5% threshold** → *Stable*)

- **Heart Rate Variability (HRV):**
  - **Recent (Feb 25-26):** 84–69 ms
  - **14-Day Avg:** ~78.5 ms
  - **Deviation:** **-12.1%** (Feb 26: 69 ms vs. 78.5 ms avg, **>12% threshold** → *Warning Trigger*)

- **Sleep Score:**
  - **Recent (Feb 25-26):** 87–80
  - **14-Day Avg:** ~82.3
  - **Deviation:** **-2.8% to +5.7%** (*Stable*)

- **Deep Sleep %:**
  - **Data not explicitly provided** in the wellness entries. Cannot evaluate "Low Quality Physical Recovery" flag.

---

### **2. Evaluate Sleep Architecture**
- **Total Sleep Duration:**
  - Feb 25: **8.08 hours** (29,083 secs)
  - Feb 26: **7.88 hours** (28,380 secs)
  - *Adequate duration*, but **Deep Sleep %** is missing for further assessment.

---

### **3. Synthesize Load & Response**
#### **Recent Workouts (Feb 24–25)**
- **Feb 24 (Easy Ride):**
  - **TSS:** 30 (Low intensity)
  - **HR Avg:** 121 bpm (Zone 1–2)
  - **Impact:** Minimal fatigue accumulation.

- **Feb 22–23 (High Load):**
  - **Feb 22:** Long Ride (TSS: 90) + Indoor Cycling (TSS: 41) = **Total TSS: 131**
  - **Feb 23:** Rest day (TSS: 0)
  - **Response:** HRV dropped **12.1%** on Feb 26 despite rest days, suggesting **cumulative fatigue**.

### **Trend Analysis**
- **HRV decline >12%** with **stable RHR** indicates **autonomic nervous system stress**, likely from the **high TSS on Feb 22** followed by incomplete recovery.

### **. Recovery Status**
  - **[GREEN/YELLOW/RED]**
---

### **4. Status Indicator & Prescription**
#### **Status:** **REST (Red)**
- **Data Justification:**
  - HRV **decreased by 12.1%** (69 ms vs. 14-day avg of 78.5 ms), triggering a **warning**.
  - RHR is stable, but HRV drop suggests **sympathetic stress** or **incomplete recovery**.

#### **Prescription:**
- **Full rest day** (no structured training).
- Monitor HRV/RHR tomorrow morning. If HRV remains low or RHR rises >5 bpm, consider **another rest day** or **light active recovery** (e.g., walking).

#### **Trend Analysis:**
- **Trending toward accumulated fatigue** due to high TSS on Feb 22 and delayed HRV response.
`;
