import { Request, Response } from "express";
import { paymentServices } from "./payment.service";

const confirmationController = async (req: Request, res: Response) => {
  const { transactionId } = req.query;

  const result = await paymentServices.confirmationService(
    transactionId as string
  );
  res.send(result);
};

const getPaymentHistory = async (req: Request, res: Response) => {
  const result = await paymentServices.getPaymentHistory();
  res.send(result);
};

export const paymentController = {
  confirmationController,
  getPaymentHistory,
};
