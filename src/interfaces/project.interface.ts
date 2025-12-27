export interface IProject {
  id?: string;
  title: string;
  description: string;
  minimumBid: number;
  budget: number;
  technology: string[];
  picture?: string;
  status: "pending" | "approved" | "rejected";
  ownerId: string;
  createdAt?: Date;
  updatedAt?: Date;
  
}
