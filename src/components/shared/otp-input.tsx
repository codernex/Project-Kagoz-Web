"use client";

import { Input } from "@/components/ui/input";
import { useOtpVerificationModal } from "@/hooks/enableOtpVerifiactionModal";
import { axiosInstance } from "@/redux/api";
import { useCallback, useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { toast } from "sonner";
import { Dialog, DialogContent } from "../ui/dialog";
import { useAuthModal } from "@/hooks/loginModal";
import { usePasswordReset } from "@/hooks/passwordResetModal";


export const VerifyOtp: React.FC = () => {
    const { email, open, endpoint, resendEndpoint, title, setOpen, type } = useOtpVerificationModal()
    const { setOpen: setAuthOpen } = useAuthModal()
    const [otp, setOtp] = useState("");
    const [otpVerified, setOtpVerified] = useState(false);
    const [timer, setTimer] = useState(120); // Timer starts from 120 seconds (2 minutes)
    const [canResend, setCanResend] = useState(false);

    const { setPasswordReset } = usePasswordReset()
    // Navigation

    const verifyUserOtp = useCallback(
        (otp: string, email: string) => {
            axiosInstance
                .post(endpoint ?? '', {
                    otp,
                    email,
                })
                .then((response) => {
                    setOpen({ open: false, email: response.data.data?.email, response: response.data.data })
                    setAuthOpen()
                    setOtpVerified(true);
                })
                .catch((err) => {
                    toast.error(err?.reponse?.data?.message);
                }).finally(() => {
                    setOtp('')
                })
        },
        [endpoint, setOpen, setAuthOpen]
    );

    // Submitting for verification
    useEffect(() => {
        if (otp.length === 6 && email) {
            verifyUserOtp(otp, email);
        }
    }, [otp, email, verifyUserOtp]);

    // OTP Verification and Redirect
    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (!otpVerified) {
                event.preventDefault();
                event.returnValue = ""; // This line is for older browsers
            }
        };

        if (otpVerified) {
            if (endpoint === '/auth/forget-password/verify') {
                setPasswordReset(true)
                setOpen({ open: false, email })
            } else {
                setOpen({ open: false, email: '' })
                setAuthOpen()
            }
        } else {
            // window.addEventListener("beforeunload", handleBeforeUnload);

            // Clean up the event listener
            return () => {
                window.removeEventListener("beforeunload", handleBeforeUnload);
            };
        }
    }, [otpVerified, setOpen, setAuthOpen, email, endpoint, setPasswordReset]);

    // Resend

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (timer > 0) {
            intervalId = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else {
            setCanResend(true); // Enable resend button after 2 minutes
        }

        return () => clearInterval(intervalId);
    }, [timer]);

    // Handling Resend Token
    const handleResendClick = () => {
        axiosInstance
            .post(resendEndpoint ?? '', {
                email,
                type
            })
            .then((res) => {
                setTimer(120);
                setCanResend(false);
            })
            .catch((err) => {
                toast.error("Something went wrong, Please try again later");
            });
    };

    return (
        <Dialog open={open}>
            <DialogContent className="max-w-4xl">
                <div className="w-full flex py-8 flex-col justify-center items-center space-y-6">
                    <h2 className="text-md font-semibold">{title}</h2>
                    <OtpInput
                        shouldAutoFocus
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        renderSeparator={<span className="mx-2">-</span>}
                        renderInput={(props) => <Input {...props} />}
                        inputStyle="h-20 min-w-[4.8rem] border-2 border-gray-300 rounded-xs text-center text-lg font-semibold focus:ring-2 focus:ring-primary focus:border-primary "
                    />
                    <div>
                        {canResend ? (
                            <button
                                className="bg-primary text-white text-sm font-semibold flex items-center justify-center hover:bg-gray-600 rounded-[.8rem] px-6 py-3"
                                onClick={handleResendClick}
                            >
                                <span>Resend OTP</span>
                            </button>
                        ) : (
                            <span className="text-sm font-semibold">
                                Resend in{" "}
                                <span className="text-primary">
                                    {Math.floor(timer / 60)}:{timer % 60 < 10 ? "0" : ""}
                                    {timer % 60}
                                </span>
                            </span>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};