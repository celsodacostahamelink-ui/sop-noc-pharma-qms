import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const QP_SYSTEM_PROMPT = `You are a Qualified Person (QP) and Senior GMP Expert with 20+ years experience in pharmaceutical wholesale, specialising in cannabis medicine distribution under German BfArM regulation.

COMPANY CONTEXT:
- NOC Pharma GmbH, Murchin, Mecklenburg-Vorpommern, Germany
- Activity: Import, storage and wholesale distribution of cannabis for medical purposes (Cannabisblüten)
- Licences: Großhandelserlaubnis (§52a AMG) + Erlaubnis (§4 MedCanG)
- Supervisory authorities: BfArM (federal), LAGuS Mecklenburg-Vorpommern, Landesbehörde Thüringen
- QP: Torsten Cuny (§15 AMG); RP: Celso Hamelink Chmielewski (§52a AMG / §7 MedCanG)

YOUR REGULATORY EXPERTISE:
1. German Law: AMG (§§13,14,15,52a,63b,72,72a,73), MedCanG (§§1-10), BtMG, AMWHV
2. EU GMP: Annex 1 (sterile), Annex 11 (computerised systems), Annex 15 (qualification/validation), Annex 16 (batch release by QP)
3. EU GDP: Guidelines 2013/C 343/01, Delegated Regulation 2016/161 (FMD/serialisation)
4. ICH Guidelines: Q8 (pharmaceutical development), Q9 (quality risk management), Q10 (pharmaceutical quality system), Q11 (development and manufacture)
5. PIC/S: GMP Guide PE 009, GDP Guide PE 011
6. GAMP 5: Computer system validation, risk-based approach
7. Cannabis-specific: UN Convention 1961, Schengen Agreement Art.75, EU import/export authorisations
8. BfArM inspection standards: AMWHV §§1-30, documentation requirements, audit trail requirements

WHEN ANALYSING SOPs, PROVIDE:
1. COMPLIANCE SCORE (0-100) with breakdown per regulatory framework
2. CRITICAL GAPS — exact clause references (e.g. "AMWHV §4(2) — temperature monitoring records incomplete")
3. RISK CLASSIFICATION per finding: Critical / Major / Minor / Observation (per ICH Q9 / PIC/S)
4. REQUIRED ACTIONS — specific text to add/change with full regulatory justification
5. AUDIT READINESS ASSESSMENT — likelihood of finding at BfArM/LAGuS inspection
6. QP DECISION RECOMMENDATION: Approve / Approve with conditions / Return for revision / Reject
7. NEXT REVIEW DATE recommendation based on regulatory change frequency

RESPONSE FORMAT for SOP analysis:
- Use clear sections with headers
- Quote specific regulatory clauses in full
- Provide concrete corrective text where applicable
- Flag any narcotic/cannabis-specific requirements separately
- Include cross-references to related SOPs where relevant

Think and respond as a BfArM inspector would assess this document.`;

export async function POST(request: NextRequest) {
    try {
          const body = await request.json();
          const { action, content, sopTitle, sopVersion, sopCode } = body;

      if (!process.env.ANTHROPIC_API_KEY) {
              return NextResponse.json(
                { error: 'ANTHROPIC_API_KEY not configured. Add it to your environment variables.' },
                { status: 500 }
                      );
      }

      if (!content && action !== 'chat') {
              return NextResponse.json({ error: 'Content is required' }, { status: 400 });
      }

      let userMessage = '';

      switch (action) {
        case 'analyse':
                  userMessage = `Perform a full GMP compliance analysis of this SOP:

                  SOP Code: ${sopCode || 'Not specified'}
                  Title: ${sopTitle || 'Not specified'}
                  Version: ${sopVersion || 'Not specified'}

                  DOCUMENT CONTENT:
                  ${content}

                  Provide your full QP assessment including compliance score, all gaps found, risk classification, required actions, and your QP decision recommendation.`;
                  break;

        case 'batch-analyse':
                  userMessage = `Perform rapid triage analysis on multiple SOPs. For each, provide: compliance score (0-100), top 3 critical gaps, risk rating (Critical/Major/Minor), and QP recommendation.

                  DOCUMENTS TO ANALYSE:
                  ${content}`;
                  break;

        case 'generate':
                  userMessage = `Generate a complete, GMP-compliant SOP for NOC Pharma GmbH for the following process:

                  ${content}

                  Requirements:
                  - Follow AMWHV and EU GDP structure
                  - Include all mandatory sections: Purpose, Scope, Definitions, Responsibilities, Materials/Equipment, Procedure (numbered steps), Deviations/OOS procedure, Related Documents, References (cite specific regulations with clause numbers), Document History table
                  - Include cannabis/narcotic-specific controls where relevant
                  - Write in professional pharmaceutical language
                  - Add specific BfArM-audit-ready elements`;
                  break;

        case 'compare':
                  userMessage = `Perform a side-by-side regulatory gap analysis between these two SOP versions:

                  ${content}

                  Identify:
                  1. What changed between versions (additions, deletions, modifications)
                  2. Whether changes IMPROVE or REDUCE compliance
                  3. Any new regulatory gaps introduced
                  4. Any previously non-compliant sections now fixed
                  5. Overall version recommendation: keep old / use new / use new with amendments`;
                  break;

        case 'update':
                  userMessage = `Review this SOP against current 2024-2026 regulatory updates and identify what must change:

                  CURRENT SOP:
                  ${content}

                  Check against:
                  - MedCanG changes (effective 1 April 2024)
                  - Recent BfArM guidance updates
                  - EU GDP 2013/C 343/01 current interpretation
                  - AMWHV current version
                  - Any ICH Q-guideline updates

                  Provide specific text changes required with regulatory justification.`;
                  break;

        case 'audit-prep':
                  userMessage = `Act as a BfArM inspector preparing for a GDP/GMP inspection of NOC Pharma GmbH.

                  Based on this SOP/documentation:
                  ${content}

                  Generate:
                  1. The 10 most likely inspection questions/findings
                  2. Required evidence the company must have ready
                  3. Common deficiency patterns for this document type
                  4. Recommended preparation actions before inspection`;
                  break;

        case 'chat':
                  userMessage = content;
                  break;

        default:
                  userMessage = content;
      }

      const message = await client.messages.create({
              model: 'claude-sonnet-4-5',
              max_tokens: 4096,
              system: QP_SYSTEM_PROMPT,
              messages: [{ role: 'user', content: userMessage }],
      });

      const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

      return NextResponse.json({
              result: responseText,
              action,
              usage: {
                        input_tokens: message.usage.input_tokens,
                        output_tokens: message.usage.output_tokens,
              },
              model: message.model,
      });

    } catch (error: unknown) {
          console.error('AI Agent error:', error);
          const message = error instanceof Error ? error.message : 'Unknown error';
          return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({
          status: 'QP Expert AI Agent active',
          model: 'claude-sonnet-4-5',
          actions: ['analyse', 'batch-analyse', 'generate', 'compare', 'update', 'audit-prep', 'chat'],
          configured: !!process.env.ANTHROPIC_API_KEY,
    });
}
