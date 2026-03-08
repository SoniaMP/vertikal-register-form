import { Hr, Text } from "@react-email/components";

export function EmailFooter() {
  return (
    <>
      <Hr className="border-gray-300 my-6" />
      <Text className="text-gray-500 text-xs text-center leading-5">
        Club Vertikal — Escalada y Montaña
        <br />
        Este correo ha sido enviado automáticamente. Por favor, no respondas
        a esta dirección.
      </Text>
    </>
  );
}
