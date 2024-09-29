import { join } from "path";
import { verifyPayment } from "./payment.utils";
import { readFileSync } from "fs";
import { User } from "../User/user.model";

const confirmationService = async (transactionId: string) => {
  try {
    const verifyResponse = await verifyPayment(transactionId);

    if (verifyResponse && verifyResponse.pay_status === "Successful") {
      const userId = transactionId.split("-")[1];
      const user = await User.findByIdAndUpdate(
        userId,
        { isVerified: true },
        { new: true }
      );

      if (!user) {
        throw new Error("User not found");
      }

      return {
        success: true,
        message: "User verified successfully!",
        data: user,
      };
    } else {
      return {
        success: false,
        message: "Payment Failed!",
        data: null,
      };
    }
  } catch (error) {
    console.error("Error in confirmationService:", error);
    return {
      success: false,
      message: "An error occurred during payment confirmation",
      data: null,
    };
  }
};

export const paymentServices = {
  confirmationService,
};
