/**
 * Conventional-commit gate (repo-steward). CI lints ONLY the PR's own commits
 * (base..head), never inherited upstream history — that history is non-conventional
 * and must not fail our ancestry.
 *
 * We keep the structural rules (type, scope, descriptive subject) and relax the
 * line-length rules: our commit bodies deliberately carry the "why" as wrapped prose,
 * file paths, and occasional URLs that legitimately exceed 100 columns.
 */
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "body-max-line-length": [0, "always", Infinity],
    "footer-max-line-length": [0, "always", Infinity],
  },
};
