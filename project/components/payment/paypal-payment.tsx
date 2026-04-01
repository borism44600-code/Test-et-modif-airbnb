'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CreditCard, Shield, Lock, CheckCircle2, AlertCircle, 
  Loader2, Wallet, Building2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PayPalPaymentProps {
  amount: number
  currency?: string
  propertyId: string
  propertyTitle: string
  checkIn: string
  checkOut: string
  nights: number
  guests: {
    adults: number
    children: number
  }
  customerEmail?: string
  customerName?: string
  onSuccess: (details: PaymentSuccessDetails) => void
  onError: (error: Error) => void
  onCancel?: () => void
}

export interface PaymentSuccessDetails {
  orderId: string
  bookingId: string
  captureId?: string
  payerEmail?: string
  payerName?: string
  amount: number
  currency: string
}

type PaymentMethod = 'paypal' | 'card'

// PayPal SDK type declarations
declare global {
  interface Window {
    paypal?: {
      Buttons: (config: PayPalButtonConfig) => {
        render: (selector: string) => Promise<void>
        close: () => void
      }
    }
  }
}

interface PayPalButtonConfig {
  style?: {
    layout?: 'vertical' | 'horizontal'
    color?: 'gold' | 'blue' | 'silver' | 'white' | 'black'
    shape?: 'rect' | 'pill'
    label?: 'paypal' | 'checkout' | 'buynow' | 'pay'
    height?: number
  }
  fundingSource?: string
  createOrder: () => Promise<string>
  onApprove: (data: { orderID: string }) => Promise<void>
  onCancel?: () => void
  onError?: (err: Error) => void
}

