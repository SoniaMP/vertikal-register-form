export type CourseRow = {
  id: string;
  title: string;
  courseDate: Date;
  address: string;
  description: string;
  image: string | null;
  isActive: boolean;
  maxCapacity: number;
  courseType: { id: string; name: string };
  prices: { id: string; name: string; amountCents: number }[];
  _count: { registrations: number };
};

export type CourseTypeOption = {
  id: string;
  name: string;
};
