window.CTCAE_ISR = {
  title: "Common Terminology Criteria for Adverse Events (CTCAE) — Injection Site Reactions",
  sourceNote: "CTCAE v6.0 (January 2026); adverse event: Injection site reaction.",
  sourceUrl: "assets/grading/ctcae-v6-jan-2026.pdf",
  definition:
    "A disorder characterized by an intense adverse reaction (usually immunologic) developing at the site of an injection.",
  columns: [
    { id: "event", label: "Adverse event" },
    { id: "grade1", label: "Grade 1" },
    { id: "grade2", label: "Grade 2" },
    { id: "grade3", label: "Grade 3" },
    { id: "grade4", label: "Grade 4" },
    { id: "grade5", label: "Grade 5" },
  ],
  row: {
    event: "Injection site reaction",
    grade1: "Tenderness with or without associated symptoms (e.g., warmth, erythema, itching)",
    grade2: "Pain; lipodystrophy; edema; phlebitis",
    grade3: "Ulceration or necrosis; severe tissue damage; operative intervention indicated",
    grade4: "Life-threatening consequences; urgent intervention indicated",
    grade5: "Death",
  },
};
