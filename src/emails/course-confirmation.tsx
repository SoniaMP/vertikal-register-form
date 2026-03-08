import { Text, Section, Row, Column } from "@react-email/components";
import { EmailLayout } from "./_components/email-layout";
import type { CourseConfirmationProps } from "./types";
import { formatPrice } from "./types";

export default function CourseConfirmation({
  firstName,
  lastName,
  courseTitle,
  coursePriceName,
  amountCents,
  branding,
}: CourseConfirmationProps) {
  return (
    <EmailLayout preview={`Confirmación de curso — ${courseTitle}`} branding={branding}>
      <Text className="text-lg text-gray-900">
        Hola {firstName} {lastName},
      </Text>
      <Text className="text-gray-700 leading-6">
        Tu inscripción al curso ha sido confirmada. Aquí tienes los detalles:
      </Text>

      <Section className="bg-gray-50 rounded-lg p-4 my-4">
        <Row>
          <Column className="text-gray-600 text-sm">Curso</Column>
          <Column className="text-right text-gray-900 font-medium text-sm">
            {courseTitle}
          </Column>
        </Row>
        <Row className="mt-2">
          <Column className="text-gray-600 text-sm">Tarifa</Column>
          <Column className="text-right text-gray-900 font-medium text-sm">
            {coursePriceName}
          </Column>
        </Row>
        <Row className="mt-4 border-t border-gray-200 pt-3">
          <Column className="text-gray-900 font-bold">Total</Column>
          <Column className="text-right text-gray-900 font-bold">
            {formatPrice(amountCents)}
          </Column>
        </Row>
      </Section>

      <Text className="text-gray-700 leading-6">
        Si tienes alguna duda, no dudes en contactarnos.
      </Text>
      <Text className="text-gray-700">¡Nos vemos en la montaña!</Text>
    </EmailLayout>
  );
}

CourseConfirmation.PreviewProps = {
  firstName: "Carlos",
  lastName: "López",
  email: "carlos@example.com",
  courseTitle: "Iniciación a la escalada deportiva",
  coursePriceName: "Socio",
  amountCents: 4500,
} satisfies CourseConfirmationProps;
