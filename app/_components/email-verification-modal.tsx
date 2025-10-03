import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, X, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface EmailVerificationModalProps {
  isOpen: boolean;
  email: string;
  onClose: () => void;
  onResendEmail?: () => Promise<void>;
}

export default function EmailVerificationModal({
  isOpen,
  email,
  onClose,
  onResendEmail
}: EmailVerificationModalProps) {
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const handleResendEmail = async () => {
    if (!onResendEmail) return;

    setIsResending(true);
    setResendMessage(null);

    try {
      await onResendEmail();
      setResendMessage("Verification email sent! Please check your inbox.");
    } catch (error) {
      setResendMessage("Failed to resend email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl font-semibold">
            Check Your Email
          </DialogTitle>
        </DialogHeader>

        <CardContent className="text-center space-y-4">
          <div className="space-y-2">
            <p className="text-muted-foreground">
              We've sent a verification email to:
            </p>
            <p className="font-medium text-foreground bg-muted px-3 py-2 rounded-md">
              {email}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Click the link in the email to verify your account and complete your registration.
            </p>
            <p className="text-sm text-muted-foreground">
              Don't see the email? Check your spam folder or click below to resend.
            </p>
          </div>

          {resendMessage && (
            <div className={`p-3 rounded-md text-sm ${
              resendMessage.includes('sent')
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {resendMessage}
            </div>
          )}

          <div className="flex flex-col gap-3 pt-4">
            <Button
              onClick={handleResendEmail}
              disabled={isResending}
              variant="outline"
              className="w-full"
            >
              {isResending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Resend Verification Email
                </>
              )}
            </Button>

            <Button
              onClick={onClose}
              variant="ghost"
              className="w-full"
            >
              Close
            </Button>
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              After verification, you'll be automatically redirected to get started with your account.
            </p>
          </div>
        </CardContent>
      </DialogContent>
    </Dialog>
  );
}
