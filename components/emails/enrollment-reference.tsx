import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Font,
} from "@react-email/components";

interface EnrollmentReferenceEmailProps {
  applicantName: string;
  referenceCode: string;
  gradeLevel: string;
  schoolYear: string;
}

function formatGradeLabel(gradeLevel: string): string {
  const map: Record<string, string> = {
    grade1: "Grade 1",
    grade2: "Grade 2",
    grade3: "Grade 3",
    grade4: "Grade 4",
    grade5: "Grade 5",
    grade6: "Grade 6",
  };
  return map[gradeLevel] ?? gradeLevel;
}

export function EnrollmentReferenceEmail({
  applicantName,
  referenceCode,
  gradeLevel,
  schoolYear,
}: EnrollmentReferenceEmailProps) {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="sans-serif"
          webFont={{
            url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap",
            format: "woff2",
          }}
        />
      </Head>
      <Preview>
        Your enrollment reference code for {schoolYear} - {referenceCode}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Heading style={schoolName}>Maniso School Christian Academy</Heading>
          </Section>

          <Section style={contentSection}>
            <Heading as="h2" style={greeting}>
              Dear {applicantName},
            </Heading>

            <Text style={paragraph}>
              Thank you for submitting your enrollment application for school
              year {schoolYear} ({formatGradeLabel(gradeLevel)}). Please save
              your reference code below — you will need it to check your
              enrollment status and for future transactions.
            </Text>

            <Section style={codeSection}>
              <Text style={codeLabel}>Your Reference Code</Text>
              <Text style={codeValue}>{referenceCode}</Text>
            </Section>

            <Text style={paragraph}>
              Present this code when making payments or communicating with the
              school regarding your enrollment. Your application is currently
              pending review and we will notify you once it has been processed.
            </Text>

            <Hr style={hr} />

            <Text style={footer}>
              This is an automated message from Maniso School Christian Academy.
              Please do not reply to this email. If you have any questions,
              please contact the school directly.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f4f4f5",
  fontFamily: "Inter, sans-serif",
  padding: "40px 0",
};

const container = {
  maxWidth: "520px",
  margin: "0 auto",
};

const headerSection = {
  backgroundColor: "#1e293b",
  padding: "32px 24px",
  borderRadius: "8px 8px 0 0",
};

const schoolName = {
  color: "#ffffff",
  fontSize: "22px",
  fontWeight: 700,
  textAlign: "center" as const,
  margin: 0,
};

const contentSection = {
  backgroundColor: "#ffffff",
  padding: "32px 24px",
  borderRadius: "0 0 8px 8px",
};

const greeting = {
  color: "#1e293b",
  fontSize: "18px",
  fontWeight: 600,
  margin: "0 0 16px",
};

const paragraph = {
  color: "#475569",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0 0 16px",
};

const codeSection = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  padding: "20px",
  textAlign: "center" as const,
  margin: "24px 0",
};

const codeLabel = {
  color: "#64748b",
  fontSize: "13px",
  fontWeight: 600,
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
  margin: "0 0 8px",
};

const codeValue = {
  color: "#0f172a",
  fontSize: "28px",
  fontWeight: 700,
  fontFamily: "monospace",
  letterSpacing: "3px",
  margin: 0,
};

const hr = {
  borderColor: "#e2e8f0",
  margin: "24px 0",
};

const footer = {
  color: "#94a3b8",
  fontSize: "13px",
  lineHeight: "1.5",
  margin: 0,
};
