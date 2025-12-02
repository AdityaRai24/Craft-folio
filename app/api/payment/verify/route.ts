import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = await req.json();

        const user = await currentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Payment is authentic, update the database

            // Check if user is already premium
            const existingPremiumUser = await prisma.premiumUser.findFirst({
                where: {
                    userId: user.id,
                },
            });

            if (!existingPremiumUser) {
                await prisma.premiumUser.create({
                    data: {
                        userId: user.id,
                    },
                });
            }

            return NextResponse.json({
                message: "Payment verified and user upgraded successfully",
                success: true,
            });
        } else {
            return NextResponse.json(
                { message: "Invalid signature", success: false },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        return NextResponse.json(
            { error: "Error verifying payment" },
            { status: 500 }
        );
    }
}
