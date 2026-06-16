export const QUOTE_ANALYSIS_SYSTEM_PROMPT = `You are a document classifier and structured data extractor for Eduardo Mendes Advisory, an Australian construction advisory firm.

Your job is to analyse uploaded files and determine whether they are Australian builder quotes or construction estimates.

ACCEPT as document_type "builder_quote":
- Builder quotes, estimates, tenders, or proposals with construction pricing
- Subcontractor quotes for building or renovation work
- Construction cost summaries from builders or contractors

REJECT as document_type "other":
- Random photos, selfies, memes, pets, scenery, food
- Unrelated invoices (utilities, retail, automotive, medical, etc.)
- Bank statements, payslips, IDs, passports, licences
- Blank, blurry, or unreadable images
- Marketing brochures with no pricing
- Architectural plans or drawings with no quote or pricing
- Screenshots of unrelated apps or websites
- Email threads without quote content

When rejecting, set rejection_reason to a short plain-English explanation (max 120 chars).

Extract fields only when visible in the document. Use null when unknown.
- state: Australian state/territory code only (NSW, VIC, QLD, SA, WA, ACT, TAS, NT)
- project_type: one of new_home_build, major_renovation, addition_extension, granny_flat, owner_builder, commercial_small
- project_stage: one of concept_idea, early_planning, design_stage, getting_approvals, tendering_builders, ready_to_build, under_construction, nearly_complete. Default tendering_builders for formal builder quotes.
- quote_total_aud: numeric AUD total excluding currency symbols (e.g. 487500)

Set confidence.is_builder_quote to:
- high: clearly a builder/construction quote with pricing
- medium: likely a quote but incomplete or partially readable
- low: uncertain, unrelated, or unreadable

Return JSON only matching the schema exactly.`;

export const QUOTE_ANALYSIS_JSON_SCHEMA = {
  name: "quote_document_analysis",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: [
      "document_type",
      "rejection_reason",
      "builder_name",
      "quote_total_aud",
      "suburb",
      "state",
      "postcode",
      "project_type",
      "project_stage",
      "confidence",
    ],
    properties: {
      document_type: {
        type: "string",
        enum: ["builder_quote", "other"],
      },
      rejection_reason: {
        type: ["string", "null"],
      },
      builder_name: {
        type: ["string", "null"],
      },
      quote_total_aud: {
        type: ["number", "null"],
      },
      suburb: {
        type: ["string", "null"],
      },
      state: {
        type: ["string", "null"],
      },
      postcode: {
        type: ["string", "null"],
      },
      project_type: {
        type: ["string", "null"],
        enum: [
          "new_home_build",
          "major_renovation",
          "addition_extension",
          "granny_flat",
          "owner_builder",
          "commercial_small",
          null,
        ],
      },
      project_stage: {
        type: ["string", "null"],
        enum: [
          "concept_idea",
          "early_planning",
          "design_stage",
          "getting_approvals",
          "tendering_builders",
          "ready_to_build",
          "under_construction",
          "nearly_complete",
          null,
        ],
      },
      confidence: {
        type: "object",
        additionalProperties: false,
        required: ["overall", "is_builder_quote"],
        properties: {
          overall: { type: "string", enum: ["high", "medium", "low"] },
          is_builder_quote: { type: "string", enum: ["high", "medium", "low"] },
        },
      },
    },
  },
} as const;
