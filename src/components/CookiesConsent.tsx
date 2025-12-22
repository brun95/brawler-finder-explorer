
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const CookiesConsent = () => {
  const [showConsent, setShowConsent] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem("cookies-consent");
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookies-consent", "accepted");
    setShowConsent(false);
    toast({
      title: "Cookies accepted",
      description: "Your preferences have been saved",
    });
  };

  const declineCookies = () => {
    localStorage.setItem("cookies-consent", "declined");
    setShowConsent(false);
    toast({
      title: "Cookies declined",
      description: "Only essential cookies will be used",
    });
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card z-50 p-4 shadow-lg border-t border-gray-300 animate-fade-up">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-medium mb-1">Cookie Consent</h3>
          <p className="text-sm text-gray-600">
            We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={declineCookies}
            className="border-gray-600 text-gray-700 hover:text-white"
          >
            Decline
          </Button>
          <Button 
            size="sm" 
            onClick={acceptCookies}
            className="bg-primary hover:bg-primary-hover text-primary-foreground"
          >
            Accept All
          </Button>
          <button
            onClick={() => setShowConsent(false)}
            className="p-1 hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
