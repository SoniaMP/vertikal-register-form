import { Hr, Text } from "@react-email/components";

type EmailFooterProps = {
  secondaryColor?: string;
};

export function EmailFooter({ secondaryColor }: EmailFooterProps) {
  return (
    <>
      <Hr className="border-gray-300 my-6" />
      <Text
        className="text-xs text-center leading-5"
        style={{ color: secondaryColor || "#6b7280" }}
      >
        Club Vertikal — Escalada y Montaña
        <br />
        Este correo ha sido enviado automáticamente. Por favor, no respondas
        a esta dirección.
      </Text>
    </>
  );
}
