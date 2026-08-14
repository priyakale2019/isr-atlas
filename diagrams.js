/**
 * Line drawings per morphology.
 * Secondary terms use ISR graphic images; others use assets/bolognia-crops/.
 */
(function () {
  const GRAPHIC_IDS = {
    erythema: true,
    color: true,
    necrosis: true,
    drainage: true,
    edema: true,
    induration: true,
    hyperpigmentation: true,
    hypopigmentation: true,
    annular: true,
    atrophy: true,
    crust: true,
    erosion: true,
    scar: true,
  };

  window.PSK_REFERENCE = {
    usesGraphicImage(id) {
      return Boolean(GRAPHIC_IDS[String(id || "").toLowerCase()]);
    },
    diagramPathForId(id) {
      const slug = typeof id === "string" ? id.toLowerCase() : "_default";
      if (GRAPHIC_IDS[slug]) {
        return `assets/graphic-images/${slug}.png`;
      }
      return `assets/bolognia-crops/${slug}.png`;
    },
    defaultDiagramPath: "assets/bolognia-crops/_default.png",
    credit: "Line drawings for morphologic reference.",
  };

  window.getMorphologyDiagramDataUrl = function (id) {
    return window.PSK_REFERENCE.diagramPathForId(id);
  };
})();
