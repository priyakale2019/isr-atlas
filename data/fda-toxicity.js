window.FDA_TOXICITY_ISR = {
  title: "FDA Toxicity Grading Scale",
  sourceNote: "FDA toxicity grading for local reactions to injectable products (local reaction table).",
  columns: [
    { id: "parameter", label: "Local reaction to injectable product" },
    { id: "grade1", label: "Mild (Grade 1)" },
    { id: "grade2", label: "Moderate (Grade 2)" },
    { id: "grade3", label: "Severe (Grade 3)" },
    { id: "grade4", label: "Potentially life threatening (Grade 4)" },
  ],
  rows: [
    {
      parameter: "Pain",
      cells: {
        grade1: "Does not interfere with activity",
        grade2: "Repeated use of non-narcotic pain reliever > 24 hours or interferes with activity",
        grade3: "Any use of narcotic pain reliever or prevents daily activity",
        grade4: "Emergency room (ER) visit or hospitalization",
      },
    },
    {
      parameter: "Tenderness",
      cells: {
        grade1: "Mild discomfort to touch",
        grade2: "Discomfort with movement",
        grade3: "Significant discomfort at rest",
        grade4: "ER visit or hospitalization",
      },
    },
    {
      parameter: "Erythema/Redness",
      marker: "*",
      cells: {
        grade1: "2.5 – 5 cm",
        grade2: "5.1 – 10 cm",
        grade3: "> 10 cm",
        grade4: "Necrosis or exfoliative dermatitis",
      },
    },
    {
      parameter: "Induration/Swelling",
      marker: "**",
      cells: {
        grade1: "2.5 – 5 cm and does not interfere with activity",
        grade2: "5.1 – 10 cm or interferes with activity",
        grade3: "> 10 cm or prevents daily activity",
        grade4: "Necrosis",
      },
    },
  ],
  footnotes: [
    "* In addition to grading the measured local reaction at the greatest single diameter, the measurement should be recorded as a continuous variable.",
    "** Induration/Swelling should be evaluated and graded using the functional scale as well as the actual measurement.",
  ],
};
