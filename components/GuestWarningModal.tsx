"use client";
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { CheckCircle } from "lucide-react";

interface GuestWarningModalProps {
  open: boolean;
  onClose: () => void;
}

const GuestWarningModal: React.FC<GuestWarningModalProps> = ({ open, onClose }) => {
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  React.useEffect(() => {
    if (isSignedIn) {
      onClose();
    }
  }, [isSignedIn, onClose]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!max-w-md">
        <DialogHeader>
          <DialogTitle>You are in Guest Mode</DialogTitle>
          <DialogDescription>
            Your portfolio data will be <span className="font-semibold text-red-500">lost</span> as soon as you go back or close this tab. Please log in or sign up to save your work and access all features.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          <h4 className="font-medium text-sm">Premium Features Available After Login:</h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle size={16} className="text-green-500" />
              Multiple theme options and customization
            </li>
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle size={16} className="text-green-500" />
              Custom subdomain deployment
            </li>
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle size={16} className="text-green-500" />
              Advanced SEO optimization
            </li>
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle size={16} className="text-green-500" />
              Full chatbot functionality
            </li>
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle size={16} className="text-green-500" />
              Section reordering and management
            </li>
          </ul>
        </div>

        <DialogFooter className="gap-2 mt-4 flex-col sm:flex-row sm:justify-end">
          <SignInButton
            mode="modal"
            fallbackRedirectUrl={pathname}
            signUpFallbackRedirectUrl={pathname}
          >
            <Button className="w-full sm:w-auto" variant="default">
              Log In / Sign Up
            </Button>
          </SignInButton>
          <Button className="w-full sm:w-auto" variant="outline" onClick={onClose}>
            Continue as Guest
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GuestWarningModal;
