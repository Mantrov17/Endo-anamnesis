export interface PlanFormData {
  date: string;

  time: string;

  text: string;
}

export interface PlanRecord extends PlanFormData {
  id: string;

  createdAt: string;

  updatedAt: string;
}
