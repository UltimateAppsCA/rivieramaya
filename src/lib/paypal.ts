import { Client, Environment } from '@paypal/paypal-server-sdk'
import { OrdersController } from '@paypal/paypal-server-sdk'

export const paypalClient = new Client({
  environment: Environment.Sandbox,
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID!,
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET!
  }
})

export async function createPayPalOrder(
  amount: number,
  description: string,
  returnUrl: string,
  cancelUrl: string
) {
  const ordersController = new OrdersController(paypalClient)

  const body = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: amount.toString(),
        },
        description,
      },
    ],
    return_url: returnUrl,
    cancel_url: cancelUrl,
  }

  return await ordersController.createOrder({ body } as any)
}

export async function capturePayPalOrder(orderId: string) {
  const ordersController = new OrdersController(paypalClient)
  return await ordersController.captureOrder({
    id: orderId,
  } as any)
}