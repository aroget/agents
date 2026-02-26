export const output = `
### **1. Calculate Deviations**
#### **Key Metrics (Last 48 Hours vs. 14-Day Average)**
- **Resting Heart Rate (RHR):**
  - **[Last Night]:** 
  - **[14-Day Avg]:** 
  - **[Deviation]:** 

- **Heart Rate Variability (HRV):**
  - **[Last Night]:** 
  - **[14-Day Avg]:** 
  - **[Deviation]:** 

- **Sleep Score:**
  - **[Last Night]:** 
  - **[14-Day Avg]:** 
  - **[Deviation]:** 

---

### **5. Status Indicator & Prescription**
How many days of data were analyzed?
- **{{number of wellness entries}}** (Sleep Score, RHR, HRV, CTL, ATL, TSS).
- **{{number of training days}}** ({{Date Range}}) with varying intensity and load.

### **3. Synthesize Load & Response**
#### **Yesterday's Workout ({{Activity Date}})**
- **{{Activity Name}}:**
  - **TSS:** {{icu_training_load}} ({{Intensity Category}})
  - **HR Avg:** {{average_heartrate}} bpm ({{HR Zones}})
  - **Impact:** {{Brief assessment of fatigue contribution}}

#### **Previous 48h (Cumulative Load):**
- **Total TSS:** {{Sum of TSS for previous 2 days}}
- **Response:** HRV is **{{% change}}** compared to baseline, suggesting **{{Recovery State}}**.

### **Trend Analysis**
- **{{Metric Trend}}:** {{Analyze if HRV/RHR/Sleep Score is trending up or down relative to the load spikes found in the JSON}}.

### **Recovery Status**
- **[{{GREEN/YELLOW/RED}}]**

---

### **4. Status Indicator & Prescription**
#### **Status:** **{{DETERMINE: RED/YELLOW/GREEN}}**
- **Data Justification:**
  - HRV {{% change}} ({{Current HRV}} ms vs. 14-day avg of {{Average HRV}} ms), triggering a **{{Status Level}}**.
  - RHR is {{Status: stable/elevated}}, but {{Primary Stressor}} suggests **{{Physiological Interpretation}}**.

#### **Prescription:**
- **{{AI Recommended Action}}** (based on whether HRV drop is >10% or RHR is >5bpm above baseline).
- **Next Step:** {{Specific advice for tomorrow's monitoring based on current fatigue trends}}.

#### **Trend Analysis:**
- **{{Trend Summary}}:** {{Explain the relationship between the cumulative TSS from the last 72 hours and the current autonomic response found in the data}}.
`;
