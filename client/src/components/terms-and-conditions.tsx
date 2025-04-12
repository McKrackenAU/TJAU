import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface TermsAndConditionsProps {
  onAccept: () => void;
  disabled?: boolean;
}

export default function TermsAndConditions({ onAccept, disabled = false }: TermsAndConditionsProps) {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    if (accepted) {
      onAccept();
    }
  };

  return (
    <div className="space-y-4 w-full max-w-3xl mx-auto">
      <h2 className="text-xl font-bold text-center">Terms and Conditions</h2>
      
      <ScrollArea className="h-[300px] rounded-md border p-4">
        <div className="space-y-6 text-sm">
          <div>
            <h3 className="text-lg font-semibold mb-2">1. Introduction</h3>
            <p>
              Welcome to Tarot Journey. This application (the "App") is operated by JMRVBS Pty Ltd. By accessing or using the App, you agree to be bound by these Terms and Conditions (the "Terms"). Please read these Terms carefully before using the App.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">2. Entertainment Purposes Only</h3>
            <p>
              <strong>THE APP IS INTENDED FOR ENTERTAINMENT PURPOSES ONLY.</strong> The content and services provided through the App, including but not limited to tarot readings, interpretations, meditations, and any guidance or advice, are provided for entertainment and self-reflection purposes only.
            </p>
            <p className="mt-2">
              The App does not provide professional advice of any kind, including but not limited to medical, psychiatric, psychological, financial, legal, or spiritual advice. You should never rely on information received through the App to make important personal, medical, financial, legal, spiritual, or business decisions.
            </p>
            <p className="mt-2">
              You acknowledge and agree that any actions you take based on the content provided through the App are taken at your own risk.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">3. Limited Liability</h3>
            <p>
              To the maximum extent permitted by law, we exclude all representations, warranties, and guarantees relating to the App and the services provided.
            </p>
            <p className="mt-2">
              JMRVBS Pty Ltd, its directors, employees, or affiliates will not be liable for any damages, losses, costs, or expenses of any kind arising from your use of the App, including but not limited to direct, indirect, incidental, consequential, or punitive damages.
            </p>
            <p className="mt-2">
              This limitation of liability applies to the fullest extent permitted by Australian law and shall apply regardless of whether we have been advised of the possibility of such damages.
            </p>
          </div>

          <Accordion type="single" collapsible>
            <AccordionItem value="privacy">
              <AccordionTrigger className="text-lg font-semibold">4. Privacy Policy</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <h4 className="font-semibold">4.1 Information We Collect</h4>
                  <p>
                    We collect only the information necessary to provide the App's services. This includes:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Account information (username, email, password)</li>
                    <li>Reading history and journal entries you create</li>
                    <li>Usage data necessary for functionality</li>
                    <li>Payment information when you subscribe (processed securely through Stripe)</li>
                  </ul>

                  <h4 className="font-semibold mt-3">4.2 How We Use Your Information</h4>
                  <p>
                    We use your information solely to:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Provide and improve the App's features and functionality</li>
                    <li>Process payments (via our payment processor)</li>
                    <li>Store your reading history and journal entries</li>
                    <li>Communicate with you about your account and the App</li>
                  </ul>

                  <h4 className="font-semibold mt-3">4.3 No Data Tracking or Third-Party Sharing</h4>
                  <p>
                    <strong>We do not track your activity for advertising purposes</strong>. We do not sell, rent, or share your personal information with third parties for marketing purposes. Your data is used exclusively to provide you with the App's services.
                  </p>

                  <h4 className="font-semibold mt-3">4.4 Data Security</h4>
                  <p>
                    We implement reasonable security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
                  </p>

                  <h4 className="font-semibold mt-3">4.5 Data Retention</h4>
                  <p>
                    We retain your data for as long as your account is active or as needed to provide you with the App's services. You may request deletion of your account and associated data at any time.
                  </p>

                  <h4 className="font-semibold mt-3">4.6 Your Rights</h4>
                  <p>
                    In accordance with Australian privacy law, you have the right to:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Access the personal information we hold about you</li>
                    <li>Request correction of your personal information</li>
                    <li>Request deletion of your account and data</li>
                    <li>Withdraw consent at any time</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="australian">
              <AccordionTrigger className="text-lg font-semibold">5. Australian Law</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p>
                    These Terms are governed by the laws of Australia. Any disputes relating to these Terms or your use of the App shall be subject to the exclusive jurisdiction of the courts of Australia.
                  </p>
                  <p className="mt-2">
                    Nothing in these Terms excludes, restricts, or modifies any right or remedy, or any guarantee, warranty, or other term or condition, implied or imposed by Australian Consumer Law which cannot lawfully be excluded or limited.
                  </p>
                  <p className="mt-2">
                    If any provision of these Terms is found to be invalid or unenforceable by a court of law, such invalidity or unenforceability will not affect the remainder of the Terms, which will continue in full force and effect.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="subscription">
              <AccordionTrigger className="text-lg font-semibold">6. Subscription Terms</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p>
                    By subscribing to the App, you agree to the following:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Subscription fees are charged in advance on a monthly basis</li>
                    <li>Subscriptions automatically renew unless cancelled at least 24 hours before the end of the current period</li>
                    <li>You can cancel your subscription through your account settings or by contacting us</li>
                    <li>No refunds are provided for partial subscription periods</li>
                  </ul>
                  <p className="mt-2">
                    In accordance with Australian Consumer Law, you have certain rights regarding automatic renewal contracts and cooling-off periods that cannot be excluded.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="access">
              <AccordionTrigger className="text-lg font-semibold">7. User-Specific Data Access</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p>
                    The App ensures that users can only access their own data. This includes:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Your reading history</li>
                    <li>Your journal entries</li>
                    <li>Your account information</li>
                    <li>Your subscription details</li>
                  </ul>
                  <p className="mt-2">
                    We implement security measures to prevent unauthorized access to user data and to ensure data isolation between users.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="contact">
              <AccordionTrigger className="text-lg font-semibold">8. Contact Information</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p>
                    If you have any questions about these Terms, please contact us at:
                  </p>
                  <p className="mt-2">
                    JMRVBS Pty Ltd<br />
                    Email: tarotjourney@jmvirtualbusinessservices.com.au
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ScrollArea>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="accept-terms" 
          checked={accepted} 
          onCheckedChange={(checked) => setAccepted(checked === true)}
        />
        <Label htmlFor="accept-terms" className="font-medium">
          I have read and agree to the Terms and Conditions, including the Privacy Policy, 
          and understand that this app is for entertainment purposes only.
        </Label>
      </div>

      <Button 
        onClick={handleAccept}
        disabled={!accepted || disabled}
        className="w-full"
      >
        Accept and Continue
      </Button>
    </div>
  );
}