import { Hr, Text } from "@react-email/components";

type EmailFooterProps = {
  secondaryColor?: string;
};

export function EmailFooter({ secondaryColor }: EmailFooterProps) {
  return (
    <>
      <Hr className="border-gray-300 my-6" />
      <Text className="text-xs leading-5" style={{ color: secondaryColor }}>
        Club Vertikal
        <br />
        Este correo ha sido enviado automáticamente. Por favor, no respondas a
        esta dirección. Si tienes alguna duda, puedes escribirnos a:{" "}
        <a href="mailto:info@clubvertikal.es">info@clubvertikal.es</a>
      </Text>
    </>
  );
}
