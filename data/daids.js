window.DAIDS_CRITERIA = {
  title: "Site Reactions to Injections and Infusions",
  sourceNote:
    "Division of AIDS (DAIDS) Table for Grading the Severity of Adult and Pediatric Adverse Events, Version 2.1 (March 2017).",
  sourceUrl: "assets/grading/daids-grading-v2.1.pdf",
  footnote:
    "Injection Site Erythema or Redness should be evaluated and graded using the greatest single diameter or measured surface area.",
  columns: [
    { id: "parameter", label: "Parameter" },
    { id: "grade1", label: "Grade 1 — Mild" },
    { id: "grade2", label: "Grade 2 — Moderate" },
    { id: "grade3", label: "Grade 3 — Severe" },
    { id: "grade4", label: "Grade 4 — Potentially life-threatening" },
  ],
  rows: [
    {
      parameter: "Injection site pain or tenderness",
      note: "Report only one.",
      cells: {
        grade1: "Pain or tenderness causing no or minimal limitation of use of limb.",
        grade2: "Pain or tenderness causing greater than minimal limitation of use of limb.",
        grade3:
          "Pain or tenderness causing inability to perform usual social and functional activities.",
        grade4:
          "Pain or tenderness causing inability to perform basic self-care function OR hospitalization indicated.",
      },
    },
    {
      parameter: "Injection site erythema or redness",
      note: "Report only one.",
      subrows: [
        {
          label: "> 15 years of age",
          cells: {
            grade1:
              "2.5 to < 5 cm in diameter OR 6.25 to < 25 cm² surface area AND symptoms causing no or minimal interference with usual social and functional activities.",
            grade2:
              "≥ 5 to < 10 cm in diameter OR ≥ 25 to < 100 cm² surface area OR symptoms causing greater than minimal interference with usual social and functional activities.",
            grade3:
              "≥ 10 cm in diameter OR ≥ 100 cm² surface area OR Ulceration OR Secondary infection OR Phlebitis OR Sterile abscess OR Drainage OR symptoms causing inability to perform usual social and functional activities.",
            grade4:
              "Potentially life-threatening consequences (e.g., abscess, exfoliative dermatitis, necrosis involving dermis or deeper tissue).",
          },
        },
        {
          label: "≤ 15 years of age",
          cells: {
            grade1: "≤ 2.5 cm in diameter.",
            grade2:
              "> 2.5 cm in diameter with < 50% surface area of the extremity segment involved (e.g., upper arm or thigh).",
            grade3:
              "≥ 50% surface area of the extremity segment involved (e.g., upper arm or thigh) OR Ulceration OR Secondary infection OR Phlebitis OR Sterile abscess OR Drainage.",
            grade4:
              "Potentially life-threatening consequences (e.g., abscess, exfoliative dermatitis, necrosis involving dermis or deeper tissue).",
          },
        },
      ],
    },
    {
      parameter: "Injection site induration or swelling",
      note: "Report only one.",
      subrows: [
        {
          label: "> 15 years of age",
          cells: {
            grade1: "Same as for Injection Site Erythema or Redness, > 15 years of age.",
            grade2: "Same as for Injection Site Erythema or Redness, > 15 years of age.",
            grade3: "Same as for Injection Site Erythema or Redness, > 15 years of age.",
            grade4: "Same as for Injection Site Erythema or Redness, > 15 years of age.",
          },
        },
        {
          label: "≤ 15 years of age",
          cells: {
            grade1: "Same as for Injection Site Erythema or Redness, ≤ 15 years of age.",
            grade2: "Same as for Injection Site Erythema or Redness, ≤ 15 years of age.",
            grade3: "Same as for Injection Site Erythema or Redness, ≤ 15 years of age.",
            grade4: "Same as for Injection Site Erythema or Redness, ≤ 15 years of age.",
          },
        },
      ],
    },
    {
      parameter: "Injection site pruritus",
      cells: {
        grade1:
          "Itching localized to the injection site that is relieved spontaneously or in < 48 hours of treatment.",
        grade2:
          "Itching beyond the injection site that is not generalized OR itching localized to the injection site requiring ≥ 48 hours treatment.",
        grade3:
          "Generalized itching causing inability to perform usual social and functional activities.",
        grade4: "NA",
      },
    },
  ],
};
