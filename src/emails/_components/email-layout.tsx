import {
  Html,
  Head,
  Body,
  Container,
  Tailwind,
  Text,
  Img,
  Preview,
} from "@react-email/components";
import { EmailFooter } from "./email-footer";
import { DEFAULT_BRANDING } from "@/lib/email-branding";
import type { EmailBrandingSettings } from "@/lib/email-branding";

type EmailLayoutProps = {
  preview: string;
  children: React.ReactNode;
  branding?: EmailBrandingSettings;
};

export function EmailLayout({ preview, children, branding }: EmailLayoutProps) {
  const bg = branding?.backgroundColor || DEFAULT_BRANDING.backgroundColor;
  const primary = branding?.primaryColor || DEFAULT_BRANDING.primaryColor;
  const secondary = branding?.secondaryColor || DEFAULT_BRANDING.secondaryColor;
  const logoUrl = branding?.logoUrl || null;

  return (
    <Html lang="es">
      <Head />
      <Preview>{preview}</Preview>
      <Tailwind>
        <Body className="font-sans" style={{ backgroundColor: bg }}>
          <Container className="bg-white rounded-lg mx-auto p-8 my-10 max-w-lg">
            <EmailHeader logoUrl={logoUrl} primaryColor={primary} />
            {children}
            <EmailFooter secondaryColor={secondary} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

type EmailHeaderProps = {
  logoUrl: string | null;
  primaryColor: string;
};

function EmailHeader({ logoUrl, primaryColor }: EmailHeaderProps) {
  if (logoUrl) {
    return (
      <Img
        src={logoUrl}
        alt="Club Vertikal"
        height={48}
        className="mx-auto mb-6"
      />
    );
  }

  return (
    <Text
      className="text-2xl font-bold text-center mb-6"
      style={{ color: primaryColor }}
    >
      Club Vertikal
    </Text>
  );
}
