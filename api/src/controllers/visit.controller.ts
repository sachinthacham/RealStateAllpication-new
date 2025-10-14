import { Request, Response } from "express";
import Visit from "../models/visit.model";

export interface AuthRequest extends Request {
    user?: { id: string; role: string };
}
// 1️⃣ Request a visit
export const createVisit = async (req: AuthRequest, res: Response) => {
  try {
    const { propertyId, date, notes } = req.body;
    const buyerId = req.user?.id; // From auth middleware

    const visit = await Visit.create({
      property: propertyId,
      buyer: buyerId,
      date,
      notes,
    });

    res.status(201).json({ message: "Visit request created", visit });
  } catch (error) {
    res.status(500).json({ message: "Error creating visit", error });
  }
};

// 2️⃣ Get all visits for logged-in buyer
export const getMyVisits = async (req: AuthRequest, res: Response) => {
  try {
    const buyerId = req.user?.id;

    const visits = await Visit.find({ buyer: buyerId })
      .populate("property", "title price location")
      .sort({ date: 1 });

    res.status(200).json(visits);
  } catch (error) {
    res.status(500).json({ message: "Error fetching visits", error });
  }
};

// 3️⃣ Seller/Admin confirms a visit
export const confirmVisit = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const visit = await Visit.findByIdAndUpdate(
      id,
      { status: "confirmed" },
      { new: true }
    );

    if (!visit) return res.status(404).json({ message: "Visit not found" });

    res.status(200).json({ message: "Visit confirmed", visit });
  } catch (error) {
    res.status(500).json({ message: "Error confirming visit", error });
  }
};

// 4️⃣ Buyer cancels visit
export const cancelVisit = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const buyerId = req.user?.id;

    const visit = await Visit.findOneAndUpdate(
      { _id: id, buyer: buyerId },
      { status: "cancelled" },
      { new: true }
    );

    if (!visit) return res.status(404).json({ message: "Visit not found or unauthorized" });

    res.status(200).json({ message: "Visit cancelled", visit });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling visit", error });
  }
};

// 5️⃣ Mark visit as completed (after it happens)
export const completeVisit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const visit = await Visit.findByIdAndUpdate(
      id,
      { status: "completed" },
      { new: true }
    );

    if (!visit) return res.status(404).json({ message: "Visit not found" });

    res.status(200).json({ message: "Visit marked as completed", visit });
  } catch (error) {
    res.status(500).json({ message: "Error completing visit", error });
  }
};