export function PayPalPayment({
  amount,
  currency = 'EUR',
  propertyId,
  propertyTitle,
  checkIn,
  checkOut,
  nights,
  guests,
  customerEmail,
  customerName,
  onSuccess,
  onError,
  onCancel,
}: PayPalPaymentProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('paypal')
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sdkReady, setSdkReady] = useState(false)
  
  const paypalButtonRef = useRef<HTMLDivElement>(null)
  const cardButtonRef = useRef<HTMLDivElement>(null)
  const paypalButtonInstance = useRef<{ close: () => void } | null>(null)
  const cardButtonInstance = useRef<{ close: () => void } | null>(null)

  // Load PayPal SDK
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

    if (!clientId) {
      setError('PayPal is not configured. Please contact support.')
      setIsLoading(false)
      return
    }

    // Check if SDK is already loaded
    if (window.paypal) {
      setSdkReady(true)
      setIsLoading(false)
      return
    }

    // Load PayPal SDK script
    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}&components=buttons,funding-eligibility`
    script.async = true
    
    script.onload = () => {
      setSdkReady(true)
      setIsLoading(false)
    }
    
    script.onerror = () => {
      setError('Failed to load payment system. Please try again.')
      setIsLoading(false)
    }

    document.body.appendChild(script)

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [currency])

  // Render PayPal buttons when SDK is ready
  useEffect(() => {
    if (!sdkReady || !window.paypal) return

    const createOrderHandler = async () => {
      setIsProcessing(true)
      setError(null)

      try {
        const response = await fetch('/api/paypal/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            propertyId,
            propertyTitle,
            checkIn,
            checkOut,
            nights,
            guests,
            totalAmount: amount,
            currency,
            customerEmail,
            customerName,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to create order')
        }

        return data.orderId
      } catch (err) {
        setIsProcessing(false)
        const error = err instanceof Error ? err : new Error('Failed to create order')
        setError(error.message)
        throw error
      }
    }

    const onApproveHandler = async (data: { orderID: string }) => {
      try {
        const response = await fetch('/api/paypal/capture-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: data.orderID }),
        })

        const captureData = await response.json()

        if (!response.ok) {
          throw new Error(captureData.message || 'Failed to capture payment')
        }

        setIsProcessing(false)
        
        onSuccess({
          orderId: captureData.orderId,
          bookingId: captureData.bookingId,
          captureId: captureData.captureId,
          payerEmail: captureData.payer?.email,
          payerName: captureData.payer?.name,
          amount,
          currency,
        })
      } catch (err) {
        setIsProcessing(false)
        const error = err instanceof Error ? err : new Error('Payment failed')
        setError(error.message)
        onError(error)
      }
    }

    const onCancelHandler = () => {
      setIsProcessing(false)
      onCancel?.()
    }

    const onErrorHandler = (err: Error) => {
      setIsProcessing(false)
      setError('Payment could not be processed. Please try again.')
      onError(err)
    }

    // Render PayPal button
    if (paypalButtonRef.current && paymentMethod === 'paypal') {
      paypalButtonRef.current.innerHTML = ''
      
      const paypalButtons = window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal',
          height: 50,
        },
        createOrder: createOrderHandler,
        onApprove: onApproveHandler,
        onCancel: onCancelHandler,
        onError: onErrorHandler,
      })

      paypalButtons.render('#paypal-button-container')
      paypalButtonInstance.current = paypalButtons
    }

    // Render Card button (via PayPal)
    if (cardButtonRef.current && paymentMethod === 'card') {
      cardButtonRef.current.innerHTML = ''
      
      const cardButtons = window.paypal.Buttons({
        fundingSource: 'card',
        style: {
          layout: 'vertical',
          color: 'black',
          shape: 'rect',
          label: 'pay',
          height: 50,
        },
        createOrder: createOrderHandler,
        onApprove: onApproveHandler,
        onCancel: onCancelHandler,
        onError: onErrorHandler,
      })

      cardButtons.render('#card-button-container')
      cardButtonInstance.current = cardButtons
    }

    return () => {
      // Cleanup buttons on unmount or payment method change
      if (paypalButtonInstance.current) {
        try {
          paypalButtonInstance.current.close()
        } catch {}
      }
      if (cardButtonInstance.current) {
        try {
          cardButtonInstance.current.close()
        } catch {}
      }
    }
  }, [sdkReady, paymentMethod, amount, currency, propertyId, propertyTitle, checkIn, checkOut, nights, guests, customerEmail, customerName, onSuccess, onError, onCancel])

  return (
    <div className="space-y-6">
      {/* Payment Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 mb-4">
          <Lock className="w-8 h-8 text-gold" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Secure Payment</h2>
        <p className="text-muted-foreground">
          Complete your booking with our secure payment system
        </p>
      </div>

      {/* Amount Display */}
      <div className="bg-secondary/50 rounded-xl p-6 text-center border border-border">
        <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
        <p className="text-4xl font-semibold text-gold">{amount.toFixed(2)} {currency}</p>
        <p className="text-sm text-muted-foreground mt-2">
          {nights} night{nights > 1 ? 's' : ''} at {propertyTitle}
        </p>
      </div>

      {/* Payment Method Selection */}
      <div className="space-y-4">
        <p className="text-sm font-medium text-center">Choose your payment method</p>
        
        <div className="grid grid-cols-2 gap-4">
          {/* PayPal Option */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setPaymentMethod('paypal')}
            className={cn(
              'relative p-4 rounded-xl border-2 transition-all text-left',
              paymentMethod === 'paypal'
                ? 'border-gold bg-gold/5 shadow-lg'
                : 'border-border hover:border-gold/50'
            )}
          >
            {paymentMethod === 'paypal' && (
              <motion.div 
                layoutId="paymentSelected"
                className="absolute top-3 right-3"
              >
                <CheckCircle2 className="w-5 h-5 text-gold" />
              </motion.div>
            )}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-[#0070ba] flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium">PayPal</p>
                <p className="text-xs text-muted-foreground">Pay with your PayPal balance</p>
              </div>
            </div>
          </motion.button>

          {/* Card Option */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setPaymentMethod('card')}
            className={cn(
              'relative p-4 rounded-xl border-2 transition-all text-left',
              paymentMethod === 'card'
                ? 'border-gold bg-gold/5 shadow-lg'
                : 'border-border hover:border-gold/50'
            )}
          >
            {paymentMethod === 'card' && (
              <motion.div 
                layoutId="paymentSelected"
                className="absolute top-3 right-3"
              >
                <CheckCircle2 className="w-5 h-5 text-gold" />
              </motion.div>
            )}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-foreground flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-background" />
              </div>
              <div>
                <p className="font-medium">Credit / Debit Card</p>
                <p className="text-xs text-muted-foreground">Visa, Mastercard, Amex</p>
              </div>
            </div>
          </motion.button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Card payments are processed securely via PayPal. No PayPal account required.
        </p>
      </div>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl"
          >
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
          <span className="ml-3 text-muted-foreground">Loading payment options...</span>
        </div>
      )}

      {/* Processing State */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-gold mx-auto mb-4" />
              <p className="text-lg font-medium">Processing your payment...</p>
              <p className="text-sm text-muted-foreground mt-2">Please do not close this window</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PayPal Button Containers */}
      {!isLoading && !error && (
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {paymentMethod === 'paypal' && (
              <motion.div
                key="paypal"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div 
                  id="paypal-button-container" 
                  ref={paypalButtonRef}
                  className="min-h-[50px]"
                />
              </motion.div>
            )}

            {paymentMethod === 'card' && (
              <motion.div
                key="card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div 
                  id="card-button-container" 
                  ref={cardButtonRef}
                  className="min-h-[50px]"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Trust Badges */}
      <div className="border-t border-border pt-6 mt-6">
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-gold" />
            <span>SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-gold" />
            <span>Secure Payment</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gold" />
            <span>PayPal Protected</span>
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-4">
          Your payment information is encrypted and secure. We never store your card details.
        </p>
      </div>
    </div>
  )
}
