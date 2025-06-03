import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

import { Loader2, Check, X } from "lucide-react";

interface CouponValidation {
  valid: boolean;
  couponId?: string;
  discountType?: 'percent' | 'fixed';
  value?: number;
  message?: string;
}

interface PricingDisplayProps {
  basePrice: number;
  onCouponApplied: (couponCode: string | null) => void;
  isLoading?: boolean;
}

export function PricingDisplay({ basePrice, onCouponApplied, isLoading = false }: PricingDisplayProps) {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidation | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const { toast } = useToast();

  // Calculate final price
  const discount = appliedCoupon?.valid ? 
    (appliedCoupon.discountType === 'percent' 
      ? basePrice * (appliedCoupon.value! / 100)
      : appliedCoupon.value!) 
    : 0;
  
  const finalPrice = Math.max(0, basePrice - discount);

  // Validate coupon code
  const validateCoupon = async (code: string) => {
    if (!code.trim()) {
      setCouponError(null);
      setAppliedCoupon(null);
      onCouponApplied(null);
      return;
    }

    setValidatingCoupon(true);
    setCouponError(null);
    
    try {
      const response = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ couponCode: code }),
      });

      const data = await response.json();

      if (data.valid) {
        const validation: CouponValidation = {
          valid: true,
          couponId: data.couponId,
          discountType: data.discountType,
          value: data.value,
        };
        setAppliedCoupon(validation);
        onCouponApplied(code);
        toast({
          title: "Coupon Applied!",
          description: `${data.discountType === 'percent' ? `${data.value}% off` : `$${(data.value / 100).toFixed(2)} off`}`,
        });
      } else {
        setCouponError(data.message || "Invalid coupon code");
        setAppliedCoupon(null);
        onCouponApplied(null);
      }
    } catch (error) {
      setCouponError("Unable to validate coupon code");
      setAppliedCoupon(null);
      onCouponApplied(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleApplyCoupon = () => {
    validateCoupon(couponCode);
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setAppliedCoupon(null);
    setCouponError(null);
    onCouponApplied(null);
  };

  // Auto-validate coupon from URL params on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlCoupon = urlParams.get('coupon');
    if (urlCoupon) {
      setCouponCode(urlCoupon);
      validateCoupon(urlCoupon);
    }
  }, []);

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        {/* Pricing Summary */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-base">Monthly Subscription</span>
            <span className="text-base">${(basePrice / 100).toFixed(2)}</span>
          </div>
          
          {appliedCoupon?.valid && (
            <div className="flex justify-between items-center text-green-600">
              <span className="text-sm flex items-center gap-2">
                Coupon Discount
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {couponCode.toUpperCase()}
                </Badge>
              </span>
              <span className="text-sm">
                -{appliedCoupon.discountType === 'percent' 
                  ? `${appliedCoupon.value}%` 
                  : `$${(appliedCoupon.value! / 100).toFixed(2)}`}
              </span>
            </div>
          )}
          
          <hr className="my-2" />
          
          <div className="flex justify-between items-center font-semibold text-lg">
            <span>Total</span>
            <span>${(finalPrice / 100).toFixed(2)}/month</span>
          </div>
          
          <p className="text-xs text-muted-foreground text-center">
            7-day free trial • Cancel anytime
          </p>
        </div>

        {/* Coupon Code Section */}
        <div className="space-y-2">
          <Label htmlFor="coupon">Coupon Code (Optional)</Label>
          <div className="flex gap-2">
            <Input
              id="coupon"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              disabled={isLoading || validatingCoupon}
              className={appliedCoupon?.valid ? "border-green-200 bg-green-50" : ""}
            />
            
            {appliedCoupon?.valid ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemoveCoupon}
                disabled={isLoading}
                className="px-3"
              >
                <X className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={handleApplyCoupon}
                disabled={isLoading || validatingCoupon || !couponCode.trim()}
              >
                {validatingCoupon ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Apply"
                )}
              </Button>
            )}
          </div>
          
          {appliedCoupon?.valid && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Check className="h-4 w-4" />
              <span>Coupon applied successfully!</span>
            </div>
          )}
          
          {couponError && (
            <p className="text-sm text-red-500">{couponError}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}