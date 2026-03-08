import {
  Html,
  Head,
  Body,
  Container,
  Tailwind,
  Text,
  Preview,
} from "@react-email/components";
import { EmailFooter } from "./email-footer";

type EmailLayoutProps = {
  preview: string;
  children: React.ReactNode;
};

export function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html lang="es">
      <Head />
      <Preview>{preview}</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="bg-white rounded-lg mx-auto p-8 my-10 max-w-lg">
            <Text className="text-2xl font-bold text-center text-gray-900 mb-6">
              Club Vertikal
            </Text>
            {children}
            <EmailFooter />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
