export interface IProperty {
    title: string;
    description: string;
    price: number;
    location: string;
    propertyType: "rent" | "sale";
    size: number;
    images: string[];
    createdBy: string; // user/agent ID
}
  